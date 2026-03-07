import { supabase } from '../lib/supabase';
import { BriefingPayload } from './adminService';
import { formatBriefingAsHTML } from '../templates/briefingEmailTemplate';

export interface ContactLead {
  name: string;
  email: string;
  phone: string;
  interest: string;
  companySize: string;
}

class LeadService {
  /**
   * Salva um lead de contato no Supabase
   */
  async saveContactLead(data: ContactLead): Promise<boolean> {
    try {
      const { data: result, error } = await supabase
        .from('leads')
        .insert([{
          type: 'contact',
          data: data,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('[LeadService] Erro ao salvar lead:', error.code, error.message);
        this.saveToBackup('contact', data);
        return false;
      }


      // Envia notificação por e-mail para o admin e o CRM
      await Promise.all([
        this.notifyAdminNewContact(data),
        this.triggerCrmWebhook('new_lead', data)
      ]);

      return true;
    } catch (error) {
      console.error('[LeadService] Erro crítico (saveContactLead):', error);
      this.saveToBackup('contact', data);
      return false;
    }
  }

  /**
   * Salva um assinante da newsletter no Supabase e notifica
   */
  async saveNewsletterSubscriber(email: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          type: 'newsletter',
          email: email,
          source: 'Footer - Newsletter',
          data: { email },
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('[LeadService] Erro newsletter:', error.message);
        return false;
      }


      return true;
    } catch (error) {
      console.error('[LeadService] Erro crítico newsletter:', error);
      return false;
    }
  }

  /**
   * Notifica o administrador sobre um novo contato do rodapé
   */
  async notifyAdminNewContact(data: ContactLead): Promise<boolean> {
    try {

      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          type: 'new_lead',
          payload: {
            name: data.name,
            email: data.email,
            whatsapp: data.phone,
            business_type: data.interest,
            source: 'Rodapé - Site'
          }
        }
      });

      if (error) {
        console.error('[LeadService] Erro notificação:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('[LeadService] Erro notificação contato:', e);
      return false;
    }
  }

  /**
   * Salva um lead de briefing SWOT no Supabase e envia e-mail
   */
  async saveBriefingLead(data: BriefingPayload): Promise<{ success: boolean; token?: string }> {
    try {
      // Salva no Supabase na tabela global 'leads'
      const { data: leadResult, error } = await supabase
        .from('leads')
        .insert([{
          source: data.type === 'SWOT_ANALYSIS' ? 'swot' : 'teste-gratuito',
          full_name: data.name,
          email: data.email,
          phone: data.phone || data.whatsapp || null,
          payload_json: data
        }])
        .select('id')
        .single();

      if (error) {
        console.error('[LeadService] Erro ao salvar briefing:', error.code, error.message);
        this.saveToBackup('briefing', data);
        return { success: false };
      }



      const leadId = leadResult.id;
      let token = '';

      // Gerar relatório HTML
      const reportHtml = formatBriefingAsHTML(data);

      // Salvar em reports
      const { data: reportResult, error: reportError } = await supabase
        .from('reports')
        .insert([{
          report_type: data.type === 'SWOT_ANALYSIS' ? 'swot' : 'teste-gratuito',
          lead_id: leadId,
          content_html: reportHtml,
          summary_json: data
        }])
        .select('id')
        .single();

      if (!reportError && reportResult) {
        // Gerar token de acesso
        token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        await supabase
          .from('report_public_links')
          .insert([{
            report_id: reportResult.id,
            token: token
          }]);

        data.public_token = token;
      } else {
        console.error('[LeadService] Erro ao salvar report:', reportError);
      }

      // Envia e-mail para o admin e sincroniza o CRM em paralelo
      await Promise.all([
        this.notifyAdminNewBriefing(data),
        this.triggerCrmWebhook('new_briefing', data)
      ]);

      return { success: true, token };
    } catch (error) {
      console.error('[LeadService] Erro crítico (saveBriefingLead):', error);
      this.saveToBackup('briefing', data);
      return { success: false };
    }
  }

  /**
   * Envia os dados do briefing para o e-mail do administrador via Edge Function
   * E envia confirmação para o cliente
   */
  async notifyAdminNewBriefing(data: BriefingPayload): Promise<boolean> {
    let adminSuccess = false;

    // 1. Envio para o ADMINISTRADOR
    try {
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          type: 'new_briefing',
          payload: {
            html: formatBriefingAsHTML(data)
          }
        }
      });

      if (error) throw error;


      adminSuccess = true;
    } catch (e) {
      console.error('[LeadService] Erro ao enviar para ADMIN:', e);
    }

    // 2. Envio para o CLIENTE (Confirmação)
    try {
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          type: 'new_briefing_client',
          payload: {
            name: data.name,
            companyName: data.companyName,
            email: data.email
          }
        }
      });

      if (error) throw error;
    } catch (e) {
      console.error('[LeadService] Erro ao enviar para CLIENTE:', e);
    }

    if (adminSuccess) {
      return true;
    }

    return false;
  }

  /**
   * Dispara o Webhook do CRM para criar um Contato / Pipeline na Hubspot ou Pipedrive
   */
  private async triggerCrmWebhook(type: string, data: unknown): Promise<void> {
    try {

      // Não esperamos por sucesso/falha do CRM para não travar a UX do usuário
      const { error } = await supabase.functions.invoke('webhook-crm', {
        body: { type, payload: data }
      });

      if (error) {
        console.error('[LeadService] Webhook CRM falhou:', error);
      }
    } catch (e) {
      console.error('[LeadService] Erro webhook-crm:', e);
    }
  }

  /**
   * Simula o envio do relatório por e-mail (Método legado/futuro)
   */
  async sendReportByEmail(email: string, reportContent: string): Promise<boolean> {
    try {

      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      return false;
    }
  }

  private saveToBackup(type: string, data: unknown) {
    try {
      const backup = JSON.parse(localStorage.getItem('mdsolution_leads_backup') || '[]');
      backup.push({
        type,
        data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('mdsolution_leads_backup', JSON.stringify(backup));
    } catch (e) {
      // Falha silenciosa no backup local
    }
  }
}

export const leadService = new LeadService();

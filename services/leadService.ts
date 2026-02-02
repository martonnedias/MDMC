import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabase';

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
      console.log('Lead de contato recebido:', data);

      const { error } = await supabase
        .from('leads')
        .insert([{
          type: 'contact',
          data: data,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar no Supabase:', error);
        this.saveToBackup('contact', data); // Fallback para localStorage
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao processar lead de contato:', error);
      this.saveToBackup('contact', data); // Fallback
      return false;
    }
  }

  /**
   * Salva um lead de briefing SWOT no Supabase e envia e-mail
   */
  async saveBriefingLead(data: any): Promise<boolean> {
    try {
      console.log('Lead de briefing recebido:', data);

      // Pega o usuário atual
      const { data: { user } } = await supabase.auth.getUser();

      // Salva no Supabase
      const { error } = await supabase
        .from('swot_briefings')
        .insert([{
          user_id: user?.id || null,
          type: data.type || 'SWOT_ANALYSIS',
          data: data,
          plan: data.plan || null,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar briefing no Supabase:', error);
        this.saveToBackup('briefing', data); // Fallback
      }

      // Envia e-mail para o admin via EmailJS
      await this.notifyAdminNewBriefing(data);

      return true;
    } catch (error) {
      console.error('Erro ao processar lead de briefing:', error);
      this.saveToBackup('briefing', data);
      return false;
    }
  }

  /**
   * Envia os dados do briefing para o e-mail do administrador via EmailJS
   * E envia confirmação para o cliente
   */
  async notifyAdminNewBriefing(data: any): Promise<boolean> {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Verificação de segurança das chaves
    if (!serviceId || !templateId || !publicKey) {
      alert(`Chaves do EmailJS não encontradas. Verifique o arquivo .env.local\n\nService: ${serviceId || 'N/A'}\nTemplate: ${templateId || 'N/A'}`);
      console.warn('[LeadService] EmailJS não configurado. Verifique as variáveis VITE_EMAILJS_*.');
      return true; // Retorna true para não bloquear a UI do usuário
    }

    let adminSuccess = false;

    // 1. Envio para o ADMINISTRADOR
    try {
      console.log('[LeadService] Tentando enviar e-mail para ADMIN...');
      const adminTemplateParams = {
        to_email: 'martonnedias@gmail.com',
        from_name: data.name,
        company_name: data.companyName,
        user_email: data.email,
        user_phone: data.phone,
        briefing_summary: this.formatBriefingAsHTML(data), // Envia HTML formatado
        message: `Novo Briefing SWOT recebido da empresa ${data.companyName}.`
      };

      await emailjs.send(serviceId, templateId, adminTemplateParams, publicKey);

      console.log('[LeadService] E-mail para ADMIN enviado com sucesso!');
      adminSuccess = true;
    } catch (e: any) {
      console.error('[LeadService] Erro ao enviar para ADMIN:', e);
      alert(`Erro ao enviar para o administrador:\n\n${e?.text || e?.message || 'Erro desconhecido'}\n\nVerifique se o Service ID e Template ID estão corretos.`);
    }

    // 2. Envio para o CLIENTE (Confirmação)
    const templateClientId = import.meta.env.VITE_EMAILJS_TEMPLATE_CLIENT_ID;

    if (templateClientId) {
      try {
        console.log('[LeadService] Tentando enviar e-mail para CLIENTE...');
        const clientTemplateParams = {
          to_email: data.email, // E-mail do cliente
          to_name: data.name,
          company_name: data.companyName,
          message: `Olá ${data.name}, recebemos os dados da empresa ${data.companyName} com sucesso. Em breve entraremos em contato com seu relatório.`
        };
        await emailjs.send(serviceId, templateClientId, clientTemplateParams, publicKey);
        console.log('[LeadService] E-mail de confirmação para CLIENTE enviado com sucesso!');
      } catch (e: any) {
        console.error('[LeadService] Erro ao enviar para CLIENTE:', e);
        // Só avisa erro do cliente se o admin funcionou (para não spammar alerts)
        if (adminSuccess) {
          console.warn('O e-mail do admin foi, mas o do cliente falhou. Verifique o Template ID do Cliente.');
        }
      }
    } else {
      console.warn('[LeadService] VITE_EMAILJS_TEMPLATE_CLIENT_ID não configurado. Pulei confirmação ao cliente.');
    }

    if (adminSuccess) {
      alert('Sucesso! E-mail enviado para o administrador.');
      return true;
    }

    return false; // Retorna false se falhou o envio crítico (Admin)
  }

  /**
   * Formata os dados do briefing em um layout de e-mail profissional e organizado
   */
  private formatBriefingAsHTML(data: any): string {
    const labels: Record<string, string> = {
      name: 'Nome do Gestor', email: 'E-mail', phone: 'WhatsApp',
      companyName: 'Empresa', segment: 'Segmento', businessTime: 'Tempo de Mercado', teamSize: 'Equipe',
      differential: 'Diferencial Competitivo', qualityRating: 'Nota de Qualidade', clientRelationship: 'Relacionamento',
      mainStrength: 'Ponto Forte Principal', keyProcess: 'Processo Chave', executionAbility: 'Execução (1-5)',
      dailyChallenge: 'Desafio Diário', financialOrg: 'Org. Financeira', processOrg: 'Org. Processos',
      mainWeakness: 'Fraqueza Principal', delegationAbility: 'Nível Delegação', specificBottleneck: 'Gargalo Específico',
      expansionDemand: 'Demanda de Expansão', biggestOpportunity: 'Oportunidade', techUsage: 'Uso de Tech',
      customerClarity: 'Clareza do Cliente', mainGoal6m: 'Meta 6 Meses', projectIdea: 'Ideia de Projeto',
      marketConcern: 'Preocupação Mercado', competitionRating: 'Concorrência', mainThreat: 'Ameaça Principal',
      adaptationAbility: 'Adaptação', dependencyLevel: 'Dependência de Clientes', financialHealth: 'Saúde Financeira',
      currentWorry: 'Preocupação Atual', mainGoal12m: 'Meta 12 Meses', directionClarity: 'Clareza Direção',
      firstImprovement: 'Primeira Melhoria', longTermDream: 'Sonho de Longo Prazo',
      changeDisposition: 'Disposição Mudança', biggestObstacle: 'Maior Obstáculo', recommendationOpenness: 'Abertura',
      plan: 'Plano Selecionado'
    };

    const sections = [
      { title: '📋 Cadastro e Empresa', fields: ['name', 'email', 'phone', 'companyName', 'segment', 'businessTime', 'teamSize'] },
      { title: '💪 Análise Interna (Forças)', fields: ['differential', 'mainStrength', 'clientRelationship', 'executionAbility'] },
      { title: '⚠️ Análise Interna (Fraquezas)', fields: ['dailyChallenge', 'mainWeakness', 'financialOrg', 'processOrg', 'delegationAbility', 'specificBottleneck'] },
      { title: '🚀 Oportunidades (Mercado)', fields: ['expansionDemand', 'biggestOpportunity', 'techUsage', 'customerClarity', 'projectIdea'] },
      { title: '🛡️ Ameaças (Riscos)', fields: ['marketConcern', 'competitionRating', 'mainThreat', 'adaptationAbility', 'dependencyLevel', 'financialHealth'] },
      { title: '🎯 Visão e Objetivos', fields: ['currentWorry', 'mainGoal6m', 'mainGoal12m', 'directionClarity', 'firstImprovement', 'longTermDream'] },
      { title: '⚙️ Disposição e Próximos Passos', fields: ['changeDisposition', 'biggestObstacle', 'recommendationOpenness', 'plan'] }
    ];

    let html = `
      <div style="background-color: #f4f7f9; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e1e8ed;">
          
          <!-- Header -->
          <div style="background-color: #0047FF; padding: 35px 40px; text-align: left;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Auditoria Estratégica SWOT</h1>
            <p style="color: #b3c7ff; margin: 5px 0 0 0; font-size: 14px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Novo Briefing Recebido</p>
          </div>

          <div style="padding: 40px;">
            <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 30px;">
              Olá, <strong>Administrador</strong>.<br>
              Um novo diagnóstico SWOT foi concluído no site. Abaixo estão as informações detalhadas para a sua análise.
            </p>
    `;

    sections.forEach(section => {
      html += `
        <div style="margin-bottom: 35px;">
          <h2 style="font-size: 18px; color: #0047FF; border-bottom: 2px solid #f0f4f8; padding-bottom: 10px; margin-bottom: 15px; font-weight: 700;">${section.title}</h2>
          <table style="width: 100%; border-collapse: collapse;">
      `;

      section.fields.forEach(field => {
        if (data[field] !== undefined) {
          html += `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f4f8; vertical-align: top; width: 40%;">
                <span style="font-size: 13px; font-weight: 700; color: #667c99; text-transform: uppercase; letter-spacing: 0.5px;">${labels[field] || field}</span>
              </td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #f0f4f8; vertical-align: top;">
                <span style="font-size: 15px; color: #2c3e50; line-height: 1.5;">${data[field]}</span>
              </td>
            </tr>
          `;
        }
      });

      html += `</table></div>`;
    });

    html += `
            <!-- Footer -->
            <div style="margin-top: 20px; padding-top: 30px; border-top: 2px solid #f0f4f8; text-align: center;">
              <p style="font-size: 14px; color: #95a5a6; margin: 0;">Este é um relatório gerado automaticamente pela plataforma <strong>MD Solution</strong>.</p>
              <div style="margin-top: 15px;">
                <a href="#" style="color: #0047FF; text-decoration: none; font-size: 13px; font-weight: 600;">Acessar Dashboard</a>
                <span style="margin: 0 10px; color: #e1e8ed;">|</span>
                <a href="mailto:contato@mdsolution.com.br" style="color: #0047FF; text-decoration: none; font-size: 13px; font-weight: 600;">Suporte Técnico</a>
              </div>
            </div>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e1e8ed;">
            <p style="font-size: 12px; color: #bdc3c7; margin: 0;">&copy; ${new Date().getFullYear()} MD Solution Estratégia Digital. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    `;

    return html;
  }

  /**
   * Simula o envio do relatório por e-mail (Método legado/futuro)
   */
  async sendReportByEmail(email: string, reportContent: string): Promise<boolean> {
    try {
      console.log(`Enviando relatório para o e-mail: ${email}`);
      console.log('Conteúdo do relatório:', reportContent.substring(0, 100) + '...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      return false;
    }
  }

  private saveToBackup(type: string, data: any) {
    try {
      const backup = JSON.parse(localStorage.getItem('mdsolution_leads_backup') || '[]');
      backup.push({
        type,
        data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('mdsolution_leads_backup', JSON.stringify(backup));
    } catch (e) {
      console.warn('Falha no backup local:', e);
    }
  }
}

export const leadService = new LeadService();
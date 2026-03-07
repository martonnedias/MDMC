import { supabase } from '../lib/supabase';

export interface Tenant {
    id: string;
    name: string;
    created_at: string;
}

export interface Ticket {
    id: string;
    subject: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    created_at: string;
    updated_at: string;
    last_message?: string;
}

export interface Invoice {
    id: string;
    stripe_invoice_id: string;
    status: 'paid' | 'open' | 'uncollectible' | 'void';
    amount_due: number;
    amount_paid: number;
    currency: string;
    hosted_invoice_url: string;
    invoice_pdf_url: string;
    due_date: string;
    created_at: string;
}

export interface Contract {
    id: string;
    title: string;
    status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'expired' | 'revoked';
    sent_at: string | null;
    accepted_at: string | null;
    created_at: string;
}

export const clientService = {
    async getMyTenants() {
        const { data, error } = await supabase
            .from('tenant_members')
            .select(`
                tenant_id,
                role,
                tenants (
                    id,
                    name
                )
            `)
            .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
            .eq('is_active', true);

        if (error) throw error;
        return data;
    },

    async getDashboardStats(tenantId: string) {
        // Obter tickets abertos
        const { count: openTickets } = await supabase
            .from('support_tickets')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId)
            .in('status', ['open', 'in_progress']);

        // Obter contratos pendentes
        const { count: pendingContracts } = await supabase
            .from('contracts')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId)
            .eq('status', 'sent');

        // Obter propostas abertas
        const { count: openProposals } = await supabase
            .from('proposals')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId)
            .eq('status', 'sent');

        return {
            openTickets: openTickets || 0,
            pendingContracts: pendingContracts || 0,
            openProposals: openProposals || 0
        };
    },

    async getTickets(tenantId: string) {
        const { data, error } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('tenant_id', tenantId)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data as Ticket[];
    },

    async getInvoices(tenantId: string) {
        const { data, error } = await supabase
            .from('billing_invoices')
            .select('*')
            .eq('tenant_id', tenantId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Invoice[];
    },

    async getContracts(tenantId: string) {
        const { data, error } = await supabase
            .from('contracts')
            .select('*')
            .eq('tenant_id', tenantId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Contract[];
    }
};

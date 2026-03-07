import { supabase } from '../lib/supabase';

export type ContractStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'expired' | 'revoked';

export interface ContractTemplate {
    id: string;
    title: string;
    category: string;
    schema_json: any;
    is_active: boolean;
    created_at: string;
}

export interface Contract {
    id: string;
    tenant_id: string;
    proposal_id?: string;
    template_id: string;
    title: string;
    status: ContractStatus;
    current_version_id: string | null;
    sent_at: string | null;
    accepted_at: string | null;
    expires_at: string | null;
    created_at: string;
}

export interface ContractVersion {
    id: string;
    contract_id: string;
    version_number: number;
    variables_json: any;
    rendered_html: string;
    content_hash: string;
    created_at: string;
}

export const contractService = {
    // 1. Templates
    async getTemplates(): Promise<ContractTemplate[]> {
        const { data, error } = await supabase
            .from('contract_templates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error("Error fetching templates", error);
        return data || [];
    },

    async saveTemplate(template: Partial<ContractTemplate>): Promise<ContractTemplate | null> {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return null;

        let q;
        if (template.id && template.id !== 'new') {
            q = supabase.from('contract_templates')
                .update({ ...template, updated_at: new Date().toISOString() })
                .eq('id', template.id).select().single();
        } else {
            const payload = { ...template };
            delete payload.id;
            q = supabase.from('contract_templates')
                .insert({ ...payload, created_by: userData.user.id }).select().single();
        }
        const { data, error } = await q;
        if (error) { console.error("Error saving template", error); return null; }
        return data;
    },

    // 2. Contracts
    async getContracts(): Promise<Contract[]> {
        const { data, error } = await supabase
            .from('contracts')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) console.error("Error fetching contracts", error);
        return data || [];
    },

    async createContract(title: string, templateId: string, tenantId: string, proposalId?: string): Promise<Contract | null> {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return null;

        const { data, error } = await supabase
            .from('contracts')
            .insert({
                title,
                template_id: templateId,
                tenant_id: tenantId,
                proposal_id: proposalId || null,
                created_by: userData.user.id
            }).select().single();

        if (error) { console.error("Error creating contract", error); return null; }
        return data;
    },

    async saveContractVersion(contractId: string, variables: any, html: string): Promise<ContractVersion | null> {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return null;

        const { data: maxVersion } = await supabase
            .from('contract_versions')
            .select('version_number')
            .eq('contract_id', contractId)
            .order('version_number', { ascending: false }).limit(1).single();

        const nextV = maxVersion ? maxVersion.version_number + 1 : 1;
        // Basic hash creation for MVP
        const hash = btoa(encodeURIComponent(html)).substring(0, 50);

        const { data: version, error } = await supabase
            .from('contract_versions')
            .insert({
                contract_id: contractId,
                version_number: nextV,
                variables_json: variables,
                rendered_html: html,
                content_hash: hash,
                created_by: userData.user.id
            }).select().single();

        if (error || !version) { console.error("Error saving version:", error); return null; }

        const { error: updErr } = await supabase.from('contracts').update({
            current_version_id: version.id,
            updated_at: new Date().toISOString()
        }).eq('id', contractId);

        if (updErr) console.error("Error updating contract version id", updErr);

        return version;
    },

    async createPublicLink(contractId: string, expiresInDays: number = 7): Promise<string | null> {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return null;

        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        const { error } = await supabase
            .from('contract_public_links')
            .insert({
                contract_id: contractId,
                token: token,
                expires_at: expiresAt.toISOString(),
                created_by: userData.user.id
            });

        if (error) { console.error("Error creating link", error); return null; }

        await supabase.from('contracts').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', contractId);
        return token;
    },

    async getContractVersion(versionId: string): Promise<ContractVersion | null> {
        const { data } = await supabase.from('contract_versions').select('*').eq('id', versionId).single();
        return data || null;
    }
};

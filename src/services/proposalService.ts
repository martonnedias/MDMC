import { supabase } from '../lib/supabase';

export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'approved' | 'expired' | 'revoked';

export interface Proposal {
    id: string;
    tenant_id: string;
    title: string;
    status: ProposalStatus;
    current_version_id: string | null;
    sent_at: string | null;
    approved_at: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
}

export interface ProposalVersion {
    id: string;
    proposal_id: string;
    version_number: number;
    payload_json: any;
    rendered_html: string;
    content_hash: string;
    created_by: string;
    created_at: string;
}

export interface Tenant {
    id: string;
    name: string;
}

export const proposalService = {
    // Query tenants for proposals
    async getTenants(): Promise<Tenant[]> {
        const { data, error } = await supabase
            .from('tenants')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Error fetching tenants:", error);
            return [];
        }
        return data || [];
    },

    // Query all proposals (Admin view)
    async getProposals(): Promise<Proposal[]> {
        const { data, error } = await supabase
            .from('proposals')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching proposals:", error);
            return [];
        }
        return data || [];
    },

    // Create a new proposal
    async createProposal(title: string, tenantId: string): Promise<Proposal | null> {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return null;

        const { data, error } = await supabase
            .from('proposals')
            .insert({
                title,
                tenant_id: tenantId,
                created_by: userData.user.id
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating proposal:", error);
            return null;
        }
        return data;
    },

    // Update proposal status/basic info
    async updateProposal(id: string, updates: Partial<Proposal>): Promise<boolean> {
        const { error } = await supabase
            .from('proposals')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error("Error updating proposal:", error);
            return false;
        }
        return true;
    },

    // Create a new proposal version
    async saveProposalVersion(
        proposalId: string,
        payload: any,
        renderedHtml: string
    ): Promise<ProposalVersion | null> {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return null;

        // 1. Get current max version number
        const { data: maxVersionData } = await supabase
            .from('proposal_versions')
            .select('version_number')
            .eq('proposal_id', proposalId)
            .order('version_number', { ascending: false })
            .limit(1)
            .single();

        const nextVersionNum = maxVersionData ? maxVersionData.version_number + 1 : 1;

        // A simple deterministic hash mechanism for the content (can use a library later, here just a basic base64 for MVP hash simulation)
        const contentHash = btoa(encodeURIComponent(renderedHtml)).substring(0, 50);

        // 2. Insert new version
        const { data: versionData, error: versionError } = await supabase
            .from('proposal_versions')
            .insert({
                proposal_id: proposalId,
                version_number: nextVersionNum,
                payload_json: payload,
                rendered_html: renderedHtml,
                content_hash: contentHash,
                created_by: userData.user.id
            })
            .select()
            .single();

        if (versionError || !versionData) {
            console.error("Error saving version:", versionError);
            return null;
        }

        // 3. Update proposal's current_version_id
        await this.updateProposal(proposalId, { current_version_id: versionData.id });

        return versionData;
    },

    // Generate an access token / link for the proposal
    async createPublicLink(proposalId: string, expiresInDays: number = 7): Promise<string | null> {
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        const { error } = await supabase
            .from('proposal_public_links')
            .insert({
                proposal_id: proposalId,
                token: token,
                expires_at: expiresAt.toISOString()
            });

        if (error) {
            console.error("Error creating public link:", error);
            return null;
        }
        // Update status to sent if draft
        await this.updateProposal(proposalId, { status: 'sent' });

        return token;
    },

    // Helper to fetch the latest version of a proposal
    async getProposalVersion(versionId: string): Promise<ProposalVersion | null> {
        const { data, error } = await supabase
            .from('proposal_versions')
            .select('*')
            .eq('id', versionId)
            .single();

        if (error) {
            console.error("Error fetching proposal version:", error);
            return null;
        }
        return data;
    }
};

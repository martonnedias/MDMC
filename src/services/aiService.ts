import { supabase } from '../lib/supabase';

// Toda geração de texto passa pela Edge Function `ai-generate`.
// A chave do Gemini fica no secret GEMINI_API_KEY do Supabase, nunca no navegador.

export class AiServiceError extends Error {
    constructor(public code: string, message: string) {
        super(message);
    }
}

type AiKind = 'blog_post' | 'page_copy' | 'marketing_report' | 'swot_report';

async function invokeAi<T>(body: Record<string, unknown> & { kind: AiKind }): Promise<T> {
    const { data, error } = await supabase.functions.invoke('ai-generate', { body });

    if (error) {
        let code = 'UNAVAILABLE';
        try {
            const payload = await (error as any).context?.json();
            if (payload?.code) code = payload.code;
        } catch {
            // resposta sem JSON: mantém o código genérico
        }
        throw new AiServiceError(code, error.message);
    }

    if (!data || (data as any).error) {
        throw new AiServiceError((data as any)?.code ?? 'UNAVAILABLE', (data as any)?.error ?? 'Falha na IA');
    }

    return (data as { data: T }).data;
}

export const aiService = {
    async generateBlogPost(topic: string, category: string): Promise<{ title: string; content: string; excerpt: string } | null> {
        try {
            return await invokeAi({ kind: 'blog_post', topic, category });
        } catch (error: any) {
            console.error('[AI Blog] Falha na geração:', error.message);
            return null;
        }
    },

    async generatePageCopy(pageName: string, sectionContext: string): Promise<{ title: string; subtitle: string } | null> {
        try {
            return await invokeAi({ kind: 'page_copy', pageName, sectionContext });
        } catch (error: any) {
            console.error('[AI Page Copy] Falha na geração:', error.message);
            return null;
        }
    },

    // Relatórios do fluxo público de captação. Lança AiServiceError para a tela tratar.
    async generateReportText(kind: 'marketing_report' | 'swot_report', formData: Record<string, unknown>): Promise<string> {
        const body = kind === 'marketing_report'
            ? { kind, formData }
            : { kind, ...formData };
        return invokeAi<string>(body as Record<string, unknown> & { kind: AiKind });
    },
};

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
        const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') ?? 'contato@mdsolution.com.br'

        if (!RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY não configurada no Supabase")
        }

        const body = await req.json()
        const { type, payload } = body
        // type: 'new_lead', 'new_briefing', 'new_briefing_client', 'proposal_accepted', 'contract_accepted'

        let subject = ''
        let htmlContent = ''
        let targetEmail = ADMIN_EMAIL // default to admin

        switch (type) {
            case 'new_lead':
                subject = '🚀 Novo Lead Recebido - MD Solution'
                htmlContent = `
                    <h2>Novo Lead Recebido!</h2>
                    <p><strong>Nome:</strong> ${payload.name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${payload.email || 'N/A'}</p>
                    <p><strong>WhatsApp:</strong> ${payload.whatsapp || 'N/A'}</p>
                    <p><strong>Negócio:</strong> ${payload.business_type || 'N/A'}</p>
                    <p><strong>Fonte:</strong> ${payload.source || 'N/A'}</p>
                `
                break
            case 'new_briefing':
                subject = '📊 Novo Diagnóstico SWOT Recebido - MD Solution'
                htmlContent = payload.html || '<p>Novo diagnóstico sem conteúdo HTML definido.</p>'
                break
            case 'new_briefing_client':
                subject = '✅ Seu Diagnóstico SWOT MD Solution foi recebido!'
                htmlContent = `
                    <h2>Olá ${payload.name || ''}!</h2>
                    <p>Recebemos as informações da empresa <strong>${payload.companyName || ''}</strong> com sucesso.</p>
                    <p>Nossa equipe vai analisar os dados e entrará em contato em breve para apresentar o relatório estratégico.</p>
                    <br/>
                    <p>Um abraço,</p>
                    <p><strong>Equipe MD Solution</strong></p>
                `
                targetEmail = payload.email // override target to the client's email
                break
            case 'proposal_accepted':
                subject = '✅ Proposta Aceita - MD Solution'
                htmlContent = `
                    <h2>Ótima notícia!</h2>
                    <p>A proposta <strong>${payload.proposal_id || ''}</strong> foi aceita.</p>
                    <p><strong>Responsável:</strong> ${payload.accepted_full_name || 'N/A'}</p>
                    <p><strong>Documento:</strong> ${payload.accepted_document || 'N/A'}</p>
                    <p><strong>Hash de Aceite:</strong> ${payload.acceptance_hash || 'N/A'}</p>
                `
                break
            case 'contract_accepted':
                subject = '✍️ Contrato Assinado - MD Solution'
                htmlContent = `
                    <h2>Contrato Assinado Digitalmente!</h2>
                    <p>O contrato <strong>${payload.contract_id || ''}</strong> foi assinado com sucesso.</p>
                    <p><strong>Responsável:</strong> ${payload.accepted_full_name || 'N/A'}</p>
                    <p><strong>Documento:</strong> ${payload.accepted_document || 'N/A'}</p>
                    <p><strong>Hash de Assinatura:</strong> ${payload.acceptance_hash || 'N/A'}</p>
                `
                break
            default:
                throw new Error("Tipo de notificação desconhecido")
        }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'MD Solution <onboarding@resend.dev>', // Usar domínio verificado em produção
                to: [targetEmail],
                subject: subject,
                html: htmlContent,
            }),
        })

        const resData = await res.json()

        if (!res.ok) {
            console.error("Erro da Resend:", resData)
            throw new Error("Falha ao enviar e-mail via Resend")
        }

        return new Response(JSON.stringify({ success: true, id: resData.id }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error("Error in send-notification edge function:", error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})

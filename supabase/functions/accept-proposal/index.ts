import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        const { token, accepted_full_name, accepted_document } = body

        if (!token || !accepted_full_name || !accepted_document) {
            return new Response(JSON.stringify({ error: 'Campos obrigatórios faltando.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        const supabaseAdmin = createClient(
            Deno.env.get('CUSTOM_SUPABASE_URL') ?? '',
            Deno.env.get('CUSTOM_SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Get Link details
        const { data: linkInfo, error: linkError } = await supabaseAdmin
            .from('proposal_public_links')
            .select('proposal_id, expires_at, revoked_at')
            .eq('token', token)
            .single()

        if (linkError || !linkInfo || linkInfo.revoked_at || (linkInfo.expires_at && new Date(linkInfo.expires_at) < new Date())) {
            return new Response(JSON.stringify({ error: 'Token inválido ou expirado.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
            })
        }

        // 2. Get Proposal details
        const { data: proposal, error: propError } = await supabaseAdmin
            .from('proposals')
            .select('id, status, current_version_id')
            .eq('id', linkInfo.proposal_id)
            .single()

        if (propError || !proposal) {
            return new Response(JSON.stringify({ error: 'Proposta indisponível.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404
            })
        }

        if (proposal.status === 'approved') {
            return new Response(JSON.stringify({ error: 'Esta proposta já foi aceita anteriormente.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
            })
        }

        const ip = req.headers.get('x-forwarded-for') || 'unknown'
        const userAgent = req.headers.get('user-agent') || 'unknown'

        // 3. Generate acceptance hash (basic example)
        let hashSource = `${proposal.id}:${proposal.current_version_id}:${accepted_document}:${new Date().toISOString()}`
        const encoder = new TextEncoder()
        const dataBuffer = encoder.encode(hashSource)
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
        const acceptanceHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')

        // 4. Save to proposal_acceptances
        const { error: acceptError } = await supabaseAdmin
            .from('proposal_acceptances')
            .insert({
                proposal_id: proposal.id,
                version_id: proposal.current_version_id,
                accepted_full_name,
                accepted_document,
                ip,
                user_agent: userAgent,
                acceptance_hash: acceptanceHash
            })

        if (acceptError) {
            return new Response(JSON.stringify({ error: 'Erro ao assinar aceite.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500
            })
        }

        // 5. Update proposal status
        await supabaseAdmin
            .from('proposals')
            .update({
                status: 'approved',
                approved_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', proposal.id)

        // 6. Log the accepted event
        await supabaseAdmin.from('proposal_events').insert({
            proposal_id: proposal.id,
            event_type: 'accepted',
            ip,
            user_agent: userAgent,
            metadata_json: { acceptance_hash: acceptanceHash }
        })

        // 7. Send notification email
        await supabaseAdmin.functions.invoke('send-notification', {
            body: {
                type: 'proposal_accepted',
                payload: {
                    proposal_id: proposal.id,
                    accepted_full_name,
                    accepted_document,
                    acceptance_hash: acceptanceHash
                }
            }
        }).catch(err => {
            console.error("Erro ao enviar notificação interna:", err)
        })

        return new Response(JSON.stringify({ success: true, hash: acceptanceHash }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})

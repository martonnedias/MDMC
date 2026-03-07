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
        let token = '';
        if (req.method === 'POST') {
            const body = await req.json()
            token = body.token
        } else {
            const url = new URL(req.url)
            token = url.searchParams.get('token')
        }

        if (!token) {
            return new Response(JSON.stringify({ error: 'Token missing' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Get Link details
        const { data: linkInfo, error: linkError } = await supabaseAdmin
            .from('contract_public_links')
            .select('contract_id, expires_at, revoked_at')
            .eq('token', token)
            .single()

        if (linkError || !linkInfo) {
            return new Response(JSON.stringify({ error: 'Contrato não encontrado ou link inválido' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404
            })
        }

        if (linkInfo.revoked_at) {
            return new Response(JSON.stringify({ error: 'Este link foi revogado pelo autor.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401
            })
        }

        if (linkInfo.expires_at && new Date(linkInfo.expires_at) < new Date()) {
            return new Response(JSON.stringify({ error: 'A validade deste contrato expirou.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401
            })
        }

        // 2. Get Contract details
        const { data: contract, error: contractError } = await supabaseAdmin
            .from('contracts')
            .select('id, title, status, current_version_id, tenant_id')
            .eq('id', linkInfo.contract_id)
            .single()

        if (contractError || !contract || !contract.current_version_id) {
            return new Response(JSON.stringify({ error: 'Contrato indisponível.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404
            })
        }

        // 3. Mark as viewed if it was 'sent' or 'draft'
        if (contract.status === 'sent' || contract.status === 'draft') {
            await supabaseAdmin
                .from('contracts')
                .update({ status: 'viewed', updated_at: new Date().toISOString() })
                .eq('id', contract.id)
            contract.status = 'viewed'
        }

        // 4. Log the viewed event
        await supabaseAdmin.from('contract_events').insert({
            contract_id: contract.id,
            public_link_id: null,
            event_type: 'viewed',
            ip: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown'
        })

        // 5. Get current version HTML
        const { data: version, error: versionError } = await supabaseAdmin
            .from('contract_versions')
            .select('id, rendered_html')
            .eq('id', contract.current_version_id)
            .single()

        if (versionError || !version) {
            return new Response(JSON.stringify({ error: 'Conteúdo do contrato não encontrado.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404
            })
        }

        // Return combined data
        return new Response(JSON.stringify({
            id: contract.id,
            title: contract.title,
            status: contract.status,
            version_id: version.id,
            html: version.rendered_html
        }), {
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

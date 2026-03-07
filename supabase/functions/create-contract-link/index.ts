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
        if (req.method !== 'POST') {
            return new Response('Method not allowed', { status: 405, headers: corsHeaders });
        }

        // Authentication check
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Não autorizado' }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

        // Setup client with user's token to check permissions
        const supabaseUserClient = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } }
        })

        const { data: { user }, error: userError } = await supabaseUserClient.auth.getUser()
        if (userError || !user) {
            return new Response(JSON.stringify({ error: 'Sessão inválida' }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        const body = await req.json()
        const { contractId, expirationDays = 7 } = body

        if (!contractId) {
            return new Response(JSON.stringify({ error: 'contractId é obrigatório' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // We use the admin client from here to manipulate DB ignoring RLS
        const supabaseAdmin = createClient(
            Deno.env.get('CUSTOM_SUPABASE_URL') ?? Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('CUSTOM_SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Verify contract exists and user has access
        const { data: contract, error: contractError } = await supabaseAdmin
            .from('contracts')
            .select('id, status')
            .eq('id', contractId)
            .single()

        if (contractError || !contract) {
            return new Response(JSON.stringify({ error: 'Contrato não encontrado.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404
            })
        }

        // Generate token
        const array = new Uint8Array(24);
        crypto.getRandomValues(array);
        const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expirationDays);

        // Revoke any existing active links for this contract
        await supabaseAdmin
            .from('contract_public_links')
            .update({ revoked_at: new Date().toISOString() })
            .eq('contract_id', contractId)
            .is('revoked_at', null)

        // Insert new link
        const { data: newLink, error: linkError } = await supabaseAdmin
            .from('contract_public_links')
            .insert({
                contract_id: contractId,
                token: token,
                expires_at: expiresAt.toISOString(),
                created_by: user.id
            })
            .select()
            .single()

        if (linkError) {
            return new Response(JSON.stringify({ error: 'Erro ao gerar link', details: linkError }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500
            })
        }

        // Update contract status to 'sent' if it was 'draft'
        if (contract.status === 'draft') {
            await supabaseAdmin
                .from('contracts')
                .update({ status: 'sent', sent_at: new Date().toISOString() })
                .eq('id', contractId)
        }

        // Log event
        await supabaseAdmin.from('contract_events').insert({
            contract_id: contractId,
            public_link_id: newLink.id,
            event_type: 'sent',
            ip: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown'
        })

        const appUrl = Deno.env.get('APP_BASE_URL') || 'https://mdsolution.com.br'
        const url = `${appUrl}/c/${token}`

        return new Response(JSON.stringify({
            url,
            token,
            expiresAt: expiresAt.toISOString()
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

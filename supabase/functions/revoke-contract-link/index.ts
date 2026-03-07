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
        const { contractId } = body

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

        // Revoke active links for this contract
        const { data: updatedLinks, error: updateError } = await supabaseAdmin
            .from('contract_public_links')
            .update({ revoked_at: new Date().toISOString() })
            .eq('contract_id', contractId)
            .is('revoked_at', null)
            .select()

        if (updateError) {
            return new Response(JSON.stringify({ error: 'Erro ao revogar links' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500
            })
        }

        // Log events for revoked links
        for (const link of updatedLinks) {
            await supabaseAdmin.from('contract_events').insert({
                contract_id: contractId,
                public_link_id: link.id,
                event_type: 'revoked',
                ip: req.headers.get('x-forwarded-for') || 'unknown',
                user_agent: req.headers.get('user-agent') || 'unknown'
            })
        }

        // Update contract status if appropriate
        await supabaseAdmin
            .from('contracts')
            .update({ status: 'revoked' })
            .eq('id', contractId)
            .in('status', ['sent', 'viewed']) // only update if it was pending

        return new Response(JSON.stringify({
            success: true,
            revokedCount: updatedLinks.length
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

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

        const body = await req.json()
        const { token, attachmentId } = body

        if (!token || !attachmentId) {
            return new Response(JSON.stringify({ error: 'Token and attachmentId are required' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        const supabaseAdmin = createClient(
            Deno.env.get('CUSTOM_SUPABASE_URL') ?? Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('CUSTOM_SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
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

        // 2. Validate Attachment
        const { data: attachment, error: attachmentError } = await supabaseAdmin
            .from('contract_attachments')
            .select('file_path, is_public_to_signer')
            .eq('id', attachmentId)
            .eq('contract_id', linkInfo.contract_id)
            .single()

        if (attachmentError || !attachment) {
            return new Response(JSON.stringify({ error: 'Anexo não encontrado ou não pertence a este contrato.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404
            })
        }

        if (!attachment.is_public_to_signer) {
            return new Response(JSON.stringify({ error: 'Você não tem permissão para acessar este anexo.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403
            })
        }

        // 3. Generate Signed URL (expiring in 5 minutes = 300 seconds)
        const expiresInSeconds = 300;
        const { data: signedData, error: signedError } = await supabaseAdmin.storage
            .from('contracts')
            .createSignedUrl(attachment.file_path, expiresInSeconds)

        if (signedError || !signedData) {
            return new Response(JSON.stringify({ error: 'Erro ao gerar link temporário do arquivo.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500
            })
        }

        return new Response(JSON.stringify({
            signedUrl: signedData.signedUrl,
            expiresInSeconds
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

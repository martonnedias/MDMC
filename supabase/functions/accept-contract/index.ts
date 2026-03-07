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

    function isValidCPF(cpf: string) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        let sum = 0, rest;
        for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        rest = (sum * 10) % 11;
        if ((rest === 10) || (rest === 11)) rest = 0;
        if (rest !== parseInt(cpf.substring(9, 10))) return false;
        sum = 0;
        for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        rest = (sum * 10) % 11;
        if ((rest === 10) || (rest === 11)) rest = 0;
        if (rest !== parseInt(cpf.substring(10, 11))) return false;
        return true;
    }

    function isValidCNPJ(cnpj: string) {
        cnpj = cnpj.replace(/[^\d]+/g, '');
        if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
        let size = cnpj.length - 2;
        let numbers = cnpj.substring(0, size);
        let digits = cnpj.substring(size);
        let sum = 0;
        let pos = size - 7;
        for (let i = size; i >= 1; i--) {
            sum += parseInt(numbers.charAt(size - i)) * pos--;
            if (pos < 2) pos = 9;
        }
        let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result !== parseInt(digits.charAt(0))) return false;
        size = size + 1;
        numbers = cnpj.substring(0, size);
        sum = 0;
        pos = size - 7;
        for (let i = size; i >= 1; i--) {
            sum += parseInt(numbers.charAt(size - i)) * pos--;
            if (pos < 2) pos = 9;
        }
        result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result !== parseInt(digits.charAt(1))) return false;
        return true;
    }

    function isValidDocument(doc: string) {
        const cleanDoc = doc.replace(/[^\d]+/g, '');
        if (cleanDoc.length === 11) return isValidCPF(cleanDoc);
        if (cleanDoc.length === 14) return isValidCNPJ(cleanDoc);
        return false;
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

        if (!isValidDocument(accepted_document)) {
            return new Response(JSON.stringify({ error: 'CPF ou CNPJ inválido. Verifique o documento informado.' }), {
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
            .from('contract_public_links')
            .select('id, contract_id, expires_at, revoked_at')
            .eq('token', token)
            .single()

        if (linkError || !linkInfo || linkInfo.revoked_at || (linkInfo.expires_at && new Date(linkInfo.expires_at) < new Date())) {
            return new Response(JSON.stringify({ error: 'Token inválido ou expirado.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
            })
        }

        // 2. Get Contract details
        const { data: contract, error: contractError } = await supabaseAdmin
            .from('contracts')
            .select('id, status, current_version_id')
            .eq('id', linkInfo.contract_id)
            .single()

        if (contractError || !contract) {
            return new Response(JSON.stringify({ error: 'Contrato indisponível.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404
            })
        }

        if (contract.status === 'accepted') {
            return new Response(JSON.stringify({ error: 'Este contrato já foi aceito anteriormente.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
            })
        }

        const ip = req.headers.get('x-forwarded-for') || 'unknown'
        const userAgent = req.headers.get('user-agent') || 'unknown'

        // 3. Generate acceptance hash (basic example)
        let hashSource = `${contract.id}:${contract.current_version_id}:${accepted_document}:${new Date().toISOString()}`
        const encoder = new TextEncoder()
        const dataBuffer = encoder.encode(hashSource)
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
        const acceptanceHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')

        // 4. Save to contract_acceptances
        const { error: acceptError } = await supabaseAdmin
            .from('contract_acceptances')
            .insert({
                contract_id: contract.id,
                version_id: contract.current_version_id,
                public_link_id: linkInfo.id,
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

        // 5. Update contract status
        await supabaseAdmin
            .from('contracts')
            .update({
                status: 'accepted',
                accepted_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', contract.id)

        // 6. Log the accepted event
        await supabaseAdmin.from('contract_events').insert({
            contract_id: contract.id,
            public_link_id: linkInfo.id,
            event_type: 'accepted',
            ip,
            user_agent: userAgent,
            metadata_json: { acceptance_hash: acceptanceHash }
        })

        // 7. Send notification email
        await supabaseAdmin.functions.invoke('send-notification', {
            body: {
                type: 'contract_accepted',
                payload: {
                    contract_id: contract.id,
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

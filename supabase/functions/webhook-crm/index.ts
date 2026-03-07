import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Tratamento de CORS para preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        const { type, payload } = body

        // Verifica qual CRM o usuário prefere ou tem configurado
        const PIPEDRIVE_API_TOKEN = Deno.env.get('PIPEDRIVE_API_TOKEN')
        const HUBSPOT_API_TOKEN = Deno.env.get('HUBSPOT_API_TOKEN')

        if (!PIPEDRIVE_API_TOKEN && !HUBSPOT_API_TOKEN) {
            console.warn("⚠️ Nenhuma Chave de API de CRM configurada. Webhook CRM abortado amigavelmente.")
            return new Response(JSON.stringify({ success: true, message: "No CRM configured, skipping CRM integration." }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        console.log(`[Webhook-CRM] Processando novo evento tipo: ${type}`)

        // Dependendo do payload base recebido, criamos um Pipedrive Person ou HubSpot Contact
        let result = {}

        if (PIPEDRIVE_API_TOKEN) {
            // [Simulação] Integração com Pipedrive API v1
            const personData = {
                name: payload.name || 'Sem Nome',
                email: [{ value: payload.email || '', primary: true }],
                phone: [{ value: payload.whatsapp || payload.phone || '', primary: true }],
            }

            // Simula chamada real via fetch para api.pipedrive.com
            console.log(`[Pipedrive] Cadastrando Person: ${personData.name}... (Simulação)`)
            result = { crm: 'pipedrive', status: 'simulated_success' }

            // Exemplo de como seria o fetch real:
            /*
            const res = await fetch(`https://api.pipedrive.com/v1/persons?api_token=${PIPEDRIVE_API_TOKEN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(personData)
            });
            result = await res.json()
            */
        }
        else if (HUBSPOT_API_TOKEN) {
            // [Simulação] Integração com Hubspot API v3
            const contactData = {
                properties: {
                    firstname: payload.name || '',
                    email: payload.email || '',
                    phone: payload.whatsapp || payload.phone || '',
                    company: payload.companyName || ''
                }
            }

            console.log(`[HubSpot] Cadastrando Contact: ${contactData.properties.firstname}... (Simulação)`)
            result = { crm: 'hubspot', status: 'simulated_success' }

            // Exemplo de como seria o fetch real:
            /*
            const res = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${HUBSPOT_API_TOKEN}`
                },
                body: JSON.stringify(contactData)
            });
            result = await res.json()
            */
        }

        return new Response(JSON.stringify({ success: true, integration: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        console.error("Error in webhook-crm edge function:", error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})

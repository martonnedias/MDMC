import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        const { token } = body

        if (!token) {
            return new Response(JSON.stringify({ error: 'Token missing' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        const supabaseAdmin = createClient(
            Deno.env.get('CUSTOM_SUPABASE_URL') ?? '',
            Deno.env.get('CUSTOM_SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Log access / Validate Token
        const { data: linkInfo, error: linkError } = await supabaseAdmin
            .from('report_public_links')
            .select('report_id, expires_at, revoked_at')
            .eq('token', token)
            .single()

        if (linkError || !linkInfo) {
            return new Response(JSON.stringify({ error: 'Token not found or invalid' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 404,
            })
        }

        if (linkInfo.revoked_at) {
            return new Response(JSON.stringify({ error: 'Token revoked' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        if (linkInfo.expires_at && new Date(linkInfo.expires_at) < new Date()) {
            return new Response(JSON.stringify({ error: 'Token expired' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        // Now get the report
        const { data: report, error: reportError } = await supabaseAdmin
            .from('reports')
            .select('content_html, report_type, created_at, summary_json')
            .eq('id', linkInfo.report_id)
            .single()

        if (reportError || !report) {
            return new Response(JSON.stringify({ error: 'Report not found' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 404,
            })
        }

        return new Response(JSON.stringify(report), {
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

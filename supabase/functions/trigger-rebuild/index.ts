import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // Verificar autenticação
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: "Não autorizado" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey, {
            global: { headers: { Authorization: authHeader } },
        });

        // Verificar se o usuário é admin
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return new Response(
                JSON.stringify({ error: "Sessão inválida" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Verificar role admin
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!profile || profile.role !== "admin") {
            return new Response(
                JSON.stringify({ error: "Apenas administradores podem acionar o rebuild" }),
                { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Disparar GitHub Actions workflow_dispatch
        const githubToken = Deno.env.get("GITHUB_TOKEN");
        const githubRepo = Deno.env.get("GITHUB_REPO") || "martonnedias/MDMC";
        const githubWorkflow = Deno.env.get("GITHUB_WORKFLOW_FILE") || "deploy.yml";

        if (!githubToken) {
            return new Response(
                JSON.stringify({ error: "GITHUB_TOKEN não configurado. Configure nas variáveis do Supabase." }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const dispatchUrl = `https://api.github.com/repos/${githubRepo}/actions/workflows/${githubWorkflow}/dispatches`;

        const ghResponse = await fetch(dispatchUrl, {
            method: "POST",
            headers: {
                Authorization: `token ${githubToken}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ref: "main",
                inputs: {
                    trigger: "supabase-admin",
                    triggered_by: user.email || user.id,
                    timestamp: new Date().toISOString(),
                },
            }),
        });

        if (ghResponse.status === 204 || ghResponse.ok) {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: `Deploy acionado com sucesso para ${githubRepo}`,
                    triggered_by: user.email,
                    timestamp: new Date().toISOString(),
                }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        } else {
            const errorText = await ghResponse.text();
            console.error("GitHub API error:", ghResponse.status, errorText);
            return new Response(
                JSON.stringify({
                    error: "Falha ao acionar GitHub Actions",
                    details: errorText,
                    status: ghResponse.status,
                }),
                { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }
    } catch (err) {
        console.error("trigger-rebuild error:", err);
        return new Response(
            JSON.stringify({ error: "Erro interno do servidor", details: String(err) }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});

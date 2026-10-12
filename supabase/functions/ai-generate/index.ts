import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Único ponto de acesso ao Gemini. A chave vem do secret GEMINI_API_KEY e nunca
// chega ao navegador. O cliente escolhe apenas o `kind` e os dados; os prompts
// ficam aqui, então a função não pode ser usada como proxy genérico do modelo.
//
// Tipos de uso:
//   blog_post, page_copy  -> somente administradores (JWT + ADMIN_EMAILS)
//   marketing_report, swot_report -> fluxo público de captação (sem login),
//                                    com campos limitados e saída limitada

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const MAX_BODY_CHARS = 16_000
const MAX_FORM_CHARS = 8_000

class HttpError extends Error {
    constructor(public status: number, public code: string, message: string) {
        super(message)
    }
}

const json = (status: number, body: Record<string, unknown>) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

// Campo obrigatório com limite de tamanho.
const requiredText = (value: unknown, name: string, max: number): string => {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new HttpError(400, 'INVALID', `Campo "${name}" é obrigatório`)
    }
    if (value.length > max) {
        throw new HttpError(400, 'INVALID', `Campo "${name}" excede ${max} caracteres`)
    }
    return value.trim()
}

// Campo opcional: vazio se ausente, mas nunca maior que o limite.
const optionalText = (value: unknown, name: string, max: number): string => {
    if (value === undefined || value === null) return ''
    if (typeof value !== 'string') {
        throw new HttpError(400, 'INVALID', `Campo "${name}" deve ser texto`)
    }
    if (value.length > max) {
        throw new HttpError(400, 'INVALID', `Campo "${name}" excede ${max} caracteres`)
    }
    return value.trim()
}

// Valida o JWT do usuário no Supabase e confere o e-mail com a lista ADMIN_EMAILS.
async function requireAdmin(req: Request): Promise<void> {
    const auth = req.headers.get('authorization') ?? ''
    if (!auth.startsWith('Bearer ')) {
        throw new HttpError(401, 'UNAUTHORIZED', 'Faça login para continuar')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    if (!supabaseUrl || !anonKey) {
        throw new HttpError(500, 'CONFIG', 'SUPABASE_URL/SUPABASE_ANON_KEY ausentes')
    }

    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: { apikey: anonKey, Authorization: auth },
    })
    if (!res.ok) {
        throw new HttpError(401, 'UNAUTHORIZED', 'Sessão inválida. Faça login novamente')
    }

    const user = await res.json()
    const admins = (Deno.env.get('ADMIN_EMAILS') ?? '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)

    if (!user?.email || !admins.includes(String(user.email).toLowerCase())) {
        throw new HttpError(403, 'FORBIDDEN', 'Acesso restrito a administradores')
    }
}

// Chamada REST ao Gemini. Lança HttpError com código conhecido.
async function callGemini(
    model: string,
    system: string | null,
    prompt: string,
    maxOutputTokens: number,
    asJson: boolean,
): Promise<string> {
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
        throw new HttpError(500, 'CONFIG', 'GEMINI_API_KEY não configurada no Supabase')
    }

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
            body: JSON.stringify({
                ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    maxOutputTokens,
                    ...(asJson ? { responseMimeType: 'application/json' } : {}),
                },
            }),
        },
    )

    if (res.status === 429) {
        throw new HttpError(429, 'QUOTA', 'Limite de requisições atingido')
    }
    if (!res.ok) {
        console.error(`[ai-generate] Gemini ${model} HTTP ${res.status}: ${await res.text()}`)
        throw new HttpError(502, 'UNAVAILABLE', 'Serviço de IA indisponível')
    }

    const data = await res.json()
    const candidate = data?.candidates?.[0]
    if (data?.promptFeedback?.blockReason || candidate?.finishReason === 'SAFETY') {
        throw new HttpError(422, 'SAFETY', 'Conteúdo bloqueado por filtro de segurança')
    }

    const text: string = (candidate?.content?.parts ?? [])
        .map((p: { text?: string }) => p.text ?? '')
        .join('')
    if (!text.trim()) {
        throw new HttpError(502, 'EMPTY', 'A IA não retornou conteúdo')
    }
    return text
}

// Tenta cada modelo em ordem. Erros de cota, segurança e configuração não
// são repetidos com outro modelo.
async function generateWithFallback<T>(
    models: string[],
    system: string | null,
    prompt: string,
    maxOutputTokens: number,
    parse: (text: string) => T,
): Promise<T> {
    const asJson = parse !== identity
    let lastError: unknown = null

    for (const model of models) {
        try {
            const text = await callGemini(model, system, prompt, maxOutputTokens, asJson)
            return parse(text)
        } catch (err) {
            if (err instanceof HttpError && ['QUOTA', 'SAFETY', 'CONFIG'].includes(err.code)) {
                throw err
            }
            console.error(`[ai-generate] falha no modelo ${model}:`, (err as Error).message)
            lastError = err
        }
    }

    if (lastError instanceof HttpError) throw lastError
    throw new HttpError(502, 'UNAVAILABLE', 'Serviço de IA indisponível')
}

const identity = <T>(text: string): T => text as unknown as T

const parseJsonObject = (text: string) => {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    const slice = start !== -1 && end !== -1 ? text.substring(start, end + 1) : text
    return JSON.parse(slice)
}

const BLOG_MODELS = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro']

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        if (req.method !== 'POST') {
            throw new HttpError(405, 'INVALID', 'Método não permitido')
        }

        const raw = await req.text()
        if (raw.length > MAX_BODY_CHARS) {
            throw new HttpError(413, 'INVALID', 'Requisição muito grande')
        }

        let body: any
        try {
            body = JSON.parse(raw)
        } catch {
            throw new HttpError(400, 'INVALID', 'JSON inválido')
        }

        switch (body?.kind) {
            case 'blog_post': {
                await requireAdmin(req)
                const topic = requiredText(body.topic, 'topic', 200)
                const category = requiredText(body.category, 'category', 80)

                const prompt = `
          Aja como um especialista em Marketing Digital e Vendas.
          Escreva um artigo completo para um blog sobre o tema: "${topic}".
          Categoria: ${category}.

          IMPORTANTE: Sua resposta deve ser ESTRITAMENTE um JSON válido.
          O conteúdo HTML deve estar devidamente escapado para JSON.

          Formato esperado:
          {
            "title": "Título...",
            "excerpt": "Resumo...",
            "content": "<h1>Título</h1><p>Conteúdo HTML aqui...</p>"
          }
        `
                const data = await generateWithFallback(BLOG_MODELS, null, prompt, 8192, parseJsonObject)
                return json(200, { data })
            }

            case 'page_copy': {
                await requireAdmin(req)
                const pageName = requiredText(body.pageName, 'pageName', 200)
                const sectionContext = requiredText(body.sectionContext, 'sectionContext', 300)

                const prompt = `Aja como um Copywriter Sênior de uma agência de marketing de luxo/performance B2B.
Crie um Título impactante (H2) e um Subtítulo altamente persuasivo para a seção "${sectionContext}" da página do produto/serviço "${pageName}".
Foque em autoridade, gatilhos de urgência ou benefícios extremos. Textos curtos e magnéticos.

IMPORTANTE: Sua resposta deve ser ESTRITAMENTE um documento JSON válido e nada mais.

Formato esperado rigoroso:
{
  "title": "Seu super título de conversão aqui...",
  "subtitle": "Seu texto de apoio magnético quebrando objeções e gerando desejo..."
}`
                const data = await generateWithFallback(BLOG_MODELS, null, prompt, 1024, parseJsonObject)
                return json(200, { data })
            }

            case 'marketing_report': {
                const formData = body.formData
                if (!formData || typeof formData !== 'object') {
                    throw new HttpError(400, 'INVALID', 'Campo "formData" é obrigatório')
                }
                const serialized = JSON.stringify(formData, null, 2)
                if (serialized.length > MAX_FORM_CHARS) {
                    throw new HttpError(400, 'INVALID', 'Dados do formulário excedem o limite')
                }

                const companyName = requiredText(formData.companyName, 'companyName', 200)
                const segment = optionalText(formData.segment, 'segment', 200)
                const priceRange = optionalText(formData.priceRange, 'priceRange', 200)
                const maxInstallments = optionalText(formData.maxInstallments, 'maxInstallments', 200)
                const deliveryTime = optionalText(formData.deliveryTime, 'deliveryTime', 200)

                const system = `Você é um Consultor Sênior de Marketing Digital e Estratégia Comercial, especializado em análise imparcial de negócios.

**SUA MISSÃO:** Fornecer uma auditoria honesta, baseada em dados, que ajude o empresário a tomar decisões informadas.

**DICA DE FORMATAÇÃO DE TABELAS:**
Ao criar tabelas de benchmark, utilize exatamente este formato Markdown para que o sistema renderize corretamente:
| Característica | Sua Empresa | Concorrente A | Concorrente B |
| :--- | :--- | :--- | :--- |
| Preço | Valor X | Valor Y | Valor Z |

**ESTRUTURA OBRIGATÓRIA:**
1. RESUMO EXECUTIVO
2. DIAGNÓSTICO SITUACIONAL
3. ANÁLISE COMPETITIVA (Use a tabela de Benchmarks aqui)
4. PONTOS FORTES
5. GARGALOS CRÍTICOS
6. OPORTUNIDADES
7. RECOMENDAÇÃO ESTRATÉGICA
8. PRÓXIMOS PASSOS`

                const prompt = `Gere o relatório completo para a empresa "${companyName}".
        DADOS DE ENTRADA:
        ${serialized}

        Compare os dados de preço (${priceRange}), parcelamento (${maxInstallments}) e entrega (${deliveryTime}) com os benchmarks típicos do segmento "${segment}".`

                const data = await generateWithFallback(['gemini-2.0-flash'], system, prompt, 8192, identity)
                return json(200, { data })
            }

            case 'swot_report': {
                const companyName = requiredText(body.companyName, 'companyName', 200)
                const segment = optionalText(body.segment, 'segment', 200)
                const differential = optionalText(body.differential, 'differential', 1000)
                const mainStrength = optionalText(body.mainStrength, 'mainStrength', 1000)
                const mainWeakness = optionalText(body.mainWeakness, 'mainWeakness', 1000)
                const biggestOpportunity = optionalText(body.biggestOpportunity, 'biggestOpportunity', 1000)
                const mainThreat = optionalText(body.mainThreat, 'mainThreat', 1000)
                const mainGoal12m = optionalText(body.mainGoal12m, 'mainGoal12m', 1000)
                const dailyChallenge = optionalText(body.dailyChallenge, 'dailyChallenge', 1000)

                const system = "Você é um(a) consultor(a) de negócios especialista em Análise SWOT e planejamento estratégico para pequenas e médias empresas. Seu papel é pegar as respostas de um questionário SWOT completo e transformar isso em um relatório estratégico personalizado, claro, humano, prático, sem termos técnicos desnecessários e sem mencionar em nenhum momento que este conteúdo foi gerado por inteligência artificial. REGRAS DE ESTILO: - Nunca use 'IA', 'algoritmo', 'modelo'. Use 'Com base nas suas respostas', 'Nesta análise'. - Português do Brasil, claro, simples e acolhedor. - Fale na segunda pessoa ('você', 'sua empresa'). - Estrutura obrigatória: 1. Capa/Intro, 2. Resumo Executivo, 3. Forças, 4. Fraquezas, 5. Oportunidades, 6. Ameaças, 7. Plano de Ação Priorizado (30 dias, 3-6 meses, 6-12 meses), 8. Considerações Finais."

                const prompt = `Gere um relatório SWOT estratégico completo para a empresa "${companyName}" do segmento "${segment}".

        Contexto coletado:
        - Diferencial: ${differential}
        - Ponto Forte: ${mainStrength}
        - Ponto Fraco: ${mainWeakness}
        - Oportunidade: ${biggestOpportunity}
        - Ameaça: ${mainThreat}
        - Meta 12 meses: ${mainGoal12m}
        - Desafio: ${dailyChallenge}

        Use as informações detalhadas do briefing para criar recomendações práticas de gestão e marketing.`

                const data = await generateWithFallback(['gemini-1.5-flash'], system, prompt, 8192, identity)
                return json(200, { data })
            }

            default:
                throw new HttpError(400, 'INVALID', 'Tipo de geração inválido')
        }
    } catch (err) {
        if (err instanceof HttpError) {
            return json(err.status, { code: err.code, error: err.message })
        }
        console.error('[ai-generate] erro inesperado:', err)
        return json(500, { code: 'INTERNAL', error: 'Erro interno' })
    }
})

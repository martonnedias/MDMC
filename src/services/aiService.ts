import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const aiService = {
    async generateBlogPost(topic: string, category: string): Promise<{ title: string; content: string; excerpt: string } | null> {
        if (!API_KEY || API_KEY.includes("PLACEHOLDER")) {
            return null;
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        // Lista de modelos para tentar em ordem de preferência
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
        let lastError = "";

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });

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
        `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();



                const startIndex = text.indexOf('{');
                const endIndex = text.lastIndexOf('}');

                if (startIndex !== -1 && endIndex !== -1) {
                    text = text.substring(startIndex, endIndex + 1);
                }

                return JSON.parse(text);
            } catch (error: any) {
                console.error(`[AI] Falha modelo ${modelName}:`, error.message);
                lastError = error.message;
                // Se for erro de cota ou segurança, não adianta tentar outros do mesmo tipo
                if (error.message.includes("quota") || error.message.includes("safety")) break;
                continue; // Tenta o próximo modelo
            }
        }

        console.error('[AI] Todos os modelos falharam. Último erro:', lastError);
        return null;
    },

    async generatePageCopy(pageName: string, sectionContext: string): Promise<{ title: string; subtitle: string } | null> {
        if (!API_KEY || API_KEY.includes("PLACEHOLDER")) {
            return null;
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
        let lastError = "";

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `Aja como um Copywriter Sênior de uma agência de marketing de luxo/performance B2B.
Crie um Título impactante (H2) e um Subtítulo altamente persuasivo para a seção "${sectionContext}" da página do produto/serviço "${pageName}".
Foque em autoridade, gatilhos de urgência ou benefícios extremos. Textos curtos e magnéticos.

IMPORTANTE: Sua resposta deve ser ESTRITAMENTE um documento JSON válido e nada mais.

Formato esperado rigoroso:
{
  "title": "Seu super título de conversão aqui...",
  "subtitle": "Seu texto de apoio magnético quebrando objeções e gerando desejo..."
}`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();

                const startIndex = text.indexOf('{');
                const endIndex = text.lastIndexOf('}');

                if (startIndex !== -1 && endIndex !== -1) {
                    text = text.substring(startIndex, endIndex + 1);
                }

                return JSON.parse(text);
            } catch (error: any) {
                console.error(`[AI Page Copy] Falha modelo ${modelName}:`, error.message);
                lastError = error.message;
                if (error.message.includes("quota") || error.message.includes("safety")) break;
                continue;
            }
        }
        console.error('[AI Page Copy] Todos modelos falharam:', lastError);
        return null;
    }
};

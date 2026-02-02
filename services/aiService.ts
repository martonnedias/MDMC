import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCU24L2Pfhznu4OdAqdMewnXNpLge6a6B4"; // Hardcoded temporariamente para evitar reinício do servidor

export const aiService = {
    async generateBlogPost(topic: string, category: string): Promise<{ title: string; content: string; excerpt: string } | null> {
        if (!API_KEY || API_KEY.includes("PLACEHOLDER")) {
            alert("API Key do Gemini não configurada corretamente.");
            return null;
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        // Lista de modelos para tentar em ordem de preferência
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
        let lastError = "";

        for (const modelName of modelsToTry) {
            try {
                console.log(`Tentando gerar com o modelo: ${modelName}...`);
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

                console.log(`Sucesso com o modelo ${modelName}!`);

                const startIndex = text.indexOf('{');
                const endIndex = text.lastIndexOf('}');

                if (startIndex !== -1 && endIndex !== -1) {
                    text = text.substring(startIndex, endIndex + 1);
                }

                return JSON.parse(text);
            } catch (error: any) {
                console.warn(`Falha ao usar modelo ${modelName}:`, error.message);
                lastError = error.message;
                // Se for erro de cota ou segurança, não adianta tentar outros do mesmo tipo
                if (error.message.includes("quota") || error.message.includes("safety")) break;
                continue; // Tenta o próximo modelo
            }
        }

        // Se chegou aqui, todos falharam
        alert(`Não foi possível gerar o artigo com nenhum dos modelos disponíveis.\nÚltimo erro: ${lastError}\n\nDica: Verifique se a sua chave API no Google AI Studio tem acesso aos modelos Gemini 1.5.`);
        return null;
    }
};

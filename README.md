<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1s0uhbTKtoYRnhF3hg-5Z-HRhm0sn-sJq

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy no GitHub Pages

Para o formulário "Diagnóstico Grátis" (e outros leads) funcionarem em produção:

1. No repositório no GitHub: **Settings** → **Secrets and variables** → **Actions**
2. Crie os secrets:
   - **VITE_SUPABASE_URL**: URL do seu projeto Supabase (ex.: `https://xxxxx.supabase.co`)
   - **VITE_SUPABASE_ANON_KEY**: Chave anônima (anon/public) do Supabase
3. Os valores devem ser os mesmos do seu `.env.local` local. Após adicionar, faça um novo push para disparar o deploy.

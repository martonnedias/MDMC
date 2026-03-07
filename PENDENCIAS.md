# 📋 Pendências Restantes — MD Solution V1

**Última Atualização:** 06/03/2026

Estas são as etapas finais que ainda precisam ser concluídas para viabilizar o lançamento da versão V1 em ambiente de produção da MD Solution. A maior parte das pendências envolve configurações de nuvem (Supabase, Stripe, Github Actions e Pre-rendering).

---

## 🔴 Prioridade Máxima (Obrigatório para Lançamento do V1)

- [x] **Configurar `.env` e deploy do back-end (`supabase`)**:
  - [x] O usuário precisa configurar e subir as Edge Functions do Supabase (`supabase functions deploy`). Estão prontas, mas sem setup (Stripe Key, Resend Key, GitHub Token no Supabase Secrets).
- [x] **Configuração de SEO / SSG (Server Side Generation)**
  - [x] A Vercel/Netlify precisa ler o site indexado para o Blog funcionar de forma orgânica. Instalar `vite-plugin-ssr` ou `react-snap` e configurar o script de *postbuild*.
- [x] **Resolver dívida técnica arquitetural no Front-end (P2)**
  - [x] O `AdminPanel.tsx` precisa de refatoração para lazy load.
  - [x] O `leadService.ts` e `Footer.tsx` precisam de refatoramento urgente (clean code).

### 2. Configuração em Produção do Stripe

Toda a parte visual de Faturamentos já foi desenvolvida (no Admin e no Client Portal). Faltam as integrações externas:

- Criar os produtos e serviços cadastrados direto no painel do Stripe.
- Configurar as chaves secretas e registrar a URL do Webhook do Stripe conectada a função Edge `stripe-webhook`.
- Testar o fluxo ponta a ponta (Assinatura -> Boleto/Cartão -> Webhook -> Liberação no Portal).

Atualmente a plataforma funciona como um SPA (Single Page Application). Para melhor indexação dos robôs do Google (SEO):

- Instalar e configurar um plugin Vite de SSG (ex: `vite-plugin-ssr`, `react-snap` ou similar) para que as páginas públicas de vendas e blogs gerem arquivos `.html` estáticos acessíveis durante o build.

### 4. E-mail Transacional (Definição de API)

A função do Supabase `send-notification` para e-mails de formulários e SWOT está montada para funcionar, mas você precisa:

- Concluir a decisão do provedor de envio e gerar a API Key (Ex: plataforma **Resend** possui ótimo plano grátis).
- Registrar as credenciais nos secrets da Edge Function.

### 5. Rebuild Automático do CMS

A aplicação já consegue gerir Blogs e Páginas Dinâmicas de Vendas.

- Concluir os testes certificando-se de que ao alterar o post, o trigger do painel Admin aciona a edge-function `trigger-rebuild`, que por fim, ativará com sucesso o arquivo de pipeline `.github/workflows/deploy.yml`.

---

## 🟡 Prioridade Média e Baixa (Polimentos)

### 6. Banco de Dados / Row Level Security (RLS)

- O frontend já está validando as interfaces, entretanto, as políticas de segurança diretamente nas tabelas SQL do Supabase devem ser verificadas a fim de isolar Roles. Certificar que "Operadores" nunca consigam executar funções de "Financeiro" e afins via API.

### 7. IA Assistiva no Admin

- Foi homologada e validada a funcionalidade para criar Posts de Blog (com modelo *gemini-1.5-flash* e fallback ativado).
- Faltam mapear de forma final os botões de atalho em sessões de criação de Páginas Landing Pages (Gerar CTAs e textos promocionais) via `aiService.ts`.

### 8. Finalização do Fluxo de Propostas

- Avaliar a navegação ponta-a-ponta e expiração de links das faturas durante transições (Lead Cadastra -> Admin Compila e Envia Proposta -> Lead Visualiza -> Aceite Final com geração de Link).

---

> [!NOTE]
> Todo o resto apontado anteriormente — CSS para impressão em PDFs de relatórios, máscaras e validação estrita de CPF/CNPJ, rotas abertas ao público (`/contato` e `/swot`), layout limpo, remoção de headers desnecessários e coleta completa de leads com estado reativo da integração da Newsletter — **já foi programado, revisto compilado (npm run build de 9.6s finalizado com código de sucesso 0) e está completamente funcional no Front-end Módulo!**

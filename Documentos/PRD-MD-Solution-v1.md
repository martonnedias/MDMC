# PRD v1.0 FINAL — MD Solution (mdsolution.com.br)

**Data:** 2026-03-04  
**Status:** CONGELADO (pronto para execução)  
**Idioma:** PT-BR  
**Tema:** Dark Mode obrigatório desde V1

---

## 1) Sumário Executivo

A MD Solution será uma plataforma para aquisição, venda, entrega e cobrança de serviços de marketing, composta por:

1) **Site público (SSG + SEO)** com conteúdo vindo do Supabase (CMS) e **rebuild automático** ao publicar.  
2) **Admin** multiusuário com RBAC para CMS, leads, propostas, contratos, relatórios e operação.  
3) **Portal do Cliente** multiempresa (tenant) para relatórios, aprovações, arquivos, tickets e financeiro.  
4) **Links públicos por token (sem login)**:
   - Propostas: `/p/:token`
   - Relatórios: `/r/:token`
   - Contratos: `/c/:token`

**Financeiro:** integração com **Stripe**, com **assinatura mensal (recorrência) como padrão** e **cobrança avulsa opcional**.

---

## 2) Objetivos (V1)

### 2.1 Objetivos de negócio

- Aumentar geração de leads qualificados (SEO + formulários e diagnósticos).
- Reduzir tempo de fechamento (proposta/contrato por link + aceite auditável).
- Padronizar entrega e suporte (portal com tickets, arquivos, aprovações, relatórios).
- Escalar receita recorrente (assinaturas via Stripe).

### 2.2 Objetivos de produto

- CMS no Supabase para blog/páginas/config.
- Multiempresa com isolamento via RLS.
- Segurança por RBAC e Edge Functions em ações sensíveis.

---

## 3) Personas e Perfis de Acesso

- **Visitante** (anônimo): acessa site, blog, testes, páginas públicas.
- **Lead**: preenche formulário, recebe/visualiza relatório.
- **Cliente** (autenticado): acessa Portal do Cliente do seu tenant.
- **Equipe interna (autenticada)**: acessa Admin conforme RBAC.

---

## 4) Escopo V1 (MVP)

### 4.1 Site público (SSG + SEO)

- Home híbrida: layout fixo em código + conteúdo dinâmico via `site_config.home_content_json`.
- Blog (lista + post) vindo de `blog_posts` (SSG).
- Páginas institucionais via CMS: `/pagina/:slug`.
- Páginas de serviços via CMS: `/servicos/:slug` (com SEO).
- Planos/pacotes (página).
- Formulários interativos:
  - Teste Gratuito (gera relatório)
  - Teste SWOT (gera relatório)
- Dark mode + design system básico.

### 4.2 Relatórios

- Relatório HTML gerado após formulários.
- Link público por token: `/r/:token`.
- Impressão/PDF via CSS print (V1).

### 4.3 Propostas

- Link público por token: `/p/:token`.
- Aceite simples ou completo (quando necessário).
- Auditoria de visualização/aceite.

### 4.4 Portal do Cliente (multiempresa)

- Dashboard
- Relatórios (histórico)
- Aprovações
- Arquivos (Storage)
- Tickets/chamados
- Financeiro (status de assinatura e faturas)

### 4.5 Admin (multiusuário)

- CMS: home config, blog, páginas, páginas de serviço.
- Serviços/pacotes: `services_data` com `slug` opcional e gerador.
- Leads (pipeline básico)
- Propostas
- Contratos
- Relatórios
- Financeiro (Stripe)

---

## 5) Fora de Escopo (V1)

- PDF server-side (V1 = print/PDF do navegador).
- Page builder livre (Home é híbrida; páginas são CMS controlado).
- App mobile nativo.
- Envio automático por e-mail transacional (V1: copiar link e enviar manualmente).

---

## 6) Stack e Arquitetura

### 6.1 Frontend e Deploy

- **Vite + React**
- Hospedagem: **GitHub Pages**
- Rotas públicas **pré-render (SSG)** no build
- Admin/Portal como **CSR** (runtime)

### 6.2 Backend

- **Supabase**:
  - Auth
  - Postgres + RLS
  - Storage
  - Edge Functions

### 6.3 Rebuild automático (obrigatório)

Ao publicar/alterar conteúdo publicado em:

- `blog_posts`, `cms_pages`, `site_config`, `services_data`
Admin chama **Edge Function** que dispara **GitHub Actions workflow_dispatch** para rebuild/deploy.

---

## 7) Rotas (IA) — Final

### Públicas (SSG)

- `/`
- `/blog`
- `/blog/:slug`
- `/pagina/:slug`
- `/servicos/:slug`
- `/planos`
- `/teste-gratuito`
- `/swot`

### Privadas (CSR)

- `/admin/*`
- `/cliente/*`

### Públicas por token (dinâmicas)

- `/p/:token` (proposta)
- `/r/:token` (relatório)
- `/c/:token` (contrato)

---

## 8) CMS e Conteúdo

### 8.1 Home híbrida

- `site_config.home_content_json` guarda textos, imagens, CTAs e toggles de seções.
- Layout e componentes da Home ficam no React.

### 8.2 Blog

Tabela `blog_posts`:

- `slug` único, `status` draft/published
- conteúdo (HTML) + campos SEO recomendados (meta/og)

### 8.3 Páginas institucionais

Tabela `cms_pages` com `page_type='generic'`:

- rota: `/pagina/:slug`
- público só se `published` e `is_active=true`

### 8.4 Páginas de serviço

`cms_pages` com `page_type='service'` e `service_page_key`:

- rota: `/servicos/:slug`
- puxa cards/pacotes de `services_data` via filtro:
  - `services_data.page == cms_pages.service_page_key`

### 8.5 Serviços/Pacotes

Tabela `services_data` (unificada por `page`):

- adiciona `slug` **opcional**
- índice único por `(page, slug)` quando slug não-nulo
- Admin:
  - botão “Gerar slug pelo nome”
  - slug editável manualmente
  - slug nunca obrigatório

---

## 9) Segurança: RLS + RBAC

### 9.1 RBAC (congelado)

- **Admin**: acesso total
- **Operação**: CMS, leads, propostas, contratos, relatórios, portal (sem ações financeiras sensíveis)
- **Financeiro**: Stripe (assinaturas/faturas) + leitura mínima de clientes para cobrar

### 9.2 RLS (princípios)

- Público (`anon`) só lê conteúdo publicado/ativo.
- Dados de portal/admin isolados por `tenant_id`.
- Tokens públicos (`/p`, `/r`, `/c`) validados via Edge Functions (não via SELECT público).

---

## 10) Financeiro (Stripe) — V1

### 10.1 Cobrança

- **Assinatura mensal padrão** (recorrência)
- Cobrança avulsa opcional (setup, auditoria, extras)

### 10.2 Requisitos V1

- Criar/gerenciar assinaturas por tenant (admin financeiro).
- Exibir faturas e status no portal.
- Webhooks Stripe via Edge Function (idempotência obrigatória).
- Não armazenar dados sensíveis de cartão (PCI no Stripe).

---

# 11) Módulo de Contratos (V1) — FINAL

## 11.1 Objetivo

Gerar contratos padronizados e seguros com aceite por link público e auditoria forte, preferencialmente derivados de uma proposta aprovada.

## 11.2 Decisões e regras (congeladas)

- Contrato **1 parte** (cliente aceita).
- Aceite completo **obrigatório**:
  - Nome completo
  - CPF/CNPJ
- Link `/c/:token`:
  - expiração configurável: 7/15/30 dias
  - pode ser revogado
- Geração:
  - principal: a partir de proposta aprovada
  - secundário: avulso pelo Admin
- Editor do contrato:
  - por **campos/variáveis + preview**
  - **sem edição livre de HTML**
  - template com **blocos configuráveis** (lista/ordem por template)
- Anexos no V1:
  - permitidos: PDF/JPG/PNG/DOC/DOCX
  - **download permitido antes do aceite**
  - limite: **20MB por arquivo**, **200MB por contrato**, **20 anexos**

## 11.3 Entidades (alto nível)

- `contract_templates` (schema com blocos/fields)
- `contracts` (status + vínculo com tenant/cliente/proposta)
- `contract_versions` (render + hash)
- `contract_public_links` (token + expiração + revogação)
- `contract_acceptances` (nome/doc + auditoria)
- `contract_events` (sent/viewed/accepted/revoked/etc.)
- `contract_attachments` (metadados + path no storage)

## 11.4 Fluxo Admin (V1)

1) Criar/gerenciar templates
2) Em proposta aprovada: “Gerar contrato”
3) Preencher campos/variáveis → salvar (gera nova versão)
4) Upload/gestão de anexos
5) Gerar link `/c/:token` com expiração
6) Revogar se necessário
7) Ao aceitar: contrato vira read-only

## 11.5 Fluxo público `/c/:token`

- Render do contrato (versão atual)
- Lista de anexos (download via signed URL)
- Form de aceite: nome + CPF/CNPJ + checkbox
- Confirmação pós-aceite + imprimir/baixar (print)

---

## 12) Critérios de Aceite (V1)

### Site/SEO/SSG

- Páginas públicas geram HTML no build e têm meta/OG/canonical.
- `sitemap.xml` atualizado no deploy.
- Rebuild automático após publish.

### CMS

- `/pagina/:slug` e `/servicos/:slug` publicam via `cms_pages`.
- `/servicos/:slug` lista pacotes por `service_page_key` → `services_data.page`.

### services_data.slug

- Slug opcional, gerável por botão no Admin e editável manualmente.
- Índice único por `(page, slug)` quando preenchido.

### Tokens públicos

- `/p/:token`, `/r/:token`, `/c/:token` funcionam sem login com validação forte.
- Expiração/revogação respeitadas (onde aplicável).

### Contratos

- Aceite exige Nome + CPF/CNPJ.
- Auditoria salva versão aceita + hash + timestamps + user-agent (+ ip quando disponível).
- Anexos baixáveis antes do aceite via signed URL.

### Stripe

- Assinatura mensal padrão ativa/cancelada reflete no portal.
- Webhook atualiza status de faturas de forma idempotente.

---

# 13) Backlog por Sprint (Opção B — tasks detalhadas)

> Sugestão de sprint: 2 semanas (ajuste conforme sua equipe).  
> Cada sprint abaixo tem entregáveis claros e validáveis.

## Sprint 0 — Base técnica + Segurança + Tema

- [x] Setup repo + Vite/React + rotas base (público/admin/cliente)
- [x] Design tokens + dark mode global (persistência local)
- [x] Supabase: schema base de tenants, profiles, RBAC (Admin/Operação/Financeiro)
- [x] RLS base multi-tenant (policies para tabelas principais)
- [x] Padrão de Edge Functions + deploy (CI)
- [x] Pipeline GitHub Actions para build/deploy no GitHub Pages
- [x] Edge Function `trigger-rebuild` (workflow_dispatch)

**DoD:** login funciona, tema aplicado, pipeline de deploy funcionando, RLS base validada.

---

## Sprint 1 — CMS + SSG público (blog, páginas, serviços)

- [x] `site_config` + tela Admin para editar home_content_json
- [x] `cms_pages` CRUD (generic + service)
- [x] Blog: CRUD `blog_posts` no Admin
- [x] Implementar SSG no build para:
  - `/blog`, `/blog/:slug`
  - `/pagina/:slug`
  - `/servicos/:slug`
- [x] Sitemap automático no build
- [x] Rebuild automático ao publicar conteúdos (Admin aciona Edge Function)

**DoD:** publicar conteúdo → rebuild → aparece no site (SSG).

---

## Sprint 2 — Serviços/pacotes + slugs + páginas de conversão

- [x] Migration: adicionar `services_data.slug` (nullable)
- [x] Índice único `(page, slug)` (somente quando slug não-nulo)
- [x] Admin: botão “Gerar slug” a partir do name + edição manual + validações
- [x] `/servicos/:slug` puxa `services_data` por `service_page_key`
- [x] Página `/planos`
- [x] CTA WhatsApp + formulário básico de contato

**DoD:** cards aparecem corretamente por serviço e slugs funcionam no admin.

---

## Sprint 3 — Formulários + Relatórios por token

- [x] Form “Teste Gratuito” (multi-step)
- [x] Form “SWOT” (multi-step)
- [x] Geração de relatório HTML armazenado + token público `/r/:token`
- [x] CSS print para PDF (relatórios)
- [x] Botões fixos: salvar/compartilhar/imprimir
- [x] Auditoria mínima de acesso ao token

**DoD:** enviar formulário → gerar relatório → link público funciona → imprimir em PDF.

---

## Sprint 4 — Propostas por token (venda)

- [x] CRUD Admin de propostas
- [x] Geração de token `/p/:token` + expiração/revogação (se aplicável)
- [x] Página pública proposta com aceite (simples e completo quando habilitado)
- [x] Auditoria: viewed/accepted + trilha de eventos

**DoD:** proposta criada → link público → aceite registrado e auditável.

---

## Sprint 5 — Contratos V1 (templates + variáveis + anexos + token)

### Banco/Storage

- [x] Migrations: `contract_templates`, `contracts`, `contract_versions`, `contract_public_links`,
      `contract_acceptances`, `contract_events`, `contract_attachments`
- [x] Bucket Storage `contracts` privado + paths padronizados
- [x] Limites:
  - 20MB por arquivo
  - 200MB por contrato
  - 20 anexos por contrato
- [x] Tipos permitidos: PDF/JPG/PNG/DOC/DOCX

### Edge Functions

- [x] `get-contract-by-token`
- [x] `accept-contract` (nome + CPF/CNPJ obrigatórios)
- [x] `create-contract-link` (7/15/30)
- [x] `revoke-contract-link`
- [x] `get-contract-attachment-url` (signed URL curta)

### Frontend Admin

- [x] Templates: editor de blocos/fields (configurável por template)
- [x] Gerar contrato a partir de proposta aprovada
- [x] Editor por variáveis + preview + versionamento
- [x] Upload/gestão de anexos + toggle “visível ao cliente”
- [x] Gerar link + copiar link + revogar

### Público

- [x] `/c/:token` render + anexos + aceite + telas de erro (expirado/revogado)

**DoD:** contrato completo com anexos e aceite auditável funcionando ponta a ponta.

---

## Sprint 6 — Portal do Cliente + Financeiro Stripe (assinatura)

### Portal

- [x] Dashboard cliente
- [x] Relatórios (histórico)
- [x] Arquivos (storage)
- [x] Aprovações
- [x] Tickets/chamados (básico)

### Stripe

- [x] Modelagem billing (customers/subscriptions/invoices)
- [x] Admin Financeiro: criar/gerenciar assinatura mensal (padrão)
- [x] Cobrança avulsa opcional
- [x] Webhooks Stripe (idempotente) → atualizar status no DB
- [x] Portal: exibir status + faturas + links

**DoD:** cliente vê assinatura/faturas; admin consegue operar assinatura; webhook atualiza status.

---

## 14) Riscos e Mitigações

- **SSG no GitHub Pages**: conteúdo dinâmico exige rebuild → mitigação: Edge Function para rebuild automático.
- **Tokens públicos**: risco de vazamento → mitigação: tokens longos, expiração, revogação, logs e validação via Edge Function.
- **Anexos**: risco de malware → mitigação: restringir tipos, bloquear executáveis/zip, limites de tamanho/quantidade, bucket privado + signed URLs.
- **Validade jurídica**: contrato/aceite → mitigação: template revisado por advogado + auditoria + hash/versionamento.

---

## 15) Próximos passos imediatos (para execução)

1) Criar repositório e pipeline (Sprint 0).
2) Planejar migrations por sprint e travar nomenclaturas finais (tabelas/colunas).
3) Implementar Sprint 0 e validar RLS/RBAC.
4) Seguir sprints na ordem.

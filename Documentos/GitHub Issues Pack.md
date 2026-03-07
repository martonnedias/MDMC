# GitHub Issues Pack (PT) — MD Solution V1 (por Sprint)
**Pronto para copiar e colar como Issues no GitHub.**  
Sugestão: criar labels antes: `sprint-0..sprint-6`, `frontend`, `backend`, `infra`, `security`, `cms`, `seo`, `tokens`, `contracts`, `proposals`, `reports`, `portal`, `stripe`, `storage`, `rls`, `rbac`.

> Dica prática: você pode criar cada Issue copiando o bloco “## Issue …” e colando no GitHub.

---

# Sprint 0 — Fundação técnica (1–2 semanas)

## Issue S0-01 — Setup do projeto web (Vite/React/TS) + estrutura de rotas
**Labels:** `sprint-0`, `frontend`, `infra`  
**Descrição:** Inicializar app Vite/React/TS, configurar rotas públicas, admin, cliente e rotas por token.  
**Checklist:**
- [ ] Criar projeto Vite + React + TypeScript
- [ ] Configurar react-router (ou equivalente)
- [ ] Estruturar rotas: público, `/admin/*`, `/cliente/*`, `/p/:token`, `/r/:token`, `/c/:token`
- [ ] Layout base (Header/Footer) e container responsivo
**Critérios de aceite:**
- Rotas navegam sem erro e exibem placeholders por seção
- Build e preview local funcionam

---

## Issue S0-02 — Design tokens + Dark Mode global (persistência)
**Labels:** `sprint-0`, `frontend`  
**Descrição:** Implementar tema claro/escuro com tokens e persistência.  
**Checklist:**
- [ ] Definir tokens (cores, tipografia, espaçamentos)
- [ ] Toggle Dark/Light
- [ ] Persistir preferência (localStorage)
- [ ] Garantir contraste mínimo (AA quando possível)
**Critérios de aceite:**
- Tema alterna sem quebrar layout
- Preferência persiste ao recarregar

---

## Issue S0-03 — Supabase: tenants + profiles + tenant_members (RBAC)
**Labels:** `sprint-0`, `backend`, `security`, `rbac`, `rls`  
**Descrição:** Criar base multi-tenant e RBAC (Admin/Operação/Financeiro).  
**Checklist:**
- [ ] Criar tabelas: `tenants`, `profiles`, `tenant_members`
- [ ] Criar enums/roles (ou text) e índices
- [ ] Criar funções helper: `is_tenant_member`, `has_tenant_role`
**Critérios de aceite:**
- Usuário pode ser vinculado a tenant com role
- Funções helper retornam corretamente (test via SQL)

---

## Issue S0-04 — RLS base: isolamento por tenant + permissões por role
**Labels:** `sprint-0`, `backend`, `security`, `rls`  
**Descrição:** Aplicar RLS e policies mínimas para tabelas multi-tenant (propostas/contratos/billing/portal).  
**Checklist:**
- [ ] Habilitar RLS nas tabelas multi-tenant existentes
- [ ] Policies: select só para membros do tenant
- [ ] Policies: insert/update só para roles permitidas
**Critérios de aceite:**
- Usuário do tenant A não consegue ler/escrever dados do tenant B
- Admin/Operação conseguem operar entidades do próprio tenant

---

## Issue S0-05 — Pipeline deploy GitHub Pages + workflow_dispatch
**Labels:** `sprint-0`, `infra`  
**Descrição:** Configurar GitHub Actions para build/deploy e habilitar disparo manual (workflow_dispatch).  
**Checklist:**
- [ ] Criar workflow `deploy-pages.yml`
- [ ] Build gera `/dist` e publica no Pages
- [ ] workflow_dispatch habilitado
**Critérios de aceite:**
- Push na main publica automaticamente
- Disparo manual funciona

---

## Issue S0-06 — Edge Function: trigger-rebuild (disparar GitHub Action)
**Labels:** `sprint-0`, `backend`, `infra`  
**Descrição:** Criar Edge Function que chama GitHub API para disparar rebuild após publish no CMS.  
**Checklist:**
- [ ] Criar function `trigger-rebuild`
- [ ] Autenticação por secret (PAT) guardado no Supabase
- [ ] Endpoint protegido (apenas Admin/Operação)
**Critérios de aceite:**
- Chamada retorna 200 e workflow executa no GitHub
- Logs de erro são registráveis (console)

---

## Issue S0-07 — Decisão técnica: CMS “interno” (controle de acesso)
**Labels:** `sprint-0`, `backend`, `security`  
**Descrição:** Definir e implementar a regra para acesso ao CMS (não-tenant). Recomendação: flag `profiles.is_internal = true` e policies com base nisso.  
**Checklist:**
- [ ] Adicionar coluna `profiles.is_internal` (default false)
- [ ] Policy: CMS write apenas para `is_internal=true` + roles permitidas (Admin/Operação)
**Critérios de aceite:**
- Usuário não interno não consegue editar CMS
- Usuário interno (Admin/Operação) consegue

---

# Sprint 1 — CMS + SSG público (2–4 semanas)

## Issue S1-01 — Migrations CMS: site_config + cms_pages + ajustes blog_posts
**Labels:** `sprint-1`, `backend`, `cms`  
**Checklist:**
- [ ] Criar `site_config` (home_content_json)
- [ ] Criar `cms_pages` (generic/service + SEO fields + status)
- [ ] Garantir `blog_posts` com status + SEO fields
**Critérios de aceite:**
- Tabelas acessíveis no Supabase
- Campos obrigatórios com defaults coerentes

---

## Issue S1-02 — Admin CMS: Editor da Home (home_content_json)
**Labels:** `sprint-1`, `frontend`, `cms`  
**Checklist:**
- [ ] Tela Admin para editar home content (inputs controlados)
- [ ] Preview simples (opcional)
- [ ] Botão “Publicar” chama `trigger-rebuild`
**Critérios de aceite:**
- Atualização do conteúdo reflete na Home após rebuild

---

## Issue S1-03 — Admin CMS: CRUD cms_pages (generic/service)
**Labels:** `sprint-1`, `frontend`, `cms`  
**Checklist:**
- [ ] Listagem (draft/published)
- [ ] Editor (title, slug, content_html, SEO)
- [ ] Para service page: `service_page_key` obrigatório
- [ ] Publicar chama `trigger-rebuild`
**Critérios de aceite:**
- Página publicada aparece em `/pagina/:slug` ou `/servicos/:slug` após rebuild

---

## Issue S1-04 — Admin Blog: CRUD blog_posts (com publish)
**Labels:** `sprint-1`, `frontend`, `cms`, `seo`  
**Checklist:**
- [ ] Listagem e editor
- [ ] Editor rich text (HTML)
- [ ] Publicar chama `trigger-rebuild`
**Critérios de aceite:**
- Post publicado aparece em `/blog/:slug` após rebuild

---

## Issue S1-05 — SSG build: gerar rotas públicas + sitemap.xml
**Labels:** `sprint-1`, `frontend`, `seo`, `infra`  
**Checklist:**
- [ ] Script build consulta Supabase (publicados)
- [ ] Pré-render: `/`, `/blog`, `/blog/:slug`, `/pagina/:slug`, `/servicos/:slug`
- [ ] Gerar `sitemap.xml`
**Critérios de aceite:**
- HTML final existe no `dist`
- Sitemap inclui slugs publicados

---

# Sprint 2 — Serviços/pacotes + slugs + páginas de conversão (2–3 semanas)

## Issue S2-01 — services_data: slug opcional + índice único (page,slug)
**Labels:** `sprint-2`, `backend`, `cms`  
**Checklist:**
- [ ] Migration `services_data.slug` nullable
- [ ] Unique index `(page, slug)` WHERE slug not null
**Critérios de aceite:**
- Não permite duplicar slug dentro do mesmo page quando preenchido
- Permite registros sem slug

---

## Issue S2-02 — Admin services_data: gerar slug + editar manual
**Labels:** `sprint-2`, `frontend`, `cms`  
**Checklist:**
- [ ] Botão “Gerar slug do nome”
- [ ] Input editável + validação (regex, lower, hífen)
- [ ] Tratamento de colisão (sugerir sufixo `-2`, `-3`)
**Critérios de aceite:**
- Slug gerado e salvo corretamente
- Erro claro quando slug já existe

---

## Issue S2-03 — Página `/servicos/:slug`: puxar pacotes por service_page_key
**Labels:** `sprint-2`, `frontend`, `seo`  
**Checklist:**
- [ ] Buscar cms_page por slug + validar published
- [ ] Ler `service_page_key` e buscar `services_data` por `page=key`
- [ ] Render cards e CTAs
**Critérios de aceite:**
- Conteúdo CMS + cards aparecem corretamente por serviço

---

## Issue S2-04 — Página `/planos` (MVP)
**Labels:** `sprint-2`, `frontend`  
**Checklist:**
- [ ] Implementar página com planos principais e CTA WhatsApp
- [ ] (Opcional) Conteúdo vindo do CMS
**Critérios de aceite:**
- Página responsiva, CTAs funcionam

---

# Sprint 3 — Formulários + Relatórios por token (2–4 semanas)

## Issue S3-01 — Form “Teste Gratuito” (multi-step) + persistência
**Labels:** `sprint-3`, `frontend`  
**Checklist:**
- [ ] UI multi-step + validações/máscaras
- [ ] Submit salva em `leads` (source=teste-gratuito)
**Critérios de aceite:**
- Form envia e cria lead no DB

---

## Issue S3-02 — Form “SWOT” (multi-step)
**Labels:** `sprint-3`, `frontend`  
**Checklist:**
- [ ] UI multi-step + validações
- [ ] Submit salva em `leads` (source=swot)
**Critérios de aceite:**
- Form envia e cria lead no DB

---

## Issue S3-03 — Geração de relatório (HTML) + persistência em reports
**Labels:** `sprint-3`, `backend`, `reports`  
**Checklist:**
- [ ] Criar registro `reports` com `content_html` e `summary_json`
- [ ] Criar token em `report_public_links`
**Critérios de aceite:**
- Submissão gera report + token

---

## Issue S3-04 — Edge Function: get-report-by-token
**Labels:** `sprint-3`, `backend`, `tokens`, `reports`  
**Checklist:**
- [ ] Validar token e expiração/revogação (se usar)
- [ ] Retornar HTML e metadados mínimos
**Critérios de aceite:**
- `/r/:token` carrega apenas via function (sem SELECT público)

---

## Issue S3-05 — Página pública `/r/:token` + print CSS
**Labels:** `sprint-3`, `frontend`, `reports`  
**Checklist:**
- [ ] Consumir function e renderizar HTML
- [ ] Botões: Compartilhar (copiar link), Imprimir
- [ ] CSS print para “PDF via navegador”
**Critérios de aceite:**
- Relatório abre sem login, imprime corretamente

---

# Sprint 4 — Propostas por token (3–5 semanas)

## Issue S4-01 — Migrations Propostas (proposals + versions + links + events + acceptances)
**Labels:** `sprint-4`, `backend`, `proposals`  
**Checklist:**
- [ ] Criar tabelas propostas conforme PRD/Tech Pack
- [ ] Índices e constraints (unique version)
- [ ] RLS para tenant
**Critérios de aceite:**
- CRUD básico via SQL/Studio funciona com RLS

---

## Issue S4-02 — Admin Propostas: criar/editar + versionamento + render HTML
**Labels:** `sprint-4`, `frontend`, `proposals`  
**Checklist:**
- [ ] Tela listagem + detalhe
- [ ] Editor de conteúdo (itens/escopo/preço) -> gera `rendered_html`
- [ ] Salvar cria nova `proposal_versions` e atualiza `current_version_id`
**Critérios de aceite:**
- Versões incrementam e preview reflete versão atual

---

## Issue S4-03 — Edge Functions Proposta: get-proposal-by-token + accept-proposal
**Labels:** `sprint-4`, `backend`, `tokens`, `proposals`  
**Checklist:**
- [ ] `get-proposal-by-token` loga `viewed`
- [ ] `accept-proposal` grava aceite + hash + evento
- [ ] Suportar aceite simples e (se habilitado) completo
**Critérios de aceite:**
- Aceite altera status para `approved` e registra auditoria

---

## Issue S4-04 — Página pública `/p/:token` (UI + aceite + confirmação)
**Labels:** `sprint-4`, `frontend`, `proposals`  
**Checklist:**
- [ ] Render proposta (HTML)
- [ ] Componente de aceite
- [ ] Tela de erro (inválido/expirado/revogado)
**Critérios de aceite:**
- Funciona sem login e registra aceite corretamente

---

# Sprint 5 — Contratos V1 (templates + variáveis + anexos + token) (3–6 semanas)

## Issue S5-01 — Migrations Contratos (templates/contracts/versions/links/events/acceptances/attachments)
**Labels:** `sprint-5`, `backend`, `contracts`, `storage`  
**Checklist:**
- [ ] Criar tabelas contratos conforme Tech Pack
- [ ] RLS para tenant
**Critérios de aceite:**
- Inserção e leitura autenticada por tenant funciona
- SELECT público direto não existe para tokens

---

## Issue S5-02 — Storage: bucket `contracts` privado + path padrão
**Labels:** `sprint-5`, `backend`, `storage`, `security`  
**Checklist:**
- [ ] Criar bucket privado `contracts`
- [ ] Padronizar path: `contracts/{tenant_id}/{contract_id}/{attachment_id}/{filename}`
**Critérios de aceite:**
- Upload funciona para usuário autenticado (Admin/Operação)
- Bucket não é público

---

## Issue S5-03 — Admin Templates: editor de blocos/fields (configurável por template)
**Labels:** `sprint-5`, `frontend`, `contracts`, `cms`  
**Checklist:**
- [ ] CRUD templates
- [ ] Editor de blocos (ordem, título, locked, fields)
- [ ] Preview com dados dummy
**Critérios de aceite:**
- Template salva `schema_json` válido e reabre corretamente

---

## Issue S5-04 — Engine de render: template + variables -> rendered_html + content_hash
**Labels:** `sprint-5`, `backend`, `contracts`  
**Checklist:**
- [ ] Resolver placeholders `{{var}}` usando `variables_json`
- [ ] Concatenar blocos em ordem
- [ ] Gerar `content_hash` (SHA-256 recomendado)
**Critérios de aceite:**
- Mesmos inputs geram mesmo hash
- Preview bate com o HTML salvo na versão

---

## Issue S5-05 — Gerar contrato a partir de proposta aprovada
**Labels:** `sprint-5`, `backend`, `frontend`, `contracts`, `proposals`  
**Checklist:**
- [ ] Botão em proposta `approved`: “Gerar contrato”
- [ ] Pré-preencher variáveis com dados da proposta
- [ ] Criar `contracts` + `contract_versions v1`
**Critérios de aceite:**
- Contrato nasce em draft com preview preenchido

---

## Issue S5-06 — Admin Contratos: editor por variáveis + preview + versionamento
**Labels:** `sprint-5`, `frontend`, `contracts`  
**Checklist:**
- [ ] Tela contrato: coluna campos (por bloco) + coluna preview
- [ ] “Salvar” cria nova versão e atualiza `current_version_id`
- [ ] Read-only após `accepted`
**Critérios de aceite:**
- Versões incrementam e preview acompanha versão atual

---

## Issue S5-07 — Upload de anexos (PDF/JPG/PNG/DOC/DOCX) com limites
**Labels:** `sprint-5`, `frontend`, `backend`, `contracts`, `storage`, `security`  
**Checklist:**
- [ ] Validar tipos permitidos
- [ ] Validar limites: 20MB/arquivo, 200MB total, 20 anexos
- [ ] Salvar metadados em `contract_attachments`
- [ ] Toggle `is_public_to_signer`
**Critérios de aceite:**
- Bloqueia arquivo inválido e excedente com mensagem clara
- Lista e remoção funcionam

---

## Issue S5-08 — Edge Functions Contratos: get-contract-by-token
**Labels:** `sprint-5`, `backend`, `tokens`, `contracts`  
**Checklist:**
- [ ] Validar token + expiração + revogação
- [ ] Retornar `rendered_html` da versão atual + lista metadados de anexos
- [ ] Logar `viewed` em `contract_events`
**Critérios de aceite:**
- Página pública consegue renderizar sem SELECT público

---

## Issue S5-09 — Edge Function: get-contract-attachment-url (signed URL)
**Labels:** `sprint-5`, `backend`, `contracts`, `storage`, `security`  
**Checklist:**
- [ ] Validar token (não expirado/revogado)
- [ ] Validar `attachmentId` pertence ao contrato
- [ ] Validar `is_public_to_signer=true`
- [ ] Gerar signed URL curto (2–5 min)
**Critérios de aceite:**
- Cliente baixa anexo antes do aceite
- Signed URL expira

---

## Issue S5-10 — Edge Function: accept-contract (aceite completo obrigatório)
**Labels:** `sprint-5`, `backend`, `contracts`, `security`  
**Checklist:**
- [ ] Validar token + expiração + revogação
- [ ] Exigir Nome completo + CPF/CNPJ
- [ ] Inserir `contract_acceptances` + hash
- [ ] Atualizar `contracts.status=accepted` e `accepted_at`
- [ ] Logar evento `accepted`
**Critérios de aceite:**
- Não aceita sem nome/doc
- Pós-aceite: contrato read-only no admin

---

## Issue S5-11 — Edge Functions Admin: create-contract-link + revoke-contract-link
**Labels:** `sprint-5`, `backend`, `contracts`, `tokens`  
**Checklist:**
- [ ] Criar link com expiração (7/15/30)
- [ ] Revogar link
- [ ] Registrar eventos `sent` / `revoked`
**Critérios de aceite:**
- Link expira corretamente
- Revogação impede acesso e aceite

---

## Issue S5-12 — Página pública `/c/:token` (render + anexos + aceite)
**Labels:** `sprint-5`, `frontend`, `contracts`  
**Checklist:**
- [ ] Consumir `get-contract-by-token`
- [ ] Listar anexos (chamar signed-url por clique)
- [ ] Form aceite (nome, CPF/CNPJ, checkbox)
- [ ] Estados: inválido/expirado/revogado/já aceito
**Critérios de aceite:**
- Contrato abre sem login e aceita corretamente
- Anexos baixam antes do aceite

---

# Sprint 6 — Portal do Cliente + Stripe Recorrência (3–6 semanas)

## Issue S6-01 — Portal do Cliente: estrutura base + auth + tenant context
**Labels:** `sprint-6`, `frontend`, `portal`, `security`  
**Checklist:**
- [ ] Login / sessão
- [ ] Resolver tenant do usuário
- [ ] Layout e menu do portal
**Critérios de aceite:**
- Cliente loga e vê somente seu tenant

---

## Issue S6-02 — Portal: Relatórios (histórico)
**Labels:** `sprint-6`, `frontend`, `portal`, `reports`  
**Checklist:**
- [ ] Listar reports do tenant (quando aplicável)
- [ ] Visualizar/baixar (print)
**Critérios de aceite:**
- Cliente acessa histórico sem vazar dados

---

## Issue S6-03 — Portal: Arquivos (Storage)
**Labels:** `sprint-6`, `frontend`, `backend`, `portal`, `storage`  
**Checklist:**
- [ ] Upload/download autenticado
- [ ] Organização por pastas/projetos (mínimo)
**Critérios de aceite:**
- Arquivos do tenant A não aparecem no tenant B

---

## Issue S6-04 — Portal: Tickets/chamados (básico)
**Labels:** `sprint-6`, `frontend`, `backend`, `portal`  
**Checklist:**
- [ ] Criar ticket
- [ ] Mensagens (thread)
- [ ] Anexo opcional
**Critérios de aceite:**
- Ticket funciona com RLS por tenant

---

## Issue S6-05 — Migrations Billing (Stripe): customers/subscriptions/invoices/events
**Labels:** `sprint-6`, `backend`, `stripe`, `billing`  
**Checklist:**
- [ ] Criar tabelas billing
- [ ] RLS: leitura para membros do tenant; escrita para Admin/Financeiro
**Critérios de aceite:**
- Admin/Financeiro conseguem operar dados de billing do tenant

---

## Issue S6-06 — Webhook Stripe (Edge Function) idempotente
**Labels:** `sprint-6`, `backend`, `stripe`, `security`  
**Checklist:**
- [ ] Validar assinatura do webhook
- [ ] Idempotência por `stripe_event_id` (unique em `billing_events`)
- [ ] Processar: subscription created/updated/deleted, invoice paid/failed
- [ ] Atualizar `billing_subscriptions` e `billing_invoices`
**Critérios de aceite:**
- Mesmo evento não é processado duas vezes
- Status reflete corretamente no DB

---

## Issue S6-07 — Admin Financeiro: criar/cancelar assinatura mensal (padrão)
**Labels:** `sprint-6`, `frontend`, `backend`, `stripe`, `billing`  
**Checklist:**
- [ ] Criar/vincular Stripe Customer ao tenant
- [ ] Criar assinatura com Price mensal
- [ ] Cancelar assinatura
**Critérios de aceite:**
- Assinatura criada aparece no portal e muda com webhook

---

## Issue S6-08 — Cobrança avulsa (opcional V1): emitir invoice/payment link
**Labels:** `sprint-6`, `backend`, `stripe`, `billing`  
**Checklist:**
- [ ] Criar cobrança avulsa (invoice ou payment link)
- [ ] Persistir referência no DB
**Critérios de aceite:**
- Cliente consegue pagar e status atualiza via webhook

---

## Issue S6-09 — Portal Financeiro: status da assinatura + faturas
**Labels:** `sprint-6`, `frontend`, `portal`, `stripe`, `billing`  
**Checklist:**
- [ ] Exibir status da assinatura
- [ ] Listar faturas com status e links (hosted_invoice_url)
**Critérios de aceite:**
- Cliente vê seu billing sem acesso a outros tenants

---

# Apêndice — Template padrão de Issue (se quiser criar extras)
```txt
Título:
Labels:
Descrição:
Checklist:
- [ ]
Critérios de aceite:
- 
Dependências:
- 
```
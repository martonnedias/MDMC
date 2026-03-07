# TECH PACK v1.0 — MD Solution (Pronto para o Desenvolvedor)
**Formato:** arquivo único (Markdown)  
**Objetivo:** complementar o PRD com entregáveis técnicos copiáveis: **SQL (migrations)**, **RLS**, **Storage policies**, **contratos de API (Edge Functions)** e **skeletons**.  
**Stack:** Vite/React (GitHub Pages) + Supabase (Auth/Postgres/RLS/Storage/Edge Functions) + Stripe

> Observação: este arquivo é um “pacote técnico” para acelerar implementação. O dev pode ajustar nomes e normalizações conforme o projeto já existente.

---

## 0) Estrutura recomendada do repositório

---

## 1) Variáveis de ambiente (checklist)
### Frontend (Vite)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_BASE_URL` (ex.: https://mdsolution.com.br)

### Edge Functions (Supabase)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_BASE_URL`

### Rebuild automático (GitHub)
- `GITHUB_REPO_OWNER`
- `GITHUB_REPO_NAME`
- `GITHUB_WORKFLOW_ID` (ou filename .yml)
- `GITHUB_TOKEN` (PAT com permissão para disparar workflow_dispatch)

### Stripe
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

---

## 2) Banco de Dados — Migrations SQL (Postgres/Supabase)

> Se você usa **Supabase CLI**, coloque as migrations em arquivos separados por timestamp.  
> Se não usa, o dev pode rodar em etapas no SQL Editor do Supabase (com cuidado na ordem).

### 2.1 Extensões e helpers


sql

-- UUIDs seguras
create extension if not exists "pgcrypto";

-- Opcional: unaccent para slug
create extension if not exists "unaccent";


#### 2.1.1 Enums (opcional, pode ser TEXT também)

sql

do $$ begin
  create type public.user_role as enum ('admin','operacao','financeiro');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.publish_status as enum ('draft','published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.contract_status as enum ('draft','sent','viewed','accepted','expired','revoked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.proposal_status as enum ('draft','sent','viewed','approved','expired','revoked');
exception when duplicate_object then null; end $$;

#### 2.1.1 Enums (opcional, pode ser TEXT também)

sql

do $$ begin
  create type public.user_role as enum ('admin','operacao','financeiro');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.publish_status as enum ('draft','published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.contract_status as enum ('draft','sent','viewed','accepted','expired','revoked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.proposal_status as enum ('draft','sent','viewed','approved','expired','revoked');
exception when duplicate_object then null; end $$;




---

### 2.2 Multi-tenant + RBAC (base)
> Se você já tem tabelas de tenants/usuários, adapte somente a parte de RBAC/tenant_id.


sql


create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Perfil básico vinculado ao auth.users
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- Membership: usuário pertence a tenant e tem role
create table if not exists public.tenant_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.user_role not null default 'operacao',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index if not exists idx_tenant_members_user on public.tenant_members(user_id);
create index if not exists idx_tenant_members_tenant on public.tenant_members(tenant_id);




#### 2.2.1 Funções helper para RLS (recomendado)

sql


create or replace function public.is_tenant_member(p_tenant uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = p_tenant
      and tm.user_id = auth.uid()
      and tm.is_active = true
  );
$$;

create or replace function public.has_tenant_role(p_tenant uuid, p_roles public.user_role[])
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = p_tenant
      and tm.user_id = auth.uid()
      and tm.is_active = true
      and tm.role = any(p_roles)
  );
$$;




---

### 2.3 CMS
#### 2.3.1 site_config

sql


create table if not exists public.site_config (
  id uuid primary key default gen_random_uuid(),
  -- um registro “singleton” é ok; enforce no app
  home_content_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);




#### 2.3.2 cms_pages

sql

create table if not exists public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  page_type text not null check (page_type in ('generic','service')),
  service_page_key text null, -- obrigatório quando page_type='service'
  content_html text not null default '',
  status public.publish_status not null default 'draft',
  is_active boolean not null default true,

  meta_title text null,
  meta_description text null,
  og_image_url text null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (slug, page_type)
);

create index if not exists idx_cms_pages_status on public.cms_pages(status, is_active);




#### 2.3.3 blog_posts (caso não exista; se existir, adaptar)

sql

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text null,
  content_html text not null default '',
  featured_image_url text null,
  category text null,
  status public.publish_status not null default 'draft',

  meta_title text null,
  meta_description text null,
  og_image_url text null,

  published_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_status on public.blog_posts(status);




---

### 2.4 services_data (slug opcional para SEO futuro)
> Ajuste o nome/estrutura se sua `services_data` já existe.


sql

alter table public.services_data
  add column if not exists slug text null;

-- Unicidade por (page, slug) quando slug preenchido
create unique index if not exists ux_services_data_page_slug
on public.services_data(page, slug)
where slug is not null;

create index if not exists idx_services_data_page on public.services_data(page);




---

### 2.5 Leads + Relatórios (tokens)

sql

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null, -- 'teste-gratuito' | 'swot' | etc.
  full_name text null,
  email text null,
  phone text null,
  payload_json jsonb not null default '{}'::jsonb
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  report_type text not null, -- 'swot' | 'teste-gratuito'
  lead_id uuid null references public.leads(id) on delete set null,
  tenant_id uuid null references public.tenants(id) on delete set null,
  content_html text not null,
  summary_json jsonb not null default '{}'::jsonb
);

create table if not exists public.report_public_links (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz null,
  revoked_at timestamptz null,
  created_at timestamptz not null default now()
);

create index if not exists idx_report_links_report on public.report_public_links(report_id);




---

### 2.6 Propostas (tokens + versões + aceite)

sql

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  status public.proposal_status not null default 'draft',
  current_version_id uuid null,
  sent_at timestamptz null,
  approved_at timestamptz null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.proposal_versions (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  version_number int not null,
  payload_json jsonb not null default '{}'::jsonb,
  rendered_html text not null,
  content_hash text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique (proposal_id, version_number)
);

create table if not exists public.proposal_public_links (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz null,
  revoked_at timestamptz null,
  created_at timestamptz not null default now()
);

create table if not exists public.proposal_acceptances (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  version_id uuid not null references public.proposal_versions(id) on delete restrict,
  accepted_at timestamptz not null default now(),
  accepted_full_name text null,
  accepted_document text null,
  ip text null,
  user_agent text null,
  acceptance_hash text not null
);

create table if not exists public.proposal_events (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  event_type text not null,
  event_at timestamptz not null default now(),
  ip text null,
  user_agent text null,
  metadata_json jsonb not null default '{}'::jsonb
);

create index if not exists idx_proposals_tenant on public.proposals(tenant_id);




---

### 2.7 Contratos (templates + tokens + anexos + aceite completo)

sql

create table if not exists public.contract_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text null,
  schema_json jsonb not null, -- blocos configuráveis por template
  is_active boolean not null default true,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  proposal_id uuid null references public.proposals(id) on delete set null,
  template_id uuid not null references public.contract_templates(id) on delete restrict,
  title text not null,
  status public.contract_status not null default 'draft',
  current_version_id uuid null,
  sent_at timestamptz null,
  accepted_at timestamptz null,
  expires_at timestamptz null,
  revoked_at timestamptz null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contract_versions (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  version_number int not null,
  variables_json jsonb not null default '{}'::jsonb,
  rendered_html text not null,
  content_hash text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique (contract_id, version_number)
);

create table if not exists public.contract_public_links (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.contract_acceptances (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  version_id uuid not null references public.contract_versions(id) on delete restrict,
  public_link_id uuid not null references public.contract_public_links(id) on delete restrict,

  accepted_at timestamptz not null default now(),
  accepted_full_name text not null,
  accepted_document text not null, -- CPF/CNPJ obrigatório
  terms_version text null,

  ip text null,
  user_agent text null,
  acceptance_hash text not null
);

create table if not exists public.contract_events (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  public_link_id uuid null references public.contract_public_links(id) on delete set null,
  event_type text not null,
  event_at timestamptz not null default now(),
  ip text null,
  user_agent text null,
  metadata_json jsonb not null default '{}'::jsonb
);

create table if not exists public.contract_attachments (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  version_id uuid null references public.contract_versions(id) on delete set null,
  file_path text not null,
  file_name text not null,
  mime_type text not null,
  file_size bigint not null,
  checksum_sha256 text null,
  is_public_to_signer boolean not null default true,
  uploaded_by uuid not null references auth.users(id),
  uploaded_at timestamptz not null default now()
);

create index if not exists idx_contracts_tenant on public.contracts(tenant_id);
create index if not exists idx_contract_links_contract on public.contract_public_links(contract_id);
create index if not exists idx_contract_attachments_contract on public.contract_attachments(contract_id);




---

### 2.8 Billing (Stripe)

sql

create table if not exists public.billing_customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now(),
  unique (tenant_id)
);

create table if not exists public.billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  stripe_subscription_id text not null unique,
  status text not null,
  current_period_end timestamptz null,
  created_at timestamptz not null default now()
);

create table if not exists public.billing_invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  stripe_invoice_id text not null unique,
  status text not null,
  amount_due bigint null,
  amount_paid bigint null,
  currency text null,
  hosted_invoice_url text null,
  invoice_pdf_url text null,
  due_date timestamptz null,
  created_at timestamptz not null default now()
);

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  event_type text not null,
  tenant_id uuid null references public.tenants(id) on delete set null,
  payload_json jsonb not null,
  received_at timestamptz not null default now()
);




---

## 3) RLS — Policies (mínimas, seguras)

### 3.1 CMS público (leitura anon apenas publicado/ativo)

sql

alter table public.cms_pages enable row level security;
create policy "cms_pages_public_read_published"
on public.cms_pages
for select
to anon
using (status = 'published' and is_active = true);

create policy "cms_pages_admin_write"
on public.cms_pages
for all
to authenticated
using (true)
with check (true);

alter table public.blog_posts enable row level security;
create policy "blog_posts_public_read_published"
on public.blog_posts
for select
to anon
using (status = 'published');

create policy "blog_posts_admin_write"
on public.blog_posts
for all
to authenticated
using (true)
with check (true);




> Observação: acima está “aberto” para authenticated. O recomendado é restringir por RBAC (Admin/Operação). Exemplo:


sql

drop policy if exists "cms_pages_admin_write" on public.cms_pages;

create policy "cms_pages_write_admin_operacao"
on public.cms_pages
for all
to authenticated
using ( public.has_tenant_role( (select id from public.tenants limit 1), array['admin','operacao']::public.user_role[] ) )
with check ( public.has_tenant_role( (select id from public.tenants limit 1), array['admin','operacao']::public.user_role[] ) );




> **Nota importante:** CMS do site (público) normalmente não é por tenant; se for “único”, você pode:
> - manter CMS sem tenant e restringir por “usuários internos” (lista allow) ou
> - criar um `internal_users` table / flag `profiles.is_internal`.
>  
> Para evitar travar seu dev aqui, recomendo: **CMS sem tenant** + restrição por role global (ex.: somente users marcados internos).

### 3.2 Multi-tenant (propostas/contratos/billing) — somente membros do tenant

sql

alter table public.proposals enable row level security;
create policy "proposals_tenant_read"
on public.proposals for select
to authenticated
using (public.is_tenant_member(tenant_id));

create policy "proposals_tenant_write_admin_operacao"
on public.proposals for insert
to authenticated
with check (public.has_tenant_role(tenant_id, array['admin','operacao']));

create policy "proposals_tenant_update_admin_operacao"
on public.proposals for update
to authenticated
using (public.has_tenant_role(tenant_id, array['admin','operacao']))
with check (public.has_tenant_role(tenant_id, array['admin','operacao']));

alter table public.contracts enable row level security;
create policy "contracts_tenant_read"
on public.contracts for select
to authenticated
using (public.is_tenant_member(tenant_id));

create policy "contracts_tenant_write_admin_operacao"
on public.contracts for insert
to authenticated
with check (public.has_tenant_role(tenant_id, array['admin','operacao']));

create policy "contracts_tenant_update_admin_operacao"
on public.contracts for update
to authenticated
using (public.has_tenant_role(tenant_id, array['admin','operacao']))
with check (public.has_tenant_role(tenant_id, array['admin','operacao']));




### 3.3 Billing — somente Financeiro/Admin

sql

alter table public.billing_customers enable row level security;
alter table public.billing_subscriptions enable row level security;
alter table public.billing_invoices enable row level security;

create policy "billing_read_tenant_members"
on public.billing_invoices for select
to authenticated
using (public.is_tenant_member(tenant_id));

create policy "billing_write_financeiro_admin"
on public.billing_invoices for all
to authenticated
using (public.has_tenant_role(tenant_id, array['admin','financeiro']))
with check (public.has_tenant_role(tenant_id, array['admin','financeiro']));




---

## 4) Storage — bucket privado + regras
### 4.1 Bucket
- Bucket: `contracts`
- **Private**

### 4.2 Path padrão
`contracts/{tenant_id}/{contract_id}/{attachment_id}/{original_filename}`

### 4.3 Limites (aplicação)
- **20MB por arquivo**
- **200MB por contrato**
- **20 anexos por contrato**
- Tipos: **PDF/JPG/PNG/DOC/DOCX**

> Esses limites são aplicados no frontend e no backend (Edge Function opcional). Para V1, o mínimo é:
> - validar no frontend antes do upload
> - salvar metadados em `contract_attachments`
> - download público via signed URL (Edge Function)

---

## 5) Edge Functions — Contratos de API (request/response)

### 5.1 GET `get-contract-by-token`
**Input:** `token` (query)  
**Output (200):**

json

{
  "contract": {
    "id": "uuid",
    "title": "string",
    "status": "sent|viewed|accepted|expired|revoked",
    "expiresAt": "2026-03-04T00:00:00Z"
  },
  "version": {
    "id": "uuid",
    "renderedHtml": "<html>...</html>",
    "contentHash": "sha256..."
  },
  "attachments": [
    { "id": "uuid", "fileName": "Escopo.pdf", "mimeType": "application/pdf", "fileSize": 12345 }
  ]
}



**Regras:**
- valida token
- se expirado → retornar 410 (Gone) com mensagem
- se revogado → 403
- logar `contract_events` tipo `viewed` (com user-agent/ip quando possível)

---

### 5.2 POST `get-contract-attachment-url`
**Body:**

json

{ "token": "string", "attachmentId": "uuid" }



**Output (200):**

json

{ "signedUrl": "https://....", "expiresInSeconds": 300 }



**Regras:**
- permitido **antes do aceite**
- valida token não expirado/revogado
- verifica `is_public_to_signer = true`
- retorna signed URL curta (2–5 min)

---

### 5.3 POST `accept-contract`
**Body:**

json

{
  "token": "string",
  "fullName": "string",
  "document": "string",
  "termsVersion": "v1"
}



**Output (200):**

json

{ "ok": true, "acceptedAt": "2026-03-04T00:00:00Z" }



**Regras:**
- valida token + expiração + revogação
- valida `fullName` obrigatório
- valida `document` obrigatório (CPF/CNPJ: validação de formato mínimo no V1)
- grava `contract_acceptances` + atualiza `contracts.status=accepted`
- registra `contract_events` `accepted`
- idempotência: se já aceito, retornar 200 com estado “já aceito” (ou 409)

---

### 5.4 POST `create-contract-link` (admin)
**Body:**

json

{ "contractId": "uuid", "expirationDays": 7 }



**Output:**

json

{ "url": "https://mdsolution.com.br/c/xxxxxxxx", "expiresAt": "..." }




### 5.5 POST `revoke-contract-link` (admin)
**Body:**

json

{ "contractId": "uuid" }




---

## 6) Edge Functions — Skeletons (TypeScript) (copiável)

> Observação: isto é “skeleton” para acelerar. O dev completa com validações, logs e tratamento de erros.

### 6.1 `get-contract-by-token/index.ts`

ts

import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return new Response("Missing token", { status: 400 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // 1) fetch link + contract + current_version + attachments
  const { data: link, error: linkErr } = await supabase
    .from("contract_public_links")
    .select("id, expires_at, revoked_at, contract_id, contracts(status, title, current_version_id)")
    .eq("token", token)
    .maybeSingle();

  if (linkErr || !link) return Response.json({ error: "Invalid token" }, { status: 404 });
  if (link.revoked_at) return Response.json({ error: "Revoked" }, { status: 403 });

  const now = new Date();
  if (new Date(link.expires_at) < now) return Response.json({ error: "Expired" }, { status: 410 });

  const contract = (link as any).contracts;
  const versionId = contract.current_version_id;

  const { data: version } = await supabase
    .from("contract_versions")
    .select("id, rendered_html, content_hash")
    .eq("id", versionId)
    .single();

  const { data: attachments } = await supabase
    .from("contract_attachments")
    .select("id, file_name, mime_type, file_size")
    .eq("contract_id", link.contract_id)
    .eq("is_public_to_signer", true);

  // 2) log viewed event (best-effort)
  await supabase.from("contract_events").insert({
    contract_id: link.contract_id,
    public_link_id: link.id,
    event_type: "viewed",
    user_agent: req.headers.get("user-agent"),
    ip: req.headers.get("x-forwarded-for") ?? null,
    metadata_json: {}
  });

  return Response.json({
    contract: { id: link.contract_id, title: contract.title, status: contract.status, expiresAt: link.expires_at },
    version: { id: version?.id, renderedHtml: version?.rendered_html, contentHash: version?.content_hash },
    attachments: (attachments ?? []).map(a => ({
      id: a.id, fileName: a.file_name, mimeType: a.mime_type, fileSize: a.file_size
    }))
  });
});




### 6.2 `get-contract-attachment-url/index.ts`

ts

import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const { token, attachmentId } = await req.json().catch(() => ({}));
  if (!token || !attachmentId) return new Response("Missing params", { status: 400 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: link } = await supabase
    .from("contract_public_links")
    .select("id, expires_at, revoked_at, contract_id")
    .eq("token", token)
    .maybeSingle();

  if (!link) return new Response("Invalid token", { status: 404 });
  if (link.revoked_at) return new Response("Revoked", { status: 403 });
  if (new Date(link.expires_at) < new Date()) return new Response("Expired", { status: 410 });

  const { data: att } = await supabase
    .from("contract_attachments")
    .select("file_path, is_public_to_signer")
    .eq("id", attachmentId)
    .eq("contract_id", link.contract_id)
    .maybeSingle();

  if (!att || !att.is_public_to_signer) return new Response("Not allowed", { status: 403 });

  const expiresIn = 300;
  const { data: signed } = await supabase.storage
    .from("contracts")
    .createSignedUrl(att.file_path, expiresIn);

  return Response.json({ signedUrl: signed?.signedUrl, expiresInSeconds: expiresIn });
});




### 6.3 `accept-contract/index.ts`

ts


import { createClient } from "jsr:@supabase/supabase-js@2";

function hash(input: string) {
  // simplificado: dev pode trocar por crypto.subtle.digest SHA-256
  return input;
}

Deno.serve(async (req) => {
  const { token, fullName, document, termsVersion } = await req.json().catch(() => ({}));
  if (!token || !fullName || !document) return new Response("Missing fields", { status: 400 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: link } = await supabase
    .from("contract_public_links")
    .select("id, expires_at, revoked_at, contract_id, contracts(current_version_id, status)")
    .eq("token", token)
    .maybeSingle();

  if (!link) return new Response("Invalid token", { status: 404 });
  if (link.revoked_at) return new Response("Revoked", { status: 403 });
  if (new Date(link.expires_at) < new Date()) return new Response("Expired", { status: 410 });

  const contract = (link as any).contracts;
  const versionId = contract.current_version_id;

  // idempotência simples: se já aceito, retorna ok
  if (contract.status === "accepted") {
    return Response.json({ ok: true, acceptedAt: new Date().toISOString(), alreadyAccepted: true });
  }

  const acceptanceHash = hash(JSON.stringify({
    token, fullName, document, versionId, termsVersion, t: Date.now()
  }));

  const { error: insErr } = await supabase.from("contract_acceptances").insert({
    contract_id: link.contract_id,
    version_id: versionId,
    public_link_id: link.id,
    accepted_full_name: fullName,
    accepted_document: document,
    terms_version: termsVersion ?? null,
    ip: req.headers.get("x-forwarded-for") ?? null,
    user_agent: req.headers.get("user-agent"),
    acceptance_hash: acceptanceHash
  });

  if (insErr) return Response.json({ error: insErr.message }, { status: 500 });

  await supabase.from("contracts").update({
    status: "accepted",
    accepted_at: new Date().toISOString()
  }).eq("id", link.contract_id);

  await supabase.from("contract_events").insert({
    contract_id: link.contract_id,
    public_link_id: link.id,
    event_type: "accepted",
    user_agent: req.headers.get("user-agent"),
    ip: req.headers.get("x-forwarded-for") ?? null,
    metadata_json: {}
  });

  return Response.json({ ok: true, acceptedAt: new Date().toISOString() });
});




---

## 7) Stripe Webhook — contrato de implementação (resumo)
### 7.1 Requisitos
- Validar assinatura do webhook (`STRIPE_WEBHOOK_SECRET`)
- Idempotência:
  - salvar `stripe_event_id` em `billing_events` com unique
  - se já existe → retornar 200

### 7.2 Eventos mínimos para V1
- `customer.subscription.created|updated|deleted`
- `invoice.paid`
- `invoice.payment_failed`

> O dev mapeia `tenant_id` via `stripe_customer_id` → `billing_customers.tenant_id`.

---

## 8) GitHub Actions — deploy + workflow_dispatch (modelo)
> Ajustar para seu projeto (Node version, build, paths).


yml

name: Deploy Pages
on:
  workflow_dispatch:
  push:
    branches: [ "main" ]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist




---

## 9) Observações finais para o dev (o que é “core” vs “nice-to-have”)
### Core (V1)
- Tokens `/p`, `/r`, `/c` via Edge Functions
- Contratos com anexos e signed URLs
- Stripe webhook idempotente
- SSG + rebuild automático

### Nice-to-have (V1.1)
- E-mail transacional (envio automático de links)
- Validação completa de CPF/CNPJ com dígitos verificadores
- Antivírus/scan de arquivos anexados
- PDF server-side

---
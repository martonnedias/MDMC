-- MIGRATION SPRINT 5 - CONTRATOS
-- Arquivo para ser executado no SQL Editor do Supabase

-- 1. Criação do Enum de Status de Contrato
DO $$ BEGIN
  CREATE TYPE public.contract_status AS ENUM ('draft','sent','viewed','accepted','expired','revoked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Tabela de Templates de Contrato
CREATE TABLE IF NOT EXISTS public.contract_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text null,
  schema_json jsonb not null default '[]'::jsonb, -- blocos configuráveis por template
  is_active boolean not null default true,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Tabela de Contratos
CREATE TABLE IF NOT EXISTS public.contracts (
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

-- 4. Tabela de Versões de Contrato
CREATE TABLE IF NOT EXISTS public.contract_versions (
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

-- Adicionando FK cruzada no contrato apontando para a version atual
ALTER TABLE public.contracts DROP CONSTRAINT IF EXISTS fk_contract_current_version;
ALTER TABLE public.contracts ADD CONSTRAINT fk_contract_current_version FOREIGN KEY (current_version_id) REFERENCES public.contract_versions(id) ON DELETE SET NULL;


-- 5. Links Públicos de Contratos
CREATE TABLE IF NOT EXISTS public.contract_public_links (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- 6. Aceites de Contratos
CREATE TABLE IF NOT EXISTS public.contract_acceptances (
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

-- 7. Eventos de Contratos
CREATE TABLE IF NOT EXISTS public.contract_events (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  public_link_id uuid null references public.contract_public_links(id) on delete set null,
  event_type text not null,
  event_at timestamptz not null default now(),
  ip text null,
  user_agent text null,
  metadata_json jsonb not null default '{}'::jsonb
);

-- 8. Anexos de Contratos
CREATE TABLE IF NOT EXISTS public.contract_attachments (
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_contracts_tenant ON public.contracts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contract_links_contract ON public.contract_public_links(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_attachments_contract ON public.contract_attachments(contract_id);

-- RLS
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_public_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_attachments ENABLE ROW LEVEL SECURITY;

-- Políticas de Admin
CREATE POLICY "Admins full access to contract templates" ON public.contract_templates FOR ALL USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));
CREATE POLICY "Admins full access to contracts" ON public.contracts FOR ALL USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));
CREATE POLICY "Admins full access to contract versions" ON public.contract_versions FOR ALL USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));
CREATE POLICY "Admins full access to contract public links" ON public.contract_public_links FOR ALL USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));
CREATE POLICY "Admins full access to contract acceptances" ON public.contract_acceptances FOR ALL USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));
CREATE POLICY "Admins full access to contract events" ON public.contract_events FOR ALL USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));
CREATE POLICY "Admins full access to contract attachments" ON public.contract_attachments FOR ALL USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

-- Storage (criação programática - só funciona se tiver permissões de admin nas extensões/schemas)
-- Importante: Pode ser necessário criar o bucket "contracts" pela interface do Supabase Studio (Storage -> New Bucket: Private).
-- Este código injeta na tabela base do storage do Supabase:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('contracts', 'contracts', false, 20971520, '{image/png,image/jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document}')
ON CONFLICT (id) DO UPDATE SET 
  public = false, 
  file_size_limit = 20971520, 
  allowed_mime_types = '{image/png,image/jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document}';

-- RLS on Storage
DROP POLICY IF EXISTS "Admins full access to contracts storage" ON storage.objects;
CREATE POLICY "Admins full access to contracts storage" ON storage.objects FOR ALL
USING (bucket_id = 'contracts' AND auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

-- MIGRATION SPRINT 4 - PROPOSTAS
-- Arquivo para ser executado no SQL Editor do Supabase

-- 1. Criação do Enum de Status de Proposta se não existir
DO $$ BEGIN
  CREATE TYPE public.proposal_status AS ENUM ('draft','sent','viewed','approved','expired','revoked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Tabela Base: Tenants (Pré-requisito do Tech Pack para isolamento de clientes/espaços)
CREATE TABLE IF NOT EXISTS public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Inserir um Tenant padrão ("MD Solution") caso a tabela esteja vazia
INSERT INTO public.tenants (name) 
SELECT 'MD Solution' 
WHERE NOT EXISTS (SELECT 1 FROM public.tenants LIMIT 1);

-- 3. Tabela de Propostas
CREATE TABLE IF NOT EXISTS public.proposals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  status public.proposal_status not null default 'draft',
  current_version_id uuid null, -- será atualizada pelas versions
  sent_at timestamptz null,
  approved_at timestamptz null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Tabela de Versões de Propostas (Para versionamento de alterações)
CREATE TABLE IF NOT EXISTS public.proposal_versions (
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

-- Adicionando FK cruzada na proposta apontando para a version atual se necessário (ou gerido via aplicação)
ALTER TABLE public.proposals DROP CONSTRAINT IF EXISTS fk_current_version;
ALTER TABLE public.proposals ADD CONSTRAINT fk_current_version FOREIGN KEY (current_version_id) REFERENCES public.proposal_versions(id) ON DELETE SET NULL;

-- 5. Links Públicos de Propostas
CREATE TABLE IF NOT EXISTS public.proposal_public_links (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz null,
  revoked_at timestamptz null,
  created_at timestamptz not null default now()
);

-- 6. Aceites das Propostas
CREATE TABLE IF NOT EXISTS public.proposal_acceptances (
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

-- 7. Eventos/Logs das Propostas
CREATE TABLE IF NOT EXISTS public.proposal_events (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  event_type text not null,
  event_at timestamptz not null default now(),
  ip text null,
  user_agent text null,
  metadata_json jsonb not null default '{}'::jsonb
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_proposals_tenant ON public.proposals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_proposal_links_token ON public.proposal_public_links(token);


-- 8. Habilitar RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_public_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_events ENABLE ROW LEVEL SECURITY;


-- 9. Políticas RLS
-- Utilizando a verificação do E-mail do Admin (baseado nas rules das sprints anteriores) 
-- para garantir que Admins têm acesso total a tudo.

-- Tenants
CREATE POLICY "Admins full access to tenants" ON public.tenants FOR ALL
USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

-- Proposals
CREATE POLICY "Admins full access to proposals" ON public.proposals FOR ALL
USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

-- Proposal Versions
CREATE POLICY "Admins full access to proposal versions" ON public.proposal_versions FOR ALL
USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

-- Proposal Public Links
CREATE POLICY "Admins full access to proposal public links" ON public.proposal_public_links FOR ALL
USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

-- Proposal Acceptances
CREATE POLICY "Admins full access to proposal acceptances" ON public.proposal_acceptances FOR ALL
USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

-- Proposal Events
CREATE POLICY "Admins full access to proposal events" ON public.proposal_events FOR ALL
USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

-- Nota: O public acesso via frontend aos links não deve ocorrer por leitura de tabela,
-- mas sim chamando as funções Edge (ex: get-proposal-by-token), as quais usarão a role service_role
-- bypassando momentaneamente o RLS público.

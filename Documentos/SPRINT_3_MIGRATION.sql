-- MIGRATION SPRINT 3 - Formulários e Relatórios por Token
-- Arquivo para ser executado no SQL Editor do Supabase

-- Garantir que a tabela leads tenha a estrutura necessária
-- Como 'type' já existe, vamos mapear 'source' para 'type' se quisermos manter compatibilidade, mas o Tech Pack exige a tabela consolidada.
-- Aqui, caso a tabela atual seja diferente, vamos tentar adicionar as colunas faltantes.
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS payload_json jsonb;

-- Copiar dado de `type` para `source` para compatibilidade reversa se `source` for nulo
UPDATE public.leads SET source = type WHERE source IS NULL;

-- 1. Criação da Tabela de Reports (Relatórios salvos)
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  report_type text not null, -- 'swot' | 'teste-gratuito'
  lead_id uuid null references public.leads(id) on delete set null,
  content_html text not null,
  summary_json jsonb not null default '{}'::jsonb
);

-- 2. Criação da Tabela de Links Públicos de Relatórios
CREATE TABLE IF NOT EXISTS public.report_public_links (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz null,
  revoked_at timestamptz null,
  created_at timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_report_links_report ON public.report_public_links(report_id);
CREATE INDEX IF NOT EXISTS idx_report_links_token ON public.report_public_links(token);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_public_links ENABLE ROW LEVEL SECURITY;

-- Reports: Admins e Financeiro podem ler todos. Público não pode ler diretamente da API do lado do cliente. (O Edge Function usará Service Role)
CREATE POLICY "Admins can view reports" ON public.reports
  FOR SELECT
  USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

CREATE POLICY "Admins can insert reports" ON public.reports
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

CREATE POLICY "Admins can view report links" ON public.report_public_links
  FOR SELECT
  USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

CREATE POLICY "Admins can insert report links" ON public.report_public_links
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

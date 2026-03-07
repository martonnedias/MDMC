-- MIGRATION SPRINT 1 - CMS (MD Solution)
-- Arquivo para ser executado no SQL Editor do Supabase

-- 1. Criação do Enum de Status se não existir
DO $$ BEGIN
  CREATE TYPE public.publish_status AS ENUM ('draft','published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Tabela de CMS Pages (Páginas Genéricas e de Serviço)
CREATE TABLE IF NOT EXISTS public.cms_pages (
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

CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON public.cms_pages(status, is_active);

-- Enable RLS for cms_pages
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

-- Select policies (Public pode ver páginas publicadas e ativas)
CREATE POLICY "Permitir leitura publica de paginas ativas e publicadas"
ON public.cms_pages FOR SELECT
USING (status = 'published' AND is_active = true);

-- Select policies (Admin pode ver tudo)
CREATE POLICY "Permitir leitura total para admin"
ON public.cms_pages FOR SELECT
USING (auth.jwt() ->> 'email' IN ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

-- Insert/Update/Delete policies (Apenas admins)
CREATE POLICY "Permitir edicao para admin"
ON public.cms_pages FOR ALL
USING (auth.jwt() ->> 'email' IN ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));


-- 3. Atualizar tabela de blog_posts caso não tenha as colunas de SEO
-- (ignorando erros caso as colunas já existam)
DO $$ 
BEGIN
    ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS status public.publish_status not null default 'draft';
    ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS meta_title text null;
    ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS meta_description text null;
    ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS og_image_url text null;
    ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS published_at timestamptz null;
EXCEPTION WHEN others THEN NULL; 
END $$;

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);

-- 4. Garantir que RLS de BlogPost aceite policies baseadas no status
DROP POLICY IF EXISTS "Allow public read access to blog_posts" ON public.blog_posts;
CREATE POLICY "Allow public read access to published blog_posts"
ON public.blog_posts FOR SELECT
USING (status = 'published');

CREATE POLICY "Allow admin read access to all blog_posts"
ON public.blog_posts FOR SELECT
USING (auth.jwt() ->> 'email' IN ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));


-- 5. Função Trigger Rebuild via Edge Function (Será usada no webhook futuramente)
-- Caso utilize triggers diretos do Postgres para invocar functions (Avançado)
-- (No MVP o Frontend fará a chamada da Edge Function, então isso é opcional)

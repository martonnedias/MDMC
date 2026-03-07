-- MIGRATION SPRINT 2 - Serviços com Slugs e Página de Planos
-- Arquivo para ser executado no SQL Editor do Supabase

ALTER TABLE public.services_data
  ADD COLUMN IF NOT EXISTS slug text null;

-- Unicidade por (page, slug) quando slug for preenchido
CREATE UNIQUE INDEX IF NOT EXISTS ux_services_data_page_slug
ON public.services_data(page, slug)
WHERE slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_services_data_page ON public.services_data(page);

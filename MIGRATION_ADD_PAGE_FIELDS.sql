-- Execute este script no SQL Editor do Supabase para adicionar os novos campos de organização
-- Isso permitirá categorizar cards por página e seção específica.

ALTER TABLE public.services_data 
ADD COLUMN IF NOT EXISTS page text DEFAULT 'landing',
ADD COLUMN IF NOT EXISTS section_id text DEFAULT 'pricing';

-- Comentários para documentação
COMMENT ON COLUMN public.services_data.page IS 'Define em qual página o ítem será exibido (landing, consultancy, ads, etc)';
COMMENT ON COLUMN public.services_data.section_id IS 'Define em qual bloco interno da página o ítem será exibido (pricing, pain-points, methodology, etc)';

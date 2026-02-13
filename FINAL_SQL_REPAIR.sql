-- COPIE E COLE ESTE SCRIPT NO "SQL EDITOR" DO SUPABASE
-- ESTE SCRIPT REPARA A TABELA services_data E RESOLVE AS DISCREPÂNCIAS

-- 1. ADICIONA AS COLUNAS FALTANTES (SE NÃO EXISTIREM)
ALTER TABLE public.services_data 
ADD COLUMN IF NOT EXISTS page text DEFAULT 'landing',
ADD COLUMN IF NOT EXISTS section_id text DEFAULT 'pricing';

-- 2. CORRIGE O CAMPO 'features' PARA SER UM JSONB VÁLIDO (ARRAY) SE ESTIVER COMO STRING OU NULL
-- Primeiro garante que a coluna seja jsonb se não for
-- ALTER TABLE public.services_data ALTER COLUMN features TYPE jsonb USING features::jsonb;

-- 3. MAPEIA OS ITENS EXISTENTES PARA AS NOVAS PÁGINAS E SEÇÕES BASEADO NA CATEGORIA
-- Consultoria / Maestro
UPDATE public.services_data 
SET page = 'consultancy', section_id = 'pricing' 
WHERE category = 'consultoria' AND (page IS NULL OR page = 'landing');

UPDATE public.services_data 
SET section_id = 'pain-points' 
WHERE category = 'consultoria' AND (name ILIKE '%Marketing%' OR name ILIKE '%Gargalo%' OR name ILIKE '%Padrão%');

-- Marketing / Anúncios
UPDATE public.services_data 
SET page = 'ads', section_id = 'pricing' 
WHERE category = 'marketing' AND (page IS NULL OR page = 'landing');

UPDATE public.services_data 
SET section_id = 'methodology' 
WHERE category = 'marketing' AND (name ILIKE '%Público%' OR name ILIKE '%Criativos%');

-- SWOT
UPDATE public.services_data 
SET page = 'swot-service', section_id = 'pricing' 
WHERE category = 'swot' AND (page IS NULL OR page = 'landing');

-- GMB
UPDATE public.services_data 
SET page = 'gmb', section_id = 'benefits' 
WHERE category = 'gmb' AND (page IS NULL OR page = 'landing');

-- SITES
UPDATE public.services_data 
SET page = 'sites', section_id = 'pricing' 
WHERE category = 'sites' AND (page IS NULL OR page = 'landing');

UPDATE public.services_data 
SET section_id = 'hero' WHERE category = 'sites' AND name ILIKE '%Inicial%';

UPDATE public.services_data 
SET section_id = 'faq' WHERE category = 'sites' AND (name ILIKE '%Entrega%' OR name ILIKE '%Alterações%' OR name ILIKE '%Custos%');

UPDATE public.services_data 
SET section_id = 'methodology' WHERE category = 'sites' AND (name ILIKE '%UX%' OR name ILIKE '%Impacto%' OR name ILIKE '%Engenharia%');

UPDATE public.services_data 
SET section_id = 'gallery' WHERE category = 'sites' AND (name ILIKE '%Galeria%' OR name ILIKE '%Interfaces%' OR name ILIKE '%Elite%');

UPDATE public.services_data 
SET section_id = 'testimonials' WHERE category = 'sites' AND (name ILIKE '%Silva%' OR name ILIKE '%Ana Claudia%');

UPDATE public.services_data 
SET section_id = 'pain-points' WHERE category = 'sites' AND (name ILIKE '%Lentidão%' OR name ILIKE '%Mobile%' OR name ILIKE '%Invisível%');

UPDATE public.services_data 
SET section_id = 'benefits' WHERE category = 'sites' AND (name ILIKE '%Bento%' OR name ILIKE '%PageSpeed%' OR name ILIKE '%SEO%' OR name ILIKE '%Vendas%' OR name ILIKE '%Painel%');

UPDATE public.services_data 
SET section_id = 'modules' WHERE category = 'sites' AND name ILIKE '%Checklist%';

-- 4. GARANTE QUE TODOS OS ITENS TENHAM NOME (EVITA ITENS FANTASMA)
DELETE FROM public.services_data WHERE name IS NULL OR name = '';

-- 5. ATIVA TODOS OS ITENS POR PADRÃO SE ESTIVEREM NULOS
UPDATE public.services_data SET is_active = true WHERE is_active IS NULL;

-- 6. LIMPEZA DE JSON CORROMPIDO NO CAMPO FEATURES (CASO EXISTA)
-- Converte strings simples que deveriam ser arrays em arrays de 1 elemento
UPDATE public.services_data 
SET features = ('["' || features || '"]')::jsonb 
WHERE jsonb_typeof(features) = 'string' AND features != '';

UPDATE public.services_data 
SET features = '[]'::jsonb 
WHERE features IS NULL;

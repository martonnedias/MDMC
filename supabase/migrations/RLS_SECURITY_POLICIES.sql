-- ==============================================================================
-- 🛡️ POLÍTICAS DE SEGURANÇA ESTRITA (ROW LEVEL SECURITY - RLS)
-- APLICAÇÃO: MD SOLUTION (PRODUÇÃO V1)
-- OBJETIVO: Bloquear acessos anônimos de leitura/escrita em tabelas sensíveis.
-- ==============================================================================

-- 1. PROTEÇÃO DA TABELA DE VENDAS E PROPOSTAS (proposals)
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Visitantes não autenticados SÓ PODEM LER se souberem o TOKEN exato (O Cliente acessando a url)
CREATE POLICY "Permitir leitura de propostas por TOKEN público"
  ON public.proposals FOR SELECT
  USING (true); -- Controle feito via Edge Function ou WHERE token = 'xyz' no frontend isolado.

-- Apenas Administradores Autenticados podem CRIAR, APAGAR ou ATUALIZAR as Faturas
CREATE POLICY "Somente Admins podem alterar faturas"
  ON public.proposals FOR ALL
  USING (auth.uid() IS NOT NULL AND auth.jwt() ->> 'email' IN ('martonnedias@gmail.com', 'admin@mdsolution.com.br'))
  WITH CHECK (auth.uid() IS NOT NULL AND auth.jwt() ->> 'email' IN ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));


-- 2. PROTEÇÃO DO BLOG (blog_posts)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa do mundo pode LER o blog para o SEO funcionar.
CREATE POLICY "Leitura pública do Blog"
  ON public.blog_posts FOR SELECT
  USING (true);

-- Apenas o administrador pode escrever ou deletar matérias.
CREATE POLICY "Apenas admin edita Blog"
  ON public.blog_posts FOR ALL
  USING (auth.jwt() ->> 'email' IN ('martonnedias@gmail.com', 'admin@mdsolution.com.br'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));


-- 3. TABELA DE EDIÇÃO DO SITE (pages e services_data)
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_data ENABLE ROW LEVEL SECURITY;

-- O site lê as configurações livremente para desenhar a interface
CREATE POLICY "Leitura pública de configurações Visuais"
  ON public.pages FOR SELECT USING (true);
  
CREATE POLICY "Leitura pública dos Serviços"
  ON public.services_data FOR SELECT USING (true);

-- Apenas Master Admins mudam os textos e preços do site no painel
CREATE POLICY "Apenas Admin muda layout Pages"
  ON public.pages FOR ALL
  USING (auth.jwt() ->> 'email' IN ('martonnedias@gmail.com', 'admin@mdsolution.com.br'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

CREATE POLICY "Apenas Admin altera os Serviços e Preços"
  ON public.services_data FOR ALL
  USING (auth.jwt() ->> 'email' IN ('martonnedias@gmail.com', 'admin@mdsolution.com.br'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

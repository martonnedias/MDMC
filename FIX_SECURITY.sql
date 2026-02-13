-- ATENÇÃO: Execute este script no SQL Editor do Supabase para corrigir a segurança

-- 1. Remover políticas antigas que permitiam acesso a qualquer um logado
drop policy if exists "Allow authenticated selects from leads" on public.leads;
drop policy if exists "Allow authenticated selects from swot_briefings" on public.swot_briefings;

-- 2. Criar novas políticas restritas APENAS aos e-mails definidos
-- Adicione/Remova e-mails conforme necessário na lista abaixo
create policy "Allow admin selects from leads"
  on public.leads for select
  using (
    auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br')
  );

create policy "Allow admin selects from swot_briefings"
  on public.swot_briefings for select
  using (
    auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br')
  );

-- Nota: A inserção continua pública (para os formulários funcionarem), 
-- mas a leitura agora é restrita a essa lista de e-mails.

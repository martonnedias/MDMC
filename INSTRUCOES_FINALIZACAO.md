# Instruções para Sistema Seguro e Finalizado

Para garantir que seu site capte leads E que apenas você tenha acesso aos dados:

## 1. Configurar Admin (Frontend)

Adicionei uma variável de segurança no seu arquivo `.env.local`.
Abra o arquivo `.env.local` e confirme se o seu e-mail está na lista:

```env
VITE_ADMIN_EMAILS=martonnedias@gmail.com,seu-outro-email@exemplo.com
```

**Se você não fizer isso, mesmo logado você será redirecionado para a home ao tentar acessar /admin.**

## 2. Configurar Segurança do Banco (Backend)

Criei um arquivo especial para corrigir a falha de segurança que permitia qualquer um ler os dados.

1.  Acesse o painel do [Supabase](https://supabase.com/dashboard) -> SQL Editor.
2.  Copie o conteúdo do arquivo `FIX_SECURITY.sql` (está na raiz do projeto).
3.  Cole e clique em **RUN**.

Isso garantirá que, mesmo que alguém descubra sua API Key e logue no seu site, não consiga ler a tabela de leads a não ser que tenha o e-mail autorizado.

## 3. Testar Tudo

1.  Rode `npm run dev`.
2.  Tente acessar `/admin`.
    *   Se estiver logado com o e-mail correto: Você verá o painel.
    *   Se estiver logado com outro e-mail: Será expulso para a Home.
3.  Envie um lead de teste no rodapé e verifique se aparece no admin.

---
**Resumo da Proteção:**
🛡️ **Frontend:** Bloqueio via código (Redirecionamento).
🛡️ **Backend:** Bloqueio via Banco de Dados (Row Level Security).
Apenas e-mails na lista VIP têm acesso aos dados.

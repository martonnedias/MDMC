# MD Solution

A **MD Solution** é uma plataforma abrangente projetada para a aquisição, venda, entrega e cobrança de serviços de marketing. Ela centraliza a operação de agências ou prestadores de serviço em um único ambiente, desde a atração do lead até a entrega do serviço e gestão financeira.

## O Que É o Projeto?

O projeto é constituído por um ecossistema dividido em quatro frentes principais, todas integradas através de um backend poderoso e seguro no Supabase, com frontend estruturado em React/Vite. Seu propósito central é:

- Aumentar a geração e qualificação de leads.
- Reduzir o tempo de fechamento de negócios.
- Padronizar a entrega e o suporte aos clientes.
- Escalar a receita através de assinaturas e integrações de pagamentos seguras.

## Principais Funcionalidades

### 1) Site Público (SSG + SEO)

- **CMS Integrado**: Páginas institucionais, serviços e blog gerenciados diretamente pelo Admin, com os dados consumidos do Supabase.
- **Formulários Interativos**: Captação de leads via formulários (como "Teste Gratuito" e "Teste SWOT") que geram relatórios automáticos.
- **Alta Performance**: Utiliza Static Site Generation (SSG) no GitHub Pages com *rebuild automáticos* sempre que um conteúdo é publicado ou modificado, garantindo SEO de ponta e fluidez de navegação.

### 2) Painel Administrativo (Admin)

- **Controle de Acessos (RBAC)**: Diferentes níveis de acesso para usuários internos (Admin, Operação e Financeiro), com visibilidades controladas.
- **Gestão Comercial**: Acompanhamento de propostas, geração de contratos estruturados a partir de templates, e funil básico de leads.
- **Gerenciamento de Conteúdo e Serviços**: Controle total sobre textos da home, pacotes de serviço, postagens no blog e gestão de relatórios.

### 3) Portal do Cliente (Multi-tenant)

- **Isolamento de Dados Seguros (RLS)**: Cada cliente (ou empresa) vê exclusivamente os dados e ativos pertencentes ao seu cadastro (tenant).
- **Dashboard e Arquivos**: Painel de acompanhamento, relatórios históricos e armazenamento seguro de arquivos.
- **Tickets e Aprovações**: Área dedicada para suporte e aprovação de materiais e entregas solicitadas.
- **Área Financeira**: Visualização de status da assinatura mensal e detalhamento de faturas.

### 4) Compartilhamento via Links Públicos (Tokens Dinâmicos)

- Links seguros gerados com prazo de expiração (tokens temporários) para acessar conteúdos fundamentais sem necessidade de login prévio:
  - **`/p/:token`** para Propostas.
  - **`/r/:token`** para Relatórios gerados em formulários.
  - **`/c/:token`** para Contratos padronizados, incluindo formulário de aceite com coleta de dados auditáveis e validade jurídica.

### 5) Módulo Financeiro

- **Integração Completa com o Stripe**: Criação de planos de assinatura de pagamento recorrente e também faturamento de serviços avulsos.
- **Atualização Automática**: Webhooks configurados para atualizar automaticamente o status de pagamentos, faturas e assinaturas no sistema, informando as etapas tanto no Admin quanto no Portal do Cliente.

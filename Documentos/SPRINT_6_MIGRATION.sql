-- MIGRATION SPRINT 6 - PORTAL DO CLIENTE + BILLING
-- Arquivo para ser executado no SQL Editor do Supabase

-- 1. Tabelas de Suporte/Tickets (Simples para v1)
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  subject text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_id uuid not null references auth.users(id),
  content text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. Tabelas de Billing (Stripe)
CREATE TABLE IF NOT EXISTS public.billing_customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  stripe_customer_id text not null unique,
  email text,
  created_at timestamptz not null default now(),
  unique (tenant_id)
);

CREATE TABLE IF NOT EXISTS public.billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  stripe_subscription_id text not null unique,
  status text not null, -- 'active', 'past_due', 'canceled', etc.
  plan_id text,
  current_period_end timestamptz null,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.billing_invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  stripe_invoice_id text not null unique,
  status text not null, -- 'paid', 'open', 'uncollectible', 'void'
  amount_due bigint null,
  amount_paid bigint null,
  currency text default 'brl',
  hosted_invoice_url text null,
  invoice_pdf_url text null,
  due_date timestamptz null,
  created_at timestamptz not null default now()
);

-- 3. Índices
CREATE INDEX IF NOT EXISTS idx_tickets_tenant ON public.support_tickets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_messages_ticket ON public.support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_billing_cust_tenant ON public.billing_customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_billing_sub_tenant ON public.billing_subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_billing_inv_tenant ON public.billing_invoices(tenant_id);

-- 4. RLS (Row Level Security)
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;

-- Políticas para Clientes (Membros do Tenant)
-- Tickets: Podem ler e criar tickets do seu tenant
CREATE POLICY "Users can view their own tenant tickets" ON public.support_tickets
FOR SELECT TO authenticated USING (public.is_tenant_member(tenant_id));

CREATE POLICY "Users can create tickets for their tenant" ON public.support_tickets
FOR INSERT TO authenticated WITH CHECK (public.is_tenant_member(tenant_id));

-- Messages: Podem ler e criar mensagens em tickets do seu tenant (que não sejam internas)
CREATE POLICY "Users can view messages from their tenant tickets" ON public.support_messages
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.support_tickets t 
    WHERE t.id = ticket_id AND public.is_tenant_member(t.tenant_id)
  ) AND is_internal = false
);

CREATE POLICY "Users can send messages to their tenant tickets" ON public.support_messages
FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.support_tickets t 
    WHERE t.id = ticket_id AND public.is_tenant_member(t.tenant_id)
  )
);

-- Billing: Podem ler dados financeiros do seu tenant
CREATE POLICY "Users can view their tenant billing info" ON public.billing_customers
FOR SELECT TO authenticated USING (public.is_tenant_member(tenant_id));

CREATE POLICY "Users can view their tenant subscriptions" ON public.billing_subscriptions
FOR SELECT TO authenticated USING (public.is_tenant_member(tenant_id));

CREATE POLICY "Users can view their tenant invoices" ON public.billing_invoices
FOR SELECT TO authenticated USING (public.is_tenant_member(tenant_id));

-- Políticas para Admins (Acesso total)
CREATE POLICY "Admins full access to tickets" ON public.support_tickets FOR ALL USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));
CREATE POLICY "Admins full access to messages" ON public.support_messages FOR ALL USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));
CREATE POLICY "Admins full access to billing customers" ON public.billing_customers FOR ALL USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));
CREATE POLICY "Admins full access to billing subscriptions" ON public.billing_subscriptions FOR ALL USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));
CREATE POLICY "Admins full access to billing invoices" ON public.billing_invoices FOR ALL USING (auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br'));

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import Stripe from "https://esm.sh/stripe@12.1.1?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (request) => {
    try {
        const signature = request.headers.get('Stripe-Signature');
        const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

        if (!signature || !endpointSecret) {
            return new Response('Missing signature or secret', { status: 400 });
        }

        const body = await request.text();
        let event;

        try {
            event = await stripe.webhooks.constructEventAsync(
                body,
                signature,
                endpointSecret,
                undefined,
                cryptoProvider
            );
        } catch (err) {
            console.error(`⚠️  Webhook signature verification failed.`, err.message);
            return new Response(`Webhook Error: ${err.message}`, { status: 400 });
        }

        const supabaseAdmin = createClient(
            Deno.env.get('CUSTOM_SUPABASE_URL') ?? Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('CUSTOM_SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Idempotency check
        const { data: existingEvent } = await supabaseAdmin
            .from('billing_events')
            .select('id')
            .eq('stripe_event_id', event.id)
            .single()

        if (existingEvent) {
            return new Response(JSON.stringify({ received: true, message: 'Event already processed' }), { status: 200 })
        }

        // Process the event
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;

                // Find tenant by customer_id
                const { data: customer } = await supabaseAdmin
                    .from('billing_customers')
                    .select('tenant_id')
                    .eq('stripe_customer_id', subscription.customer)
                    .single()

                if (customer) {
                    const statusMapping = {
                        'active': 'active',
                        'past_due': 'past_due',
                        'unpaid': 'past_due',
                        'canceled': 'canceled',
                        'incomplete': 'pending',
                        'incomplete_expired': 'canceled',
                        'trialing': 'active'
                    };

                    await supabaseAdmin
                        .from('billing_subscriptions')
                        .upsert({
                            tenant_id: customer.tenant_id,
                            stripe_customer_id: subscription.customer,
                            stripe_subscription_id: subscription.id,
                            status: statusMapping[subscription.status] || 'canceled',
                            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                            cancel_at_period_end: subscription.cancel_at_period_end
                        }, { onConflict: 'stripe_subscription_id' })
                }
                break;
            }
            case 'invoice.payment_succeeded':
            case 'invoice.payment_failed': {
                const invoice = event.data.object;

                const { data: customer } = await supabaseAdmin
                    .from('billing_customers')
                    .select('tenant_id')
                    .eq('stripe_customer_id', invoice.customer)
                    .single()

                if (customer) {
                    await supabaseAdmin
                        .from('billing_invoices')
                        .upsert({
                            tenant_id: customer.tenant_id,
                            stripe_invoice_id: invoice.id,
                            amount_due: invoice.amount_due / 100, // Converts cents to main currency unit
                            amount_paid: invoice.amount_paid / 100,
                            status: invoice.status === 'paid' ? 'paid' : (invoice.status === 'open' ? 'open' : 'void'),
                            hosted_invoice_url: invoice.hosted_invoice_url,
                            invoice_pdf: invoice.invoice_pdf,
                            due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
                            created_at: new Date(invoice.created * 1000).toISOString()
                        }, { onConflict: 'stripe_invoice_id' })
                }
                break;
            }
        }

        // Record the processed event for idempotency
        await supabaseAdmin
            .from('billing_events')
            .insert({
                stripe_event_id: event.id,
                type: event.type,
                processed: true
            })

        return new Response(JSON.stringify({ received: true }), { status: 200 })

    } catch (err) {
        console.error('Webhook error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
})

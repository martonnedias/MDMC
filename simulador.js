import crypto from 'crypto';
import https from 'https';

const webhookSecret = 'whsec_JSNKRxCJ1fWv1fs8Ekx4b7IyX5Nhio1q';

const payload = JSON.stringify({
    id: 'evt_test_unidade',
    object: 'event',
    type: 'checkout.session.completed',
    data: {
        object: {
            id: 'cs_test_fantasma',
            object: 'checkout.session',
            payment_status: 'paid',
            customer_email: 'contato@mdsolution.com.br',
            metadata: {
                plano: 'premium'
            }
        }
    }
});

const timestamp = Math.floor(Date.now() / 1000);
const secretBuffer = Buffer.from(webhookSecret, 'utf-8');
const payloadBuffer = Buffer.from(`${timestamp}.${payload}`, 'utf-8');

const signature = crypto
    .createHmac('sha256', secretBuffer)
    .update(payloadBuffer)
    .digest('hex');

const stripeSignatureHeader = `t=${timestamp},v1=${signature}`;

const options = {
    hostname: 'miadxjhglynefwufxajd.supabase.co',
    path: '/functions/v1/stripe-webhook',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Stripe-Signature': stripeSignatureHeader,
    },
};

console.log('Simulando venda pelo banco do Stripe... 💸');

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(`Resposta do Servidor Supabase (Status: ${res.statusCode}):`);
        console.log(data);
    });
});

req.on('error', (e) => {
    console.error('[ERRO] Falha no disparo:', e.message);
});

req.write(payload);
req.end();

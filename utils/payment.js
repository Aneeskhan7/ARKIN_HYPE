/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
// payment.js

// eslint-disable-next-line import/no-extraneous-dependencies
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');

async function createPaymentIntent(amount) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card'],
    });
    return paymentIntent;
}

async function handleWebhookEvent(req) {
    const sig = req.headers['stripe-signature'];
    let stripeEvent;

    try {
        stripeEvent = stripe.webhooks.constructEvent(req.rawBody, sig, 'YOUR_STRIPE_WEBHOOK_SECRET');
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        throw new Error('Webhook signature verification failed.');
    }

    // Handle the event
    switch (stripeEvent.type) {
        case 'payment_intent.succeeded':
            // Payment succeeded, fulfill the order
            break;
        case 'payment_intent.payment_failed':
            // Payment failed, handle accordingly
            break;
        // Handle other event types as needed
        default:
            // Unexpected event type
            break;
    }
}

module.exports = {
    createPaymentIntent,
    handleWebhookEvent
};

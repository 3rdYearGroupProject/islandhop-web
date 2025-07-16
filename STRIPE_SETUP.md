# Stripe Payment Integration Setup

## Environment Variables

Add the following environment variable to your `.env` file:

```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key_here
```

## Backend Payment Intent Endpoint

You need to create a backend endpoint at `http://localhost:8095/api/v1/payments/create-payment-intent` that:

1. Accepts POST requests with `{ amount: number, currency: string }`
2. Creates a Stripe PaymentIntent on your backend
3. Returns `{ clientSecret: string }`

Example backend code (Node.js):

```javascript
app.post('/api/v1/payments/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        // Add any metadata you need
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## How It Works

1. User clicks "Pay $X.XX & Proceed" 
2. Stripe payment form appears
3. User enters card details and payment is processed
4. On successful payment, the trip initiation API is called with the payment intent ID
5. Backend can verify the payment before confirming the trip

## Testing

Use Stripe test card numbers:
- Success: 4242424242424242
- Decline: 4000000000000002
- Requires authentication: 4000002500003155

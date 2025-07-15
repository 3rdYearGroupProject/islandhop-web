import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = ({ totalAmount, onPaymentSuccess, onPaymentError, submitting, setSubmitting }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      setPaymentError('Stripe has not loaded yet. Please try again.');
      return;
    }

    setSubmitting(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment intent on your backend
      const { data } = await axios.post('http://localhost:8095/api/v1/payments/create-payment-intent', {
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'usd'
      });

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer Name', // You can get this from user data
          },
        },
      });

      if (error) {
        setPaymentError(error.message);
        onPaymentError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Payment failed. Please try again.';
      setPaymentError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-300 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-800 mb-2">Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      {paymentError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {paymentError}
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={!stripe || submitting}
        className="w-full px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Processing Payment...' : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </div>
  );
};

export default PaymentForm;
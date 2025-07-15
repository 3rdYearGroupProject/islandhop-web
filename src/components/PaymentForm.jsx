import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = ({ totalAmount, onPaymentSuccess, onPaymentError, submitting, setSubmitting }) => {
  const [paymentError, setPaymentError] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Sri Lanka'
  });

  const handleCustomerDetailsChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone } = customerDetails;
    if (!firstName || !lastName || !email || !phone) {
      setPaymentError('Please fill in all required fields');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setPaymentError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setPaymentError(null);

    try {
      // Create payment with backend
      const paymentData = {
        amount: totalAmount,
        currency: 'LKR',
        orderId: `ORDER_${Date.now()}`,
        itemName: 'Trip Booking Advance Payment',
        customerDetails: customerDetails
      };

      const { data } = await axios.post('http://localhost:8095/api/v1/payments/create-payhere-payment', paymentData);

      if (data.success) {
        // Initialize PayHere payment
        const payment = {
          sandbox: true, // Set to false for production
          merchant_id: data.merchantId,
          return_url: `${window.location.origin}/payment/return`,
          cancel_url: `${window.location.origin}/payment/cancel`,
          notify_url: data.notifyUrl,
          order_id: data.orderId,
          items: data.itemName,
          amount: data.amount,
          currency: data.currency,
          hash: data.hash,
          first_name: customerDetails.firstName,
          last_name: customerDetails.lastName,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: customerDetails.address,
          city: customerDetails.city,
          country: customerDetails.country
        };

        // PayHere payment callbacks
        window.payhere.onCompleted = function onCompleted(orderId) {
          console.log("Payment completed. OrderID:" + orderId);
          onPaymentSuccess(orderId);
        };

        window.payhere.onDismissed = function onDismissed() {
          console.log("Payment dismissed");
          setPaymentError("Payment was cancelled");
          onPaymentError("Payment was cancelled");
        };

        window.payhere.onError = function onError(error) {
          console.log("Error:" + error);
          setPaymentError("Payment failed: " + error);
          onPaymentError("Payment failed: " + error);
        };

        // Start PayHere payment
        window.payhere.startPayment(payment);
      } else {
        throw new Error(data.message || 'Failed to initialize payment');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Payment failed. Please try again.';
      setPaymentError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={customerDetails.firstName}
            onChange={handleCustomerDetailsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={customerDetails.lastName}
            onChange={handleCustomerDetailsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Email *</label>
        <input
          type="email"
          name="email"
          value={customerDetails.email}
          onChange={handleCustomerDetailsChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Phone *</label>
        <input
          type="tel"
          name="phone"
          value={customerDetails.phone}
          onChange={handleCustomerDetailsChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={customerDetails.address}
          onChange={handleCustomerDetailsChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={customerDetails.city}
            onChange={handleCustomerDetailsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={customerDetails.country}
            onChange={handleCustomerDetailsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            readOnly
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">Total Amount:</span>
          <span className="text-xl font-bold text-primary-600">LKR {(totalAmount * 300).toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Payment will be processed securely through PayHere
        </p>
      </div>

      {paymentError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {paymentError}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={submitting}
        className="w-full px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {submitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </>
        ) : (
          `Pay LKR ${(totalAmount * 300).toFixed(2)}`
        )}
      </button>

      <div className="text-xs text-gray-500 text-center">
        <p>Secured by PayHere Payment Gateway</p>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </div>
  );
};

export default PaymentForm;
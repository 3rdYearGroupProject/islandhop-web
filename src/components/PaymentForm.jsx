import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserUID } from '../utils/userStorage';

const PaymentForm = ({ totalAmount, onPaymentSuccess, onPaymentError, submitting, setSubmitting, tripId, tripData }) => {
  const [paymentError, setPaymentError] = useState(null);
  const [payHereLoaded, setPayHereLoaded] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Sri Lanka'
  });

  // Check if PayHere is loaded
  useEffect(() => {
    const checkPayHere = () => {
      if (window.payhere) {
        setPayHereLoaded(true);
        console.log('PayHere is ready');
      } else {
        console.log('PayHere not loaded yet');
        setTimeout(checkPayHere, 1000);
      }
    };
    checkPayHere();
  }, []);

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

  const createChatGroup = async (orderId) => {
    try {
      const userUID = getUserUID();
      if (!userUID) {
        console.warn('User UID not found, skipping group creation');
        return;
      }

      // Prepare group data
      const groupName = tripData?.name || `Trip ${tripId || orderId}`;
      const description = tripData?.destinations?.length > 0 
        ? tripData.destinations.join(', ') 
        : 'Trip destinations';

      const groupData = {
        groupName: groupName,
        description: description,
        groupType: 'PRIVATE',
        memberIds: [userUID],
        adminId: userUID,
        tripId: tripId
      };

      console.log('Creating chat group for successful payment:', groupData);

      const groupResponse = await axios.post('http://localhost:8090/api/v1/chat/group/create-with-trip', groupData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      if (groupResponse.data) {
        console.log('Chat group created successfully:', groupResponse.data);
        // You could store the group ID for future reference if needed
        // localStorage.setItem(`trip_${tripId}_group`, groupResponse.data.groupId);
      }
    } catch (error) {
      console.error('Failed to create chat group:', error.response?.data || error.message);
      // Don't fail the payment process if group creation fails
      // This is a supplementary feature that shouldn't block the main flow
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    if (!payHereLoaded || !window.payhere) {
      setPaymentError('Payment system is not ready. Please refresh the page and try again.');
      return;
    }

    setSubmitting(true);
    setPaymentError(null);

    try {
      // Send payment request to backend
      const paymentRequest = {
        amount: totalAmount,
        currency: "LKR",
        orderId: `ORDER_${tripId || Date.now()}`,
        tripId: tripId, // Explicitly include tripId
        itemName: "Trip Booking",
        customerDetails: {
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: customerDetails.address,
          city: customerDetails.city,
          country: customerDetails.country
        }
      };

      console.log('Sending payment request to backend:', paymentRequest);
      console.log('TripId being sent:', tripId);

      // Call your backend API
      const response = await axios.post('http://localhost:8088/api/v1/payments/create-payhere-payment', paymentRequest);

      console.log('Backend response:', response.data);
      
      // Updated condition to check for the correct response structure
      if (response.data && response.data.status === 'success') {
        const paymentData = response.data.payHereData;

        // Setup PayHere event handlers
        window.payhere.onCompleted = async function onCompleted(orderId) {
          console.log("Payment completed. OrderID:" + orderId);
          
          // Create chat group after successful payment
          await createChatGroup(orderId);
          
          setSubmitting(false);
          onPaymentSuccess(orderId);
        };

        window.payhere.onDismissed = function onDismissed() {
          console.log("Payment dismissed");
          setPaymentError("Payment was cancelled");
          setSubmitting(false);
          onPaymentError("Payment was cancelled");
        };

        window.payhere.onError = function onError(error) {
          console.log("Error:" + error);
          setPaymentError("Payment failed: " + error);
          setSubmitting(false);
          onPaymentError("Payment failed: " + error);
        };

        // PayHere payment initiation with backend response
        const paymentDetails = {
          sandbox: paymentData.sandbox || true,
          merchant_id: paymentData.merchant_id,
          return_url: paymentData.return_url,
          cancel_url: paymentData.cancel_url,
          notify_url: paymentData.notify_url,
          order_id: paymentData.order_id,
          items: paymentData.items,
          amount: paymentData.amount,
          currency: paymentData.currency,
          hash: paymentData.hash, // Important: Hash from backend
          first_name: paymentData.first_name,
          last_name: paymentData.last_name,
          email: paymentData.email,
          phone: paymentData.phone,
          address: paymentData.address,
          city: paymentData.city,
          country: paymentData.country,
        };

        console.log('Initiating PayHere payment with details:', paymentDetails);
        window.payhere.startPayment(paymentDetails);

      } else {
        throw new Error(response.data.data?.message || 'Failed to create payment');
      }

    } catch (err) {
      console.error('Payment creation error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Payment failed. Please try again.';
      setPaymentError(errorMessage);
      onPaymentError(errorMessage);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {!payHereLoaded && (
        <div className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
          Loading payment system...
        </div>
      )}

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
          <span className="text-xl font-bold text-primary-600">LKR {(totalAmount).toFixed(2)}</span>
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
        disabled={submitting || !payHereLoaded}
        className="w-full px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {submitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </>
        ) : !payHereLoaded ? (
          'Loading Payment System...'
        ) : (
          `Pay LKR ${(totalAmount).toFixed(2)}`
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
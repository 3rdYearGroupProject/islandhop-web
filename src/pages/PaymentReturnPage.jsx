import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [paymentDetails, setPaymentDetails] = useState({});

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const paymentId = searchParams.get('payment_id');
    const statusCode = searchParams.get('status_code');
    
    // Verify payment status with backend
    const verifyPayment = async () => {
      try {
        const response = await fetch(`http://localhost:8095/api/v1/payments/verify-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            paymentId,
            statusCode
          })
        });

        const data = await response.json();
        
        if (data.success) {
          setPaymentStatus('success');
          setPaymentDetails(data.paymentDetails);
        } else {
          setPaymentStatus('failed');
          setPaymentDetails({ error: data.message });
        }
      } catch (error) {
        setPaymentStatus('failed');
        setPaymentDetails({ error: 'Payment verification failed' });
      }
    };

    if (orderId) {
      verifyPayment();
    } else {
      setPaymentStatus('failed');
      setPaymentDetails({ error: 'Invalid payment parameters' });
    }
  }, [searchParams]);

  const handleContinue = () => {
    if (paymentStatus === 'success') {
      navigate('/trips', { state: { paymentSuccess: true } });
    } else {
      navigate('/trips');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          {paymentStatus === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h2>
              <p className="text-gray-600">Please wait while we verify your payment...</p>
            </>
          )}

          {paymentStatus === 'success' && (
            <>
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your payment has been processed successfully. You can now complete your trip booking.
              </p>
              {paymentDetails.orderId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    <strong>Order ID:</strong> {paymentDetails.orderId}
                  </p>
                  {paymentDetails.amount && (
                    <p className="text-sm text-gray-600">
                      <strong>Amount:</strong> LKR {paymentDetails.amount}
                    </p>
                  )}
                </div>
              )}
              <button
                onClick={handleContinue}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                Continue to Trip Booking
              </button>
            </>
          )}

          {paymentStatus === 'failed' && (
            <>
              <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h2>
              <p className="text-gray-600 mb-6">
                {paymentDetails.error || 'Your payment could not be processed. Please try again.'}
              </p>
              <button
                onClick={handleContinue}
                className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
              >
                Back to Trip Booking
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentReturnPage;
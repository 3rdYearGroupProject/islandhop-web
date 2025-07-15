import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  const handleBackToBooking = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <XCircleIcon className="h-16 w-16 text-orange-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Cancelled</h2>
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. You can try again or continue with your booking process.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleBackToBooking}
              className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Trip Booking
            </button>
            <button
              onClick={() => navigate('/trips')}
              className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              My Trips
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentCancelPage;
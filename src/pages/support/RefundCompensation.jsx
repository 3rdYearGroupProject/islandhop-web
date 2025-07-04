import React, { useState } from 'react';
import { 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const RefundCompensation = () => {
  const [mockTickets] = useState([
    {
      id: 'BK-20250621-0012',
      complaint: 'Driver did not arrive at pickup location. Tourist waited for 30 minutes and had to book another ride.',
      user: {
        name: 'Ayesha Fernando',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        email: 'ayesha.fernando@email.com',
        phone: '+94 77 123 4567',
      },
      date: '2025-06-21',
      status: 'pending',
      amount: 'LKR 2,500.00',
    },
    {
      id: 'BK-20250618-0045',
      complaint: 'Vehicle was not as described. No AC and not clean.',
      user: {
        name: 'Ruwan Silva',
        avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
        email: 'ruwan.silva@email.com',
        phone: '+94 76 987 6543',
      },
      date: '2025-06-18',
      status: 'pending',
      amount: 'LKR 1,200.00',
    },
  ]);

  const [selectedBooking, setSelectedBooking] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const ticket = mockTickets.find((t) => t.id === selectedBooking);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBooking || !eligibility) {
      alert('Please select a booking and eligibility status');
      return;
    }

    setProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      alert(`Refund ${eligibility === 'eligible' ? 'approved and processed' : 'denied'}!`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Refund & Compensation
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Process refund requests and compensation claims
        </p>
      </div>

      {processed && (
        <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-success-600 dark:text-success-400" />
            <div>
              <h3 className="text-sm font-medium text-success-800 dark:text-success-300">
                Refund Processed Successfully
              </h3>
              <p className="text-sm text-success-700 dark:text-success-400 mt-1">
                The refund request has been processed and the customer will be notified.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Selection */}
            <div>
              <label htmlFor="booking" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Booking/Complaint <span className="text-danger-500">*</span>
              </label>
              <select
                id="booking"
                value={selectedBooking}
                onChange={(e) => setSelectedBooking(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 px-3 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                disabled={processed}
              >
                <option value="">Choose a booking to process refund</option>
                {mockTickets.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>
                    {ticket.id} - {ticket.user.name} - {ticket.amount}
                  </option>
                ))}
              </select>
            </div>

            {/* Complaint Summary */}
            {ticket && (
              <div className="bg-gray-50 dark:bg-secondary-700 rounded-xl p-4 border border-gray-200 dark:border-secondary-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Complaint Summary
                </h3>
                
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={ticket.user.avatar}
                    alt={ticket.user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-secondary-600"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {ticket.user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {ticket.user.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {ticket.user.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Booking ID:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{ticket.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{ticket.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{ticket.amount}</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-gray-600 dark:text-gray-400">Complaint:</span>
                    <p className="text-gray-900 dark:text-white mt-1">{ticket.complaint}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Eligibility Assessment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Refund Eligibility <span className="text-danger-500">*</span>
              </label>
              <div className="flex space-x-6">
                <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  eligibility === 'eligible' 
                    ? 'border-success-300 bg-success-50 dark:border-success-600 dark:bg-success-900/20' 
                    : 'border-gray-300 dark:border-secondary-600 hover:border-gray-400 dark:hover:border-secondary-500'
                }`}>
                  <input
                    type="radio"
                    name="eligibility"
                    value="eligible"
                    checked={eligibility === 'eligible'}
                    onChange={(e) => setEligibility(e.target.value)}
                    className="text-success-600 focus:ring-success-500"
                    disabled={processed}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Eligible for Refund</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Customer meets refund criteria</p>
                  </div>
                </label>

                <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  eligibility === 'not-eligible' 
                    ? 'border-danger-300 bg-danger-50 dark:border-danger-600 dark:bg-danger-900/20' 
                    : 'border-gray-300 dark:border-secondary-600 hover:border-gray-400 dark:hover:border-secondary-500'
                }`}>
                  <input
                    type="radio"
                    name="eligibility"
                    value="not-eligible"
                    checked={eligibility === 'not-eligible'}
                    onChange={(e) => setEligibility(e.target.value)}
                    className="text-danger-600 focus:ring-danger-500"
                    disabled={processed}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Not Eligible</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Does not meet refund criteria</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing || processed || !selectedBooking || !eligibility}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : processed ? (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Processed
                  </>
                ) : (
                  <>
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    Process Refund
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RefundCompensation;

import React, { useState } from 'react';
import { X, MapPin, Car, Calendar, CreditCard } from 'lucide-react';
import PaymentForm from './PaymentForm';

const TripCompletionModal = ({ 
  isOpen, 
  onClose, 
  tripData, 
  totalDistance, 
  totalDays, 
  startMeterReading, 
  endMeterReading 
}) => {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculate cost breakdown
  const fuelCostPerKm = 25; // LKR per km
  const dailyDriverRate = 5000; // LKR per day
  const fuelCost = totalDistance * fuelCostPerKm;
  const driverCost = totalDays * dailyDriverRate;
  const serviceFee = (fuelCost + driverCost) * 0.1; // 10% service fee
  const totalAmount = fuelCost + driverCost + serviceFee;

  const handlePaymentSuccess = (orderId) => {
    console.log('Trip payment successful:', orderId);
    // Handle successful payment - could close modal, show success message, etc.
    onClose();
    // You might want to navigate somewhere or update trip status
  };

  const handlePaymentError = (error) => {
    console.error('Trip payment error:', error);
    // Handle payment error
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Trip Completed!</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Trip Summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-green-800 mb-2">
                Congratulations! Your {totalDays}-day trip has been completed.
              </h4>
              <p className="text-green-700">
                You've traveled {totalDistance} km and experienced amazing destinations. 
                Please complete the payment to finalize your trip.
              </p>
            </div>

            {/* Trip Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Car className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Total Distance</p>
                <p className="text-lg font-bold text-gray-900">{totalDistance} km</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Trip Duration</p>
                <p className="text-lg font-bold text-gray-900">{totalDays} days</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Destinations</p>
                <p className="text-lg font-bold text-gray-900">{tripData?.destinations?.length || 'Multiple'}</p>
              </div>
            </div>

            {/* Odometer Readings */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Odometer Readings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Start Reading</p>
                  <p className="text-lg font-semibold text-gray-900">{startMeterReading} km</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">End Reading</p>
                  <p className="text-lg font-semibold text-gray-900">{endMeterReading} km</p>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h4 className="text-lg font-semibold text-gray-900">Cost Breakdown</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Fuel Cost</p>
                    <p className="text-sm text-gray-500">{totalDistance} km × LKR {fuelCostPerKm}/km</p>
                  </div>
                  <span className="font-semibold text-gray-900">LKR {fuelCost.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Driver Service</p>
                    <p className="text-sm text-gray-500">{totalDays} days × LKR {dailyDriverRate.toLocaleString()}/day</p>
                  </div>
                  <span className="font-semibold text-gray-900">LKR {driverCost.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Service Fee</p>
                    <p className="text-sm text-gray-500">10% platform fee</p>
                  </div>
                  <span className="font-semibold text-gray-900">LKR {serviceFee.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 bg-primary-50 -mx-4 px-4 rounded">
                  <div>
                    <p className="text-lg font-bold text-primary-900">Total Amount</p>
                    <p className="text-sm text-primary-700">Final payment due</p>
                  </div>
                  <span className="text-xl font-bold text-primary-900">LKR {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Complete Payment</h4>
              <PaymentForm
                totalAmount={totalAmount}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                submitting={submitting}
                setSubmitting={setSubmitting}
                tripId={tripData?.id}
                tripData={tripData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCompletionModal;

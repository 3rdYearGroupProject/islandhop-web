import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Car, Calendar, CreditCard, User, Users, DollarSign, Heart, Calculator } from 'lucide-react';
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
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [chargeData, setChargeData] = useState(null);
  const [driverTip, setDriverTip] = useState(0);
  const [guideTip, setGuideTip] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [calculatedCosts, setCalculatedCosts] = useState({
    vehicleCost: 0,
    driverCost: 0,
    guideCost: 0,
    systemCharge: 0,
    totalCost: 0
  });

  // Calculate total distance from meter readings
  const calculateTotalDistance = () => {
    if (!tripData?.dailyPlans) return 0;
    
    let totalDist = 0;
    tripData.dailyPlans.forEach(plan => {
      if (plan.start_meter_read && plan.end_meter_read) {
        const dayDistance = plan.end_meter_read - plan.start_meter_read - (plan.deduct_amount || 0);
        totalDist += Math.max(0, dayDistance); // Ensure no negative distances
      }
    });
    
    return totalDist;
  };

  const calculatedTotalDistance = calculateTotalDistance();

  // Fetch vehicle types and charge data
  useEffect(() => {
    if (isOpen) {
      fetchVehicleTypesAndCharges();
    }
  }, [isOpen]);

  // Calculate costs when data is available
  useEffect(() => {
    if (vehicleTypes.length > 0 && chargeData && tripData) {
      calculateCosts();
    }
  }, [vehicleTypes, chargeData, tripData, driverTip, guideTip, calculatedTotalDistance]);

  const fetchVehicleTypesAndCharges = async () => {
    setIsLoading(true);
    try {
      // Fetch vehicle types
      const vehicleResponse = await fetch('http://localhost:8091/api/v1/admin/vehicle-types');
      const vehicleData = await vehicleResponse.json();
      
      // Fetch charges
      const chargeResponse = await fetch('http://localhost:4013/charges/get');
      const chargeResult = await chargeResponse.json();
      
      if (vehicleData.status === 'success') {
        setVehicleTypes(vehicleData.data);
      }
      
      if (chargeResult.success) {
        setChargeData(chargeResult.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCosts = () => {
    if (!tripData || !chargeData || vehicleTypes.length === 0) {
      // Set default values when data is not available
      setCalculatedCosts({
        vehicleCost: 0,
        baseDriverCost: 0,
        baseGuideCost: 0,
        driverCost: 0,
        guideCost: 0,
        systemCharge: 0,
        totalCost: 0,
        tripDays: 1,
        vehicleType: null
      });
      return;
    }

    // Find matching vehicle type
    const vehicleType = vehicleTypes.find(v => 
      v.typeName.toLowerCase() === tripData.vehicleType?.toLowerCase()
    );
    
    if (!vehicleType) {
      console.warn('Vehicle type not found:', tripData.vehicleType);
      // Set default values when vehicle type is not found
      setCalculatedCosts({
        vehicleCost: 0,
        baseDriverCost: 0,
        baseGuideCost: 0,
        driverCost: 0,
        guideCost: 0,
        systemCharge: 0,
        totalCost: 0,
        tripDays: 1,
        vehicleType: null
      });
      return;
    }

    // Calculate trip duration in days
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(tripData.endDate);
    const tripDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);

    // Calculate costs with proper fallbacks
    const vehicleCost = (calculatedTotalDistance || 0) * (vehicleType.pricePerKm || 0);
    const baseDriverCost = tripData.driverNeeded ? (chargeData.driverDailyCharge || 0) * tripDays : 0;
    const baseGuideCost = tripData.guideNeeded ? (chargeData.guideDailyCharge || 0) * tripDays : 0;
    const driverCost = baseDriverCost + parseFloat(driverTip || 0);
    const guideCost = baseGuideCost + parseFloat(guideTip || 0);
    const subtotal = vehicleCost + driverCost + guideCost;
    const systemCharge = subtotal * ((chargeData.systemChargePercentage || 0) / 100);
    const totalCost = subtotal + systemCharge;

    setCalculatedCosts({
      vehicleCost: vehicleCost || 0,
      baseDriverCost: baseDriverCost || 0,
      baseGuideCost: baseGuideCost || 0,
      driverCost: driverCost || 0,
      guideCost: guideCost || 0,
      systemCharge: systemCharge || 0,
      totalCost: totalCost || 0,
      tripDays,
      vehicleType
    });
  };

  if (!isOpen) return null;

  const handlePaymentSuccess = async (orderId, paymentAmount) => {
    console.log('Trip payment successful:', orderId, 'Amount:', paymentAmount);
    
    try {
      // Show success message
      setShowSuccessMessage(true);
      
      // Send payment processing request
      const paymentPayload = {
        _id: tripData._id || tripData.id,
        payedAmount: parseFloat(paymentAmount || getRemainingAmount())
      };
      
      const paymentResponse = await fetch('http://localhost:4015/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentPayload)
      });
      
      if (!paymentResponse.ok) {
        throw new Error(`Payment processing failed: ${paymentResponse.status}`);
      }
      
      console.log('Payment processed successfully');

      const promises = [];

      // Driver payment
      if (tripData?.driverNeeded && tripData?.driver_email && calculatedCosts?.driverCost) {
        const driverPayload = {
          tripId: tripData._id || tripData.id,
          driverEmail: tripData.driver_email,
          cost: calculatedCosts.driverCost || 0
        };
        promises.push(
          fetch('http://localhost:4013/driver', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(driverPayload)
          })
        );
      }

      // Guide payment
      if (tripData?.guideNeeded && tripData?.guide_email && calculatedCosts?.guideCost) {
        const guidePayload = {
          tripId: tripData._id || tripData.id,
          guideEmail: tripData.guide_email,
          cost: calculatedCosts.guideCost || 0
        };
        promises.push(
          fetch('http://localhost:4013/guide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guidePayload)
          })
        );
      }

      if (promises.length > 0) {
        await Promise.all(promises);
        console.log('Driver and guide payments processed successfully');
      }
      
      // Redirect after 3 seconds
      setTimeout(() => {
        onClose();
        navigate('/trips');
      }, 3000);
      
    } catch (error) {
      console.error('Error processing payments:', error);
      alert('Payment was successful, but there was an error processing some backend operations. Please contact support if needed.');
      // Still redirect on error
      setTimeout(() => {
        onClose();
        navigate('/trips');
      }, 2000);
    }
  };

  // Extract cities from daily plans
  const getCities = () => {
    if (!tripData?.dailyPlans) return [];
    return [...new Set(tripData.dailyPlans.map(plan => plan.city).filter(Boolean))];
  };

  // Calculate remaining amount due after deducting already paid amount
  const getRemainingAmount = () => {
    const totalCost = calculatedCosts.totalCost || 0;
    const paidAmount = parseFloat(tripData?.payedAmount || 0);
    return Math.max(0, totalCost - paidAmount);
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
            {showSuccessMessage ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
                <p className="text-green-700 mb-4">
                  Your payment has been processed successfully and your trip has been completed.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-600">
                    Driver and guide payments are being processed...
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  You will be redirected to your trips page in a few seconds...
                </p>
                <div className="mt-4">
                  <div className="animate-pulse flex justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading cost calculation...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Trip Summary */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">
                    Congratulations! Your {calculatedCosts.tripDays || totalDays}-day trip has been completed.
                  </h4>
                  <p className="text-green-700">
                    You've traveled {(calculatedTotalDistance || 0).toLocaleString()} km and experienced amazing destinations. 
                    Please complete the payment to finalize your trip.
                  </p>
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Car className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Total Distance</p>
                    <p className="text-lg font-bold text-gray-900">{(calculatedTotalDistance || 0).toLocaleString()} km</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Trip Duration</p>
                    <p className="text-lg font-bold text-gray-900">{calculatedCosts.tripDays || totalDays} days</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Cities Visited</p>
                    <p className="text-lg font-bold text-gray-900">{getCities().length}</p>
                  </div>
                </div>

                {/* Destinations Visited */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-600" />
                    Destinations Visited
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getCities().map((city, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-5 h-5 text-gray-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Cost Breakdown</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Vehicle Cost */}
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Vehicle Cost</p>
                          <p className="text-sm text-gray-500">
                            {calculatedCosts.vehicleType?.typeName || 'N/A'} - {(calculatedTotalDistance || 0)} km × Rs.{calculatedCosts.vehicleType?.pricePerKm || 0}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">Rs.{(calculatedCosts.vehicleCost || 0).toLocaleString()}</span>
                    </div>

                    {/* Driver Cost */}
                    {tripData.driverNeeded && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">Driver Service</p>
                            <p className="text-sm text-gray-500">
                              {calculatedCosts.tripDays || 1} days × Rs.{(chargeData?.driverDailyCharge || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900">Rs.{(calculatedCosts.baseDriverCost || 0).toLocaleString()}</span>
                      </div>
                    )}

                    {/* Guide Cost */}
                    {tripData.guideNeeded && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">Guide Service</p>
                            <p className="text-sm text-gray-500">
                              {calculatedCosts.tripDays || 1} days × Rs.{(chargeData?.guideDailyCharge || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900">Rs.{(calculatedCosts.baseGuideCost || 0).toLocaleString()}</span>
                      </div>
                    )}

                    {/* Tips Section */}
                    <div className="border-t border-gray-200 pt-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        Tips (Optional)
                      </h5>
                      
                      {tripData.driverNeeded && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Driver Tip</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Rs.</span>
                            <input
                              type="number"
                              value={driverTip}
                              onChange={(e) => setDriverTip(e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                        </div>
                      )}
                      
                      {tripData.guideNeeded && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Guide Tip</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Rs.</span>
                            <input
                              type="number"
                              value={guideTip}
                              onChange={(e) => setGuideTip(e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* System Charge */}
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900">System Charge</p>
                          <p className="text-sm text-gray-500">{chargeData?.systemChargePercentage || 0}% platform fee</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">Rs.{(calculatedCosts.systemCharge || 0).toLocaleString()}</span>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-700">Subtotal</span>
                      <span className="font-semibold text-gray-900">Rs.{(calculatedCosts.totalCost || 0).toLocaleString()}</span>
                    </div>

                    {/* Already Paid Amount */}
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">Already Paid</p>
                        <p className="text-sm text-gray-500">Amount paid during booking</p>
                      </div>
                      <span className="font-semibold text-green-600">-Rs.{parseFloat(tripData?.payedAmount || 0).toLocaleString()}</span>
                    </div>
                    
                    {/* Remaining Amount Due */}
                    <div className="flex justify-between items-center py-3 bg-primary-50 -mx-4 px-4 rounded">
                      <div>
                        <p className="text-lg font-bold text-primary-900">Amount Due</p>
                        <p className="text-sm text-primary-700">Remaining payment required</p>
                      </div>
                      <span className="text-xl font-bold text-primary-900">
                        Rs.{getRemainingAmount().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Complete Payment</h4>
                  {getRemainingAmount() > 0 ? (
                    <PaymentForm
                      totalAmount={getRemainingAmount()}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      submitting={submitting}
                      setSubmitting={setSubmitting}
                      tripId={tripData?.id || tripData?._id}
                      tripData={tripData}
                    />
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <p className="text-green-800 font-medium">✅ Payment Complete!</p>
                      <p className="text-sm text-green-700 mt-1">
                        Your trip has been fully paid. No additional payment required.
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          navigate('/trips');
                        }}
                        className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCompletionModal;

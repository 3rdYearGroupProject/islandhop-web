import React, { useState, useEffect } from 'react';
import { X, MapPin, Calculator, Users, Car, User, DollarSign, Heart } from 'lucide-react';

const CompleteTripModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  tripData, 
  totalDistance = 0 
}) => {
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
  }, [vehicleTypes, chargeData, tripData, driverTip, guideTip, totalDistance]);

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
    if (!tripData || !chargeData || vehicleTypes.length === 0) return;

    // Find matching vehicle type
    const vehicleType = vehicleTypes.find(v => 
      v.typeName.toLowerCase() === tripData.vehicleType?.toLowerCase()
    );
    
    if (!vehicleType) {
      console.warn('Vehicle type not found:', tripData.vehicleType);
      return;
    }

    // Calculate trip duration in days
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(tripData.endDate);
    const tripDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    // Calculate costs
    const vehicleCost = totalDistance * vehicleType.pricePerKm;
    const driverCost = (tripData.driverNeeded ? chargeData.driverDailyCharge * tripDays : 0) + parseFloat(driverTip || 0);
    const guideCost = (tripData.guideNeeded ? chargeData.guideDailyCharge * tripDays : 0) + parseFloat(guideTip || 0);
    const subtotal = vehicleCost + driverCost + guideCost;
    const systemCharge = subtotal * (chargeData.systemChargePercentage / 100);
    const totalCost = subtotal + systemCharge;

    setCalculatedCosts({
      vehicleCost,
      driverCost,
      guideCost,
      systemCharge,
      totalCost,
      tripDays,
      vehicleType
    });
  };

  const handleConfirm = async () => {
    // Send payment completion requests
    try {
      const promises = [];

      // Driver payment
      if (tripData.driverNeeded && tripData.driver_email) {
        const driverPayload = {
          tripId: tripData._id,
          driverEmail: tripData.driver_email,
          cost: calculatedCosts.driverCost
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
      if (tripData.guideNeeded && tripData.guide_email) {
        const guidePayload = {
          tripId: tripData._id,
          guideEmail: tripData.guide_email,
          cost: calculatedCosts.guideCost
        };
        promises.push(
          fetch('http://localhost:4013/guide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guidePayload)
          })
        );
      }

      await Promise.all(promises);
      
      onConfirm({
        totalDistance,
        costs: calculatedCosts,
        driverTip,
        guideTip
      });
      onClose();
    } catch (error) {
      console.error('Error processing payments:', error);
      alert('Error processing payments. Please try again.');
    }
  };

  // Extract cities from daily plans
  const getCities = () => {
    if (!tripData?.dailyPlans) return [];
    return [...new Set(tripData.dailyPlans.map(plan => plan.city).filter(Boolean))];
  };

  if (!isOpen) return null;

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
                <Calculator className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Complete Trip</h3>
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
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading cost calculation...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Trip Summary */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Trip Summary</h4>
                  
                  {/* Destinations */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-medium text-gray-700">Destinations Visited</span>
                    </div>
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

                  {/* Total Distance */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Total Distance Traveled</span>
                    <span className="text-lg font-bold text-green-600">{totalDistance.toLocaleString()} km</span>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h4>
                  
                  <div className="space-y-3">
                    {/* Vehicle Cost */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">
                          Vehicle ({calculatedCosts.vehicleType?.typeName}) - {totalDistance} km × Rs.{calculatedCosts.vehicleType?.pricePerKm}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">Rs.{calculatedCosts.vehicleCost.toLocaleString()}</span>
                    </div>

                    {/* Driver Cost */}
                    {tripData.driverNeeded && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">
                            Driver Service ({calculatedCosts.tripDays} days × Rs.{chargeData?.driverDailyCharge})
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          Rs.{((calculatedCosts.driverCost || 0) - parseFloat(driverTip || 0)).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Guide Cost */}
                    {tripData.guideNeeded && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-gray-700">
                            Guide Service ({calculatedCosts.tripDays} days × Rs.{chargeData?.guideDailyCharge})
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          Rs.{((calculatedCosts.guideCost || 0) - parseFloat(guideTip || 0)).toLocaleString()}
                        </span>
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
                    <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-700">System Charge ({chargeData?.systemChargePercentage}%)</span>
                      </div>
                      <span className="font-semibold text-gray-900">Rs.{calculatedCosts.systemCharge.toLocaleString()}</span>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center border-t-2 border-gray-300 pt-3">
                      <span className="text-lg font-bold text-gray-900">Total Cost</span>
                      <span className="text-xl font-bold text-green-600">Rs.{calculatedCosts.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Confirmation Note */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>Note:</strong> Confirming will complete the trip and process payments to the driver and guide.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <Calculator className="w-4 h-4" />
              Complete Trip & Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteTripModal;

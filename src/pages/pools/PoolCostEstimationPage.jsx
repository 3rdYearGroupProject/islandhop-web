import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserData } from '../../utils/userStorage';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PoolProgressBar from '../../components/PoolProgressBar';
import axios from 'axios';

const PoolCostEstimationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    poolName, selectedDates, poolSize, poolPrivacy, poolId, pool, userUid, groupId, tripId, 
    selectedTerrainPreferences, selectedActivityPreferences, destinations, itinerary,
    suggestions, totalSuggestions, hasSuggestions, backendResponse
  } = location.state || {};

  console.log('💰 PoolCostEstimationPage received:', { 
    poolName, selectedDates, poolSize, poolPrivacy, poolId, userUid, groupId, tripId,
    selectedTerrainPreferences, selectedActivityPreferences
  });

  // State for service preferences
  const [needDriver, setNeedDriver] = useState(false);
  const [needGuide, setNeedGuide] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPrices, setFetchingPrices] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [priceError, setPriceError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const userData = getUserData();
  const userId = userData?.uid || user?.uid;

  // Fetch vehicles when driver is needed
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!needDriver) {
        setVehicles([]);
        setSelectedVehicle('');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8091/api/v1/admin/vehicle-types');
        console.log('Vehicle API response:', response.data);
        
        // Handle the correct response structure (response.data.data)
        let vehicleData = [];
        if (response.status === 200 && response.data && response.data.data) {
          vehicleData = Array.isArray(response.data.data) ? response.data.data : [];
        } else if (Array.isArray(response.data)) {
          vehicleData = response.data;
        }
        
        setVehicles(vehicleData);
        
        if (vehicleData.length > 0) {
          setSelectedVehicle(vehicleData[0].typeName);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [needDriver]);

  // Fetch cost breakdown when preferences change
  useEffect(() => {
    const fetchCostBreakdown = async () => {
      // For cost estimation, we don't need tripId - we can use mock data or basic calculation
      if (!userId || (!needDriver && !needGuide)) {
        setPriceData(null);
        return;
      }

      try {
        setFetchingPrices(true);
        setPriceError(null);

        let preferredVehicleTypeId = null;
        if (needDriver && selectedVehicle && Array.isArray(vehicles)) {
          const vehicleObj = vehicles.find(v => v.typeName === selectedVehicle);
          preferredVehicleTypeId = vehicleObj ? vehicleObj.id : null;
          console.log('Selected vehicle for cost breakdown:', { selectedVehicle, vehicleObj, preferredVehicleTypeId });
        }

        // If we have tripId, use the actual API
        if (tripId) {
          const params = {
            userId,
            tripId,
            setGuide: needGuide ? 1 : 0,
            setDriver: needDriver ? 1 : 0,
            ...(preferredVehicleTypeId && { preferredVehicleTypeId })
          };

          const response = await axios.get('http://localhost:8095/api/v1/trips/cost-breakdown', { params });
          setPriceData(response.data);
          console.log('Cost breakdown:', response.data);
        } else {
          // For estimation without tripId, use default rates
          console.log('Using default rates for cost estimation');
          const mockPriceData = {
            averageDriverCost: needDriver ? 15000 : 0, // Default driver cost per day
            averageGuideCost: needGuide ? 12000 : 0    // Default guide cost per day
          };
          setPriceData(mockPriceData);
        }
      } catch (error) {
        console.error('Error fetching cost breakdown:', error);
        
        // Fallback to default rates on API error
        const fallbackPriceData = {
          averageDriverCost: needDriver ? 15000 : 0,
          averageGuideCost: needGuide ? 12000 : 0
        };
        setPriceData(fallbackPriceData);
        setPriceError(null); // Don't show error for fallback
      } finally {
        setFetchingPrices(false);
      }
    };

    fetchCostBreakdown();
  }, [needDriver, needGuide, selectedVehicle, vehicles, tripId, userId]);

  const calculateTotal = () => {
    if (!priceData) return 0;
    return (priceData.averageDriverCost || 0) + (priceData.averageGuideCost || 0);
  };

  const handleInitiateTrip = async () => {
    if (!userId) {
      alert('Please log in to continue.');
      return;
    }

    setSubmitting(true);

    try {
      let actualTripId = tripId;
      let actualGroupId = groupId;

      // If we don't have tripId/groupId, we need to create the group with trip first
      if (!tripId || !groupId) {
        console.log('Creating group with trip...');
        
        const startDate = selectedDates && selectedDates[0] ? 
          selectedDates[0].toISOString().split('T')[0] : null;
        const endDate = selectedDates && selectedDates.length > 1 && selectedDates[1] ? 
          selectedDates[1].toISOString().split('T')[0] : startDate;

        if (!startDate || !endDate) {
          alert('Please select valid travel dates');
          return;
        }

        if (!poolName) {
          alert('Please provide a trip name');
          return;
        }

        if (!poolPrivacy) {
          alert('Pool privacy setting is required.');
          return;
        }

        const requestData = {
          userId: userId,
          userEmail: user?.email || 'user@example.com',
          tripName: poolName,
          startDate: startDate,
          endDate: endDate,
          baseCity: "Colombo",
          groupName: poolName,
          arrivalTime: "14:30",
          multiCityAllowed: true,
          activityPacing: "Normal",
          budgetLevel: "Medium",
          preferredTerrains: selectedTerrainPreferences || [],
          preferredActivities: selectedActivityPreferences || [],
          visibility: poolPrivacy,
          maxMembers: poolSize || 6,
          requiresApproval: false
        };

        const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086/api/v1';
        const apiUrl = `${baseUrl}/groups/with-trip`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(requestData)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log('Group created successfully:', result);

        if (result.status === 'success' && result.groupId && result.tripId) {
          actualTripId = result.tripId;
          actualGroupId = result.groupId;
        } else {
          throw new Error('Failed to create group and trip');
        }
      }

      // Now initiate the trip with service preferences
      let preferredVehicleTypeId = null;
      if (needDriver && selectedVehicle && Array.isArray(vehicles)) {
        const vehicleObj = vehicles.find(v => v.typeName === selectedVehicle);
        preferredVehicleTypeId = vehicleObj ? vehicleObj.id : null;
      }

      const payload = {
        userId,
        tripId: actualTripId,
        preferredVehicleTypeId,
        setGuide: needGuide ? 1 : 0,
        setDriver: needDriver ? 1 : 0
      };

      console.log('Trip initiate payload:', payload);
      console.log('Available vehicles:', vehicles);
      console.log('Selected vehicle name:', selectedVehicle);

      const initiateResponse = await axios.post('http://localhost:8095/api/v1/trips/initiate', payload);
      console.log('Trip initiated successfully:', initiateResponse);
      
      // Continue to trip suggestions page
      navigate('/trip-suggestions', {
        state: {
          // Trip information from location state
          tripId: actualTripId,
          groupId: actualGroupId,
          tripName: poolName,
          startDate: selectedDates?.[0],
          endDate: selectedDates?.[selectedDates.length - 1] || selectedDates?.[0],
          destinations: destinations || [],
          terrains: selectedTerrainPreferences,
          activities: selectedActivityPreferences,
          itinerary: itinerary || [],
          userUid: userId,
          
          // Service preferences from cost estimation
          needDriver,
          needGuide,
          selectedVehicle,
          
          // Detailed cost breakdown
          costBreakdown: {
            averageDriverCost: priceData?.averageDriverCost || 0,
            averageGuideCost: priceData?.averageGuideCost || 0,
            totalCost: calculateTotal(),
            costPerPerson: Math.ceil(calculateTotal() / (poolSize || 1)), // Calculate cost per person
            maxParticipants: poolSize || 1,
            vehicleType: selectedVehicle,
            needDriver,
            needGuide
          },
          
          // Backward compatibility
          estimatedCost: calculateTotal(),
          
          // Suggestions data that was saved from itinerary page
          suggestions: suggestions || [],
          totalSuggestions: totalSuggestions || 0,
          hasSuggestions: hasSuggestions || false,
          backendResponse: backendResponse || {}
        }
      });
    } catch (err) {
      console.error('Error creating trip:', err);
      
      let errorMessage = 'Failed to create trip. Please try again.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/pools/preferences', {
      state: {
        poolName,
        selectedDates,
        poolSize,
        poolPrivacy,
        poolId,
        pool,
        userUid,
        selectedTerrainPreferences,
        selectedActivityPreferences
      }
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <Navbar />
      <PoolProgressBar 
        poolName={poolName} 
        onBack={handleBack} 
        currentStep={4} 
        completedSteps={[1, 2, 3]} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cost Estimation</h1>
          <p className="text-gray-600">
            Select your preferred services to get an estimated cost for your trip
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Preferences */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Preferences</h2>
            
            {/* Driver Option */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Need a Driver?</h3>
                  <p className="text-sm text-gray-600">Professional driver with local knowledge</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needDriver}
                    onChange={(e) => setNeedDriver(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {needDriver && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={loading}
                  >
                    {loading ? (
                      <option>Loading vehicles...</option>
                    ) : Array.isArray(vehicles) && vehicles.length > 0 ? (
                      vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.typeName}>
                          {vehicle.typeName} - {vehicle.seatingCapacity} seats
                        </option>
                      ))
                    ) : (
                      <option>No vehicles available</option>
                    )}
                  </select>
                </div>
              )}
            </div>

            {/* Guide Option */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Need a Tour Guide?</h3>
                  <p className="text-sm text-gray-600">Expert local guide for enhanced experience</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needGuide}
                    onChange={(e) => setNeedGuide(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Cost Breakdown</h2>
            
            {fetchingPrices ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-3 text-gray-600">Calculating costs...</span>
              </div>
            ) : priceError ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">⚠️ Error</div>
                <p className="text-gray-600">{priceError}</p>
              </div>
            ) : priceData ? (
              <div className="space-y-4">
                {needDriver && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <span className="text-gray-900 font-medium">Driver Service</span>
                      {selectedVehicle && (
                        <p className="text-sm text-gray-500">{selectedVehicle}</p>
                      )}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      LKR {(priceData.averageDriverCost || 0).toLocaleString()}
                    </span>
                  </div>
                )}
                
                {needGuide && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-900 font-medium">Tour Guide Service</span>
                    <span className="text-lg font-semibold text-gray-900">
                      LKR {(priceData.averageGuideCost || 0).toLocaleString()}
                    </span>
                  </div>
                )}

                {!needDriver && !needGuide && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Select services above to see cost breakdown</p>
                  </div>
                )}

                {(needDriver || needGuide) && (
                  <div className="pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-gray-900">Total Estimated Cost</span>
                      <span className="text-2xl font-bold text-primary-600">
                        LKR {calculateTotal().toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      * This is an estimated cost. Final pricing may vary based on specific requirements.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Select services to see cost breakdown</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-4 justify-end mt-8">
          <button
            onClick={handleBack}
            className="bg-white border border-primary-600 text-primary-600 px-8 py-3 rounded-full shadow hover:bg-primary-50 font-medium transition-colors"
            disabled={submitting}
          >
            Back
          </button>
          
          <button
            onClick={handleInitiateTrip}
            disabled={submitting}
            className={`px-8 py-3 rounded-full shadow font-medium transition-colors border ${
              !submitting 
                ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700' 
                : 'bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed'
            }`}
          >
            {submitting ? 'Processing...' : 'Continue to Similar Trips'}
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PoolCostEstimationPage;
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Clock, Navigation, CheckCircle, Loader } from 'lucide-react';
import { GOOGLE_MAPS_LIBRARIES } from '../../utils/googleMapsConfig';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px',
};

const BASE_URL = 'http://localhost:3001';

const MapPopupModal = ({ open, onClose, tripId, tripData }) => {
  const [routeData, setRouteData] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // New state for day management
  const [startingDay, setStartingDay] = useState(null);
  const [endingDay, setEndingDay] = useState(null);
  const [showStartDayModal, setShowStartDayModal] = useState(false);
  const [showEndDayModal, setShowEndDayModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [startMeterReading, setStartMeterReading] = useState('');
  const [endMeterReading, setEndMeterReading] = useState('');
  const [deductValue, setDeductValue] = useState('');
  const [dayNote, setDayNote] = useState('');
  
  // New state for ending entire trip
  const [endingTrip, setEndingTrip] = useState(false);
  const [showEndTripModal, setShowEndTripModal] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'MOCK_KEY',
    libraries: GOOGLE_MAPS_LIBRARIES,
    preventGoogleFontsLoading: true
  });

  // Fetch route data when modal opens or use passed tripData
  useEffect(() => {
    if (open && (tripData || tripId)) {
      if (tripData && tripData.dailyPlans) {
        // Use the passed trip data directly to create route data
        const transformedRouteData = transformTripDataToRouteData(tripData);
        setRouteData(transformedRouteData);
        setLastUpdated(new Date().toLocaleTimeString());
      } else if (tripId) {
        // Fallback to fetching from API
        fetchRouteData();
      }
    }
  }, [open, tripId, tripData]);

  // Calculate route when data is available
  useEffect(() => {
    if (routeData && isLoaded) {
      calculateRoute();
    }
  }, [routeData, isLoaded]);

  // Helper functions for day management
  const canStartDay = (dayNumber) => {
    if (!tripData?.dailyPlans) return false;
    
    // First day can always be started
    if (dayNumber == 1) return true;
    
    // For subsequent days, previous day must be end_confirmed
    const previousDay = tripData.dailyPlans.find(day => day.day == dayNumber - 1);
    return previousDay && previousDay.end_confirmed == 1;
  };

  const canEndDay = (dayNumber) => {
    if (!tripData?.dailyPlans) return false;
    
    const currentDay = tripData.dailyPlans.find(day => day.day == dayNumber);
    return currentDay && currentDay.start_confirmed == 1;
  };

  const isDayStarted = (dayNumber) => {
    if (!tripData?.dailyPlans) return false;
    const day = tripData.dailyPlans.find(d => d.day == dayNumber);
    return day && day.start_confirmed == 1;
  };

  const isDayEnded = (dayNumber) => {
    if (!tripData?.dailyPlans) return false;
    const day = tripData.dailyPlans.find(d => d.day == dayNumber);
    return day && day.end_confirmed == 1;
  };

  const areAllDaysCompleted = () => {
    if (!tripData?.dailyPlans || tripData.dailyPlans.length == 0) return false;
    return tripData.dailyPlans.every(day => day.end_confirmed == 1);
  };

  const canEndTrip = () => {
    return areAllDaysCompleted() && !tripData?.ended;
  };

  // Start day function
  const handleStartDay = (dayNumber) => {
    setSelectedDay(dayNumber);
    setStartMeterReading('');
    setShowStartDayModal(true);
  };

  const confirmStartDay = async () => {
    if (!startMeterReading || !selectedDay) {
      setError('Please enter meter reading');
      return;
    }

    try {
      setStartingDay(selectedDay);
      const response = await fetch(`http://localhost:5007/api/trips/start-day-${selectedDay}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: tripId,
          metervalue: parseInt(startMeterReading)
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start day ${selectedDay}: ${response.status}`);
      }

      const result = await response.json();
      console.log('Day started successfully:', result);
      
      // Refresh trip data by calling parent component or refetch
      setShowStartDayModal(false);
      setStartMeterReading('');
      setSelectedDay(null);
      
      // You might want to call a callback to refresh trip data
      if (tripData) {
        // Update local state if possible
        const updatedDay = tripData.dailyPlans.find(d => d.day == selectedDay);
        if (updatedDay) {
          updatedDay.start_confirmed = 1;
          updatedDay.start_meter_read = parseInt(startMeterReading);
        }
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error starting day:', err);
    } finally {
      setStartingDay(null);
    }
  };

  // End day functionality
  const handleEndDay = (dayNumber) => {
    setSelectedDay(dayNumber);
    setEndMeterReading('');
    setDeductValue('');
    setDayNote('');
    setShowEndDayModal(true);
  };

  const confirmEndDay = async () => {
    if (!endMeterReading || !selectedDay) {
      setError('Please enter meter reading');
      return;
    }

    // Double-check that the day has been started before allowing completion
    if (!canEndDay(selectedDay)) {
      setError('Cannot complete day: Day must be started first');
      return;
    }

    try {
      setEndingDay(selectedDay);
      const response = await fetch(`http://localhost:5007/api/trips/end-day-${selectedDay}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: tripId,
          metervalue: parseInt(endMeterReading),
          deductvalue: parseInt(deductValue) || 0,
          note: dayNote || ''
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to end day ${selectedDay}: ${response.status}`);
      }

      const result = await response.json();
      console.log('Day ended successfully:', result);
      
      // Refresh trip data
      setShowEndDayModal(false);
      setEndMeterReading('');
      setDeductValue('');
      setDayNote('');
      setSelectedDay(null);
      
      // Update local state if possible
      if (tripData) {
        const updatedDay = tripData.dailyPlans.find(d => d.day == selectedDay);
        if (updatedDay) {
          updatedDay.end_confirmed = 1;
          updatedDay.end_meter_read = parseInt(endMeterReading);
          updatedDay.deduct_amount = parseInt(deductValue) || 0;
          updatedDay.additional_note = dayNote || '';
        }
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error ending day:', err);
    } finally {
      setEndingDay(null);
    }
  };

  // End trip functionality
  const handleEndTrip = () => {
    setShowEndTripModal(true);
  };

  const confirmEndTrip = async () => {
    if (!canEndTrip()) {
      setError('Cannot end trip: All days must be completed first');
      return;
    }

    try {
      setEndingTrip(true);
      const response = await fetch(`http://localhost:5007/api/trips/end-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: tripId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to end trip: ${response.status}`);
      }

      const result = await response.json();
      console.log('Trip ended successfully:', result);
      
      // Close modal and refresh
      setShowEndTripModal(false);
      
      // Update local state if possible
      if (tripData) {
        tripData.ended = 1;
        tripData.endconfirmed = 1;
      }
      
      // Show success message and potentially close the entire modal
      alert('Trip completed successfully!');
      
    } catch (err) {
      setError(err.message);
      console.error('Error ending trip:', err);
    } finally {
      setEndingTrip(false);
    }
  };

  const calculateRoute = useCallback(async () => {
    if (!isLoaded) return;
    
    try {
      setLoading(true);
      
      // Get DirectionsService request parameters from backend
      const response = await fetch(`${BASE_URL}/trips/${tripId}/directions-request`);
      if (!response.ok) {
        throw new Error(`Failed to fetch directions request: ${response.status}`);
      }
      
      const { directionsRequest } = await response.json();
      
      // Use Google Maps DirectionsService (proper way)
      const directionsService = new window.google.maps.DirectionsService();
      
      const result = await new Promise((resolve, reject) => {
        directionsService.route(directionsRequest, (result, status) => {
          if (status == 'OK') {
            resolve(result);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        });
      });
      
      setDirectionsResponse(result);
      setLastUpdated(new Date().toLocaleTimeString());
      
      console.log('✅ Google Maps DirectionsService route loaded successfully');
      console.log('Route summary:', result.routes[0].summary);
      console.log('Total distance:', result.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000 + ' km');
      
    } catch (err) {
      setError(err.message);
      console.error('Error calculating route:', err);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, tripId]);

  // Transform trip data from active trip API to route data format
  const transformTripDataToRouteData = (tripData) => {
    if (!tripData || !tripData.dailyPlans) {
      return null;
    }

    const optimizedRoute = tripData.dailyPlans.map((dayPlan) => {
      const destinations = [];
      
      // Add attractions as destinations
      if (dayPlan.attractions && Array.isArray(dayPlan.attractions)) {
        dayPlan.attractions.forEach((attraction, index) => {
          destinations.push({
            id: `attraction-${dayPlan.day}-${index}`,
            name: attraction.name || 'Attraction',
            category: 'activities',
            completed: false,
            estimatedArrival: null,
            coordinates: attraction.location || null
          });
        });
      }

      return {
        day: dayPlan.day,
        city: dayPlan.city || `Day ${dayPlan.day}`,
        destinations: destinations,
        // Include day status from API
        start_confirmed: dayPlan.start_confirmed,
        end_confirmed: dayPlan.end_confirmed,
        start_meter_read: dayPlan.start_meter_read,
        end_meter_read: dayPlan.end_meter_read,
        deduct_amount: dayPlan.deduct_amount,
        additional_note: dayPlan.additional_note
      };
    });

    // Calculate approximate total distance and duration
    const totalDistance = Math.round(tripData.averageTripDistance || 0);
    const totalDuration = Math.ceil(totalDistance / 60); // Assume 60 km/h average

    return {
      optimizedRoute: optimizedRoute,
      totalDistance: `${totalDistance} km`,
      totalDuration: `${totalDuration} hours`,
      currentPosition: {
        lat: 6.9271, // Default to Colombo, Sri Lanka
        lng: 79.8612
      }
    };
  };

  const fetchRouteData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch only route data for destination management
      const response = await fetch(`${BASE_URL}/trips/${tripId}/optimized-route`);

      if (!response.ok) {
        throw new Error(`Failed to fetch route data: ${response.status}`);
      }
      
      const routeData = await response.json();
      setRouteData(routeData);
      
      console.log('Route data loaded for destination management');
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching route data:', err);
      setLoading(false);
    }
  };

  const getRouteStatistics = () => {
    if (directionsResponse) {
      const route = directionsResponse.routes[0];
      const totalDistance = route.legs.reduce((total, leg) => total + leg.distance.value, 0);
      const totalDuration = route.legs.reduce((total, leg) => total + leg.duration.value, 0);
      
      return {
        distance: `${(totalDistance / 1000).toFixed(1)} km`,
        duration: `${Math.floor(totalDuration / 3600)}h ${Math.floor((totalDuration % 3600) / 60)}m`,
        summary: route.summary
      };
    }
    return {
      distance: routeData?.totalDistance || 'Calculating...',
      duration: routeData?.totalDuration || 'Calculating...',
      summary: 'Loading route...'
    };
  };

  const getMarkerColor = (category) => {
    switch (category) {
      case 'attraction':
        return '#DC2626'; // Red
      case 'restaurant':
        return '#EA580C'; // Orange
      case 'hotel':
        return '#2563EB'; // Blue
      default:
        return '#6B7280'; // Gray
    }
  };

  if (!open) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-xl shadow-lg p-6 w-[98vw] h-[95vh] mx-2 relative">
          <div className="flex items-center justify-center h-96">
            <Loader className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading Google Maps directions...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-xl shadow-lg p-6 w-[98vw] h-[95vh] mx-2 relative">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="text-2xl">×</span>
          </button>
          <div className="flex items-center justify-center h-96 text-red-600">
            <div className="text-center">
              <p className="text-lg font-semibold">Error loading route data</p>
              <p className="text-sm mt-2">{error}</p>
              <div className="text-xs text-gray-500 mt-2">
                <p>Backend Status: {error.includes('Failed to fetch') ? '❌ Disconnected' : '⚠️ API Error'}</p>
                <p>Expected: http://localhost:3001/trips/{tripId}/directions-request</p>
              </div>
              <button
                onClick={fetchRouteData}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-[98vw] h-[95vh] mx-2 relative overflow-hidden">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-20 bg-white rounded-full p-2 shadow-md"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="text-xl">×</span>
        </button>
        
        <h2 className="text-2xl font-bold mb-4 pr-12">Trip Route Map</h2>
        
        {/* Trip Statistics */}
        {(routeData || directionsResponse) && (
          <div className="flex gap-6 mb-6 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Distance:</span>
              <span className="font-semibold">{getRouteStatistics().distance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Duration:</span>
              <span className="font-semibold">{getRouteStatistics().duration}</span>
            </div>
            {/* Route Type Indicator */}
            <div className="flex items-center gap-2">
              {directionsResponse ? (
                <>
                  <span className="text-green-600">✅</span>
                  <span className="font-medium text-green-600">Google Maps Directions</span>
                </>
              ) : (
                <>
                  <span className="text-gray-600">📍</span>
                  <span className="font-medium text-gray-600">Loading Directions...</span>
                </>
              )}
            </div>
            {/* Route Summary */}
            {directionsResponse && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Via: {getRouteStatistics().summary}</span>
                {lastUpdated && <span>• Updated: {lastUpdated}</span>}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-6 h-[calc(100%-8rem)]">
          {/* Destinations List - 25% - LEFT SIDE */}
          <div className="flex-[0.25] bg-gray-50 rounded-lg p-4 h-full overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">Upcoming Destinations</h3>
            
            {/* End Trip Button - Shows when all days are completed */}
            {canEndTrip() && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-green-800 mb-2 font-medium">🎉 All days completed!</p>
                  <button
                    onClick={handleEndTrip}
                    disabled={endingTrip}
                    className="w-full px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {endingTrip ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Ending Trip...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        End Trip
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* Trip Status when completed */}
            {tripData?.ended == 1 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-sm text-blue-800 font-medium">✅ Trip Completed</p>
                <p className="text-xs text-blue-600 mt-1">This trip has been successfully completed</p>
              </div>
            )}
            
            {routeData?.optimizedRoute?.map((day) => (
              <div key={day.day} className="mb-6 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Day {day.day} - {day.city}
                  </h4>
                  <div className="flex items-center gap-1">
                    {isDayStarted(day.day) && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Started</span>
                    )}
                    {isDayEnded(day.day) && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Completed</span>
                    )}
                  </div>
                </div>

                {/* Day Management Buttons */}
                <div className="flex gap-2 mb-3">
                  {!isDayStarted(day.day) && canStartDay(day.day) && (
                    <button
                      onClick={() => handleStartDay(day.day)}
                      disabled={startingDay == day.day}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {startingDay == day.day ? (
                        <Loader className="h-3 w-3 animate-spin" />
                      ) : (
                        <span>▶️</span>
                      )}
                      Start Day
                    </button>
                  )}
                  
                  {!isDayStarted(day.day) && !canStartDay(day.day) && day.day > 1 && (
                    <button
                      disabled
                      className="px-3 py-1 bg-gray-300 text-gray-500 text-xs rounded cursor-not-allowed"
                      title="Previous day must be completed first"
                    >
                      ⏸️ Waiting
                    </button>
                  )}

                  {isDayStarted(day.day) && !isDayEnded(day.day) && canEndDay(day.day) && (
                    <button
                      onClick={() => handleEndDay(day.day)}
                      disabled={endingDay == day.day}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {endingDay == day.day ? (
                        <Loader className="h-3 w-3 animate-spin" />
                      ) : (
                        <CheckCircle className="h-3 w-3" />
                      )}
                      Mark Complete
                    </button>
                  )}

                  {isDayStarted(day.day) && !isDayEnded(day.day) && !canEndDay(day.day) && (
                    <button
                      disabled
                      className="px-3 py-1 bg-gray-300 text-gray-500 text-xs rounded cursor-not-allowed flex items-center gap-1"
                      title="Day must be started first before it can be completed"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Mark Complete
                    </button>
                  )}
                </div>

                {/* Attractions/Destinations for this day */}
                {day.destinations && day.destinations.length > 0 ? (
                  day.destinations.map((destination) => (
                    <div
                      key={destination.id}
                      className="bg-white rounded-lg p-3 mb-2 border border-gray-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getMarkerColor(destination.category) }}
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {destination.name}
                            </span>
                          </div>
                          
                          <div className="text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="capitalize">{destination.category}</span>
                            </div>
                            {destination.estimatedArrival && (
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                <span>ETA: {destination.estimatedArrival}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 text-xs py-2">
                    No attractions planned for this day
                  </div>
                )}
              </div>
            ))}
            
            {!tripData?.dailyPlans || tripData.dailyPlans.length == 0 ? (
              <div className="text-center text-gray-500 text-sm">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                No trip data available
              </div>
            ) : tripData.ended == 1 ? (
              <div className="text-center text-blue-600 text-sm">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                Trip completed successfully!
              </div>
            ) : areAllDaysCompleted() ? (
              <div className="text-center text-green-600 text-sm">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                All days completed! Ready to end trip.
              </div>
            ) : null}
          </div>

          {/* Map Section - 75% - RIGHT SIDE */}
          <div className="flex-[0.75] h-full">
            {isLoaded && (routeData || directionsResponse) ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={routeData?.currentPosition || { lat: 6.9271, lng: 79.8612 }}
                zoom={7}
              >
                {/* Current Position Marker */}
                {routeData?.currentPosition && (
                  <Marker
                    position={routeData.currentPosition}
                    title="Current Location"
                    icon={{
                      path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                      fillColor: '#3B82F6',
                      fillOpacity: 1,
                      strokeColor: '#FFFFFF',
                      strokeWeight: 3,
                      scale: 10,
                    }}
                  />
                )}
                
                {/* Google Maps DirectionsRenderer */}
                {directionsResponse && (
                  <DirectionsRenderer
                    directions={directionsResponse}
                    options={{
                      suppressMarkers: false,
                      polylineOptions: {
                        strokeColor: '#4285F4',
                        strokeWeight: 6,
                        strokeOpacity: 0.8
                      },
                      markerOptions: {
                        icon: {
                          path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                          fillColor: '#4285F4',
                          fillOpacity: 1,
                          strokeColor: '#FFFFFF',
                          strokeWeight: 2,
                          scale: 6,
                        }
                      }
                    }}
                  />
                )}
              </GoogleMap>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                {loading ? (
                  <div className="text-center">
                    <Loader className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-2" />
                    <span className="text-gray-500">Loading Google Maps directions...</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Map will appear here</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Start Day Modal */}
        {showStartDayModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96 mx-4">
              <h3 className="text-lg font-semibold mb-4">Start Day {selectedDay}</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meter Reading
                </label>
                <input
                  type="number"
                  value={startMeterReading}
                  onChange={(e) => setStartMeterReading(e.target.value)}
                  placeholder="Enter current meter reading"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowStartDayModal(false);
                    setStartMeterReading('');
                    setSelectedDay(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStartDay}
                  disabled={!startMeterReading || startingDay}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {startingDay ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    'Start Day'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* End Day Modal */}
        {showEndDayModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96 mx-4">
              <h3 className="text-lg font-semibold mb-4">Complete Day {selectedDay}</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Meter Reading *
                </label>
                <input
                  type="number"
                  value={endMeterReading}
                  onChange={(e) => setEndMeterReading(e.target.value)}
                  placeholder="Enter end meter reading"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deduct Value (optional)
                </label>
                <input
                  type="number"
                  value={deductValue}
                  onChange={(e) => setDeductValue(e.target.value)}
                  placeholder="Enter deduction amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (optional)
                </label>
                <textarea
                  value={dayNote}
                  onChange={(e) => setDayNote(e.target.value)}
                  placeholder="Enter any notes for this day"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEndDayModal(false);
                    setEndMeterReading('');
                    setDeductValue('');
                    setDayNote('');
                    setSelectedDay(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEndDay}
                  disabled={!endMeterReading || endingDay}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {endingDay ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    'Complete Day'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* End Trip Modal */}
        {showEndTripModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96 mx-4">
              <h3 className="text-lg font-semibold mb-4">🎉 Complete Trip</h3>
              <p className="text-sm text-gray-600 mb-6">
                Congratulations! All days have been completed. Are you sure you want to end this trip?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEndTripModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEndTrip}
                  disabled={endingTrip}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {endingTrip ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Yes, Complete Trip
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPopupModal;

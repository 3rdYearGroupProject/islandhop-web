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
  const [completingDestination, setCompletingDestination] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

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
          if (status === 'OK') {
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

    const optimizedRoute = tripData.dailyPlans.map((day, index) => {
      const destinations = [];
      
      // Add activities as destinations
      if (day.activities) {
        day.activities.forEach(activity => {
          destinations.push({
            id: activity.id || `activity-${index}-${destinations.length}`,
            name: activity.name || activity.title || 'Activity',
            category: 'activities',
            completed: false,
            estimatedArrival: activity.time || null,
            coordinates: activity.coordinates || null
          });
        });
      }

      // Add places to stay as destinations
      if (day.places) {
        day.places.forEach(place => {
          destinations.push({
            id: place.id || `place-${index}-${destinations.length}`,
            name: place.name || 'Place to Stay',
            category: 'places',
            completed: false,
            estimatedArrival: place.checkIn || null,
            coordinates: place.coordinates || null
          });
        });
      }

      // Add food places as destinations
      if (day.food) {
        day.food.forEach(food => {
          destinations.push({
            id: food.id || `food-${index}-${destinations.length}`,
            name: food.name || 'Restaurant',
            category: 'food',
            completed: false,
            estimatedArrival: food.time || null,
            coordinates: food.coordinates || null
          });
        });
      }

      // Add transportation as destinations
      if (day.transportation) {
        day.transportation.forEach(transport => {
          destinations.push({
            id: transport.id || `transport-${index}-${destinations.length}`,
            name: transport.name || 'Transportation',
            category: 'transportation',
            completed: false,
            estimatedArrival: transport.time || null,
            coordinates: transport.coordinates || null
          });
        });
      }

      return {
        day: index + 1,
        city: day.city || day.destination || `Day ${index + 1}`,
        destinations: destinations
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

  const handleDestinationComplete = async (day, destinationType, destinationId) => {
    try {
      setCompletingDestination(destinationId);
      
      const response = await fetch(`${BASE_URL}/trips/${tripId}/completeDestination`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          day,
          destinationType,
          destinationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to complete destination: ${response.status}`);
      }

      // Refresh route data after completion
      await fetchRouteData();
    } catch (err) {
      setError(err.message);
      console.error('Error completing destination:', err);
    } finally {
      setCompletingDestination(null);
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

  const renderDestinationMarkers = () => {
    if (!routeData?.optimizedRoute) return null;

    const markers = [];
    routeData.optimizedRoute.forEach((day) => {
      day.destinations.forEach((destination) => {
        if (!destination.completed) {
          markers.push(
            <Marker
              key={destination.id}
              position={destination.coordinates}
              title={destination.name}
              icon={{
                path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                fillColor: getMarkerColor(destination.category),
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 8,
              }}
              onClick={() => handleDestinationComplete(day.day, destination.category, destination.id)}
            />
          );
        }
      });
    });

    return markers;
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
            
            {routeData?.optimizedRoute?.map((day) => (
              <div key={day.day} className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Day {day.day} - {day.city}
                </h4>
                
                {day.destinations
                  .filter(dest => !dest.completed)
                  .map((destination) => (
                    <div
                      key={destination.id}
                      className="bg-white rounded-lg p-3 mb-2 border border-gray-200"
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
                          
                          <div className="text-xs text-gray-600 mb-2">
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
                      
                      <button
                        onClick={() => handleDestinationComplete(
                          day.day,
                          destination.category,
                          destination.id
                        )}
                        disabled={completingDestination === destination.id}
                        className="w-full px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        {completingDestination === destination.id ? (
                          <Loader className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3 w-3" />
                        )}
                        Mark Complete
                      </button>
                    </div>
                  ))}
              </div>
            ))}
            
            {routeData?.optimizedRoute?.every(day => 
              day.destinations.every(dest => dest.completed)
            ) && (
              <div className="text-center text-gray-500 text-sm">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                All destinations completed!
              </div>
            )}
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
                
                {/* Destination Markers (for additional functionality) */}
                {renderDestinationMarkers()}
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
      </div>
    </div>
  );
};

export default MapPopupModal;

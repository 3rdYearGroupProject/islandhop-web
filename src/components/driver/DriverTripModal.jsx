import React, { useState } from 'react';
import { MapPin, Clock, Users, Star, Camera, Utensils, Bed, Car, Navigation, ChevronDown } from 'lucide-react';

const DriverTripModal = ({ open, onClose, trip }) => {
  const [expandedDays, setExpandedDays] = useState({});
  
  if (!open || !trip) return null;

  // Use actual trip data from dailyPlans if available, otherwise use mock data
  const itineraryData = trip.dailyPlans && Array.isArray(trip.dailyPlans) && trip.dailyPlans.length > 0 ? 
    trip.dailyPlans.reduce((acc, day, index) => {
      
      // Transform attractions array into categorized arrays
      const activities = [];
      const places = [];
      const food = [];
      const transportation = [];
      
      if (day.attractions && Array.isArray(day.attractions)) {
        day.attractions.forEach(attraction => {
          const item = {
            id: attraction.id || Math.random(),
            name: attraction.name,
            location: typeof attraction.location === 'object' 
              ? `${attraction.location.lat}, ${attraction.location.lng}`
              : attraction.location || 'Location not specified',
            rating: attraction.rating,
            type: attraction.type,
            description: attraction.description || `Visit ${attraction.name}`
          };
          
          // Categorize based on type
          switch (attraction.type?.toLowerCase()) {
            case 'activity':
            case 'attraction':
              activities.push(item);
              break;
            case 'place':
            case 'accommodation':
              places.push(item);
              break;
            case 'food':
            case 'restaurant':
              food.push(item);
              break;
            case 'transport':
            case 'transportation':
              transportation.push(item);
              break;
            default:
              // Default to activities if type is unclear
              activities.push(item);
          }
        });
      }
      
      acc[index] = {
        date: new Date(day.date || trip.startDate),
        city: day.city || day.destination || `Day ${index + 1}`,
        activities: activities,
        places: places,
        food: food,
        transportation: transportation
      };
      
      return acc;
    }, {}) :
    // Fallback: Create a basic itinerary structure from available trip data
    {
      0: {
        date: new Date(trip.startDate || Date.now()),
        city: trip.destination || trip.pickupLocation || 'Trip Location',
        activities: [
          {
            id: 1,
            name: 'Trip to ' + (trip.destination || 'destination'),
            location: trip.destination || 'Various locations',
            duration: trip.estimatedTime || '2-3 hours',
            rating: 4.5,
            description: 'Driver service for your planned trip',
            price: `LKR ${trip.fare || 0}`,
            time: '09:00'
          }
        ],
        places: trip.destination ? [
          {
            id: 1,
            name: 'Destination Area',
            location: trip.destination,
            price: `LKR ${trip.fare || 0}/trip`,
            rating: 4.0,
            reviews: 50,
            description: 'Your planned destination',
            checkIn: '15:00',
            checkOut: '11:00'
          }
        ] : [],
        food: [
          {
            id: 1,
            name: 'Local Restaurant',
            location: trip.destination || 'Destination',
            cuisine: 'Sri Lankan',
            rating: 4.3,
            reviews: 75,
            description: 'Authentic local cuisine',
            priceRange: 'LKR 500-1000',
            time: '12:00'
          }
        ],
        transportation: [
          {
            id: 1,
            name: trip.vehicleType || 'Private Vehicle',
            type: trip.vehicleType || 'Car',
            price: `LKR ${trip.fare || 0}`,
            rating: 4.5,
            description: `${trip.distance || 'Full'} trip transportation`,
            time: '08:00',
            duration: trip.estimatedTime || '1 day'
          }
        ]
      }
    };

  const toggleDay = (dayIndex) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'activities': return <Camera className="w-4 h-4 text-primary-600" />;
      case 'food': return <Utensils className="w-4 h-4 text-orange-600" />;
      case 'places': return <Bed className="w-4 h-4 text-green-600" />;
      case 'transportation': return <Car className="w-4 h-4 text-blue-600" />;
      default: return <MapPin className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold z-10"
          >
            &times;
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">Active Trip</span>
                <span className="text-white/80 text-sm">#{trip.id}</span>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-white drop-shadow">
                {trip.tripName || `Trip to ${trip.destination}`}
              </h1>
              <div className="flex items-center text-white/90 mb-2">
                <MapPin className="h-5 w-5 mr-2 text-blue-200" />
                <span className="text-lg font-medium">{trip.pickupLocation} → {trip.destination}</span>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center text-blue-100">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">{trip.passenger}</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{trip.estimatedTime}</span>
                </div>
                <span className="px-3 py-1 bg-green-100/80 text-green-900 text-xs rounded-full font-semibold">LKR {trip.fare}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Trip Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Passenger Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Passenger Information</h3>
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{trip.passenger}</p>
                    <p className="text-sm text-gray-600">{trip.passengerPhone || '+94 77 000 0000'}</p>
                    
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Trip Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Distance:</span>
                    <span className="font-medium">{trip.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="font-medium">{trip.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Start Time:</span>
                    <span className="font-medium">{trip.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                      {trip.status === 'in_progress' ? 'In Progress' : trip.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tourist's Planned Activities */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tourist's Planned Activities</h2>
              
              <div className="space-y-4">
                {Object.entries(itineraryData).length > 0 ? (
                  Object.entries(itineraryData).map(([dayIndex, dayData]) => (
                  <div key={dayIndex} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <button
                      onClick={() => toggleDay(dayIndex)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary-600 font-bold">{parseInt(dayIndex) + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Day {parseInt(dayIndex) + 1}
                          </h3>
                          <p className="text-sm text-gray-600">{formatDate(dayData.date)}</p>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedDays[dayIndex] ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>

                    {expandedDays[dayIndex] && (
                      <div className="px-4 pb-4">
                        <div className="border-t border-gray-100 pt-4">
                          {/* Activities */}
                          {dayData.activities?.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                {getCategoryIcon('activities')}
                                <span className="ml-2">Activities</span>
                              </h4>
                              <div className="space-y-2">
                                {dayData.activities.map((activity) => (
                                  <div key={activity.id} className="bg-primary-50 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-1">
                                      <h5 className="font-medium text-gray-900">{activity.name}</h5>
                                      <span className="text-sm text-primary-600 font-medium">{activity.price}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                                      <span>📍 {typeof activity.location === 'object' ? `${activity.location.lat}, ${activity.location.lng}` : activity.location}</span>
                                      <span>⏱️ {activity.duration}</span>
                                      <span>🕐 {activity.time}</span>
                                      <span>⭐ {activity.rating}/5</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Food */}
                          {dayData.food?.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                {getCategoryIcon('food')}
                                <span className="ml-2">Dining</span>
                              </h4>
                              <div className="space-y-2">
                                {dayData.food.map((restaurant) => (
                                  <div key={restaurant.id} className="bg-orange-50 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-1">
                                      <h5 className="font-medium text-gray-900">{restaurant.name}</h5>
                                      <span className="text-sm text-orange-600 font-medium">{restaurant.priceRange}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{restaurant.description}</p>
                                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                                      <span>📍 {typeof restaurant.location === 'object' ? `${restaurant.location.lat}, ${restaurant.location.lng}` : restaurant.location}</span>
                                      <span>🍽️ {restaurant.cuisine}</span>
                                      <span>🕐 {restaurant.time}</span>
                                      <span>⭐ {restaurant.rating}/5 ({restaurant.reviews} reviews)</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Accommodation */}
                          {dayData.places?.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                {getCategoryIcon('places')}
                                <span className="ml-2">Accommodation</span>
                              </h4>
                              <div className="space-y-2">
                                {dayData.places.map((place) => (
                                  <div key={place.id} className="bg-green-50 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-1">
                                      <h5 className="font-medium text-gray-900">{place.name}</h5>
                                      <span className="text-sm text-green-600 font-medium">{place.price}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{place.description}</p>
                                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                                      <span>📍 {typeof place.location === 'object' ? `${place.location.lat}, ${place.location.lng}` : place.location}</span>
                                      <span>🏨 Check-in: {place.checkIn}</span>
                                      <span>🚪 Check-out: {place.checkOut}</span>
                                      <span>⭐ {place.rating}/5 ({place.reviews} reviews)</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Transportation */}
                          {dayData.transportation?.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                {getCategoryIcon('transportation')}
                                <span className="ml-2">Transportation</span>
                              </h4>
                              <div className="space-y-2">
                                {dayData.transportation.map((transport) => (
                                  <div key={transport.id} className="bg-blue-50 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-1">
                                      <h5 className="font-medium text-gray-900">{transport.name}</h5>
                                      <span className="text-sm text-blue-600 font-medium">{transport.price}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{transport.description}</p>
                                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                                      <span>🚗 {transport.type}</span>
                                      <span>⏱️ {transport.duration}</span>
                                      <span>🕐 {transport.time}</span>
                                      <span>⭐ {transport.rating}/5</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Show message if no itinerary data is available */}
                          {(!dayData.activities || dayData.activities.length === 0) &&
                           (!dayData.food || dayData.food.length === 0) &&
                           (!dayData.places || dayData.places.length === 0) &&
                           (!dayData.transportation || dayData.transportation.length === 0) && (
                            <div className="text-center py-6">
                              <div className="text-gray-400 mb-2">📋</div>
                              <p className="text-gray-500 text-sm">
                                No detailed itinerary available for this day.
                              </p>
                              <p className="text-gray-400 text-xs mt-1">
                                The tourist hasn't added specific activities yet.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">🗺️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Itinerary Available</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      The tourist hasn't created a detailed itinerary for this trip yet. 
                      You can still provide transportation services based on the pickup and destination locations.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                <Navigation className="w-4 h-4 mr-2" />
                Navigate to Pickup
              </button>
              {/* <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                Call Passenger
              </button> */}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverTripModal;
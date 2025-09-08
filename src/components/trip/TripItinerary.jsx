import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin, Clock, Star, Users } from 'lucide-react';
import { getCityImageUrl } from '../../utils/imageUtils';

const TripItinerary = ({ 
  dailyPlans, 
  itineraryCollapsed, 
  setItineraryCollapsed,
  expandedDays,
  setExpandedDays,
  setSelectedMarker,
  setShowTravelersModal,
  setSelectedDestination 
}) => {
  const itineraryRef = useRef(null);
  const [itineraryMaxHeight, setItineraryMaxHeight] = useState('none');
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation for itinerary collapse/expand
  useEffect(() => {
    if (!itineraryRef.current) return;
    
    if (itineraryCollapsed) {
      setItineraryMaxHeight(`${itineraryRef.current.scrollHeight}px`);
      setTimeout(() => setItineraryMaxHeight('200px'), 10);
    } else {
      setItineraryMaxHeight(`${itineraryRef.current.scrollHeight}px`);
      setTimeout(() => setItineraryMaxHeight('none'), 500);
    }
  }, [itineraryCollapsed, isAnimating]);

  // Animate on collapse/expand
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [itineraryCollapsed]);

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  const handleExpandDay = (dayIndex) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  const handlePlaceClick = (place, dayNumber) => {
    const markerData = {
      name: place.name,
      location: place.location,
      type: 'Attraction',
      rating: place.rating,
      description: place.description,
      image: place.image,
      dayNumber: dayNumber
    };
    setSelectedMarker(markerData);
  };

  const handleSeeWhoElseIsComing = (destinationName) => {
    setSelectedDestination(destinationName);
    setShowTravelersModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Trip Itinerary</h2>
        <button
          onClick={() => setItineraryCollapsed((prev) => !prev)}
          className="flex items-center text-primary-600 hover:text-primary-700 font-medium px-3 py-1 rounded transition-colors"
          aria-label={itineraryCollapsed ? 'Expand itinerary' : 'Collapse itinerary'}
        >
          {itineraryCollapsed ? 'Expand All' : 'Collapse All'}
          <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${itineraryCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      <div
        ref={itineraryRef}
        className={`relative transition-all duration-500 overflow-hidden${itineraryCollapsed ? ' opacity-70' : ''}`}
        style={{
          maxHeight: itineraryMaxHeight,
        }}
      >
        {itineraryCollapsed ? (
          <div>
            {/* Collapsed view - show summary */}
            {dailyPlans.slice(0, 2).map((dayData, dayIndex) => (
              <div key={dayIndex} className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {dayData.day}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Day {dayData.day}</h3>
                      <p className="text-sm text-gray-600">{dayData.city}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {dayData.attractions?.length || 0} attractions • {dayData.restaurants?.length || 0} restaurants
                  </div>
                </div>
              </div>
            ))}
            {dailyPlans.length > 2 && (
              <div className="text-center py-4 text-gray-500">
                ... and {dailyPlans.length - 2} more days
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 pointer-events-none select-none">
              <span className="text-primary-700 font-semibold text-base mb-1">Itinerary Collapsed</span>
              <span className="text-gray-500 text-xs">Expand to see the full trip plan</span>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {dailyPlans.map((dayData, dayIndex) => (
              <div key={dayIndex} className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4 overflow-hidden">
                {/* Day Header */}
                <div 
                  className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 cursor-pointer hover:from-primary-100 hover:to-primary-200 transition-all"
                  onClick={() => handleExpandDay(dayIndex)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                        {dayData.day}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Day {dayData.day}</h3>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="font-medium">{dayData.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm text-gray-600">
                        <div>{dayData.attractions?.length || 0} attractions</div>
                        <div>{dayData.restaurants?.length || 0} restaurants</div>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-primary-600 transition-transform ${
                          expandedDays[dayIndex] ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </div>
                </div>

                {/* Day Content */}
                {expandedDays[dayIndex] && (
                  <div className="p-4 space-y-6">
                    {/* Attractions */}
                    {dayData.attractions && dayData.attractions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                          Attractions ({dayData.attractions.length})
                        </h4>
                        <div className="grid gap-3">
                          {dayData.attractions.map((attraction, idx) => (
                            <div 
                              key={idx} 
                              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer hover:border-primary-300"
                              onClick={() => handlePlaceClick(attraction, dayData.day)}
                            >
                              <div className="flex gap-3">
                                {attraction.image && (
                                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                      src={attraction.image}
                                      alt={attraction.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.src = getCityImageUrl(dayData.city);
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h5 className="font-medium text-gray-900 truncate">{attraction.name}</h5>
                                    {attraction.rating && (
                                      <div className="flex items-center text-sm">
                                        <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                                        <span>{attraction.rating}</span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{attraction.description}</p>
                                  <div className="flex items-center justify-between">
                                    {attraction.time && (
                                      <div className="flex items-center text-xs text-gray-500">
                                        <Clock className="w-3 h-3 mr-1" />
                                        <span>{attraction.time}</span>
                                      </div>
                                    )}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSeeWhoElseIsComing(attraction.name);
                                      }}
                                      className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                                    >
                                      <Users className="w-3 h-3" />
                                      Who's coming?
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Restaurants */}
                    {dayData.restaurants && dayData.restaurants.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="w-4 h-4 mr-2 text-orange-600">🍽️</span>
                          Restaurants ({dayData.restaurants.length})
                        </h4>
                        <div className="grid gap-3">
                          {dayData.restaurants.map((restaurant, idx) => (
                            <div 
                              key={idx} 
                              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-gray-900">{restaurant.name}</h5>
                                {restaurant.rating && (
                                  <div className="flex items-center text-sm">
                                    <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                                    <span>{restaurant.rating}</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{restaurant.description}</p>
                              {restaurant.time && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>{restaurant.time}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hotels */}
                    {dayData.hotels && dayData.hotels.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="w-4 h-4 mr-2 text-blue-600">🏨</span>
                          Hotels ({dayData.hotels.length})
                        </h4>
                        <div className="grid gap-3">
                          {dayData.hotels.map((hotel, idx) => (
                            <div 
                              key={idx} 
                              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-gray-900">{hotel.name}</h5>
                                {hotel.rating && (
                                  <div className="flex items-center text-sm">
                                    <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                                    <span>{hotel.rating}</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{hotel.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripItinerary;

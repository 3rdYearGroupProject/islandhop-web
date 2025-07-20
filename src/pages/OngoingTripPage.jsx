import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Users, Star, Camera, Bed, Utensils, Car, Calendar, ChevronDown, Clock } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


// For demo, use mock data. Replace with real data as needed.
const ongoingTrip = {
  name: 'Cultural Heritage Tour',
  dates: 'Aug 15 → Aug 25, 2025',
  destination: 'Central Province',
  travelers: 4,
  rating: null,
  memories: 0,
  highlights: ['Kandy Temple', 'Nuwara Eliya'],
  daysLeft: 12,
};

// Demo places for the map

// Mock itinerary data (structure matches ViewTripPage)
const mockItinerary = {
  0: {
    date: new Date('2025-08-15'),
    activities: [
      {
        id: 1,
        name: 'Arrival in Kandy',
        location: 'Kandy',
        duration: '2 hours',
        rating: 4.5,
        description: 'Arrive and check in to hotel',
        price: '$25',
        time: '10:00'
      },
      {
        id: 2,
        name: 'Temple Visit',
        location: 'Kandy Temple',
        duration: '2 hours',
        rating: 4.7,
        description: 'Visit the famous Kandy Temple',
        price: '$10',
        time: '14:00'
      },
      {
        id: 10,
        name: 'Evening Walk by Lake',
        location: 'Kandy Lake',
        duration: '1 hour',
        rating: 4.2,
        description: 'Relaxing walk around the lake',
        price: '$0',
        time: '17:00'
      }
    ],
    places: [
      {
        id: 1,
        name: 'Kandy City Hotel',
        location: 'Kandy',
        price: '$100/night',
        rating: 4.3,
        reviews: 120,
        description: 'Central hotel in Kandy',
        checkIn: '12:00',
        checkOut: '11:00'
      }
    ],
    food: [
      {
        id: 1,
        name: 'Cafe Aroma',
        location: 'Kandy',
        cuisine: 'Sri Lankan',
        rating: 4.6,
        reviews: 200,
        description: 'Authentic local food',
        priceRange: '$10-20',
        time: '19:00'
      },
      {
        id: 11,
        name: 'Royal Bar & Hotel',
        location: 'Kandy',
        cuisine: 'Bar',
        rating: 4.1,
        reviews: 90,
        description: 'Historic bar for drinks',
        priceRange: '$15-30',
        time: '21:00'
      }
    ],
    transportation: [
      {
        id: 1,
        name: 'Airport Transfer',
        type: 'Private Car',
        price: '$30',
        rating: 4.5,
        description: 'Pickup from airport',
        time: '09:00',
        duration: '1 hour'
      }
    ]
  },
  1: {
    date: new Date('2025-08-16'),
    activities: [
      {
        id: 3,
        name: 'Nuwara Eliya Tour',
        location: 'Nuwara Eliya',
        duration: '4 hours',
        rating: 4.8,
        description: 'Explore tea plantations',
        price: '$20',
        time: '10:00'
      },
      {
        id: 12,
        name: 'Gregory Lake Boating',
        location: 'Gregory Lake',
        duration: '2 hours',
        rating: 4.6,
        description: 'Boat ride and lakeside picnic',
        price: '$15',
        time: '15:00'
      }
    ],
    places: [
      {
        id: 2,
        name: 'Grand Hotel',
        location: 'Nuwara Eliya',
        price: '$150/night',
        rating: 4.7,
        reviews: 300,
        description: 'Historic hotel with gardens',
        checkIn: '14:00',
        checkOut: '12:00'
      }
    ],
    food: [
      {
        id: 2,
        name: 'Tea Lounge',
        location: 'Nuwara Eliya',
        cuisine: 'Cafe',
        rating: 4.2,
        reviews: 80,
        description: 'Tea and snacks',
        priceRange: '$5-15',
        time: '13:00'
      },
      {
        id: 13,
        name: 'Salmiya Italian Restaurant',
        location: 'Nuwara Eliya',
        cuisine: 'Italian',
        rating: 4.4,
        reviews: 60,
        description: 'Popular for pizza and pasta',
        priceRange: '$10-25',
        time: '19:00'
      }
    ],
    transportation: [
      {
        id: 2,
        name: 'Kandy to Nuwara Eliya',
        type: 'Train',
        price: '$8',
        rating: 4.9,
        description: 'Scenic train ride',
        time: '08:00',
        duration: '3 hours'
      }
    ]
  },
  2: {
    date: new Date('2025-08-17'),
    activities: [
      {
        id: 4,
        name: 'Horton Plains Hike',
        location: 'Horton Plains',
        duration: '6 hours',
        rating: 4.9,
        description: 'Hike to World’s End and Baker’s Falls',
        price: '$30',
        time: '06:00'
      },
      {
        id: 5,
        name: 'Visit Strawberry Farm',
        location: 'Nuwara Eliya',
        duration: '1 hour',
        rating: 4.3,
        description: 'Pick and taste fresh strawberries',
        price: '$8',
        time: '15:00'
      }
    ],
    places: [
      {
        id: 3,
        name: 'Jetwing St. Andrew’s',
        location: 'Nuwara Eliya',
        price: '$120/night',
        rating: 4.5,
        reviews: 180,
        description: 'Colonial-style hotel',
        checkIn: '14:00',
        checkOut: '12:00'
      }
    ],
    food: [
      {
        id: 3,
        name: 'Grand Indian',
        location: 'Nuwara Eliya',
        cuisine: 'Indian',
        rating: 4.5,
        reviews: 150,
        description: 'Famous for curries',
        priceRange: '$10-20',
        time: '18:00'
      }
    ],
    transportation: [
      {
        id: 3,
        name: 'Private Van',
        type: 'Van',
        price: '$40',
        rating: 4.7,
        description: 'Transport for the day',
        time: '05:30',
        duration: '12 hours'
      }
    ]
  },
  3: {
    date: new Date('2025-08-18'),
    activities: [
      {
        id: 6,
        name: 'Tea Factory Tour',
        location: 'Pedro Tea Estate',
        duration: '2 hours',
        rating: 4.6,
        description: 'Learn about tea production',
        price: '$12',
        time: '09:00'
      }
    ],
    places: [
      {
        id: 4,
        name: 'Araliya Green Hills',
        location: 'Nuwara Eliya',
        price: '$110/night',
        rating: 4.4,
        reviews: 140,
        description: 'Modern hotel with mountain views',
        checkIn: '14:00',
        checkOut: '12:00'
      }
    ],
    food: [
      {
        id: 4,
        name: 'The Pub',
        location: 'Nuwara Eliya',
        cuisine: 'Pub',
        rating: 4.0,
        reviews: 70,
        description: 'Casual pub for dinner',
        priceRange: '$8-18',
        time: '20:00'
      }
    ],
    transportation: [
      {
        id: 4,
        name: 'Tuk Tuk',
        type: 'Tuk Tuk',
        price: '$5',
        rating: 4.2,
        description: 'Short rides in town',
        time: '08:30',
        duration: '1 hour'
      }
    ]
  }
};

const tripProgress = {
  currentDay: 1, // 1-based index for user display, 0-based for code
  totalDays: 2,
};
const mockPlaces = [
  {
    name: 'Kandy Temple',
    type: 'Attraction',
    location: { lat: 7.2936, lng: 80.6411 },
    dayNumber: 1,
    placeType: 'attraction',
    rating: 4.8,
  },
  {
    name: 'Nuwara Eliya',
    type: 'City',
    location: { lat: 6.9497, lng: 80.7891 },
    dayNumber: 2,
    placeType: 'attraction',
    rating: 4.7,
  },
];

const OngoingTripBanner = ({ trip }) => (
  <div className="relative">
    <div className="absolute inset-0 w-full h-[340px] bg-gradient-to-r from-primary-600 to-primary-700 pointer-events-none" style={{ zIndex: 0 }}></div>
    <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-8" style={{ zIndex: 1 }}>
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">Ongoing Trip</span>
            <span className="text-white/80 text-sm">{trip.dates}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 text-white drop-shadow">{trip.name}</h1>
          <div className="flex items-center text-white/90 mb-2">
            <MapPin className="h-5 w-5 mr-2 text-blue-200" />
            <span className="text-lg font-medium">{trip.destination}</span>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center text-blue-100">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">{trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}</span>
            </div>
            {trip.daysLeft && (
              <span className="px-3 py-1 bg-orange-100/80 text-orange-900 text-xs rounded-full font-semibold">{trip.daysLeft} days left</span>
            )}
          </div>
          {trip.highlights && trip.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {trip.highlights.slice(0, 3).map((highlight, idx) => (
                <span key={idx} className="inline-block px-2 py-1 bg-white/20 text-blue-100 text-xs rounded-md">{highlight}</span>
              ))}
              {trip.highlights.length > 3 && (
                <span className="inline-block px-2 py-1 bg-white/10 text-white text-xs rounded-md">+{trip.highlights.length - 3} more</span>
              )}
            </div>
          )}
          <div className="flex items-center gap-6 mt-2">
            {trip.rating && (
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                <span className="font-semibold text-lg text-white">{trip.rating}</span>
              </div>
            )}
            {trip.memories > 0 && (
              <div className="flex items-center">
                <Camera className="h-5 w-5 mr-1 text-blue-200" />
                <span className="font-semibold text-lg text-white">{trip.memories} memories</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);



const days = Object.values(mockItinerary).map(day => day.date);

const OngoingTripPage = () => {
  // Expand all days by default
  const [expandedDays, setExpandedDays] = useState(() => {
    const expanded = {};
    Object.keys(mockItinerary).forEach((k) => { expanded[k] = true; });
    return expanded;
  });
  const [itineraryCollapsed, setItineraryCollapsed] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState(mockPlaces[0]?.location || { lat: 7.8731, lng: 80.7718 });
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
  });

  // Animation for itinerary collapse/expand
  const itineraryRef = useRef(null);
  const [itineraryMaxHeight, setItineraryMaxHeight] = useState('none');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!itineraryRef.current) return;
    if (!isAnimating) {
      // Set maxHeight to current scrollHeight for smooth expand
      setItineraryMaxHeight(itineraryRef.current.scrollHeight + 'px');
    }
  }, [itineraryCollapsed, isAnimating]);

  // Animate on collapse/expand
  useEffect(() => {
    if (!itineraryRef.current) return;
    setIsAnimating(true);
    if (itineraryCollapsed) {
      // Animate to collapsed height
      setItineraryMaxHeight('140px');
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      // Remove maxHeight restriction so it takes required height
      setItineraryMaxHeight('none');
      setIsAnimating(false);
    }
  }, [itineraryCollapsed]);

  const getMarkerIcon = (placeType) => {
    switch (placeType) {
      case 'attraction':
        return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      case 'hotel':
        return 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
      case 'restaurant':
        return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
      default:
        return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="relative z-10">
        <Navbar />
      </div>
      {/* Blue Banner/Header */}
      <div className="relative">
        <div className="absolute inset-0 w-full h-[300px] bg-gradient-to-r from-primary-600 to-primary-700 pointer-events-none" style={{ zIndex: 0 }}></div>
        <div className="relative max-w-7xl mx-auto px-4 pt-40 pb-12" style={{ zIndex: 1 }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">Ongoing Trip</span>
                <span className="text-white/80 text-sm">{ongoingTrip.dates}</span>
              </div>
              <h1 className="text-4xl font-bold mb-2 text-white drop-shadow">{ongoingTrip.name}</h1>
              <p className="text-white/90 text-lg">{ongoingTrip.destination}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Itinerary + Map */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Left: Itinerary, vertical timeline style, collapsible */}
          <div className="w-full md:w-1/2 min-w-0 flex flex-col">
            {/* Trip Progress Card */}
            <div className="mb-4">
              <div className="bg-white border border-primary-200 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full">
                  <h3 className="text-lg font-semibold text-primary-700 mb-1">Trip Progress</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-700 mb-2">
                    <span className="font-medium">{ongoingTrip.name}</span>
                    <span className="text-gray-400">|</span>
                    <span>Day <span className="font-bold">{tripProgress.currentDay}</span> of <span className="font-bold">{tripProgress.totalDays}</span></span>
                    <span className="text-gray-400">|</span>
                    <span>{ongoingTrip.daysLeft} days left</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-1 mb-1">
                    <div
                      className="h-full bg-primary-500 transition-all"
                      style={{ width: `${Math.round((tripProgress.currentDay-1) / tripProgress.totalDays * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Start</span>
                    <span>End</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-semibold">Ongoing</span>
                </div>
              </div>
            </div>

            {/* Today's Details Card */}
            {(() => {
              const todayIdx = tripProgress.currentDay - 1;
              const today = mockItinerary[todayIdx];
              if (!today) return null;
              // Gather all stops in order: transportation, activities, food, places
              const stops = [
                ...(today.transportation?.map(a => ({ ...a, category: 'transportation' })) || []),
                ...(today.activities?.map(a => ({ ...a, category: 'activities' })) || []),
                ...(today.food?.map(a => ({ ...a, category: 'food' })) || []),
                ...(today.places?.map(a => ({ ...a, category: 'places' })) || []),
              ].sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
              return (
                <div className="mb-6">
                  <div className="bg-white border border-blue-200 rounded-lg shadow p-4">
                    <h3 className="text-base font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      Today's Plan: <span className="font-medium text-blue-700 ml-1">{today.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    </h3>
                    <ol className="space-y-2">
                      {stops.length === 0 && (
                        <li className="text-gray-400 italic">No destinations or stops planned for today.</li>
                      )}
                      {(() => {
                        // Highlight previous, current, and next stops
                        const currentIdx = 1; // For demo, highlight the second stop as current
                        return stops.map((stop, idx) => {
                          let highlight = '';
                          if (idx === currentIdx - 1) highlight = 'before';
                          else if (idx === currentIdx) highlight = 'current';
                          else if (idx === currentIdx + 1) highlight = 'next';
                          return (
                            <li
                              key={idx}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all border border-transparent ${
                                highlight === 'current' ? 'bg-blue-100 border-blue-400 shadow font-bold text-blue-900' :
                                highlight === 'before' ? 'bg-gray-50 text-gray-500' :
                                highlight === 'next' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                'hover:bg-blue-50 text-gray-800'
                              }`}
                            >
                              <span className="flex-shrink-0">
                                {stop.category === 'transportation' && <Car className="w-4 h-4 text-blue-600" />}
                                {stop.category === 'activities' && <Camera className="w-4 h-4 text-primary-600" />}
                                {stop.category === 'food' && <Utensils className="w-4 h-4 text-orange-600" />}
                                {stop.category === 'places' && <Bed className="w-4 h-4 text-green-600" />}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="truncate text-base">{stop.name}</span>
                                  {stop.location && <span className="text-gray-500 text-xs">({stop.location})</span>}
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 flex-wrap">
                                  {stop.time && <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{stop.time}</span>}
                                  {stop.duration && <span className="flex items-center"><span className="ml-1">[{stop.duration}]</span></span>}
                                </div>
                              </div>
                              {stop.rating && (
                                <span className="flex items-center text-yellow-500 text-xs font-medium ml-2"><Star className="w-4 h-4 mr-1 fill-yellow-400" />{stop.rating}</span>
                              )}
                              {highlight === 'current' && <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">Current</span>}
                              {highlight === 'next' && <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-white text-xs rounded-full">Next</span>}
                            </li>
                          );
                        });
                      })()}
                    </ol>
                  </div>
                </div>
              );
            })()}
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
            {/* Animated collapse/expand for itinerary */}
            <div
              ref={itineraryRef}
              className={`relative transition-all duration-500 overflow-hidden${itineraryCollapsed ? ' opacity-70' : ''}`}
              style={{
                maxHeight: itineraryMaxHeight,
              }}
            >
              {itineraryCollapsed ? (
                <div>
                  {/* Show only the first day and first item as a preview, faded and compact */}
                  {(() => {
                    const [dayIndex, dayData] = Object.entries(mockItinerary)[0];
                    const hasItems = (dayData.activities?.length || 0) > 0 ||
                      (dayData.places?.length || 0) > 0 ||
                      (dayData.food?.length || 0) > 0 ||
                      (dayData.transportation?.length || 0) > 0;
                    const allItems = [
                      ...(dayData.activities?.map(a => ({ ...a, category: 'activities' })) || []),
                      ...(dayData.places?.map(a => ({ ...a, category: 'places' })) || []),
                      ...(dayData.food?.map(a => ({ ...a, category: 'food' })) || []),
                      ...(dayData.transportation?.map(a => ({ ...a, category: 'transportation' })) || []),
                    ].sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
                    const previewItem = allItems[0];
                    const getCategoryIcon = (category) => {
                      switch(category) {
                        case 'activities': return <Camera className="w-5 h-5 text-primary-600" />;
                        case 'places': return <Bed className="w-5 h-5 text-green-600" />;
                        case 'food': return <Utensils className="w-5 h-5 text-orange-600" />;
                        case 'transportation': return <Car className="w-5 h-5 text-blue-600" />;
                        default: return <MapPin className="w-5 h-5 text-gray-600" />;
                      }
                    };
                    const getCategoryColor = (category) => {
                      switch(category) {
                        case 'activities': return 'bg-primary-50 border-primary-200';
                        case 'places': return 'bg-green-50 border-green-200';
                        case 'food': return 'bg-orange-50 border-orange-200';
                        case 'transportation': return 'bg-blue-50 border-blue-200';
                        default: return 'bg-gray-50 border-gray-200';
                      }
                    };
                    return (
                      <div key={dayIndex} className="border-l-2 border-gray-200 relative opacity-60 pointer-events-none select-none">
                        <div className="flex items-center mb-2 -ml-3">
                          <div className="bg-white border-4 border-primary-600 w-5 h-5 rounded-full"></div>
                          <span className="ml-3 flex items-center text-base font-semibold text-gray-900">Day {parseInt(dayIndex, 10) + 1} - {formatDate(dayData.date)}</span>
                          {hasItems && (
                            <span className="ml-2 text-xs text-gray-500">
                              ({allItems.length} items)
                            </span>
                          )}
                        </div>
                        <div className="ml-6 pb-2">
                          {hasItems && previewItem ? (
                            <div className={`p-2 rounded border ${getCategoryColor(previewItem.category)} flex items-center gap-2`}>
                              {getCategoryIcon(previewItem.category)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-gray-900 truncate text-sm">{previewItem.name}</h4>
                                  {previewItem.time && (
                                    <span className="text-xs text-gray-500 ml-2">{previewItem.time}</span>
                                  )}
                                </div>
                                {previewItem.location && (
                                  <div className="flex items-center text-xs text-gray-600 mt-1">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {previewItem.location}
                                  </div>
                                )}
                                {previewItem.rating && (
                                  <span className="flex items-center text-yellow-500 mt-1">
                                    <Star className="w-4 h-4 mr-1 fill-yellow-400" />
                                    {previewItem.rating}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              <Calendar className="w-6 h-6 mx-auto mb-1 opacity-50" />
                              <p className="text-xs">No activities planned for this day</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                  {/* Overlay with expand prompt */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 pointer-events-none select-none">
                    <span className="text-primary-700 font-semibold text-base mb-1">Itinerary Collapsed</span>
                    <span className="text-gray-500 text-xs">Expand to see the full trip plan</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-0">
                  {Object.entries(mockItinerary).map(([dayIndex, dayData]) => {
                    const isExpanded = expandedDays[dayIndex];
                    const hasItems = (dayData.activities?.length || 0) > 0 ||
                      (dayData.places?.length || 0) > 0 ||
                      (dayData.food?.length || 0) > 0 ||
                      (dayData.transportation?.length || 0) > 0;
                    // Gather all items, add category, and sort by time
                    const allItems = [
                      ...(dayData.activities?.map(a => ({ ...a, category: 'activities' })) || []),
                      ...(dayData.places?.map(a => ({ ...a, category: 'places' })) || []),
                      ...(dayData.food?.map(a => ({ ...a, category: 'food' })) || []),
                      ...(dayData.transportation?.map(a => ({ ...a, category: 'transportation' })) || []),
                    ].sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
                    // Icon and color helpers
                    const getCategoryIcon = (category) => {
                      switch(category) {
                        case 'activities': return <Camera className="w-5 h-5 text-primary-600" />;
                        case 'places': return <Bed className="w-5 h-5 text-green-600" />;
                        case 'food': return <Utensils className="w-5 h-5 text-orange-600" />;
                        case 'transportation': return <Car className="w-5 h-5 text-blue-600" />;
                        default: return <MapPin className="w-5 h-5 text-gray-600" />;
                      }
                    };
                    const getCategoryColor = (category) => {
                      switch(category) {
                        case 'activities': return 'bg-primary-50 border-primary-200';
                        case 'places': return 'bg-green-50 border-green-200';
                        case 'food': return 'bg-orange-50 border-orange-200';
                        case 'transportation': return 'bg-blue-50 border-blue-200';
                        default: return 'bg-gray-50 border-gray-200';
                      }
                    };
                    // Highlight logic: highlight middle item of current day
                    const dayNum = parseInt(dayIndex, 10) + 1;
                    const isCurrentDay = dayNum === tripProgress.currentDay;
                    const isUpcomingDay = dayNum > tripProgress.currentDay;
                    return (
                      <div key={dayIndex} className="border-l-2 border-gray-200 relative">
                        {/* Day Header */}
                        <div className="flex items-center mb-4 -ml-3">
                          <div className="bg-white border-4 border-primary-600 w-6 h-6 rounded-full"></div>
                          <button
                            onClick={() => setExpandedDays(prev => ({ ...prev, [dayIndex]: !prev[dayIndex] }))}
                            className="ml-4 flex items-center text-lg font-semibold text-gray-900 hover:text-primary-600"
                          >
                            Day {parseInt(dayIndex, 10) + 1} - {formatDate(dayData.date)}
                            <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          {hasItems && (
                            <span className="ml-3 text-sm text-gray-500">
                              ({allItems.length} items)
                            </span>
                          )}
                        </div>
                        {/* Day Content */}
                        {isExpanded && (
                          <div className="ml-6 pb-8">
                            {hasItems ? (
                              <div className="space-y-4">
                                {allItems.map((item, itemIndex) => {
                                  // Middle index for current day
                                  let middleIndex = Math.floor((allItems.length - 1) / 2);
                                  const isCurrentItem = isCurrentDay && itemIndex === middleIndex;
                                  const isCompleted = isCurrentDay && itemIndex < middleIndex;
                                  // Mark as completed for all items after the current one in current and upcoming days
                                  const isMarkable = (isCurrentDay && itemIndex > middleIndex) || isUpcomingDay;
                                  return (
                                    <div
                                      key={`${item.category}-${itemIndex}`}
                                      className={`px-4 py-3 rounded-lg border max-w-[520px] relative ${getCategoryColor(item.category)} ${isCurrentItem ? 'ring-2 ring-primary-500 bg-primary-50/80 relative' : ''}`}
                                      style={{ marginLeft: 0 }}
                                    >
                                      {/* Time at true bottom right of card */}
                                      {item.time && (
                                        <span className="absolute bottom-2 right-4 text-sm text-gray-500">{item.time}</span>
                                      )}
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3 flex-1">
                                          {getCategoryIcon(item.category)}
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                              <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                                            </div>
                                            {item.location && (
                                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {item.location}
                                              </div>
                                            )}
                                            {item.description && (
                                              <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-3">
                                              <div className="flex items-center space-x-4 text-sm">
                                                {item.duration && (
                                                  <span className="flex items-center text-gray-500">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {item.duration}
                                                  </span>
                                                )}
                                                {item.rating && (
                                                  <span className="flex items-center text-yellow-500">
                                                    <Star className="w-4 h-4 mr-1 fill-yellow-400" />
                                                    {item.rating}
                                                  </span>
                                                )}
                                                {item.reviews && (
                                                  <span className="text-gray-500">({item.reviews} reviews)</span>
                                                )}
                                              </div>
                                              {/* No time here, handled by absolute at card bottom right */}
                                              <div className="text-right"></div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                          {isCompleted && (
                                            <span className="mb-1 px-2 py-1 bg-green-500 text-white text-xs rounded font-semibold shadow">Completed</span>
                                          )}
                                          {isCurrentItem && (
                                            <span className="ml-4 px-2 py-1 bg-primary-500 text-white text-xs rounded font-semibold shadow">Current</span>
                                          )}
                                          {isMarkable && (
                                            <button
                                              className="ml-4 px-2 py-1 bg-gray-300 hover:bg-green-500 text-gray-700 hover:text-white text-xs rounded font-semibold shadow transition-colors"
                                              style={{ minWidth: '110px' }}
                                              onClick={() => { /* Implement mark as completed logic here */ }}
                                            >
                                              Mark as Completed
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No activities planned for this day</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Chat Interface Card below the whole itinerary */}
            <div className="mt-8">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-primary-700 mb-2">Chat with Driver &amp; Guide</h3>
                <div className="h-56 overflow-y-auto bg-gray-50 rounded p-3 mb-3 flex flex-col gap-2" style={{ minHeight: '180px' }}>
                  {/* Example chat bubbles, replace with real chat logic */}
                  <div className="self-end max-w-[70%]">
                    <div className="bg-blue-100 text-blue-900 px-3 py-2 rounded-lg mb-1 text-sm">Hi, when will we reach the next stop?</div>
                    <div className="text-xs text-gray-400 text-right mr-1">You (Tourist)</div>
                  </div>
                  <div className="self-start max-w-[70%]">
                    <div className="bg-green-100 text-green-900 px-3 py-2 rounded-lg mb-1 text-sm">We will reach in about 30 minutes.</div>
                    <div className="text-xs text-gray-400 ml-1">Driver</div>
                  </div>
                  <div className="self-start max-w-[70%]">
                    <div className="bg-yellow-100 text-yellow-900 px-3 py-2 rounded-lg mb-1 text-sm">Let me know if you want to stop for food!</div>
                    <div className="text-xs text-gray-400 ml-1">Guide</div>
                  </div>
                </div>
                <form className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                    placeholder="Type your message..."
                  />
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded font-semibold text-sm transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
          {/* Right: Map */}
          <div className="w-full md:w-1/2 min-w-0 flex flex-col h-[calc(100vh-160px)] md:sticky top-32">
            <div className="bg-white rounded-xl w-full h-full shadow-lg border border-gray-200 overflow-hidden flex flex-col">
              {isLoaded ? (
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b border-gray-100 shrink-0">
                    <h2 className="font-bold text-lg">Trip Map</h2>
                    <p className="text-sm text-gray-500">Explore your trip destinations</p>
                  </div>
                  <div className="flex-1 min-h-[400px]">
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%', minHeight: '400px' }}
                      center={mapCenter}
                      zoom={10}
                      options={{
                        fullscreenControl: true,
                        streetViewControl: true,
                        mapTypeControl: true,
                        zoomControl: true,
                      }}
                    >
                      {mockPlaces.map((place, index) => (
                        <Marker
                          key={`${place.name}-${index}`}
                          position={place.location}
                          onClick={() => {
                            setSelectedMarker(place);
                            setMapCenter(place.location);
                          }}
                          icon={getMarkerIcon(place.placeType)}
                          title={place.name}
                        />
                      ))}
                      {selectedMarker && (
                        <InfoWindow
                          position={selectedMarker.location}
                          onCloseClick={() => setSelectedMarker(null)}
                        >
                          <div className="p-2">
                            <h3 className="font-bold">{selectedMarker.name}</h3>
                            <p className="text-sm">{selectedMarker.type}</p>
                            {selectedMarker.rating && (
                              <div className="flex items-center mt-1">
                                <span className="text-yellow-500">★</span>
                                <span className="ml-1 text-sm">{selectedMarker.rating}</span>
                              </div>
                            )}
                            <div className="mt-2 text-sm">
                              <p className="text-blue-600">Day {selectedMarker.dayNumber}</p>
                            </div>
                          </div>
                        </InfoWindow>
                      )}
                    </GoogleMap>
                  </div>
                  <div className="p-3 border-t border-gray-100 shrink-0">
                    <div className="flex gap-4 flex-wrap">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-xs">Attractions</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                        <span className="text-xs">Hotels</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-xs">Restaurants</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="font-medium">Loading Map...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OngoingTripPage;

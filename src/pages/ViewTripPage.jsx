import React, { useState, useEffect } from 'react';
import { useLocation as useRouterLocation, useNavigate, useParams } from 'react-router-dom';
import { MapPin, Plus, Utensils, Bed, Car, Camera, Search, Calendar, ChevronDown, Clock, Edit3, Share2, Heart } from 'lucide-react';

import Navbar from '../components/Navbar';

const ViewTripPage = () => {
  const location = useRouterLocation();
  const navigate = useNavigate();
  const { tripId } = useParams();
  
  // Get trip data from route state or use mock data if none provided
  const tripFromState = location.state?.trip;
  
  const [currentDay, setCurrentDay] = useState(0);
  const [expandedDays, setExpandedDays] = useState({});
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Expandable Cost Breakdown State ---
  const [costExpanded, setCostExpanded] = useState({
    accommodation: false,
    food: false,
    activities: false,
    transportation: false
  });

  // --- Cost Calculation Helpers ---
  // Helper to extract numeric value from price string (e.g., "$200/night" or "$25")
  const parsePrice = (price) => {
    if (!price) return 0;
    const match = price.match(/\$([0-9]+(?:\.[0-9]+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };
  // Helper for price ranges (e.g., "$10-20")
  const parsePriceRange = (range) => {
    if (!range) return 0;
    const match = range.match(/\$([0-9]+)(?:-([0-9]+))?/);
    if (!match) return 0;
    if (match[2]) return (parseInt(match[1]) + parseInt(match[2])) / 2;
    return parseInt(match[1]);
  };

  // --- Expand/collapse handler ---
  const toggleCostExpand = (cat) => {
    setCostExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Mock saved trip data - this would normally come from an API
  const mockSavedTrip = {
    id: '1',
    name: 'Sri Lanka Adventure',
    dates: ['2024-02-15', '2024-02-19'],
    terrains: ['Beach', 'Mountains', 'Cultural Sites'],
    activities: ['Wildlife Safari', 'Temple Visits', 'Beach Activities'],
    createdAt: '2024-01-15',
    status: 'completed',
    totalDays: 5,
    destinations: ['Colombo', 'Kandy', 'Ella', 'Galle'],
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
    itinerary: {
      0: {
        date: new Date('2024-02-15'),
        activities: [
          {
            id: 1,
            name: 'Arrival in Colombo',
            location: 'Bandaranaike International Airport',
            duration: '2 hours',
            rating: 4.5,
            description: 'Airport pickup and transfer to hotel',
            price: '$25',
            time: '14:00'
          },
          {
            id: 2,
            name: 'Colombo City Tour',
            location: 'Colombo',
            duration: '3 hours',
            rating: 4.3,
            description: 'Explore the bustling capital city',
            price: '$40',
            time: '16:30'
          }
        ],
        places: [
          {
            id: 1,
            name: 'Galle Face Hotel',
            location: 'Colombo',
            price: '$200/night',
            rating: 4.7,
            reviews: 2156,
            description: 'Historic luxury hotel facing the Indian Ocean',
            checkIn: '15:00',
            checkOut: '12:00'
          }
        ],
        food: [
          {
            id: 1,
            name: 'Ministry of Crab',
            location: 'Colombo',
            cuisine: 'Seafood',
            rating: 4.8,
            reviews: 3247,
            description: 'World-renowned restaurant specializing in Sri Lankan crab',
            priceRange: '$30-50',
            time: '19:30'
          }
        ],
        transportation: [
          {
            id: 1,
            name: 'Airport Transfer',
            type: 'Private Car',
            price: '$25',
            rating: 4.5,
            description: 'Comfortable airport pickup service',
            time: '13:30',
            duration: '1 hour'
          }
        ]
      },
      1: {
        date: new Date('2024-02-16'),
        activities: [
          {
            id: 3,
            name: 'Temple of the Sacred Tooth',
            location: 'Kandy',
            duration: '2 hours',
            rating: 4.6,
            description: 'Visit the most sacred Buddhist temple in Sri Lanka',
            price: '$15',
            time: '10:00'
          },
          {
            id: 4,
            name: 'Kandy Lake Walk',
            location: 'Kandy',
            duration: '1 hour',
            rating: 4.2,
            description: 'Peaceful walk around the scenic Kandy Lake',
            price: 'Free',
            time: '17:00'
          }
        ],
        places: [
          {
            id: 2,
            name: 'Hotel Suisse',
            location: 'Kandy',
            price: '$120/night',
            rating: 4.4,
            reviews: 867,
            description: 'Charming hotel with lake views',
            checkIn: '15:00',
            checkOut: '12:00'
          }
        ],
        food: [
          {
            id: 2,
            name: 'The Empire Cafe',
            location: 'Kandy',
            cuisine: 'International',
            rating: 4.2,
            reviews: 543,
            description: 'Cozy cafe with mountain views',
            priceRange: '$10-20',
            time: '12:30'
          }
        ],
        transportation: [
          {
            id: 2,
            name: 'Colombo to Kandy',
            type: 'Train',
            price: '$5',
            rating: 4.8,
            description: 'Scenic train journey through the mountains',
            time: '07:00',
            duration: '3 hours'
          }
        ]
      },
      2: {
        date: new Date('2024-02-17'),
        activities: [
          {
            id: 5,
            name: 'Nine Arches Bridge',
            location: 'Ella',
            duration: '2 hours',
            rating: 4.7,
            description: 'Iconic railway bridge with stunning views',
            price: 'Free',
            time: '09:00'
          },
          {
            id: 6,
            name: 'Little Adams Peak Hike',
            location: 'Ella',
            duration: '3 hours',
            rating: 4.5,
            description: 'Moderate hike with panoramic views',
            price: 'Free',
            time: '14:00'
          }
        ],
        places: [
          {
            id: 3,
            name: 'Ella Flower Garden Resort',
            location: 'Ella',
            price: '$80/night',
            rating: 4.3,
            reviews: 432,
            description: 'Beautiful resort surrounded by nature',
            checkIn: '14:00',
            checkOut: '11:00'
          }
        ],
        food: [
          {
            id: 3,
            name: 'Cafe Chill',
            location: 'Ella',
            cuisine: 'Local',
            rating: 4.4,
            reviews: 321,
            description: 'Popular local spot with amazing views',
            priceRange: '$8-15',
            time: '12:00'
          }
        ],
        transportation: [
          {
            id: 3,
            name: 'Kandy to Ella',
            type: 'Train',
            price: '$3',
            rating: 4.9,
            description: 'One of the most scenic train rides in the world',
            time: '11:00',
            duration: '6 hours'
          }
        ]
      },
      3: {
        date: new Date('2024-02-18'),
        activities: [
          {
            id: 7,
            name: 'Galle Fort Exploration',
            location: 'Galle',
            duration: '3 hours',
            rating: 4.6,
            description: 'Explore the historic Dutch colonial fort',
            price: '$10',
            time: '10:00'
          },
          {
            id: 8,
            name: 'Unawatuna Beach',
            location: 'Unawatuna',
            duration: '4 hours',
            rating: 4.4,
            description: 'Relax on one of Sri Lanka\'s most beautiful beaches',
            price: 'Free',
            time: '14:00'
          }
        ],
        places: [
          {
            id: 4,
            name: 'Jetwing Lighthouse',
            location: 'Galle',
            price: '$180/night',
            rating: 4.6,
            reviews: 1234,
            description: 'Clifftop hotel designed by Geoffrey Bawa',
            checkIn: '15:00',
            checkOut: '12:00'
          }
        ],
        food: [
          {
            id: 4,
            name: 'Pedlar\'s Inn Cafe',
            location: 'Galle Fort',
            cuisine: 'International',
            rating: 4.5,
            reviews: 876,
            description: 'Historic cafe within the fort walls',
            priceRange: '$12-25',
            time: '13:00'
          }
        ],
        transportation: [
          {
            id: 4,
            name: 'Ella to Galle',
            type: 'Private Car',
            price: '$60',
            rating: 4.5,
            description: 'Scenic drive to the southern coast',
            time: '07:00',
            duration: '4 hours'
          }
        ]
      },
      4: {
        date: new Date('2024-02-19'),
        activities: [
          {
            id: 9,
            name: 'Whale Watching',
            location: 'Mirissa',
            duration: '4 hours',
            rating: 4.6,
            description: 'Spot blue whales and dolphins in their natural habitat',
            price: '$45',
            time: '06:30'
          },
          {
            id: 10,
            name: 'Departure',
            location: 'Colombo Airport',
            duration: '2 hours',
            rating: 4.0,
            description: 'Transfer to airport for departure',
            price: '$30',
            time: '15:00'
          }
        ],
        places: [],
        food: [
          {
            id: 5,
            name: 'Coconut Tree Hill Restaurant',
            location: 'Mirissa',
            cuisine: 'Seafood',
            rating: 4.3,
            reviews: 567,
            description: 'Beachfront dining with fresh seafood',
            priceRange: '$15-30',
            time: '12:00'
          }
        ],
        transportation: [
          {
            id: 5,
            name: 'Galle to Mirissa',
            type: 'Tuk-tuk',
            price: '$15',
            rating: 4.2,
            description: 'Fun tuk-tuk ride along the coast',
            time: '06:00',
            duration: '30 minutes'
          },
          {
            id: 6,
            name: 'Airport Transfer',
            type: 'Private Car',
            price: '$70',
            rating: 4.5,
            description: 'Direct transfer to Colombo Airport',
            time: '13:00',
            duration: '2.5 hours'
          }
        ]
      }
    }
  };

  useEffect(() => {
    // Load trip data - either from route state or mock data
    const loadTrip = () => {
      setLoading(true);
      
      // Use trip from state if available, otherwise use mock data
      let tripData = tripFromState || mockSavedTrip;
      
      // If tripData comes from MyTripsPage, transform it to match expected structure
      if (tripFromState && !tripFromState.destinations) {
        tripData = {
          ...tripFromState,
          // Transform single destination to destinations array
          destinations: tripFromState.destination ? [tripFromState.destination] : ['Sri Lanka'],
          // Extract total days from dates string or set default to 5 days
          totalDays: 5,
          // Transform dates string to array format
          dates: tripFromState.dates && tripFromState.dates !== 'Not set'
            ? tripFromState.dates.split(' → ').map(date => new Date(date).toISOString().split('T')[0])
            : ['2024-02-15', '2024-02-19'],
          // Add missing properties with defaults
          terrains: tripFromState.terrains || ['Beach', 'Mountains', 'Cultural Sites'],
          activities: tripFromState.activities || ['Sightseeing', 'Cultural Tours'],
          createdAt: tripFromState.createdAt || new Date().toISOString(),
          coverImage: tripFromState.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
          // Use mock itinerary for now - in a real app this would come from the backend
          itinerary: mockSavedTrip.itinerary
        };
      }
      
      setTrip(tripData);
      
      // Initialize expanded days - expand first few days by default
      const totalDays = tripData.totalDays || 5;
      const initialExpanded = {};
      for (let i = 0; i < totalDays; i++) {
        initialExpanded[i] = i < 3; // Expand first 3 days
      }
      setExpandedDays(initialExpanded);
      
      setLoading(false);
    };

    loadTrip();
  }, [tripFromState, tripId]);

  // Generate days array from trip dates
  const generateDays = () => {
    if (!trip || !trip.dates || trip.dates.length < 2) return [];
    
    const days = [];
    const startDate = new Date(trip.dates[0]);
    const totalDays = trip.totalDays || 5;
    
    // Generate only the number of days specified in totalDays
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate);
    }
    
    return days;
  };

  const days = generateDays();

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleBack = () => {
    navigate('/trips');
  };

  const handleEdit = () => {
    navigate('/trip-itinerary', {
      state: {
        tripName: trip.name,
        selectedDates: trip.dates,
        selectedTerrains: trip.terrains,
        selectedActivities: trip.activities,
        tripId: trip.id,
        editMode: true
      }
    });
  };

  const handleShare = () => {
    console.log('Share trip:', trip.name);
    // Implement share functionality
  };

  const handleFavorite = () => {
    console.log('Toggle favorite for trip:', trip.name);
    // Implement favorite functionality
  };

  const handleProceed = () => {
    navigate('/select-driver-guide', {
      state: {
        trip: trip
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Trip not found</p>
          <button 
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  // Calculate costs per category
  const accommodationItems = Object.values(trip?.itinerary || {}).flatMap(day => day?.places || []);
  const accommodationTotal = accommodationItems.reduce((sum, place) => sum + parsePrice(place.price), 0);

  const foodItems = Object.values(trip?.itinerary || {}).flatMap(day => day?.food || []);
  const foodTotal = foodItems.reduce((sum, food) => sum + parsePriceRange(food.priceRange), 0);

  const activityItems = Object.values(trip?.itinerary || {}).flatMap(day => day?.activities || []);
  const activityTotal = activityItems.reduce((sum, act) => sum + parsePrice(act.price), 0);

  const transportationItems = Object.values(trip?.itinerary || {}).flatMap(day => day?.transportation || []);
  const transportationTotal = transportationItems.reduce((sum, t) => sum + parsePrice(t.price), 0);

  // For demo, driver/guide costs are fixed
  const driverCost = 200;
  const guideCost = 150;

  const grandTotal = accommodationTotal + foodTotal + activityTotal + transportationTotal + driverCost + guideCost;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Floating Bill-shaped Navbar overlays the top, so pull content down and let blue header go behind */}
      <div className="relative z-10">
        <Navbar />
      </div>
      {/* Trip Header - blue background behind navbar, pulled up to be visible behind floating navbar */}
      <div className="relative">
        <div className="absolute inset-0 w-full h-[300px] bg-gradient-to-r from-primary-600 to-primary-700 pointer-events-none" style={{ zIndex: 0 }}></div>
        <div className="relative max-w-7xl mx-auto px-4 pt-40 pb-12" style={{ zIndex: 1 }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {trip.status === 'completed' ? 'Completed' : 'Upcoming'}
                </span>
                <span className="text-white/80 text-sm">
                  {trip.totalDays} days • {Array.isArray(trip.destinations) ? trip.destinations.join(', ') : trip.destinations || trip.destination || 'Sri Lanka'}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2 text-white drop-shadow">{trip.name}</h1>
              <p className="text-white/90 text-lg">
                {formatDate(new Date(trip.dates[0]))} - {formatDate(new Date(trip.dates[1]))}
              </p>
            </div>
            {/* Removed edit, share, and like buttons */}
          </div>
        </div>
      </div>

      {/* Main Content: Itinerary + Map (sticky/fixed) */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 py-8">
        <div className="flex gap-8 w-full">
          {/* Left: Itinerary, scrollable - 50% width */}
          <div className="w-1/2 min-w-0 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Trip Itinerary</h2>
            <button
              onClick={handleBack}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Trips
            </button>
          </div>
          {/* Day Timeline */}
          <div className="space-y-0">
            {days.map((day, dayIndex) => {
              const dayItinerary = trip.itinerary?.[dayIndex] || { 
                activities: [], 
                places: [], 
                food: [], 
                transportation: [] 
              };
              const isExpanded = expandedDays[dayIndex];
              const hasItems = (dayItinerary.activities?.length || 0) > 0 || 
                             (dayItinerary.places?.length || 0) > 0 || 
                             (dayItinerary.food?.length || 0) > 0 || 
                             (dayItinerary.transportation?.length || 0) > 0;
              return (
                <div key={dayIndex} className="border-l-2 border-gray-200 relative">
                  {/* Day Header */}
                  <div className="flex items-center mb-4 -ml-3">
                    <div className="bg-white border-4 border-primary-600 w-6 h-6 rounded-full"></div>
                    <button 
                      onClick={() => toggleDayExpansion(dayIndex)}
                      className="ml-4 flex items-center text-lg font-semibold text-gray-900 hover:text-primary-600"
                    >
                      Day {dayIndex + 1} - {formatDate(day)}
                      <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {hasItems && (
                      <span className="ml-3 text-sm text-gray-500">
                        ({Object.entries(dayItinerary).reduce((total, [, items]) => total + (Array.isArray(items) ? items.length : 0), 0)} items)
                      </span>
                    )}
                  </div>
                  {/* Day Content */}
                  {isExpanded && (
                    <div className="ml-6 pb-8">
                      {hasItems ? (
                        <div className="space-y-4">
                          {/* Sort all items by time and display chronologically */}
                          {Object.entries(dayItinerary)
                            .flatMap(([category, items]) => 
                              Array.isArray(items) ? items.map(item => ({ ...item, category })) : []
                            )
                            .sort((a, b) => {
                              const timeA = a.time || '00:00';
                              const timeB = b.time || '00:00';
                              return timeA.localeCompare(timeB);
                            })
                            .map((item, itemIndex) => {
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
                                <div key={`${item.category}-${itemIndex}`} className={`p-4 rounded-lg border ${getCategoryColor(item.category)}`}>
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                      {getCategoryIcon(item.category)}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                                          {item.time && (
                                            <span className="text-sm text-gray-500 ml-2">{item.time}</span>
                                          )}
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
                                              <span className="flex items-center text-yellow-600">
                                                ⭐ {item.rating}
                                              </span>
                                            )}
                                            {item.reviews && (
                                              <span className="text-gray-500">({item.reviews} reviews)</span>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            {item.price && (
                                              <span className="font-semibold text-gray-900">{item.price}</span>
                                            )}
                                            {item.priceRange && (
                                              <span className="font-semibold text-gray-900">{item.priceRange}</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
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
          {/* Trip Summary moved below both columns */}
        </div>
          {/* Right: Map, sticky/fixed on viewport - exactly 50% width */}
          <div className="hidden lg:flex w-1/2 min-w-0">
            <div className="bg-gray-200 rounded-xl w-full h-[calc(100vh-160px)] sticky top-20">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-medium">Interactive Map</p>
                  <p className="text-sm">Trip route and locations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Trip Summary (below itinerary, left column only) */}
        <div className="flex gap-8 w-full">
          {/* Left: Trip Summary Card */}
          <div className="w-1/2 min-w-0 flex flex-col">
            <div className="w-full mt-10">
              <div
                id="trip-summary-card"
                className="bg-gray-50 rounded-xl p-6 mb-8 w-full border border-gray-200"
                style={{ minHeight: '220px', boxShadow: 'none', border: '1px solid #e5e7eb' }}
                ref={el => (window.tripSummaryCardRef = el)}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Cost Breakdown</h3>
                <div className="space-y-3">
                  {/* Accommodation */}
                  <div className="flex flex-col border-b border-gray-100 pb-2">
                    <button
                      className="flex justify-between items-center w-full text-left focus:outline-none"
                      onClick={() => toggleCostExpand('accommodation')}
                    >
                      <span className="text-gray-600">Accommodation</span>
                      <span className="font-medium flex items-center">
                        ${accommodationTotal.toFixed(2)}
                        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${costExpanded.accommodation ? 'rotate-180' : ''}`} />
                      </span>
                    </button>
                    {costExpanded.accommodation && (
                      <div className="pl-4 mt-2 space-y-1">
                        {accommodationItems.length === 0 && <span className="text-gray-400 text-sm">No accommodations</span>}
                        {accommodationItems.map((place, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-gray-700">
                            <span>{place.name} <span className="text-gray-400">({place.location})</span></span>
                            <span>{place.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Food */}
                  <div className="flex flex-col border-b border-gray-100 pb-2">
                    <button
                      className="flex justify-between items-center w-full text-left focus:outline-none"
                      onClick={() => toggleCostExpand('food')}
                    >
                      <span className="text-gray-600">Food</span>
                      <span className="font-medium flex items-center">
                        ${foodTotal.toFixed(2)}
                        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${costExpanded.food ? 'rotate-180' : ''}`} />
                      </span>
                    </button>
                    {costExpanded.food && (
                      <div className="pl-4 mt-2 space-y-1">
                        {foodItems.length === 0 && <span className="text-gray-400 text-sm">No food entries</span>}
                        {foodItems.map((food, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-gray-700">
                            <span>{food.name} <span className="text-gray-400">({food.location})</span></span>
                            <span>{food.priceRange}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Activities */}
                  <div className="flex flex-col border-b border-gray-100 pb-2">
                    <button
                      className="flex justify-between items-center w-full text-left focus:outline-none"
                      onClick={() => toggleCostExpand('activities')}
                    >
                      <span className="text-gray-600">Activities</span>
                      <span className="font-medium flex items-center">
                        ${activityTotal.toFixed(2)}
                        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${costExpanded.activities ? 'rotate-180' : ''}`} />
                      </span>
                    </button>
                    {costExpanded.activities && (
                      <div className="pl-4 mt-2 space-y-1">
                        {activityItems.length === 0 && <span className="text-gray-400 text-sm">No activities</span>}
                        {activityItems.map((act, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-gray-700">
                            <span>{act.name} <span className="text-gray-400">({act.location})</span></span>
                            <span>{act.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Transportation */}
                  <div className="flex flex-col border-b border-gray-100 pb-2">
                    <button
                      className="flex justify-between items-center w-full text-left focus:outline-none"
                      onClick={() => toggleCostExpand('transportation')}
                    >
                      <span className="text-gray-600">Transportation</span>
                      <span className="font-medium flex items-center">
                        ${transportationTotal.toFixed(2)}
                        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${costExpanded.transportation ? 'rotate-180' : ''}`} />
                      </span>
                    </button>
                    {costExpanded.transportation && (
                      <div className="pl-4 mt-2 space-y-1">
                        {transportationItems.length === 0 && <span className="text-gray-400 text-sm">No transportation</span>}
                        {transportationItems.map((t, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-gray-700">
                            <span>{t.name} <span className="text-gray-400">({t.type || t.location})</span></span>
                            <span>{t.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Driver */}
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Driver</span>
                    <span className="font-medium">${driverCost.toFixed(2)}</span>
                  </div>
                  {/* Guide */}
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Guide</span>
                    <span className="font-medium">${guideCost.toFixed(2)}</span>
                  </div>
                  {/* Grand Total */}
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-900 font-bold">Total</span>
                    <span className="font-bold text-primary-700 text-lg">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Actions Card */}
          <div className="w-1/2 min-w-0 flex flex-col">
            <div className="w-full mt-10">
              <div
                className="bg-gray-50 rounded-xl p-6 mb-8 w-full border border-gray-200 flex flex-col justify-center"
                id="actions-card"
                style={{ minHeight: '220px', height: window.tripSummaryCardRef ? window.tripSummaryCardRef.offsetHeight : undefined, boxShadow: 'none', border: '1px solid #e5e7eb' }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Actions</h3>
                <div className="flex flex-row gap-4 w-full mb-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors border border-gray-200"
                  >
                    Back
                  </button>
                  <button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors border border-red-200"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleProceed}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors border border-blue-200"
                  >
                    Proceed
                  </button>
                </div>
                {/* Disclaimers and info */}
                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <p>By proceeding, you agree to our <a href="#" className="underline hover:text-primary-600">Terms & Conditions</a> and <a href="#" className="underline hover:text-primary-600">Privacy Policy</a>.</p>
                  <p>Payments are processed securely. You will be able to select your preferred driver and guide after payment.</p>
                  <p>If you delete this trip, it cannot be recovered.</p>
                  <p>For support, contact <a href="mailto:support@islandhop.com" className="underline hover:text-primary-600">support@islandhop.com</a>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTripPage;

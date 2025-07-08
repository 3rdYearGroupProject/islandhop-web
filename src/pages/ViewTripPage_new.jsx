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
    const endDate = new Date(trip.dates[1]);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Trip Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
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
              <h1 className="text-4xl font-bold mb-2">{trip.name}</h1>
              <p className="text-white/90 text-lg">
                {formatDate(new Date(trip.dates[0]))} - {formatDate(new Date(trip.dates[1]))}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-6">
              <button
                onClick={handleFavorite}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                title="Add to Favorites"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                title="Share Trip"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleEdit}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                title="Edit Trip"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Itinerary */}
          <div className="w-full lg:w-1/2">
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
          </div>

          {/* Right Column - Summary & Map */}
          <div className="w-full lg:w-1/2">
            {/* Trip Summary */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{trip.totalDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Destinations</span>
                  <span className="font-medium">
                    {Array.isArray(trip.destinations) ? trip.destinations.length : 1} cities
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Activities</span>
                  <span className="font-medium">
                    {Object.values(trip.itinerary || {}).reduce((total, day) => total + (day?.activities?.length || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accommodations</span>
                  <span className="font-medium">
                    {Object.values(trip.itinerary || {}).reduce((total, day) => total + (day?.places?.length || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${trip.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>
                    {trip.status === 'completed' ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p className="font-medium">Interactive Map</p>
                <p className="text-sm">Trip route and locations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTripPage;

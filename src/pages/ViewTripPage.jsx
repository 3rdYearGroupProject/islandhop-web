import React, { useState, useEffect } from 'react';
// ...existing imports...
import ProceedModal from '../components/tourist/ProceedModal';
import { useLocation as useRouterLocation, useNavigate, useParams } from 'react-router-dom';
import { MapPin, Plus, Utensils, Bed, Car, Camera, Search, Calendar, ChevronDown, Clock, Edit3, Share2, Heart } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { tripPlanningApi } from '../api/axios';
import { getUserUID } from '../utils/userStorage';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getCityImageUrl, placeholderImage, logImageError } from '../utils/imageUtils';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
  const [apiError, setApiError] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 7.8731, lng: 80.7718 }); // Sri Lanka center
  const [places, setPlaces] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

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
    coverImage: getCityImageUrl('Colombo'),
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
    // Check for authenticated user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Load trip data - either from API, route state or mock data
    const loadTrip = async () => {
      setLoading(true);
      setApiError(null);
      
      try {
        // If we have both tripId and userId, fetch from API
        if (tripId && currentUserId) {
          console.log('🔍 Fetching trip details from API for tripId:', tripId, 'userId:', currentUserId);
          
          const response = await tripPlanningApi.get(`/itinerary/${tripId}?userId=${currentUserId}`);
          
          if (response.data && response.data.status === 'success') {
            console.log('✅ API Response:', response.data);
            
            // Extract all places from the daily plans for the map
            const allPlaces = [];
            response.data.dailyPlans.forEach(day => {
              // Add attractions
              if (day.attractions && day.attractions.length > 0) {
                day.attractions.forEach(attraction => {
                  if (attraction.location && attraction.location.lat && attraction.location.lng) {
                    allPlaces.push({
                      ...attraction,
                      dayNumber: day.day,
                      placeType: 'attraction'
                    });
                  }
                });
              }
              
              // Add hotels
              if (day.hotels && day.hotels.length > 0) {
                day.hotels.forEach(hotel => {
                  if (hotel.location && hotel.location.lat && hotel.location.lng) {
                    allPlaces.push({
                      ...hotel,
                      dayNumber: day.day,
                      placeType: 'hotel'
                    });
                  }
                });
              }
              
              // Add restaurants
              if (day.restaurants && day.restaurants.length > 0) {
                day.restaurants.forEach(restaurant => {
                  if (restaurant.location && restaurant.location.lat && restaurant.location.lng) {
                    allPlaces.push({
                      ...restaurant,
                      dayNumber: day.day,
                      placeType: 'restaurant'
                    });
                  }
                });
              }
            });
            
            setPlaces(allPlaces);
            
            // If there are places with coordinates, set the map center to the first one
            if (allPlaces.length > 0 && allPlaces[0].location) {
              setMapCenter({
                lat: allPlaces[0].location.lat,
                lng: allPlaces[0].location.lng
              });
            }
            
            // Transform API response to match our trip structure
            const tripData = {
              id: response.data.tripId,
              name: `Trip to ${response.data.destination}`,
              dates: [response.data.startDate, response.data.endDate],
              terrains: ['Beach', 'Mountains', 'Cultural Sites'],
              activities: ['Sightseeing', 'Cultural Tours'],
              createdAt: new Date().toISOString(),
              status: 'active', // Default to active
              totalDays: response.data.numberOfDays,
              destinations: [response.data.destination],
              coverImage: getCityImageUrl(response.data.destination),
              apiData: response.data, // Store the original API response
              // Transform daily plans to match itinerary structure
              itinerary: transformDailyPlansToItinerary(response.data.dailyPlans)
            };
            
            setTrip(tripData);
            
            // Initialize expanded days - expand first few days by default
            const initialExpanded = {};
            for (let i = 0; i < tripData.totalDays; i++) {
              initialExpanded[i] = i < 3; // Expand first 3 days
            }
            setExpandedDays(initialExpanded);
          } else {
            console.error('❌ Invalid API response:', response);
            setApiError('Failed to load trip data from API');
            fallbackToLocalData();
          }
        } else {
          // If no tripId or userId, fall back to local data
          fallbackToLocalData();
        }
      } catch (error) {
        console.error('❌ Error fetching trip details:', error);
        setApiError(`Failed to load trip: ${error.message}`);
        fallbackToLocalData();
      } finally {
        setLoading(false);
      }
    };
    
    const fallbackToLocalData = () => {
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
          coverImage: tripFromState.image || getCityImageUrl(tripFromState.destination || 'Sri Lanka'),
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
    };

    loadTrip();
  }, [tripFromState, tripId, currentUserId]);

  // Transform API daily plans data to match our itinerary format
  const transformDailyPlansToItinerary = (dailyPlans) => {
    const itinerary = {};
    
    dailyPlans.forEach((day, index) => {
      const dayIndex = day.day - 1; // Convert 1-indexed to 0-indexed
      const dayDate = new Date(); // Default to today
      dayDate.setDate(dayDate.getDate() + dayIndex); // Add days
      
      // Get a city image for the current day's city
      const cityImage = getCityImageUrl(day.city || 'Sri Lanka');
      
      // Initialize itinerary day
      itinerary[dayIndex] = {
        date: dayDate,
        activities: [],
        places: [],
        food: [],
        transportation: [],
        city: day.city || 'Sri Lanka',
        cityImage: cityImage
      };
      
      // Add attractions to activities
      if (day.attractions && day.attractions.length > 0) {
        day.attractions.forEach((attraction, i) => {
          // Create a descriptive name for the image based on attraction type and city
          const imageNameBase = `${attraction.name || 'attraction'} ${day.city || 'Sri Lanka'} ${attraction.type || ''}`.trim();
          
          itinerary[dayIndex].activities.push({
            id: `attraction-${dayIndex}-${i}`,
            name: attraction.name,
            location: attraction.location ? `${day.city || 'Sri Lanka'}` : '',
            duration: `${attraction.visitDurationMinutes ? Math.floor(attraction.visitDurationMinutes / 60) : 1} hours`,
            rating: attraction.rating || 4.0,
            description: attraction.type || 'Sightseeing',
            price: '$0', // Default price if not available
            time: '10:00', // Default time if not available
            // Always use local image for reliability
            thumbnailUrl: getCityImageUrl(imageNameBase),
            googlePlaceId: attraction.googlePlaceId || '',
            coordinates: attraction.location || null
          });
        });
      }
      
      // Add hotels to places
      if (day.hotels && day.hotels.length > 0) {
        day.hotels.forEach((hotel, i) => {
          // Create a descriptive name for the image based on hotel details
          const imageNameBase = `${hotel.name || 'hotel'} ${day.city || 'Sri Lanka'} accommodation`.trim();
          
          itinerary[dayIndex].places.push({
            id: `hotel-${dayIndex}-${i}`,
            name: hotel.name,
            location: hotel.location ? `${day.city || 'Sri Lanka'}` : '',
            price: '$100/night', // Default price if not available
            rating: hotel.rating || 4.0,
            reviews: 100, // Default reviews if not available
            description: hotel.type || 'Hotel',
            checkIn: '15:00', // Default time if not available
            checkOut: '12:00', // Default time if not available
            // Always use local image for reliability
            thumbnailUrl: getCityImageUrl(imageNameBase),
            googlePlaceId: hotel.googlePlaceId || '',
            coordinates: hotel.location || null
          });
        });
      }
      
      // Add restaurants to food
      if (day.restaurants && day.restaurants.length > 0) {
        day.restaurants.forEach((restaurant, i) => {
          // Create a descriptive name for the image based on restaurant details
          const imageNameBase = `${restaurant.name || 'restaurant'} ${day.city || 'Sri Lanka'} food`.trim();
          
          itinerary[dayIndex].food.push({
            id: `restaurant-${dayIndex}-${i}`,
            name: restaurant.name,
            location: restaurant.location ? `${day.city || 'Sri Lanka'}` : '',
            cuisine: 'Local', // Default cuisine if not available
            rating: restaurant.rating || 4.0,
            reviews: 50, // Default reviews if not available
            description: restaurant.type || 'Restaurant',
            priceRange: '$10-25', // Default price range if not available
            time: '12:30', // Default time if not available
            // Always use local image for reliability
            thumbnailUrl: getCityImageUrl(imageNameBase),
            googlePlaceId: restaurant.googlePlaceId || '',
            coordinates: restaurant.location || null
          });
        });
      }
      
      // Add default transportation if none provided
      if (dayIndex > 0) {
        itinerary[dayIndex].transportation.push({
          id: `transport-${dayIndex}`,
          name: `Transportation to ${day.city || 'next destination'}`,
          type: 'Car',
          price: '$30',
          rating: 4.5,
          description: 'Comfortable private transfer',
          time: '09:00',
          duration: '2 hours'
        });
      }
    });
    
    return itinerary;
  };

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

  // Modal state
  const [showProceedModal, setShowProceedModal] = useState(false);
  const [proceedMessage, setProceedMessage] = useState('');
  const [numPassengers, setNumPassengers] = useState(1);

  const handleProceed = () => {
    let message = '';
    if (needDriver && needGuide) {
      message = 'Are you sure you want to proceed with both a driver and a guide?';
    } else if (needDriver && !needGuide) {
      message = 'Are you sure you want to proceed with only a driver?';
    } else if (!needDriver && needGuide) {
      message = 'Are you sure you want to proceed with only a guide?';
    } else {
      message = 'Are you sure you want to proceed without a driver or guide?';
    }
    setProceedMessage(message);
    setShowProceedModal(true);
  };

  const confirmProceed = () => {
    setShowProceedModal(false);
    navigate('/select-driver-guide', {
      state: {
        trip: trip,
        numPassengers: needDriver ? numPassengers : undefined
      }
    });
  };

  const cancelProceed = () => {
    setShowProceedModal(false);
  };

  // Google Maps API loading
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
  });

  // Google Maps styles and settings
  const mapContainerStyle = {
    width: '100%',
    height: '100%', // Changed from 400px to 100% to fill parent
    minHeight: '400px', // Ensures minimum height for usability
  };
  
  // Get map icon based on place type
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
  
  // Handle marker click
  const handleMarkerClick = (place) => {
    setSelectedMarker(place);
    
    // Center the map on the selected place
    if (place.location) {
      setMapCenter({
        lat: place.location.lat,
        lng: place.location.lng
      });
    }
  };
  
  // Close info window
  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  const [needDriver, setNeedDriver] = useState(true);
  const [needGuide, setNeedGuide] = useState(true);

  const driverCost = needDriver ? 200 : 0;
  const guideCost = needGuide ? 150 : 0;
  const grandTotal = driverCost + guideCost;

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

  if (apiError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error: {apiError}</p>
          <p className="text-gray-600 mb-4">We encountered an issue loading your trip. Please try again later.</p>
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
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Left: Itinerary, scrollable - 50% width on desktop */}
          <div className="w-full md:w-1/2 min-w-0 flex flex-col">
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
          {/* Right: Interactive Map showing all places from the itinerary */}
          <div className="w-full md:w-1/2 min-w-0 flex flex-col h-[calc(100vh-160px)]">
            <div className="bg-white rounded-xl w-full h-full md:sticky top-20 shadow-lg border border-gray-200 overflow-hidden flex flex-col">
              {isLoaded ? (
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b border-gray-100 shrink-0">
                    <h2 className="font-bold text-lg">Trip Map</h2>
                    <p className="text-sm text-gray-500">Explore your trip destinations</p>
                  </div>
                  <div className="flex-1 min-h-[400px]">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapCenter}
                      zoom={12}
                      options={{
                        fullscreenControl: true,
                        streetViewControl: true,
                        mapTypeControl: true,
                        zoomControl: true,
                      }}
                    >
                      {places.map((place, index) => (
                        <Marker
                          key={`${place.name}-${index}`}
                          position={{
                            lat: place.location.lat,
                            lng: place.location.lng
                          }}
                          onClick={() => handleMarkerClick(place)}
                          icon={getMarkerIcon(place.placeType)}
                          title={place.name}
                        />
                      ))}
                      {selectedMarker && (
                        <InfoWindow
                          position={{
                            lat: selectedMarker.location.lat,
                            lng: selectedMarker.location.lng
                          }}
                          onCloseClick={handleInfoWindowClose}
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
                            <img 
                              src={getCityImageUrl(selectedMarker.name || selectedMarker.location?.city || 'Sri Lanka')}
                              alt={selectedMarker.name} 
                              className="mt-2 w-full h-24 object-cover rounded"
                              onError={(e) => {
                                logImageError('ViewTripPage InfoWindow', selectedMarker, e.target.src);
                                e.target.src = placeholderImage;
                              }}
                            />
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
                {/* Driver/Guide Selection */}
                <div className="flex gap-6 mb-4 items-center">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={needDriver}
                      onChange={e => setNeedDriver(e.target.checked)}
                      className={`h-5 w-5 rounded border-2 border-primary-600 focus:ring-2 focus:ring-primary-500 transition-all duration-150 ${needDriver ? 'bg-primary-600' : 'bg-white'}`}
                      style={{ accentColor: needDriver ? '#2563eb' : undefined, backgroundColor: needDriver ? '#2563eb' : '#fff' }}
                    />
                    <span className="text-gray-800 font-medium">I need a driver</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={needGuide}
                      onChange={e => setNeedGuide(e.target.checked)}
                      className={`h-5 w-5 rounded border-2 border-primary-600 focus:ring-2 focus:ring-primary-500 transition-all duration-150 ${needGuide ? 'bg-primary-600' : 'bg-white'}`}
                      style={{ accentColor: needGuide ? '#2563eb' : undefined, backgroundColor: needGuide ? '#2563eb' : '#fff' }}
                    />
                    <span className="text-gray-800 font-medium">I need a guide</span>
                  </label>
                </div>
                <div className="space-y-3">
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
                  {/* Advance Payment */}
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-900 font-bold">Advance Payment (50%)</span>
                    <span className="font-bold text-primary-600 text-lg">${(grandTotal * 0.5).toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">You must pay 50% of the total cost before the start of your trip.</div>
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
                style={{ minHeight: '220px', boxShadow: 'none', border: '1px solid #e5e7eb' }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Actions</h3>
                <div className="flex flex-row gap-4 w-full mb-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full transition-colors border border-gray-400"
                  >
                    Back
                  </button>
                  <button
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-full transition-colors border border-red-400"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleProceed}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-full transition-colors border border-blue-200"
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
          {/* Proceed Modal */}
          <ProceedModal
            open={showProceedModal}
            message={proceedMessage}
            onConfirm={confirmProceed}
            onCancel={cancelProceed}
            needDriver={needDriver}
            numPassengers={numPassengers}
            setNumPassengers={setNumPassengers}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewTripPage;

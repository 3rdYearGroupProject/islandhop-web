import React, { useState, useEffect } from 'react';
import { useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import { MapPin, Plus, Utensils, Bed, Car, Camera, Search, Calendar, ChevronDown, Clock } from 'lucide-react';
import AddDestinationModal from '../components/AddDestinationModal';
import AddThingsToDoModal from '../components/AddThingsToDoModal';
import AddPlacesToStayModal from '../components/AddPlacesToStayModal';
import AddFoodAndDrinkModal from '../components/AddFoodAndDrinkModal';
import AddTransportationModal from '../components/AddTransportationModal';

import Navbar from '../components/Navbar';
// Import the trip progress bar component (assume it's named TripProgressBar and in components)
import TripProgressBar from '../components/TripProgressBar';
import { getUserUID } from '../utils/userStorage';
import { tripPlanningApi } from '../api/axios';

// Google Places API integration
const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

// Sri Lanka boundary for location filtering
const SRI_LANKA_BOUNDS = {
  north: 9.8354,
  south: 5.9169,
  east: 81.8919,
  west: 79.6533
};

// Popular Sri Lankan cities for destination search
const POPULAR_SRI_LANKAN_CITIES = [
  { name: 'Colombo', coords: { lat: 6.9271, lng: 79.8612 } },
  { name: 'Kandy', coords: { lat: 7.2906, lng: 80.6337 } },
  { name: 'Galle', coords: { lat: 6.0329, lng: 80.217 } },
  { name: 'Nuwara Eliya', coords: { lat: 6.9497, lng: 80.7891 } },
  { name: 'Anuradhapura', coords: { lat: 8.3114, lng: 80.4037 } },
  { name: 'Sigiriya', coords: { lat: 7.9568, lng: 80.7608 } },
  { name: 'Ella', coords: { lat: 6.8720, lng: 81.0463 } },
  { name: 'Mirissa', coords: { lat: 5.9487, lng: 80.4565 } },
  { name: 'Jaffna', coords: { lat: 9.6615, lng: 80.0255 } },
  { name: 'Negombo', coords: { lat: 7.2083, lng: 79.8358 } },
  { name: 'Trincomalee', coords: { lat: 8.5922, lng: 81.2357 } },
  { name: 'Batticaloa', coords: { lat: 7.7167, lng: 81.7000 } },
  { name: 'Ratnapura', coords: { lat: 6.6806, lng: 80.4022 } },
  { name: 'Matara', coords: { lat: 5.9486, lng: 80.5428 } },
  { name: 'Badulla', coords: { lat: 6.9895, lng: 81.0557 } },
  { name: 'Polonnaruwa', coords: { lat: 7.9329, lng: 81.0081 } },
  { name: 'Kurunegala', coords: { lat: 7.4800, lng: 80.3600 } },
  { name: 'Kalutara', coords: { lat: 6.5833, lng: 79.9597 } },
  { name: 'Hambantota', coords: { lat: 6.1236, lng: 81.1233 } },
  { name: 'Dambulla', coords: { lat: 7.8536, lng: 80.6519 } },
  { name: 'Matale', coords: { lat: 7.4667, lng: 80.6167 } },
  { name: 'Ampara', coords: { lat: 7.2833, lng: 81.6667 } },
  { name: 'Mannar', coords: { lat: 8.9667, lng: 79.8833 } },
  { name: 'Vavuniya', coords: { lat: 8.7500, lng: 80.5000 } },
  { name: 'Puttalam', coords: { lat: 8.0333, lng: 79.8167 } },
  { name: 'Beruwala', coords: { lat: 6.4733, lng: 79.9844 } },
  { name: 'Chilaw', coords: { lat: 7.5758, lng: 79.7953 } },
  { name: 'Gampaha', coords: { lat: 7.0917, lng: 79.9997 } },
  { name: 'Kegalle', coords: { lat: 7.2533, lng: 80.3436 } },
  { name: 'Point Pedro', coords: { lat: 9.8167, lng: 80.2333 } },
  { name: 'Tangalle', coords: { lat: 6.0167, lng: 80.7833 } },
  { name: 'Monaragala', coords: { lat: 6.8667, lng: 81.3500 } },
  { name: 'Balangoda', coords: { lat: 6.6500, lng: 80.6833 } },
  { name: 'Hatton', coords: { lat: 6.8917, lng: 80.5958 } },
  { name: 'Weligama', coords: { lat: 5.9667, lng: 80.4167 } },
  { name: 'Arugam Bay', coords: { lat: 6.8500, lng: 81.8333 } },
  { name: 'Tissamaharama', coords: { lat: 6.2833, lng: 81.2833 } },
  { name: 'Bentota', coords: { lat: 6.4219, lng: 80.0008 } },
  { name: 'Kitulgala', coords: { lat: 6.9833, lng: 80.4167 } },
  { name: 'Hikkaduwa', coords: { lat: 6.1478, lng: 80.1039 } }
];

// Function to check if coordinates are within Sri Lanka
const isWithinSriLanka = (lat, lng) => {
  return lat >= SRI_LANKA_BOUNDS.south && 
         lat <= SRI_LANKA_BOUNDS.north && 
         lng >= SRI_LANKA_BOUNDS.west && 
         lng <= SRI_LANKA_BOUNDS.east;
};

// Search Sri Lankan cities using Google Places API
const searchSriLankanCities = async (query = '') => {
  return new Promise((resolve, reject) => {
    if (!GOOGLE_PLACES_API_KEY) {
      console.error('Google Places API key is not configured');
      resolve(POPULAR_SRI_LANKAN_CITIES.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase())
      ));
      return;
    }

    try {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      // If no query, return popular cities
      if (!query.trim()) {
        resolve(POPULAR_SRI_LANKAN_CITIES);
        return;
      }

      const request = {
        query: `${query} Sri Lanka city`,
        fields: ['place_id', 'name', 'geometry', 'formatted_address', 'photos', 'types'],
        locationBias: {
          center: { lat: 7.8731, lng: 80.7718 }, // Center of Sri Lanka
          radius: 200000 // 200km radius
        }
      };

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          // Filter results to only include Sri Lankan locations
          const sriLankanCities = results
            .filter(place => {
              if (!place.geometry?.location) return false;
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              return isWithinSriLanka(lat, lng) && 
                     place.types.some(type => ['locality', 'administrative_area_level_2', 'administrative_area_level_1'].includes(type));
            })
            .map(place => ({
              id: place.place_id,
              name: place.name,
              coords: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              },
              address: place.formatted_address,
              image: place.photos ? getPhotoUrl(place.photos[0]) : null,
              place_id: place.place_id
            }))
            .slice(0, 10); // Limit to 10 results

          resolve(sriLankanCities);
        } else {
          console.warn('Places search failed:', status);
          // Fallback to popular cities if search fails
          resolve(POPULAR_SRI_LANKAN_CITIES.filter(city => 
            city.name.toLowerCase().includes(query.toLowerCase())
          ));
        }
      });
    } catch (error) {
      console.error('Error searching cities:', error);
      resolve(POPULAR_SRI_LANKAN_CITIES.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase())
      ));
    }
  });
};

// Helper function to get photo URL from Google Places photo
const getPhotoUrl = (photo, maxWidth = 400) => {
  if (!photo || !photo.getUrl) return null;
  return photo.getUrl({ maxWidth });
};

// API Functions for backend integration
// Search activities with preferences and proximity optimization
const searchActivities = async (tripId, searchParams) => {
  const userId = getUserUID();
  console.log('🔍 Searching activities for trip:', tripId, 'with params:', searchParams, 'userId:', userId);
  const params = new URLSearchParams({
    query: searchParams.query || '',
    city: searchParams.city || '',
    lastPlaceId: searchParams.lastPlaceId || '',
    maxResults: searchParams.maxResults || 10,
    userId: userId || ''
  });
  try {
    const fullUrl = `/trip/${tripId}/search/activities?${params}`;
    console.log('📡 Making API request to:', fullUrl);
    const response = await tripPlanningApi.get(fullUrl, { withCredentials: true });
    console.log('📨 API Response status:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Activities search error:', error);
    throw error;
  }
};

// Search accommodation with preference-based filtering
const searchAccommodation = async (tripId, searchParams) => {
  const userId = getUserUID();
  console.log('🔍 Searching accommodation for trip:', tripId, 'with params:', searchParams, 'userId:', userId);
  const params = new URLSearchParams({
    query: searchParams.query || '',
    city: searchParams.city || '',
    lastPlaceId: searchParams.lastPlaceId || '',
    maxResults: searchParams.maxResults || 10,
    userId: userId || ''
  });
  try {
    const fullUrl = `/trip/${tripId}/search/accommodation?${params}`;
    console.log('📡 Making API request to:', fullUrl);
    const response = await tripPlanningApi.get(fullUrl, { withCredentials: true });
    console.log('📨 API Response status:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Accommodation search error:', error);
    throw error;
  }
};

// Search dining options with preference and proximity matching
const searchDining = async (tripId, searchParams) => {
  const userId = getUserUID();
  console.log('🔍 Searching dining for trip:', tripId, 'with params:', searchParams, 'userId:', userId);
  const params = new URLSearchParams({
    query: searchParams.query || '',
    city: searchParams.city || '',
    lastPlaceId: searchParams.lastPlaceId || '',
    maxResults: searchParams.maxResults || 10,
    userId: userId || ''
  });
  try {
    const fullUrl = `/trip/${tripId}/search/dining?${params}`;
    console.log('📡 Making API request to:', fullUrl);
    const response = await tripPlanningApi.get(fullUrl, { withCredentials: true });
    console.log('📨 API Response status:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Dining search error:', error);
    throw error;
  }
};

// Add place to a specific day with detailed context
const addPlaceToDay = async (tripId, dayNumber, placeData, userId) => {
  try {
    const response = await tripPlanningApi.post(`/trip/${tripId}/day/${dayNumber}/add-place`, {
      userId: userId,
      placeName: placeData.name,
      city: placeData.location || placeData.city,
      dayNumber: dayNumber,
      placeType: placeData.type || placeData.category || 'ATTRACTION',
      estimatedVisitDurationMinutes: placeData.durationMinutes || placeData.duration || 120,
      preferredTimeSlot: placeData.timeSlot || 'morning',
      priority: placeData.priority || 5
    }, { withCredentials: true });
    if (response.status !== 200) {
      throw new Error(`Failed to add place to day: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error('❌ Add place to day error:', error);
    throw error;
  }
};

// Retrieve complete trip information
const getTripDetails = async (tripId) => {
  try {
    console.log('📥 Fetching trip details for tripId:', tripId);
    const response = await tripPlanningApi.get(`/trip/${tripId}`, { withCredentials: true });
    if (response.status !== 200) {
      throw new Error(`Failed to get trip details: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error('❌ Get trip details error:', error);
    throw error;
  }
};

const TripItineraryPage = () => {
  const location = useRouterLocation();
  const navigate = useNavigate();
  const { tripName, selectedDates, selectedTerrains, selectedActivities, tripId, trip, userUid } = location.state || {};
  
  console.log('📍 TripItineraryPage received:', { tripName, selectedDates, tripId, userUid });
  
  const [currentDay, setCurrentDay] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [itinerary, setItinerary] = useState({});
  const [expandedDays, setExpandedDays] = useState({});
  const [selectedStayDates, setSelectedStayDates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Destination management states
  const [destinations, setDestinations] = useState({}); // dayIndex -> destination
  const [availableCities, setAvailableCities] = useState([]);
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  
  // Backend data states
  const [backendSuggestions, setBackendSuggestions] = useState({
    activities: [],
    places: [],
    food: []
  });
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [lastSearchParams, setLastSearchParams] = useState(null);

  // Generate days array from selected dates
  const generateDays = () => {
    if (!selectedDates || selectedDates.length < 2) return [];
    
    const days = [];
    const startDate = new Date(selectedDates[0]);
    const endDate = new Date(selectedDates[1]);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    
    return days;
  };

  const days = generateDays();

  useEffect(() => {
    // Initialize empty itinerary for each day and expand first few days
    const initialItinerary = {};
    const initialExpanded = {};
    days.forEach((day, index) => {
      initialItinerary[index] = {
        date: day,
        activities: [],
        places: [],
        food: [],
        transportation: []
      };
      // Expand first 3 days by default
      initialExpanded[index] = index < 1;
    });
    setItinerary(initialItinerary);
    setExpandedDays(initialExpanded);
  }, [days.length]);

  const mockSuggestions = {
    activities: [
      { 
        id: 1, 
        name: 'Sigiriya Rock Fortress', 
        location: 'Sigiriya', 
        duration: '3 hours', 
        rating: 4.8,
        reviews: 2847,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        description: 'Ancient rock fortress with stunning views',
        price: '$25'
      },
      { 
        id: 2, 
        name: 'Temple of the Tooth', 
        location: 'Kandy', 
        duration: '2 hours', 
        rating: 4.7,
        reviews: 1923,
        image: 'https://images.unsplash.com/photo-1546172799-48f3b4e1c4e3?w=400&h=300&fit=crop',
        description: 'Sacred Buddhist temple housing Buddha\'s tooth relic',
        price: '$15'
      },
      { 
        id: 3, 
        name: 'Galle Fort', 
        location: 'Galle', 
        duration: '2-3 hours', 
        rating: 4.6,
        reviews: 3421,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        description: 'Historic colonial fort with ocean views',
        price: '$10'
      },
      { 
        id: 4, 
        name: 'Ella Rock Hike', 
        location: 'Ella', 
        duration: '4-5 hours', 
        rating: 4.9,
        reviews: 892,
        image: 'https://images.unsplash.com/photo-1566054992766-3d4677dccb67?w=400&h=300&fit=crop',
        description: 'Challenging hike with panoramic mountain views',
        price: 'Free'
      },
      { 
        id: 5, 
        name: 'Whale Watching Tour', 
        location: 'Mirissa', 
        duration: '3-4 hours', 
        rating: 4.5,
        reviews: 1234,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        description: 'Spot blue whales and dolphins in their natural habitat',
        price: '$45'
      },
      { 
        id: 6, 
        name: 'Safari at Yala National Park', 
        location: 'Yala', 
        duration: '6 hours', 
        rating: 4.7,
        reviews: 987,
        image: 'https://images.unsplash.com/photo-1549366021-9f761d040a87?w=400&h=300&fit=crop',
        description: 'Wildlife safari to see leopards, elephants, and birds',
        price: '$65'
      }
    ],
    places: [
      { 
        id: 1, 
        name: 'Jetwing Spa', 
        location: 'Negombo', 
        price: '$120/night', 
        rating: 4.5,
        reviews: 1834,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
        description: 'Luxury beachfront resort with spa facilities'
      },
      { 
        id: 2, 
        name: 'Grand Sands Hotel', 
        location: 'Kandy', 
        price: '$85/night', 
        rating: 4.3,
        reviews: 967,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
        description: 'Modern hotel in the heart of Kandy'
      },
      { 
        id: 3, 
        name: 'Galle Face Hotel', 
        location: 'Colombo', 
        price: '$200/night', 
        rating: 4.7,
        reviews: 2156,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
        description: 'Historic luxury hotel facing the Indian Ocean'
      },
      { 
        id: 4, 
        name: 'Heritance Tea Factory', 
        location: 'Nuwara Eliya', 
        price: '$180/night', 
        rating: 4.6,
        reviews: 743,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
        description: 'Unique hotel converted from a tea factory'
      },
      { 
        id: 5, 
        name: 'Anantara Peace Haven', 
        location: 'Tangalle', 
        price: '$350/night', 
        rating: 4.8,
        reviews: 456,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
        description: 'Luxury beachfront resort with clifftop location'
      }
    ],
    cities: [
      { 
        id: 1, 
        name: 'Colombo', 
        region: 'Western Province', 
        description: 'Bustling capital city with modern attractions and historic sites', 
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
        highlights: ['Galle Face Green', 'National Museum', 'Pettah Market', 'Red Mosque'],
        accommodations: 156,
        averagePrice: '$85/night'
      },
      { 
        id: 2, 
        name: 'Kandy', 
        region: 'Central Province', 
        description: 'Cultural capital surrounded by hills and home to sacred temples', 
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
        highlights: ['Temple of the Tooth', 'Kandy Lake', 'Royal Botanical Gardens', 'Cultural Shows'],
        accommodations: 89,
        averagePrice: '$65/night'
      },
      { 
        id: 3, 
        name: 'Galle', 
        region: 'Southern Province', 
        description: 'Historic coastal city with colonial Dutch architecture', 
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        highlights: ['Galle Fort', 'Dutch Reformed Church', 'Maritime Museum', 'Beaches'],
        accommodations: 67,
        averagePrice: '$95/night'
      },
      { 
        id: 4, 
        name: 'Ella', 
        region: 'Uva Province', 
        description: 'Mountain town famous for hiking trails and tea plantations', 
        image: 'https://images.unsplash.com/photo-1566054992766-3d4677dccb67?w=400&h=300&fit=crop',
        highlights: ['Nine Arch Bridge', 'Little Adam\'s Peak', 'Ella Rock', 'Tea Factories'],
        accommodations: 43,
        averagePrice: '$55/night'
      },
      { 
        id: 5, 
        name: 'Nuwara Eliya', 
        region: 'Central Province', 
        description: 'Cool climate hill station known as "Little England"', 
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
        highlights: ['Horton Plains', 'Gregory Lake', 'Tea Plantations', 'Victoria Park'],
        accommodations: 71,
        averagePrice: '$75/night'
      },
      { 
        id: 6, 
        name: 'Sigiriya', 
        region: 'North Central Province', 
        description: 'Ancient city home to the famous Lion Rock fortress', 
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        highlights: ['Sigiriya Rock', 'Pidurangala Rock', 'Ancient Frescoes', 'Water Gardens'],
        accommodations: 34,
        averagePrice: '$110/night'
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
        image: 'https://images.unsplash.com/photo-1559847844-d825b6b9f5b1?w=400&h=300&fit=crop',
        description: 'World-renowned restaurant specializing in Sri Lankan crab',
        priceRange: '$30-50'
      },
      { 
        id: 2, 
        name: 'The Station Restaurant', 
        location: 'Kandy', 
        cuisine: 'International', 
        rating: 4.4,
        reviews: 892,
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
        description: 'Fine dining with mountain views',
        priceRange: '$15-25'
      },
      { 
        id: 3, 
        name: 'Pedlar\'s Inn Cafe', 
        location: 'Galle', 
        cuisine: 'Local', 
        rating: 4.5,
        reviews: 1456,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
        description: 'Charming cafe in historic Galle Fort',
        priceRange: '$8-15'
      }
    ],
    transportation: [
      { 
        id: 1, 
        name: 'Private Car with Driver', 
        type: 'Car Rental', 
        price: '$50/day', 
        rating: 4.6,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
        description: 'Comfortable air-conditioned vehicle with experienced driver',
        features: ['AC', 'English Speaking Driver', 'Fuel Included']
      },
      { 
        id: 2, 
        name: 'Blue Line Train', 
        type: 'Train', 
        price: '$15', 
        rating: 4.8,
        reviews: 1567,
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
        description: 'Scenic train journey through tea plantations',
        features: ['Scenic Route', 'Observation Car', 'First Class Available']
      },
      { 
        id: 3, 
        name: 'Tuk Tuk Adventure', 
        type: 'Local Transport', 
        price: '$25/day', 
        rating: 4.4,
        reviews: 678,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        description: 'Authentic local experience with tuk tuk tours',
        features: ['Local Guide', 'Flexible Stops', 'Cultural Experience']
      }
    ]
  };

  // Function to check if a day has a destination
  const dayHasDestination = (dayIndex) => {
    return destinations[dayIndex] !== undefined;
  };

  // Function to get destination for a day
  const getDestinationForDay = (dayIndex) => {
    return destinations[dayIndex] || null;
  };

  // Search cities using Google Places API
  const searchCities = async (query = '') => {
    setIsSearchingCities(true);
    try {
      const cities = await searchSriLankanCities(query);
      setAvailableCities(cities);
    } catch (error) {
      console.error('Error searching cities:', error);
      setAvailableCities(POPULAR_SRI_LANKAN_CITIES);
    } finally {
      setIsSearchingCities(false);
    }
  };

  // Initialize cities on component mount
  useEffect(() => {
    searchCities();
  }, []);

  // Search cities when query changes (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (showDestinationModal) {
        searchCities(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, showDestinationModal]);
  
  useEffect(() => {
    // Initialize empty itinerary for each day and expand first few days
    const initialItinerary = {};
    const initialExpanded = {};
    days.forEach((day, index) => {
      initialItinerary[index] = {
        date: day,
        activities: [],
        places: [],
        food: [],
        transportation: []
      };
      // Expand first 3 days by default
      initialExpanded[index] = index < 1;
    });
    setItinerary(initialItinerary);
    setExpandedDays(initialExpanded);
  }, [days.length]);

  const handleAddItem = (category, dayIndex) => {
    console.log('🎯 Add button clicked for category:', category, 'dayIndex:', dayIndex);
    setSelectedCategory(category);
    setCurrentDay(dayIndex);
    
    if (category === 'Destinations') {
      console.log('🏙️ Opening destination modal with Google Places API');
      setShowDestinationModal(true);
      // Reset search query when opening destination modal
      setSearchQuery('');
      // Load initial cities
      searchCities('');
    } else {
      // Check if destination is required for this day
      if (!dayHasDestination(dayIndex)) {
        alert('Please add a destination for this day first before adding other activities.');
        return;
      }
      
      console.log('📋 Opening modal for category:', category);
      setShowAddModal(true);
      
      // Fetch backend data when specific category button is clicked
      if (['activities', 'places', 'food'].includes(category)) {
        console.log('🚀 Fetching backend data for category:', category);
        fetchBackendSuggestions(category, { 
          query: '',  // Start with empty search
          maxResults: 20 
        });
      }
    }
  };

  // Enhanced addItemToItinerary to sync with backend after add
  const addItemToItinerary = async (item, selectedDates = null) => {
    // Handle destination selection separately
    if (showDestinationModal) {
      console.log('🏙️ Adding destination:', item, 'to day:', currentDay);
      
      // Update destinations state
      setDestinations(prev => ({
        ...prev,
        [currentDay]: item
      }));
      
      // Close modal and reset state
      setShowDestinationModal(false);
      setSearchQuery('');
      return;
    }

    // Helper function to get category key
    const getCategoryKey = (category) => {
      if (category === 'activities') return 'activities';
      if (category === 'places') return 'places';
      if (category === 'food') return 'food';
      if (category === 'transportation') return 'transportation';
      return 'activities';
    };

    // Determine which days to add to
    let daysToAdd = [];
    if (selectedDates && selectedDates.length > 0) {
      daysToAdd = selectedDates;
    } else if (currentDay !== undefined && days && days[currentDay]) {
      daysToAdd = [days[currentDay]];
    }

    // Map days to day indices
    const dayIndices = daysToAdd.map(date => {
      if (date instanceof Date) {
        return days.findIndex(d => d.toDateString() === date.toDateString());
      } else {
        // If date is already an index
        return typeof date === 'number' ? date : days.findIndex(d => d.toDateString() === new Date(date).toDateString());
      }
    }).filter(idx => idx !== -1);

    // Loading state for add operation
    setIsLoadingSuggestions(true);
    let error = null;

    try {
      // For each day, call backend
      await Promise.all(dayIndices.map(async (dayIdx) => {
        await addPlaceToDay(tripId, dayIdx, item, userUid);
      }));
      // Fetch latest trip details from backend
      const tripDetails = await getTripDetails(tripId);
      // Update local itinerary state from backend trip data
      if (tripDetails && tripDetails.trip && tripDetails.trip.itinerary) {
        setItinerary(tripDetails.trip.itinerary);
      }
      setShowAddModal(false);
      setShowDestinationModal(false);
      setSelectedStayDates([]);
    } catch (err) {
      error = err;
      alert('Failed to add item: ' + err.message);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const addItemToItineraryOld = (item, selectedDates = null) => {
    // Helper function to get category key
    const getCategoryKey = (category) => {
      switch(category) {
        case 'Destinations': return 'places';
        case 'activities': return 'activities';
        case 'places': return 'places';
        case 'food': return 'food';
        case 'transportation': return 'transportation';
        default: return 'activities';
      }
    };

    if (selectedDates && selectedDates.length > 0) {
      // Add item to multiple selected days
      selectedDates.forEach(dateIndex => {
        setItinerary(prev => {
          const categoryKey = getCategoryKey(selectedCategory);
          const dayData = prev[dateIndex] || {
            date: days[dateIndex],
            activities: [],
            places: [],
            food: [],
            transportation: []
          };
          
          return {
            ...prev,
            [dateIndex]: {
              ...dayData,
              [categoryKey]: [
                ...(dayData[categoryKey] || []), 
                { ...item, selectedDates: selectedDates, isMultiDay: true }
              ]
            }
          };
        });
      });
    } else {
      // Add to single day (fallback for old logic)
      setItinerary(prev => {
        const categoryKey = getCategoryKey(selectedCategory);
        const dayData = prev[currentDay] || {
          date: days[currentDay],
          activities: [],
          places: [],
          food: [],
          transportation: []
        };
        
        return {
          ...prev,
          [currentDay]: {
            ...dayData,
            [categoryKey]: [
              ...(dayData[categoryKey] || []), 
              item
            ]
          }
        };
      });
    }
    setShowAddModal(false);
    setShowDestinationModal(false);
    setSelectedStayDates([]);
  };

  const handleStayDateSelect = (dayIndex) => {
    setSelectedStayDates(prev => {
      if (prev.includes(dayIndex)) {
        return prev.filter(d => d !== dayIndex);
      } else {
        return [...prev, dayIndex].sort((a, b) => a - b);
      }
    });
  };

  // Function to fetch backend suggestions based on category
  const fetchBackendSuggestions = async (category, searchParams = {}) => {
    if (!tripId) {
      console.warn('⚠️ No tripId available for backend search, tripId:', tripId);
      console.log('🔍 Available location state:', { tripName, selectedDates, tripId, userUid });
      return [];
    }

    console.log('🔄 Fetching backend suggestions for category:', category, 'params:', searchParams);
    console.log('🆔 Using tripId:', tripId);
    setIsLoadingSuggestions(true);
    
    try {
      let searchFunction;
      let cacheKey;
      
      switch(category) {
        case 'activities':
          searchFunction = searchActivities;
          cacheKey = 'activities';
          console.log('🎯 Using activities search function');
          break;
        case 'places':
          searchFunction = searchAccommodation;
          cacheKey = 'places';
          console.log('🏨 Using accommodation search function');
          break;
        case 'food':
          searchFunction = searchDining;
          cacheKey = 'food';
          console.log('🍽️ Using dining search function');
          break;
        default:
          console.warn('⚠️ Unknown category for backend search:', category);
          return mockSuggestions[category] || [];
      }

      const result = await searchFunction(tripId, searchParams);
      
      // Update backend suggestions cache
      setBackendSuggestions(prev => ({
        ...prev,
        [cacheKey]: result.data || result || []
      }));
      
      setLastSearchParams({ category, searchParams });
      console.log('✅ Backend suggestions updated for', category, ':', result);
      console.log('📊 Cached suggestions count:', (result.data || result || []).length);
      
      return result.data || result || [];
    } catch (error) {
      console.error('❌ Failed to fetch backend suggestions:', error);
      console.log('🔄 Falling back to mock data on error for category:', category);
      // Fallback to mock data on error
      return mockSuggestions[category] || [];
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Enhanced getFilteredSuggestions to use backend data
  const getFilteredSuggestions = async () => {
    const suggestionsKey = showDestinationModal ? 'cities' : selectedCategory;
    
    console.log('🔍 Getting filtered suggestions for:', suggestionsKey, 'query:', searchQuery);
    
    // For destinations (cities), still use mock data
    if (showDestinationModal) {
      if (!searchQuery) return mockSuggestions.cities || [];
      
      return (mockSuggestions.cities || []).filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.region && item.region.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // For other categories, try backend first
    if (['activities', 'places', 'food'].includes(selectedCategory)) {
      const searchParams = {
        query: searchQuery,
        maxResults: 20
      };
      
      // Check if we need to refetch (different search or no cached data)
      const needsRefetch = !lastSearchParams || 
                          lastSearchParams.category !== selectedCategory ||
                          lastSearchParams.searchParams?.query !== searchQuery ||
                          !backendSuggestions[selectedCategory]?.length;
      
      if (needsRefetch) {
        console.log('🔄 Fetching fresh backend data...');
        const backendData = await fetchBackendSuggestions(selectedCategory, searchParams);
        return backendData;
      } else {
        console.log('📊 Using cached backend data for', selectedCategory);
        return backendSuggestions[selectedCategory] || [];
      }
    }
    
    // Fallback to mock suggestions with search filter
    const suggestions = mockSuggestions[suggestionsKey] || [];
    if (!searchQuery) return suggestions;
    
    return suggestions.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.destination && item.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.region && item.region.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  // Wrapper function for modals to handle async suggestions
  const getSuggestionsForModal = () => {
    const suggestionsKey = showDestinationModal ? 'cities' : selectedCategory;
    
    console.log('🔍 getSuggestionsForModal called for:', suggestionsKey, 'searchQuery:', searchQuery);
    
    // For destinations, return Google Places API results
    if (showDestinationModal) {
      console.log('📋 Returning available cities from Google Places API:', availableCities.length, 'items');
      return availableCities;
    }
    
    // For backend categories, return cached data if available
    if (['activities', 'places', 'food'].includes(selectedCategory)) {
      const cachedData = backendSuggestions[selectedCategory] || [];
      console.log('📊 Backend cached data for', selectedCategory, ':', cachedData.length, 'items');
      
      // If no cached data and not currently loading, show empty state
      if (cachedData.length === 0 && !isLoadingSuggestions) {
        console.log('📭 No cached data available and not loading - showing empty state');
        return [];
      }
      
      if (!searchQuery) {
        console.log('📋 Returning all cached backend data (no search query)');
        return cachedData;
      }
      
      const filtered = cachedData.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('📋 Returning filtered backend data:', filtered.length, 'items');
      return filtered;
    }
    
    // Fallback to mock suggestions
    console.log('🔄 Falling back to mock suggestions for:', suggestionsKey);
    const suggestions = mockSuggestions[suggestionsKey] || [];
    if (!searchQuery) return suggestions;
    
    return suggestions.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.destination && item.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.region && item.region.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  // Effect to refetch when search query changes (with debounce)
  useEffect(() => {
    if (!showAddModal || !selectedCategory || !['activities', 'places', 'food'].includes(selectedCategory)) {
      return;
    }

    console.log('🔍 Search query effect triggered - query:', searchQuery, 'category:', selectedCategory);
    
    const timeoutId = setTimeout(() => {
      if (searchQuery !== (lastSearchParams?.searchParams?.query || '')) {
        console.log('🔍 Search query changed, refetching suggestions...', {
          newQuery: searchQuery,
          oldQuery: lastSearchParams?.searchParams?.query
        });
        fetchBackendSuggestions(selectedCategory, { 
          query: searchQuery,
          maxResults: 20 
        });
      } else {
        console.log('🔍 Search query unchanged, skipping refetch');
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, showAddModal, selectedCategory]);

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
    navigate('/trip-preferences', { 
      state: { tripName, selectedDates } 
    });
  };

  const handleSaveTrip = () => {
    navigate('/trips', {
      state: {
        newTrip: {
          name: tripName,
          dates: selectedDates,
          terrains: selectedTerrains,
          activities: selectedActivities,
          itinerary: itinerary,
          createdAt: new Date()
        }
      }
    });
  };

  if (!tripName || !selectedDates) {
    return <div>Loading...</div>;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Spacer to prevent overlap with fixed/floating navbar */}
      <div className="h-20 md:h-24 lg:h-28"></div>
      {/* Trip Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 pt-2 pb-1">
          <TripProgressBar currentStep={4} completedSteps={[1, 2, 3]} tripName={tripName} />
        </div>
      </div>

      {/* Trip Header removed as per request */}

      {/* Removed Itinerary tab and horizontal line as per request */}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Itinerary */}
          <div className="w-full lg:w-1/2">
            <p className="text-gray-600 text-sm mb-6">What's a trip without experiences?</p>
            
            {/* Day Timeline */}
            <div className="space-y-0">
              {days.map((day, dayIndex) => {
                const dayItinerary = itinerary[dayIndex] || { activities: [], places: [], food: [], transportation: [] };
                const isExpanded = expandedDays[dayIndex];
                const hasItems = dayItinerary.activities.length > 0 || dayItinerary.places.length > 0 || 
                               dayItinerary.food.length > 0 || dayItinerary.transportation.length > 0;
                
                return (
                  <div key={dayIndex} className="border-l-2 border-gray-200 relative">
                    {/* Day Header */}
                    <div className="flex items-center mb-4 -ml-3">
                      <div className="bg-white border-4 border-gray-200 w-6 h-6 rounded-full"></div>
                      <button 
                        onClick={() => toggleDayExpansion(dayIndex)}
                        className="ml-4 flex items-center text-lg font-semibold text-gray-900 hover:text-primary-600"
                      >
                        {formatDate(day)}
                        <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Day Content */}
                    {isExpanded && (
                      <div className="ml-6 pb-8">
                        {/* Destination Display */}
                        {destinations[dayIndex] ? (
                          <div className="mb-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-primary-900">{destinations[dayIndex].name}</h4>
                                <p className="text-sm text-primary-700">
                                  {destinations[dayIndex].address || 'Sri Lanka'}
                                </p>
                              </div>
                              <button 
                                onClick={() => handleAddItem('Destinations', dayIndex)}
                                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                              >
                                Change
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="text-center">
                              <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600 mb-3">Add a destination for this day first</p>
                              <button 
                                onClick={() => handleAddItem('Destinations', dayIndex)}
                                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                              >
                                Add Destination
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Added Items */}
                        {hasItems ? (
                          <div className="space-y-3 mb-6">
                            {Object.entries(dayItinerary).map(([category, items]) => {
                              // Ensure items is always an array before mapping
                              if (!Array.isArray(items) || items.length === 0) return null;
                              
                              const getCategoryIcon = (category) => {
                                switch(category) {
                                  case 'activities': return <Camera className="w-4 h-4 text-primary-600" />;
                                  case 'places': return <MapPin className="w-4 h-4 text-primary-600" />;
                                  case 'food': return <Utensils className="w-4 h-4 text-primary-600" />;
                                  case 'transportation': return <Car className="w-4 h-4 text-primary-600" />;
                                  default: return <MapPin className="w-4 h-4 text-primary-600" />;
                                }
                              };

                              const getCategoryName = (category) => {
                                switch(category) {
                                  case 'activities': return 'Things to Do';
                                  case 'places': return 'Places to Stay';
                                  case 'food': return 'Dining';
                                  case 'transportation': return 'Transportation';
                                  default: return category;
                                }
                              };
                              
                              return items.map((item, itemIndex) => (
                                <div key={`${category}-${itemIndex}`} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        {getCategoryIcon(category)}
                                        <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                                          {getCategoryName(category)}
                                        </span>
                                        {item.isMultiDay && (
                                          <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                                            Multi-day
                                          </span>
                                        )}
                                      </div>
                                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                                      <p className="text-sm text-gray-500">{item.location}</p>
                                      {item.duration && <p className="text-xs text-gray-400 mt-1">{item.duration}</p>}
                                      {item.description && (
                                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                                      )}
                                      {item.price && <p className="text-sm font-medium text-gray-900 mt-2">{item.price}</p>}
                                    </div>
                                    <div className="text-right ml-4">
                                      {item.rating && (
                                        <p className="text-xs text-yellow-600 mb-2">★ {item.rating}</p>
                                      )}
                                      <button className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ));
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 mb-6">
                            <div className="text-gray-400 mb-2">
                              <Calendar className="w-8 h-8 mx-auto" />
                            </div>
                            <p className="text-gray-500 text-sm mb-1">No activities planned for this day</p>
                            <p className="text-gray-400 text-xs">Use the buttons below to add activities, places, dining, or transportation</p>
                          </div>
                        )}

                        {/* Category Addition Buttons */}
                        {destinations[dayIndex] ? (
                          <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200">
                            <button 
                              onClick={() => handleAddItem('activities', dayIndex)}
                              className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg group border border-gray-200 w-24 h-20"
                              title="Add Things to Do"
                            >
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 mb-1">
                                <Camera className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
                              </div>
                              <span className="text-xs text-gray-600 group-hover:text-primary-600 text-center leading-tight">Things to Do</span>
                            </button>
                            <button 
                              onClick={() => handleAddItem('places', dayIndex)}
                              className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg group border border-gray-200 w-24 h-20"
                              title="Add Places to Stay"
                            >
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 mb-1">
                                <Bed className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
                              </div>
                              <span className="text-xs text-gray-600 group-hover:text-primary-600 text-center leading-tight">Places to Stay</span>
                            </button>
                            <button 
                              onClick={() => handleAddItem('food', dayIndex)}
                              className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg group border border-gray-200 w-24 h-20"
                              title="Add Dining"
                            >
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 mb-1">
                                <Utensils className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
                              </div>
                              <span className="text-xs text-gray-600 group-hover:text-primary-600 text-center leading-tight">Dining</span>
                            </button>
                          </div>
                        ) : (
                          <div className="pt-4 border-t border-gray-200">
                            <div className="text-center py-4">
                              <p className="text-sm text-gray-500 mb-3">
                                Please add a destination first to unlock activities, places, and dining options for this day.
                              </p>
                              <div className="flex items-center justify-center space-x-4 opacity-50 pointer-events-none">
                                <div className="flex flex-col items-center p-3 border border-gray-200 w-24 h-20 rounded-lg">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                                    <Camera className="w-4 h-4 text-gray-400" />
                                  </div>
                                  <span className="text-xs text-gray-400 text-center leading-tight">Things to Do</span>
                                </div>
                                <div className="flex flex-col items-center p-3 border border-gray-200 w-24 h-20 rounded-lg">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                                    <Bed className="w-4 h-4 text-gray-400" />
                                  </div>
                                  <span className="text-xs text-gray-400 text-center leading-tight">Places to Stay</span>
                                </div>
                                <div className="flex flex-col items-center p-3 border border-gray-200 w-24 h-20 rounded-lg">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                                    <Utensils className="w-4 h-4 text-gray-400" />
                                  </div>
                                  <span className="text-xs text-gray-400 text-center leading-tight">Dining</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Collapsed Day Summary */}
                    {!isExpanded && hasItems && (
                      <div className="ml-6 pb-8">
                        <div className="text-sm text-gray-600">
                          {Object.entries(dayItinerary).reduce((total, [, items]) => total + items.length, 0)} items planned
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="w-full lg:w-1/2">
            <div className="sticky top-6">
              <div className="bg-gray-100 rounded-lg h-[calc(100vh-12rem)] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Interactive map</p>
                  <p className="text-xs">Your trip destinations will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="w-full lg:w-1/2">
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              className="bg-white border border-primary-600 text-primary-600 px-6 py-2 rounded-lg shadow hover:bg-primary-50 font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSaveTrip}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg shadow hover:bg-primary-700 font-medium transition-colors"
            >
              Save Trip
            </button>
          </div>
        </div>
      </div>

      {/* Modularized Add Item Modals */}
      <AddThingsToDoModal
        show={showAddModal && selectedCategory === 'activities'}
        onClose={() => {
          console.log('🚪 Closing Things to Do modal');
          setShowAddModal(false);
          setSelectedStayDates([]);
          setSearchQuery('');
          // Clear cached suggestions for fresh data next time
          setBackendSuggestions(prev => ({
            ...prev,
            activities: []
          }));
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getFilteredSuggestions={getSuggestionsForModal}
        selectedStayDates={selectedStayDates}
        setSelectedStayDates={setSelectedStayDates}
        days={days}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
        isLoading={isLoadingSuggestions}
        tripId={tripId}
      />
      <AddPlacesToStayModal
        show={showAddModal && selectedCategory === 'places'}
        onClose={() => {
          console.log('🚪 Closing Places to Stay modal');
          setShowAddModal(false);
          setSelectedStayDates([]);
          setSearchQuery('');
          // Clear cached suggestions for fresh data next time
          setBackendSuggestions(prev => ({
            ...prev,
            places: []
          }));
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getFilteredSuggestions={getSuggestionsForModal}
        selectedStayDates={selectedStayDates}
        setSelectedStayDates={setSelectedStayDates}
        days={days}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
        isLoading={isLoadingSuggestions}
        tripId={tripId}
      />
      <AddFoodAndDrinkModal
        show={showAddModal && selectedCategory === 'food'}
        onClose={() => {
          console.log('🚪 Closing Food & Drink modal');
          setShowAddModal(false);
          setSelectedStayDates([]);
          setSearchQuery('');
          // Clear cached suggestions for fresh data next time
          setBackendSuggestions(prev => ({
            ...prev,
            food: []
          }));
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getFilteredSuggestions={getSuggestionsForModal}
        selectedStayDates={selectedStayDates}
        setSelectedStayDates={setSelectedStayDates}
        days={days}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
        isLoading={isLoadingSuggestions}
        tripId={tripId}
      />
      <AddTransportationModal
        show={showAddModal && selectedCategory === 'transportation'}
        onClose={() => {
          setShowAddModal(false);
          setSelectedStayDates([]);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getFilteredSuggestions={getFilteredSuggestions}
        selectedStayDates={selectedStayDates}
        setSelectedStayDates={setSelectedStayDates}
        days={days}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
      />

      <AddDestinationModal
        show={showDestinationModal}
        onClose={() => {
          setShowDestinationModal(false);
          setSelectedStayDates([]);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getFilteredSuggestions={getSuggestionsForModal}
        dayIndex={currentDay}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
        isSearchingCities={isSearchingCities}
      />
    </div>
  );
};

export default TripItineraryPage;

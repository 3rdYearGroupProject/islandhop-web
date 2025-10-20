import React, { useState, useEffect } from 'react';
import { useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import { MapPin, Plus, Utensils, Bed, Car, Camera, Search, Calendar, ChevronDown, Clock, Users, Star } from 'lucide-react';
import AddDestinationModal from '../../components/AddDestinationModal';
import AddThingsToDoModal from '../../components/AddThingsToDoModal';
import AddPlacesToStayModal from '../../components/AddPlacesToStayModal';
import AddFoodAndDrinkModal from '../../components/AddFoodAndDrinkModal';
import AddTransportationModal from '../../components/AddTransportationModal';
import { tripPlanningApi } from '../../api/axios';
import { PoolsApi } from '../../api/poolsApi';
import { useAuth } from '../../hooks/useAuth';
import { getUserUID } from '../../utils/userStorage';
import JoinPoolModal from '../../components/JoinPoolModal';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
// Import the trip progress bar component (assume it's named TripProgressBar and in components)
import TripProgressBar from '../../components/TripProgressBar';
// import { createTripItinerary } from '../api/tripApi'; // Moved to TripPreferencesPage

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

const PoolItineraryPage = () => {
  const location = useRouterLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Extract and normalize all navigation state data from PoolPreferencesPage
  const {
    tripId,
    groupId,
    tripName,
    poolName,
    startDate,
    endDate,
    userUid,
    joinedGroup,
    selectedTerrains,
    selectedActivities,
    // Legacy support for old navigation format
    selectedDates,
    trip
  } = location.state || {};

  // Normalize dates: use startDate/endDate if available, fallback to selectedDates
  const normalizedDates = startDate && endDate 
    ? [new Date(startDate), new Date(endDate)]
    : selectedDates || [];

  // Normalize trip name: use tripName if available, fallback to poolName
  const normalizedTripName = tripName || poolName;

  // Normalize preferences: ensure they are arrays
  const normalizedTerrains = selectedTerrains || [];
  const normalizedActivities = selectedActivities || [];
  
  console.log('📍 PoolItineraryPage received navigation state:', { 
    tripId, 
    groupId, 
    tripName: normalizedTripName, 
    dates: normalizedDates, 
    userUid, 
    joinedGroup,
    terrains: normalizedTerrains,
    activities: normalizedActivities
  });

  // Validate required navigation data
  if (!tripId || !groupId) {
    console.error('❌ Missing required navigation data:', {
      tripId: tripId || 'MISSING',
      groupId: groupId || 'MISSING',
      userUid: userUid || 'MISSING'
    });
    
    // You can either redirect back or show an error message
    // For now, let's continue but log the issue clearly
  }

  // Usage of normalized navigation state throughout the component:
  // - normalizedTripName: Used in UI display, progress bar, and save operations
  // - normalizedDates: Used for generating trip days and backend API calls
  // - normalizedTerrains/normalizedActivities: Used for filtering suggestions (future implementation)
  // - tripId: Used for backend itinerary API calls
  // - groupId: Used for pool management and navigation
  // - userUid: Used for user-specific backend operations
  // - joinedGroup: Used for conditional UI rendering (join/leave buttons)
  
  const [currentDay, setCurrentDay] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [itinerary, setItinerary] = useState({});
  const [expandedDays, setExpandedDays] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Destination management states
  const [destinations, setDestinations] = useState({}); // dayIndex -> destination
  const [availableCities, setAvailableCities] = useState([]);
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [isSavingTrip, setIsSavingTrip] = useState(false);
  
  // Trip suggestions states
  const [showSimilarTrips, setShowSimilarTrips] = useState(false);
  const [similarTrips, setSimilarTrips] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedTripToJoin, setSelectedTripToJoin] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isFinalizingTrip, setIsFinalizingTrip] = useState(false);
  
  // --- End of state variables ---
  const [isCreator, setIsCreator] = useState(false); // Will be determined from group data
  
  // Mock data for trip planning
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

  // Generate days array from normalized dates
  const generateDays = () => {
    if (!normalizedDates || normalizedDates.length < 2) return [];
    
    const days = [];
    const startDate = new Date(normalizedDates[0]);
    const endDate = new Date(normalizedDates[1]);
    
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

  // Remove all backend integration functions
  // (searchActivities, searchAccommodation, searchDining, addPlaceToDay, addCityToDay, updateTripCities, getTripDetails)

  // Helper function to check if a day has a destination
  const dayHasDestination = (dayIndex) => {
    return destinations[dayIndex] && destinations[dayIndex].name;
  };

  const handleAddItem = (category, dayIndex) => {
    console.log('🎯 Add button clicked for category:', category, 'dayIndex:', dayIndex);
    setSelectedCategory(category);
    setCurrentDay(dayIndex);
    
    if (category === 'Destinations') {
      console.log('🏙️ Opening destination modal with Google Places API');
      setShowDestinationModal(true);
      // Reset search query when opening destination modal
      setSearchQuery('');
    } else {
      // Check if destination is required for this day
      if (!dayHasDestination(dayIndex)) {
        alert('Please add a destination for this day first before adding other activities.');
        return;
      }
      
      console.log('📋 Opening modal for category:', category);
      setShowAddModal(true);
    }
  };

  // Add item to itinerary using both local state and backend
  const addItemToItinerary = async (item, selectedDates = null) => {
    console.log('🚀 ADD ITEM TO ITINERARY START');
    console.log('📍 Item details:', item);
    console.log('📅 Selected dates:', selectedDates);
    console.log('🏠 Show destination modal:', showDestinationModal);
    console.log('📋 Current category:', selectedCategory);
    console.log('📅 Current day:', currentDay);
    
    // Handle destination selection separately
    if (showDestinationModal) {
      console.log('🏙️ DESTINATION ADDITION FLOW');
      console.log('🏙️ Adding destination:', item, 'to day:', currentDay);
      
      // Add destination to local state only
      setDestinations(prev => ({ ...prev, [currentDay]: { name: item.name } }));
      setShowDestinationModal(false);
      setSearchQuery('');
      return;
    }

    console.log('🎯 ACTIVITY/PLACE/FOOD ADDITION FLOW');
    
    // Helper function to get category key
    const getCategoryKey = (category) => {
      if (category === 'activities') return 'activities';
      if (category === 'places') return 'places';
      if (category === 'food') return 'food';
      if (category === 'transportation') return 'transportation';
      return 'activities';
    };

    console.log('📂 Category key:', getCategoryKey(selectedCategory));

    // Determine which days to add to
    let daysToAdd = [];
    if (selectedDates && selectedDates.length > 0) {
      daysToAdd = selectedDates;
    } else if (currentDay !== undefined && days && days[currentDay]) {
      daysToAdd = [days[currentDay]];
    }

    console.log('📅 Days to add to:', daysToAdd);

    // Map days to day indices
    const dayIndices = daysToAdd.map(date => {
      if (date instanceof Date) {
        return days.findIndex(d => d.toDateString() === date.toDateString());
      } else {
        // If date is already an index
        return typeof date === 'number' ? date : days.findIndex(d => d.toDateString() === new Date(date).toDateString());
      }
    }).filter(idx => idx !== -1);

    console.log('📊 Day indices to add to:', dayIndices);

    // Add to backend for each day (one place per day as per requirement)
    if (['activities', 'places', 'food'].includes(selectedCategory)) {
      for (const dayIdx of dayIndices) {
        console.log(`🔄 Adding to backend for day ${dayIdx + 1}`);
        const success = await addPlaceToItineraryBackend(item, dayIdx, selectedCategory);
        if (!success) {
          console.warn(`⚠️ Failed to add to backend for day ${dayIdx + 1}, continuing with local state only`);
        }
      }
    }

    // Add to local itinerary state
    setItinerary(prev => {
      const updated = { ...prev };
      dayIndices.forEach(dayIdx => {
        const categoryKey = getCategoryKey(selectedCategory);
        if (!updated[dayIdx]) {
          updated[dayIdx] = {
            date: days[dayIdx],
            activities: [],
            places: [],
            food: [],
            transportation: []
          };
        }
        updated[dayIdx][categoryKey] = [...(updated[dayIdx][categoryKey] || []), item];
      });
      return updated;
    });
    setShowAddModal(false);
    setShowDestinationModal(false);
  };

  // API call function for modals to use directly
  const fetchSuggestionsForModal = async (category, dayIndex) => {
    if (!tripId || !userUid) {
      console.warn('⚠️ No tripId or userUid available for backend search:', { tripId, userUid });
      // Filter mock suggestions based on user preferences
      return filterSuggestionsByPreferences(mockSuggestions[category] || [], category);
    }

    // Map frontend categories to API endpoint types
    const categoryTypeMap = {
      'activities': 'attractions',
      'places': 'hotels', 
      'food': 'restaurants'
    };

    const apiType = categoryTypeMap[category];
    if (!apiType) {
      console.warn('⚠️ Unknown category for API:', category);
      return filterSuggestionsByPreferences(mockSuggestions[category] || [], category);
    }

    // Calculate day number
    const dayNumber = (dayIndex || 0) + 1;

    try {
      console.log('🔄 Fetching suggestions for modal - category:', category, 'type:', apiType, 'day:', dayNumber);
      
      // Include user preferences in API request
      const params = new URLSearchParams({
        userId: userUid
      });
      
      // Add preference filters to API request
      if (normalizedTerrains.length > 0) {
        params.append('terrains', normalizedTerrains.join(','));
      }
      if (normalizedActivities.length > 0) {
        params.append('activities', normalizedActivities.join(','));
      }
      
      console.log('📡 API params with preferences:', params.toString());

      const response = await tripPlanningApi.get(`/itinerary/${tripId}/day/${dayNumber}/suggestions/${apiType}`, {
        params: Object.fromEntries(params)
      });

      console.log('✅ Modal suggestions received:', response.data.length, 'items for', category);
      
      // Transform API response to match expected format
      return response.data.map(item => ({
        id: item.id,
        name: item.name,
        location: item.address,
        address: item.address,
        price: item.price || `Price Level: ${item.priceLevel}`,
        priceLevel: item.priceLevel,
        rating: item.rating,
        reviews: item.reviews,
        image: item.image || 'https://via.placeholder.com/400x300',
        description: `${item.category} - ${item.popularityLevel} popularity`,
        distanceKm: item.distanceKm,
        isOpenNow: item.isOpenNow,
        isRecommended: item.isRecommended,
        latitude: item.latitude,
        longitude: item.longitude,
        source: item.source,
        googlePlaceId: item.googlePlaceId
      }));
    } catch (error) {
      console.error('❌ Error fetching modal suggestions:', error);
      console.log('🔄 Falling back to filtered mock data for category:', category);
      
      // Fallback to filtered mock data on error
      return filterSuggestionsByPreferences(mockSuggestions[category] || [], category);
    }
  };

  // Helper function to filter mock suggestions based on user preferences
  const filterSuggestionsByPreferences = (suggestions, category) => {
    if (!suggestions || suggestions.length === 0) return [];
    
    // For activities, filter based on activity preferences
    if (category === 'activities' && normalizedActivities.length > 0) {
      return suggestions.filter(item => {
        const itemName = item.name.toLowerCase();
        const itemDescription = (item.description || '').toLowerCase();
        
        return normalizedActivities.some(activity => {
          const activityLower = activity.toLowerCase();
          return itemName.includes(activityLower) || 
                 itemDescription.includes(activityLower) ||
                 // Map some activity preferences to suggestion types
                 (activity === 'hiking' && (itemName.includes('rock') || itemName.includes('hike'))) ||
                 (activity === 'wildlife' && (itemName.includes('safari') || itemName.includes('park'))) ||
                 (activity === 'culture' && (itemName.includes('temple') || itemName.includes('fort'))) ||
                 (activity === 'adventure' && (itemName.includes('whale') || itemName.includes('rock')));
        });
      });
    }
    
    // For places, could filter based on terrain preferences in the future
    // For food, return all suggestions for now
    
    return suggestions;
  };

  // API call function to add place to itinerary backend
  const addPlaceToItineraryBackend = async (place, dayIndex, category) => {
    if (!tripId || !userUid) {
      console.warn('⚠️ No tripId or userUid available for adding place to backend:', { tripId, userUid });
      alert('Unable to add place: Missing trip or user information');
      return false;
    }

    // Map frontend categories to API endpoint types
    const categoryTypeMap = {
      'activities': 'attractions',
      'places': 'hotels', 
      'food': 'restaurants'
    };

    const apiType = categoryTypeMap[category];
    if (!apiType) {
      console.warn('⚠️ Unknown category for API:', category);
      alert('Unable to add place: Unknown category');
      return false;
    }

    // Calculate day number
    const dayNumber = (dayIndex || 0) + 1;

    try {
      console.log('🔄 Adding place to backend itinerary - category:', category, 'type:', apiType, 'day:', dayNumber);
      
      console.log(' Place data:', place);

      // Prepare place data in the expected format
      const placeData = {
        id: place.googlePlaceId || place.id || `place_${Date.now()}`,
        name: place.name,
        address: place.address || place.location,
        price: place.price || place.priceRange,
        priceLevel: place.priceLevel || 'Medium',
        category: place.category || place.type || (apiType === 'attractions' ? 'Activity' : apiType === 'hotels' ? 'Hotel' : 'Restaurant'),
        rating: place.rating || 0,
        reviews: place.reviews || 0,
        popularityLevel: place.popularityLevel || 'Medium',
        image: place.image || 'https://via.placeholder.com/400x300',
        latitude: place.latitude || 0,
        longitude: place.longitude || 0,
        distanceKm: place.distanceKm || 0,
        isOpenNow: place.isOpenNow !== undefined ? place.isOpenNow : true,
        source: place.source || 'Frontend',
        googlePlaceId: place.googlePlaceId || place.id,
        isRecommended: place.isRecommended || false
      };

      const response = await tripPlanningApi.post(`/itinerary/${tripId}/day/${dayNumber}/${apiType}`, placeData, {
        params: { userId: userUid }
      });

      console.log('✅ Place added to backend successfully:', response.data);
      
      alert(response.data.message || 'Place added to itinerary successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error adding place to backend:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Error adding place: ${errorMessage}`);
      return false;
    }
  };

  // Simple function for destination and transportation modals
  const getFilteredSuggestions = () => {
    // For destination modal - used for Google Places API cities
    if (showDestinationModal) {
      if (!searchQuery) return mockSuggestions.cities || [];
      
      return (mockSuggestions.cities || []).filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.region && item.region.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // For transportation modal - use mock data
    const suggestions = mockSuggestions.transportation || [];
    if (!searchQuery) return suggestions;
    
    return suggestions.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

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
    navigate('/pool-preferences', { 
      state: { 
        poolName: normalizedTripName, 
        selectedDates: normalizedDates,
        poolSize: location.state?.poolSize,
        poolPrivacy: location.state?.poolPrivacy,
        userUid
      } 
    });
  };

  // ===============================
  // TRIP CONFIRMATION FUNCTIONS
  // ===============================

  /**
   * Check if current user is the trip creator and fetch confirmation status
   */
  const checkCreatorStatusAndConfirmation = async () => {
    try {
      // For now, assume the user who navigated with userUid is the creator
      // In a real app, you'd fetch group details to check creator
      const currentUserUID = getUserUID();
      setIsCreator(currentUserUID === userUid);
      
      // Check if there's already a confirmation in progress
      if (confirmedTripId) {
        const status = await PoolsApi.getConfirmationStatus(confirmedTripId, currentUserUID);
        setConfirmationStatus(status);
      }
    } catch (error) {
      console.error('❌ Error checking creator status:', error);
    }
  };

  /**
   * Initiate trip confirmation - Only creators can do this
   */
  const handleInitiateTripConfirmation = async () => {
    if (!isCreator) {
      alert('❌ Only the trip creator can initiate confirmation');
      return;
    }

    try {
      setIsInitiatingConfirmation(true);
      
      const confirmationData = {
        groupId: groupId,
        userId: userUid,
        minMembers: 2, // Minimum members required
        maxMembers: 8, // Maximum members allowed
        tripStartDate: normalizedDates[0]?.toISOString(),
        tripEndDate: normalizedDates[normalizedDates.length - 1]?.toISOString(),
        confirmationHours: 48, // Members have 48 hours to confirm
        totalAmount: 40000, // Total trip cost in LKR
        pricePerPerson: 10000, // Price per person in LKR
        currency: 'LKR',
        upfrontPaymentHours: 48, // Hours to make upfront payment
        finalPaymentDaysBefore: 7, // Days before trip to make final payment
        tripDetails: {
          destinations: Object.values(destinations).map(dest => dest.name || dest),
          activities: Object.values(itinerary).flat().map(activity => activity.name || activity.title)
        }
      };

      console.log('🎯 Initiating trip confirmation with data:', confirmationData);
      
      const result = await PoolsApi.initiateTripConfirmation(confirmationData);
      
      console.log('✅ Trip confirmation initiated:', result);
      setConfirmedTripId(result.confirmedTripId);
      setConfirmationStatus(result);
      setShowConfirmationModal(true);
      
      alert(`✅ Trip confirmation initiated successfully!\n\nConfirmation ID: ${result.confirmedTripId}\nMembers have 48 hours to confirm their participation.`);
      
    } catch (error) {
      console.error('❌ Error initiating trip confirmation:', error);
      alert(`❌ Failed to initiate trip confirmation: ${error.message}`);
    } finally {
      setIsInitiatingConfirmation(false);
    }
  };

  /**
   * Confirm participation in the trip - Members call this
   */
  const handleConfirmParticipation = async () => {
    if (!confirmedTripId) {
      alert('❌ No trip confirmation in progress');
      return;
    }

    try {
      setIsConfirmingParticipation(true);
      
      const result = await PoolsApi.confirmParticipation(confirmedTripId, getUserUID());
      
      console.log('✅ Participation confirmed:', result);
      setConfirmationStatus(result);
      
      alert(`✅ Your participation has been confirmed!\n\nStatus: ${result.status}\nConfirmed members: ${result.confirmedMembers?.length || 0}`);
      
    } catch (error) {
      console.error('❌ Error confirming participation:', error);
      alert(`❌ Failed to confirm participation: ${error.message}`);
    } finally {
      setIsConfirmingParticipation(false);
    }
  };

  /**
   * Cancel trip confirmation - Only creators can do this
   */
  const handleCancelTripConfirmation = async () => {
    if (!isCreator || !confirmedTripId) {
      alert('❌ Only the trip creator can cancel confirmation');
      return;
    }

    const reason = prompt('Please provide a reason for canceling the trip confirmation:');
    if (!reason) return;

    try {
      const result = await PoolsApi.cancelTripConfirmation(confirmedTripId, userUid, reason);
      
      console.log('✅ Trip confirmation canceled:', result);
      setConfirmationStatus(null);
      setConfirmedTripId(null);
      
      alert(`✅ Trip confirmation canceled successfully.\n\nReason: ${reason}`);
      
    } catch (error) {
      console.error('❌ Error canceling trip confirmation:', error);
      alert(`❌ Failed to cancel trip confirmation: ${error.message}`);
    }
  };

  // Check creator status on component mount
  useEffect(() => {
    // Trip confirmation functionality moved to ViewPoolPage.jsx
    // This useEffect is no longer needed for confirmation
  }, [groupId, userUid]);

  const handleSaveTrip = async () => {
    console.log('💾 Starting trip save process to get suggestions...');
    
    setIsSavingTrip(true);
    setIsLoadingSuggestions(true);
    
    // Validate required data using normalized values
    if (!normalizedTripName || !normalizedDates || normalizedDates.length < 2 || !userUid) {
      console.warn('⚠️ Missing required trip data:', { 
        tripName: normalizedTripName, 
        dates: normalizedDates, 
        userUid 
      });
      alert('Missing required trip information. Please go back and complete all steps.');
      setIsSavingTrip(false);
      setIsLoadingSuggestions(false);
      return;
    }

    try {
      // Fix destinations data structure - backend expects simple string array or Map format
      const destinationsList = Object.values(destinations)
        .filter(dest => dest && dest.name) // Filter out empty destinations
        .map(dest => dest.name); // Extract just the name string
      
      // If no destinations with names, create a simple array from destination names
      const finalDestinations = destinationsList.length > 0 
        ? destinationsList 
        : Object.values(destinations).map(dest => typeof dest === 'string' ? dest : dest?.name).filter(Boolean);
      
      console.log('🏙️ ===== DESTINATIONS DATA PREPARATION =====');
      console.log('🏙️ Raw destinations object:', destinations);
      console.log('🏙️ Object.values(destinations):', Object.values(destinations));
      console.log('🏙️ Filtered destination names:', destinationsList);
      console.log('🏙️ Final destinations array:', finalDestinations);
      console.log('🏙️ ===== END DESTINATIONS PREPARATION =====');
      
      // Prepare trip data for backend in the correct nested structure
      // Backend expects "tripData" not "tripDetails"
      const tripData = {
        name: normalizedTripName, // Backend expects "name" not "tripName"
        startDate: normalizedDates[0],
        endDate: normalizedDates[normalizedDates.length - 1],
        destinations: finalDestinations, // Send as simple string array
        terrains: normalizedTerrains || [],
        activities: normalizedActivities || [],
        itinerary: itinerary,
        places: finalDestinations // Use the same cleaned destinations for places
      };

      const requestData = {
        userId: getUserUID() || user?.uid || userUid,
        tripId: tripId, // Add the tripId that was received when the group was created
        groupId: groupId, // Include groupId in request body as well
        tripData: tripData, // Changed from tripDetails to tripData to match backend
        optionalField: 'save_and_suggest'
      };

      console.log('🔍 ===== PREPARING TRIP DATA FOR SAVE-TRIP API =====');
      console.log('🔍 User ID comparison:');
      console.log('  - getUserUID():', getUserUID());
      console.log('  - user?.uid:', user?.uid);
      console.log('  - userUid (from state):', userUid);
      console.log('  - Final userId chosen:', getUserUID() || user?.uid || userUid);
      console.log('🔍 Raw inputs:');
      console.log('  - normalizedTripName:', normalizedTripName);
      console.log('  - normalizedDates:', normalizedDates);
      console.log('  - destinations:', destinations);
      console.log('  - normalizedTerrains:', normalizedTerrains);
      console.log('  - normalizedActivities:', normalizedActivities);
      console.log('  - itinerary length:', itinerary ? itinerary.length : 'null');
      console.log('  - userUid:', userUid);
      console.log('  - user?.uid:', user?.uid);
      console.log('  - groupId:', groupId);
      console.log('  - tripId:', tripId); // Add tripId to the logging
      
      console.log('🔍 Constructed tripData object:', tripData);
      console.log('🔍 Final requestData object:', requestData);
      console.log('🔍 JSON stringified requestData:', JSON.stringify(requestData, null, 2));
      console.log('🔍 ===== END TRIP DATA PREPARATION =====');

      console.log('🚀 Saving trip and getting suggestions...', { groupId, requestData });

      // Call the backend API to save trip and get similar trip suggestions
      const response = await PoolsApi.saveTripAndGetSuggestions(groupId, requestData);
      
      console.log('📊 ===== SAVE-TRIP RESPONSE ANALYSIS =====');
      console.log('📊 Full response object:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📊 Response keys:', Object.keys(response || {}));
      console.log('📊 Response status:', response?.status);
      console.log('📊 Response success:', response?.success);
      console.log('📊 Response message:', response?.message);
      console.log('📊 Similar trips count:', response?.similarTrips?.length || 0);
      console.log('📊 Total suggestions:', response?.totalSuggestions);
      console.log('📊 Has similar trips:', response?.hasSimilarTrips);
      console.log('📊 Similar trips data:', response?.similarTrips);
      console.log('📊 ===== END SAVE-TRIP RESPONSE ANALYSIS =====');
      
      // Navigate to cost estimation page after saving trip
      console.log('🔄 Navigating to cost estimation page...');
      navigate('/pool-cost-estimation', {
        state: {
          // Trip information
          tripId: tripId,
          groupId: groupId,
          poolName: normalizedTripName,
          selectedDates: normalizedDates,
          destinations: Object.values(destinations),
          selectedTerrainPreferences: normalizedTerrains,
          selectedActivityPreferences: normalizedActivities,
          itinerary: itinerary,
          userUid: user?.uid || userUid,
          userEmail: user?.email,
          
          // Store suggestions data for later use
          suggestions: response?.similarTrips || response?.suggestions || [],
          totalSuggestions: response?.totalSuggestions || 0,
          hasSuggestions: response?.hasSimilarTrips || false,
          
          // Backend response for debugging
          backendResponse: response
        }
      });
      
    } catch (error) {
      console.error('❌ ===== SAVE-TRIP ERROR ANALYSIS =====');
      console.error('❌ Error object:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ ===== END SAVE-TRIP ERROR ANALYSIS =====');
      
      alert('Error saving trip and getting suggestions. Please try again.');
    }

    setIsSavingTrip(false);
    setIsLoadingSuggestions(false);
  };

  // Handle joining an existing similar trip
  const handleJoinSimilarTrip = (trip) => {
    console.log('🤝 Attempting to join similar trip:', trip);
    setSelectedTripToJoin(trip);
    setShowJoinModal(true);
  };

  // Handle finalizing the user's own trip
  const handleFinalizeTrip = async () => {
    console.log('🎯 Finalizing user\'s own trip...');
    
    setIsFinalizingTrip(true);
    
    try {
      // Call the finalize group API
      const response = await PoolsApi.finalizeGroup(groupId, {
        userId: user?.uid || userUid,
        action: 'finalize'
      });
      
      if (response.success) {
        console.log('✅ Trip finalized successfully');
        
        // Navigate to pools page with success message
        navigate('/pools', {
          state: {
            newPool: {
              id: groupId || tripId || Date.now(),
              tripId: tripId,
              groupId: groupId,
              name: normalizedTripName,
              dates: normalizedDates,
              terrains: normalizedTerrains,
              activities: normalizedActivities,
              itinerary: itinerary,
              joinedGroup: joinedGroup,
              createdAt: new Date(),
              status: 'finalized'
            },
            message: 'Trip created and finalized successfully!'
          }
        });
      } else {
        throw new Error(response.error || 'Failed to finalize trip');
      }
    } catch (error) {
      console.error('❌ Error finalizing trip:', error);
      alert('Error finalizing trip. Please try again.');
    }
    
    setIsFinalizingTrip(false);
    setShowSimilarTrips(false);
  };

  // Handle successful join to similar trip
  const handleJoinSuccess = () => {
    console.log('✅ Successfully joined similar trip');
    setShowJoinModal(false);
    setShowSimilarTrips(false);
    
    // Navigate to pools page
    navigate('/pools', {
      state: {
        message: 'Successfully joined similar trip!'
      }
    });
  };

  // Handle closing similar trips modal
  const handleCloseSimilarTrips = () => {
    setShowSimilarTrips(false);
    setSimilarTrips([]);
  };

  if (!normalizedTripName || !normalizedDates || normalizedDates.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">Loading pool itinerary...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait while we prepare your trip planning page.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Spacer to prevent overlap with fixed/floating navbar */}
      <div className="h-20 md:h-24 lg:h-28"></div>
      {/* Trip Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 pt-2 pb-1">
          <TripProgressBar currentStep={4} completedSteps={[1, 2, 3]} tripName={normalizedTripName} />
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
                                className="bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 transition-colors font-medium text-sm"
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
              className="bg-white border border-primary-600 text-primary-600 px-6 py-2 rounded-full shadow hover:bg-primary-50 font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSaveTrip}
              disabled={isSavingTrip || isLoadingSuggestions}
              className="bg-primary-600 text-white px-6 py-2 rounded-full shadow hover:bg-primary-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingSuggestions ? 'Saving Trip...' : isSavingTrip ? 'Saving...' : 'Save Trip & Continue'}
            </button>
          </div>

          {/* Trip Confirmation Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {/* Trip planning and itinerary management continues here */}
            {/* Trip confirmation functionality has been moved to ViewPoolPage.jsx */}
          </div>
        </div>
      </div>

      {/* Similar Trips Modal */}
      {showSimilarTrips && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Similar Trips Available</h2>
                  <p className="text-gray-600 mt-1">Join an existing group or continue with your trip</p>
                </div>
                <button
                  onClick={handleCloseSimilarTrips}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Similar Trips Grid */}
              {similarTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {similarTrips.map((trip) => (
                    <div
                      key={trip.groupId}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Trip Image */}
                      <div className="h-48 bg-gradient-to-br from-blue-500 to-teal-500 relative">
                        {trip.image ? (
                          <img
                            src={trip.image}
                            alt={trip.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white">
                            <Camera className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 text-xs font-medium">
                          {trip.currentMembers || 0}/{trip.maxMembers || 8} members
                        </div>
                      </div>

                      {/* Trip Details */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                          {trip.name}
                        </h3>
                        
                        {/* Trip Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {trip.currentMembers || 0} travelers
                          </div>

                          {trip.matchPercentage && (
                            <div className="flex items-center text-sm text-green-600">
                              <Star className="w-4 h-4 mr-2 fill-current" />
                              {trip.matchPercentage}% match
                            </div>
                          )}
                        </div>

                        {/* Destinations */}
                        {trip.destinations && trip.destinations.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">Destinations:</p>
                            <div className="flex flex-wrap gap-1">
                              {trip.destinations.slice(0, 3).map((dest, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                >
                                  {dest}
                                </span>
                              ))}
                              {trip.destinations.length > 3 && (
                                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                  +{trip.destinations.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Join Button */}
                        <button
                          onClick={() => handleJoinSimilarTrip(trip)}
                          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                        >
                          Request to Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Similar Trips Found</h3>
                  <p className="text-gray-600">No matching trips available right now.</p>
                </div>
              )}

              {/* Actions */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleFinalizeTrip}
                    disabled={isFinalizingTrip}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFinalizingTrip ? 'Creating Trip...' : 'Create My Trip Instead'}
                  </button>
                  <button
                    onClick={handleCloseSimilarTrips}
                    className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-center text-sm text-gray-500 mt-3">
                  You can create your own trip or join one of the similar trips above
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Pool Modal */}
      <JoinPoolModal
        show={showJoinModal}
        onClose={() => {
          setShowJoinModal(false);
          setSelectedTripToJoin(null);
        }}
        pool={selectedTripToJoin}
        onJoinSuccess={handleJoinSuccess}
      />

      {/* Modularized Add Item Modals */}
      <AddThingsToDoModal
        show={showAddModal && selectedCategory === 'activities'}
        onClose={() => {
          console.log('🚪 Closing Things to Do modal');
          setShowAddModal(false);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fetchSuggestionsForModal={fetchSuggestionsForModal}
        days={days}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
        isLoading={false}
        tripId={tripId}
        currentDay={currentDay}
      />
      <AddPlacesToStayModal
        show={showAddModal && selectedCategory === 'places'}
        onClose={() => {
          console.log('🚪 Closing Places to Stay modal');
          setShowAddModal(false);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fetchSuggestionsForModal={fetchSuggestionsForModal}
        days={days}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
        isLoading={false}
        tripId={tripId}
        currentDay={currentDay}
      />
      <AddFoodAndDrinkModal
        show={showAddModal && selectedCategory === 'food'}
        onClose={() => {
          console.log('🚪 Closing Food & Drink modal');
          setShowAddModal(false);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fetchSuggestionsForModal={fetchSuggestionsForModal}
        days={days}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
        isLoading={false}
        tripId={tripId}
        currentDay={currentDay}
      />
      <AddTransportationModal
        show={showAddModal && selectedCategory === 'transportation'}
        onClose={() => {
          setShowAddModal(false);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getFilteredSuggestions={getFilteredSuggestions}
        days={days}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
      />

      <AddDestinationModal
        show={showDestinationModal}
        onClose={() => {
          setShowDestinationModal(false);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getFilteredSuggestions={getFilteredSuggestions}
        dayIndex={currentDay}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
        isSearchingCities={isSearchingCities}
        // Backend integration props
        tripId={tripId}
        userUid={userUid}
        startDate={normalizedDates?.[0]}
        groupId={groupId}
      />

      <Footer />
    </div>
  );
};

export default PoolItineraryPage;

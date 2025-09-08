import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getProfileCompletionStatus } from '../utils/profileStorage';
import LoginRequiredPopup from '../components/LoginRequiredPopup';
import CompleteProfilePopup from '../components/CompleteProfilePopup';
import CustomDropdown from '../components/CustomDropdown';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Settings, 
  Edit3, 
  Trash2, 
  Share2, 
  Download,
  Filter,
  Search,
  MoreHorizontal,
  Sparkles,
  Globe,
  Camera,
  Heart,
  ChevronDown
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CreateTripModal from '../components/tourist/CreateTripModal';
import CreateAiTripModal from '../components/tourist/CreateTripModal';
import TripCard from '../components/tourist/TripCard';
import myTripsVideo from '../assets/mytrips.mp4';
import { tripPlanningApi } from '../api/axios';
import { getUserUID } from '../utils/userStorage';
import Footer from '../components/Footer';
import { getCityImageUrl, placeholderImage, logImageError } from '../utils/imageUtils';

const placeholder = placeholderImage;

const MyTripsPage = () => {
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [isCreateAiTripModalOpen, setIsCreateAiTripModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Dropdown options
  const filterOptions = [
    { value: 'all', label: 'All Trips' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];
  
  const sortOptions = [
    { value: 'recent', label: 'Recent' },
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date' }
  ];
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  // Popup states
  const [showLoginRequiredPopup, setShowLoginRequiredPopup] = useState(false);
  const [showCompleteProfilePopup, setShowCompleteProfilePopup] = useState(false);
  const [currentActionName, setCurrentActionName] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // State for trips
  const [trips, setTrips] = useState([]);

  // Get current user and fetch their trips
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('🔐 Current user UID:', user.uid);
        setCurrentUser(user);
        
        // Check if we should use mock data (only when explicitly set)
        const useMockData = process.env.REACT_APP_USE_MOCK_DATA === 'true';
        
        if (useMockData) {
          console.log('🔧 Using mock data - REACT_APP_USE_MOCK_DATA is set to true');
          setTrips(mockTrips);
          setApiError(null);
          return;
        }
        
        // Fetch user trips from backend
        console.log('🚀 STARTING API FETCH FOR USER:', user.uid);
        console.log('🔧 Environment variables check:');
        console.log('  - REACT_APP_USE_MOCK_DATA:', process.env.REACT_APP_USE_MOCK_DATA);
        console.log('  - REACT_APP_API_BASE_URL_TRIP_PLANNING:', process.env.REACT_APP_API_BASE_URL_TRIP_PLANNING);
        console.log('  - NODE_ENV:', process.env.NODE_ENV);
        
        try {
          console.log('📡 Calling fetchUserTrips...');
          const userTrips = await fetchUserTrips(user.uid, filterStatus);
          console.log('✅ API CALL SUCCESS! Received trips:', userTrips.length);
          console.log('📊 First trip data sample:', userTrips[0]);
          setTrips(userTrips);
          setApiError(null);
        } catch (error) {
          console.error('❌ API CALL FAILED!');
          console.error('❌ Error type:', error.constructor.name);
          console.error('❌ Error message:', error.message);
          console.error('❌ Full error object:', error);
          console.error('❌ Error stack:', error.stack);
          
          // Only use mock data for specific network errors, not all errors
          if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            console.warn('⚠️ Network error detected - using mock data as fallback');
            setTrips(mockTrips);
            setApiError('Unable to connect to server. Showing sample data.');
          } else {
            console.error('❌ API Error - NOT using mock data. Showing error state.');
            setTrips([]);
            setApiError(error.message);
          }
        }
      } else {
        setCurrentUser(null);
        setTrips([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Watch for filter changes and refetch trips
  useEffect(() => {
    const refetchTripsForFilter = async () => {
      if (!currentUser) {
        console.log('🚫 No current user - skipping trip fetch');
        setTrips([]);
        return;
      }
      
      // Check if we should use mock data (only when explicitly set)
      const useMockData = process.env.REACT_APP_USE_MOCK_DATA === 'true';
      
      if (useMockData) {
        console.log('🔧 Using mock data - REACT_APP_USE_MOCK_DATA is set to true');
        setTrips(mockTrips);
        setApiError(null);
        return;
      }
      
      console.log('🔄 Filter changed to:', filterStatus);
      console.log('🚀 Refetching trips with new filter...');
      
      try {
        const userTrips = await fetchUserTrips(currentUser.uid, filterStatus);
        console.log('✅ FILTER REFETCH SUCCESS! Received trips:', userTrips.length);
        setTrips(userTrips);
        setApiError(null);
      } catch (error) {
        console.error('❌ FILTER REFETCH FAILED!');
        console.error('❌ Error:', error.message);
        
        // Only use mock data for specific network errors, not all errors
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
          console.warn('⚠️ Network error detected - using mock data as fallback');
          setTrips(mockTrips);
          setApiError('Unable to connect to server. Showing sample data.');
        } else {
          console.error('❌ API Error - NOT using mock data. Showing error state.');
          setTrips([]);
          setApiError(error.message);
        }
      }
    };

    refetchTripsForFilter();
  }, [filterStatus, currentUser]);

  // Check authentication and profile completion
  const checkUserAccessAndProfile = (actionName) => {
    if (!currentUser) {
      setCurrentActionName(actionName);
      setShowLoginRequiredPopup(true);
      return false;
    }

    const isProfileCompleted = getProfileCompletionStatus();
    if (!isProfileCompleted) {
      setCurrentActionName(actionName);
      setShowCompleteProfilePopup(true);
      return false;
    }

    return true;
  };

  // Handle Plan New Adventure button click
  const handlePlanNewAdventure = () => {
    if (checkUserAccessAndProfile('plan new adventures')) {
      setIsCreateTripModalOpen(true);
    }
  };

  // Handle AI Trip Suggestions button click
  const handleAITripSuggestions = () => {
    if (checkUserAccessAndProfile('get AI trip suggestions')) {
      setIsCreateTripModalOpen(true);
    }
  };

  // Mock data as fallback - updated to use getCityImageUrl consistently
  const mockTrips = [
    // Trip History (mostly expired, some completed)
    {
      id: 1,
      name: 'Summer Adventure in Sri Lanka',
      dates: 'Jun 11 → Jun 21, 2025',
      destination: 'Sri Lanka',
      image: getCityImageUrl('Sigiriya'),
      status: 'expired',
      progress: 100,
      daysLeft: 0,
      travelers: 2,
      rating: 4.8,
      memories: 45,
      highlights: ['Sigiriya Rock', 'Tea Plantations', 'Galle Fort'],
      budget: 2500,
      spent: 2350
    },
    {
      id: 4,
      name: 'Wildlife Safari',
      dates: 'May 2 → May 10, 2025',
      destination: 'Yala National Park',
      image: getCityImageUrl('Yala'),
      status: 'expired',
      progress: 100,
      daysLeft: 0,
      travelers: 3,
      rating: 4.6,
      memories: 32,
      highlights: ['Leopard Spotting', 'Safari Jeep', 'Bird Watching'],
      budget: 2100,
      spent: 2050
    },
    {
      id: 5,
      name: 'Hill Country Escape',
      dates: 'Apr 10 → Apr 18, 2025',
      destination: 'Nuwara Eliya',
      image: getCityImageUrl('Nuwara Eliya'),
      status: 'expired',
      progress: 100,
      daysLeft: 0,
      travelers: 2,
      rating: 4.9,
      memories: 28,
      highlights: ['Tea Estates', 'Hiking', 'Waterfalls'],
      budget: 1800,
      spent: 1700
    },
    {
      id: 6,
      name: 'Historic Wonders',
      dates: 'Mar 1 → Mar 7, 2025',
      destination: 'Anuradhapura',
      image: getCityImageUrl('Anuradhapura'),
      status: 'expired',
      progress: 100,
      daysLeft: 0,
      travelers: 1,
      rating: 4.2,
      memories: 12,
      highlights: ['Sacred City', 'Ancient Ruins'],
      budget: 1200,
      spent: 1100
    },
    {
      id: 10,
      name: 'City Lights',
      dates: 'Feb 1 → Feb 5, 2025',
      destination: 'Colombo',
      image: getCityImageUrl('Colombo'),
      status: 'expired',
      progress: 100,
      daysLeft: 0,
      travelers: 2,
      rating: 4.0,
      memories: 10,
      highlights: ['Nightlife', 'Shopping'],
      budget: 900,
      spent: 850
    },
    {
      id: 11,
      name: 'Solo Explorer',
      dates: 'Jan 10 → Jan 15, 2025',
      destination: 'Jaffna',
      image: getCityImageUrl('Jaffna'),
      status: 'expired',
      progress: 100,
      daysLeft: 0,
      travelers: 1,
      rating: 3.8,
      memories: 7,
      highlights: ['Nallur Temple'],
      budget: 800,
      spent: 700
    },
    {
      id: 12,
      name: 'Expired Beach Bash',
      dates: 'Dec 1 → Dec 7, 2024',
      destination: 'Mirissa',
      image: getCityImageUrl('Mirissa'),
      status: 'expired',
      progress: 100,
      daysLeft: 0,
      travelers: 5,
      rating: 4.2,
      memories: 12,
      highlights: ['Whale Watching', 'Beach Party'],
      budget: 1800,
      spent: 1700
    },
    // Only one completed trip for variety
    {
      id: 13,
      name: 'Wellness Getaway',
      dates: 'Nov 10 → Nov 15, 2024',
      destination: 'Kandy',
      image: getCityImageUrl('Kandy'),
      status: 'completed',
      progress: 100,
      daysLeft: 0,
      travelers: 2,
      rating: 4.7,
      memories: 15,
      highlights: ['Ayurveda Spa', 'Botanical Gardens'],
      budget: 2000,
      spent: 1900
    },
    // Ongoing Trip (active)
    {
      id: 2,
      name: 'Cultural Heritage Tour',
      dates: 'Aug 15 → Aug 25, 2025',
      destination: 'Central Province',
      image: getCityImageUrl('Kandy'),
      status: 'active',
      progress: 65,
      daysLeft: 12,
      travelers: 4,
      rating: null,
      memories: 0,
      highlights: ['Kandy Temple', 'Nuwara Eliya'],
      budget: 3200,
      spent: 1200
    },
    // Upcoming (draft/upcoming)
    {
      id: 3,
      name: 'Beach Retreat',
      dates: 'Not set',
      destination: 'Southern Coast',
      image: getCityImageUrl('Mirissa'),
      status: 'draft',
      progress: 25,
      daysLeft: null,
      travelers: 2,
      rating: null,
      memories: 0,
      highlights: [],
      budget: 1800,
      spent: 0
    },
    {
      id: 7,
      name: 'Family Fun Trip',
      dates: 'Dec 20 → Dec 28, 2025',
      destination: 'Colombo',
      image: getCityImageUrl('Colombo'),
      status: 'upcoming',
      progress: 10,
      daysLeft: 5,
      travelers: 5,
      rating: null,
      memories: 0,
      highlights: ['Zoo', 'Amusement Park'],
      budget: 3000,
      spent: 0
    },
    {
      id: 8,
      name: 'Adventure with Friends',
      dates: 'Jan 5 → Jan 12, 2026',
      destination: 'Ella',
      image: getCityImageUrl('Ella'),
      status: 'upcoming',
      progress: 0,
      daysLeft: 180,
      travelers: 4,
      rating: null,
      memories: 0,
      highlights: ['Nine Arches Bridge', 'Little Adam’s Peak'],
      budget: 2200,
      spent: 0
    },
    {
      id: 9,
      name: 'Wellness Getaway',
      dates: 'Feb 10 → Feb 15, 2026',
      destination: 'Kandy',
      image: getCityImageUrl('Kandy'),
      status: 'draft',
      progress: 0,
      daysLeft: null,
      travelers: 2,
      rating: null,
      memories: 0,
      highlights: ['Ayurveda Spa', 'Botanical Gardens'],
      budget: 2000,
      spent: 0
    }
  ];

  // API function to fetch user trips
  const fetchUserTrips = async (userId, filter = 'all') => {
    console.log('📥 ===== FETCH USER TRIPS START =====');
    console.log('👤 Fetching trips for userId:', userId);
    console.log('🔍 Filter selected:', filter);
    console.log('🌍 Full API URL will be constructed as:');
    
    let apiUrl;
    if (filter === 'active') {
      apiUrl = `http://localhost:5006/api/trips/user/${userId}`;
    } else if (filter === 'completed') {
      apiUrl = `http://localhost:4015/api/user-trips/${userId}`;
    } else {
      // For 'all', 'draft' use the existing endpoint
      apiUrl = `${process.env.REACT_APP_API_BASE_URL_TRIP_PLANNING || 'http://localhost:8085/api/v1'}/itinerary?userId=${userId}`;
    }
    console.log('🔗 Complete API URL:', apiUrl);
    
    try {
      setIsLoadingTrips(true);
      setApiError(null);
      
      console.log('📡 Making fetch request with options:');
      console.log('  - Method: GET');
      console.log('  - Headers: Accept: application/json, Content-Type: application/json');
      console.log('  - Credentials: include');
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      console.log('📨 ===== RESPONSE RECEIVED =====');
      console.log('📨 Response status:', response.status);
      console.log('📨 Response statusText:', response.statusText);
      console.log('📨 Response ok:', response.ok);
      console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error('❌ Response not OK - handling error...');
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Error response data:', errorData);
        
        if (response.status === 400) {
          const msg = `Invalid user ID: ${errorData.message || 'Please check your login status'}`;
          console.error('❌ 400 Error:', msg);
          alert(msg);
          throw new Error(`Invalid userId: ${errorData.message}`);
        } else if (response.status === 404) {
          console.log('📝 404 - No trips found for user');
          if (filter === 'active') {
            // For active trips, don't show alert - just return empty array
            console.log('📝 No active trips found for user');
            return [];
          } else {
            alert('No trips found. Start planning your first adventure!');
            return []; // Return empty array for no trips
          }
        } else if (response.status === 500) {
          const msg = `Server error: ${errorData.message || 'Please try again later'}`;
          console.error('❌ 500 Error:', msg);
          alert(msg);
          throw new Error(`Server error: ${errorData.message}`);
        } else {
          const msg = `HTTP ${response.status}: ${response.statusText}`;
          console.error('❌ Other HTTP Error:', msg);
          throw new Error(msg);
        }
      }
      
      console.log('✅ Response OK - parsing JSON...');
      const data = await response.json();
      console.log('📦 ===== RAW API RESPONSE DATA =====');
      console.log('📦 Data type:', typeof data);
      console.log('📦 Is Array:', Array.isArray(data));
      console.log('📦 Data length:', Array.isArray(data) ? data.length : 'Not array');
      console.log('📦 Raw data:', data);
      console.log('📦 First item sample:', Array.isArray(data) && data.length > 0 ? data[0] : 'No items');
      
      // Validate API response structures
      if (filter === 'active') {
        // Active trips API can have two possible structures:
        // 1. Direct: { userId: string, trips: array, totalTrips: number }
        // 2. Wrapped: { success: true, data: { userId: string, trips: array, totalTrips: number } }
        
        let actualData = data;
        if (data.success && data.data) {
          actualData = data.data;
          console.log('✅ Active trips API wrapped structure detected, using data field');
        }
        
        if (!actualData.userId || !Array.isArray(actualData.trips)) {
          console.error('❌ Active trips API unexpected response structure');
          console.error('Expected data to have: { userId: string, trips: array, totalTrips: number }');
          console.error('Received actualData:', actualData);
          // Don't throw error, just log and continue with empty array
        } else {
          console.log('✅ Active trips API structure validation passed');
        }
      } else if (filter === 'completed') {
        // Completed trips API response format:
        // { message: string, userId: string, count: number, data: array }
        
        if (!data.userId || !Array.isArray(data.data)) {
          console.error('❌ Completed trips API unexpected response structure');
          console.error('Expected data to have: { message: string, userId: string, count: number, data: array }');
          console.error('Received data:', data);
          // Don't throw error, just log and continue with empty array
        } else {
          console.log('✅ Completed trips API structure validation passed');
        }
      }
      
      // Handle different API response formats
      let backendTrips = [];
      
      if (filter === 'active') {
        // Active trips API response format (from localhost:5006)
        // Priority order for parsing:
        // 1. Wrapped: { success: true, data: { userId: string, trips: array, totalTrips: number } }
        // 2. Direct: { userId: string, trips: array, totalTrips: number }
        // 3. Fallback: direct array
        
        if (data.success && data.data && Array.isArray(data.data.trips)) {
          // Wrapped structure (most common)
          backendTrips = data.data.trips;
          console.log('📊 Active trips API (wrapped) - userId:', data.data.userId);
          console.log('📊 Active trips API (wrapped) - totalTrips:', data.data.totalTrips);
        } else if (data.trips && Array.isArray(data.trips)) {
          // Direct structure
          backendTrips = data.trips;
          console.log('📊 Active trips API (direct) - userId:', data.userId);
          console.log('📊 Active trips API (direct) - totalTrips:', data.totalTrips);
        } else if (Array.isArray(data)) {
          // Fallback: direct array response
          backendTrips = data;
          console.log('📊 Active trips API (array) - length:', data.length);
        } else {
          console.warn('⚠️ Unexpected active trips API response structure:', data);
          backendTrips = [];
        }
      } else if (filter === 'completed') {
        // Completed trips API response format (from localhost:4015)
        // Expected: { message: string, userId: string, count: number, data: array }
        
        if (Array.isArray(data.data)) {
          // Expected structure
          backendTrips = data.data;
          console.log('📊 Completed trips API - userId:', data.userId);
          console.log('📊 Completed trips API - count:', data.count);
          console.log('📊 Completed trips API - message:', data.message);
        } else if (Array.isArray(data)) {
          // Fallback: direct array
          backendTrips = data;
          console.log('📊 Completed trips API (fallback array) - length:', data.length);
        } else {
          console.warn('⚠️ Unexpected completed trips API response structure:', data);
          backendTrips = [];
        }
      } else {
        // All trips API response format (from localhost:8085)
        backendTrips = Array.isArray(data) ? data : [];
      }
      
      console.log('🔄 Processing', backendTrips.length, 'trips for transformation...');
      
      const transformedTrips = backendTrips.map((trip, index) => {
        console.log(`🔄 Transforming trip ${index + 1}:`, trip);
        
        // Use different transformation based on the API source
        let transformed;
        if (filter === 'active') {
          transformed = transformActiveTrip(trip);
        } else if (filter === 'completed') {
          transformed = transformCompletedTrip(trip);
        } else {
          transformed = transformBackendTripSummary(trip);
        }
        
        console.log(`✅ Transformed trip ${index + 1}:`, transformed);
        return transformed;
      });
      
      console.log('✅ ===== FETCH USER TRIPS SUCCESS =====');
      console.log('✅ Total trips found:', transformedTrips.length);
      console.log('✅ Transformed trips summary:', transformedTrips.map(t => ({ id: t.id, name: t.name, status: t.status })));
      
      return transformedTrips;
    } catch (error) {
      console.error('❌ ===== FETCH USER TRIPS FAILED =====');
      console.error('❌ Error type:', error.constructor.name);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Full error object:', error);
      
      // Handle different types of errors with detailed logging
      let userFriendlyMessage = 'Failed to fetch trips';
      
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        userFriendlyMessage = 'Unable to connect to server. Please check if the backend is running or your internet connection.';
        console.error('❌ NETWORK ERROR DETECTED - backend may not be running on localhost:8085');
      } else if (error.message.includes('Invalid userId')) {
        userFriendlyMessage = 'Authentication issue. Please try logging in again.';
        console.error('❌ AUTHENTICATION ERROR');
      } else if (error.message.includes('Server error')) {
        userFriendlyMessage = 'Server error occurred. Please try again later.';
        console.error('❌ SERVER ERROR');
      } else if (error.message.includes('No trips found')) {
        userFriendlyMessage = 'No trips found. Start planning your first adventure!';
        console.error('❌ NO TRIPS FOUND');
      } else {
        console.error('❌ UNKNOWN ERROR TYPE');
      }
      
      console.error('❌ User-friendly message:', userFriendlyMessage);
      setApiError(userFriendlyMessage);
      
      // Don't show alert for network errors to avoid double alerts
      if (!error.message.includes('Invalid userId') && 
          !error.message.includes('Server error') && 
          !error.message.includes('No trips found')) {
        console.log('🔔 Showing user alert for error:', userFriendlyMessage);
        // Only show alert for non-network errors to reduce noise
        if (error.message !== 'Failed to fetch' && error.name !== 'TypeError') {
          alert(`Failed to fetch trips: ${error.message}`);
        }
      }
      
      throw error;
    } finally {
      setIsLoadingTrips(false);
    }
  };

  // Transform backend trip summary data to frontend format
  const transformBackendTripSummary = (tripSummary) => {
    console.log('🔄 Transforming trip summary data:', tripSummary);
    console.log('🔍 Trip summary fields:', Object.keys(tripSummary || {}));
    console.log('🔍 Trip summary tripId:', tripSummary?.tripId);
    
    const calculateTripStatus = (trip) => {
      if (!trip.startDate || !trip.endDate) return 'draft';
      
      const now = new Date();
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      
      if (now < startDate) return 'upcoming';
      if (now >= startDate && now <= endDate) return 'active';
      return 'completed';
    };

    const calculateDaysLeft = (trip) => {
      if (!trip.startDate) return null;
      
      const now = new Date();
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      
      if (now < startDate) {
        return Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
      }
      if (now >= startDate && now <= endDate) {
        return Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      }
      return 0;
    };

    const formatTripDates = (startDate, endDate) => {
      if (!startDate || !endDate) return 'Dates not set';
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      return `${start.toLocaleDateString('en-US', formatOptions)} → ${end.toLocaleDateString('en-US', formatOptions)}`;
    };

    const status = calculateTripStatus(tripSummary);
    const cityImage = getCityImageUrl(tripSummary.destination || 'Sri Lanka');
    
    let highlights = [];
    if (tripSummary.destination) {
      highlights.push(tripSummary.destination);
    }
    if (tripSummary.cities && Array.isArray(tripSummary.cities)) {
      highlights = [...highlights, ...tripSummary.cities];
    }
    if (tripSummary.activities && Array.isArray(tripSummary.activities)) {
      const activityNames = tripSummary.activities
        .filter(a => a && a.name)
        .map(a => a.name)
        .slice(0, 3);
      highlights = [...highlights, ...activityNames];
    }
    
    highlights = [...new Set(highlights)];
    
    return {
      id: tripSummary.tripId,
      tripId: tripSummary.tripId, // Explicitly preserve the backend trip ID
      name: tripSummary.tripName || 'Untitled Trip',
      dates: formatTripDates(tripSummary.startDate, tripSummary.endDate),
      destination: tripSummary.destination || 'Sri Lanka',
      image: cityImage,
      status: status,
      progress: status === 'completed' ? 100 : status === 'active' ? 50 : 10,
      daysLeft: calculateDaysLeft(tripSummary),
      travelers: tripSummary.groupSize || 1,
      rating: null,
      memories: 0,
      highlights: highlights,
      budget: tripSummary.budget || 0, 
      spent: tripSummary.spent || 0,
      numberOfDays: tripSummary.numberOfDays,
      message: tripSummary.message,
      createdAt: tripSummary.startDate,
      _originalData: tripSummary
    };
  };

  // Transform active trip data from active trips API to frontend format
  const transformActiveTrip = (activeTrip) => {
    console.log('🔄 Transforming active trip data:', activeTrip);
    console.log('🔍 Active trip fields:', Object.keys(activeTrip || {}));
    console.log('🔍 Active trip potential IDs:', {
      tripId: activeTrip?.tripId,
      _id: activeTrip?._id,
      id: activeTrip?.id
    });
    
    const formatTripDates = (startDate, endDate) => {
      if (!startDate || !endDate) return 'Dates not set';
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      return `${start.toLocaleDateString('en-US', formatOptions)} → ${end.toLocaleDateString('en-US', formatOptions)}`;
    };

    const calculateDaysLeft = (trip) => {
      const endDate = trip.endDate || trip.end_date || trip.endTime;
      if (!endDate) return null;
      
      const now = new Date();
      const end = new Date(endDate);
      
      if (now <= end) {
        return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
      }
      return 0;
    };

    // Extract trip data based on the actual API response structure
    // The API response has: tripName, startDate, endDate, baseCity, etc.
    // Based on the backend data structure, tripId should be in activeTrip.tripId field
    const tripId = activeTrip.tripId || activeTrip._id || activeTrip.id || `trip_${Date.now()}_${Math.random()}`;
    
    console.log('🔍 Active trip ID extraction:', {
      tripId: activeTrip.tripId,
      _id: activeTrip._id,
      id: activeTrip.id,
      selectedTripId: tripId,
      fullActiveTrip: activeTrip
    });
    const tripName = activeTrip.tripName || activeTrip.name || activeTrip.title || 'Untitled Trip';
    const startDate = activeTrip.startDate;
    const endDate = activeTrip.endDate;
    const destination = activeTrip.baseCity || activeTrip.destination || activeTrip.location || 'Sri Lanka';
    
    // Calculate budget from the cost fields
    const driverCost = activeTrip.averageDriverCost || 0;
    const guideCost = activeTrip.averageGuideCost || 0;
    const totalBudget = driverCost + guideCost;
    const spent = parseFloat(activeTrip.payedAmount) || 0;

    // Get city image for the destination
    const cityImage = getCityImageUrl(destination);
    
    // Build highlights array from dailyPlans, preferredTerrains, and preferredActivities
    let highlights = [];
    
    // Add destination
    if (destination) {
      highlights.push(destination);
    }
    
    // Add preferred terrains
    if (activeTrip.preferredTerrains && Array.isArray(activeTrip.preferredTerrains)) {
      highlights = [...highlights, ...activeTrip.preferredTerrains.slice(0, 2)];
    }
    
    // Add preferred activities
    if (activeTrip.preferredActivities && Array.isArray(activeTrip.preferredActivities)) {
      highlights = [...highlights, ...activeTrip.preferredActivities.slice(0, 2)];
    }
    
    // Add cities from daily plans
    if (activeTrip.dailyPlans && Array.isArray(activeTrip.dailyPlans)) {
      const cities = activeTrip.dailyPlans
        .map(plan => plan.city)
        .filter(city => city && city !== destination)
        .slice(0, 2);
      highlights = [...highlights, ...cities];
    }
    
    // Remove duplicates and limit to 5 highlights
    highlights = [...new Set(highlights)].slice(0, 5);
    
    // Calculate number of days
    const numberOfDays = activeTrip.dailyPlans ? activeTrip.dailyPlans.length : 
                        (startDate && endDate ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1 : 1);
    
    return {
      id: tripId,
      tripId: tripId, // Explicitly preserve the backend trip ID
      name: tripName,
      dates: formatTripDates(startDate, endDate),
      destination: destination,
      image: cityImage,
      status: 'active', // All trips from this API are active
      progress: 50, // Default progress for active trips
      daysLeft: calculateDaysLeft(activeTrip),
      travelers: 1, // Default as the API doesn't seem to have group size info
      rating: null,
      memories: 0,
      highlights: highlights,
      budget: totalBudget,
      spent: spent,
      numberOfDays: numberOfDays,
      message: `${activeTrip.activityPacing} paced trip with ${activeTrip.budgetLevel} budget`,
      createdAt: activeTrip.lastUpdated,
      _originalData: activeTrip,
      _source: 'active_trips_api'
    };
  };

  // Transform completed trip data from completed trips API to frontend format
  const transformCompletedTrip = (completedTrip) => {
    console.log('🔄 Transforming completed trip data:', completedTrip);
    console.log('🔍 Completed trip fields:', Object.keys(completedTrip || {}));
    console.log('🔍 Completed trip potential IDs:', {
      _id: completedTrip?._id,
      originalTripId: completedTrip?.originalTripId,
      id: completedTrip?.id
    });
    
    const formatTripDates = (startDate, endDate) => {
      if (!startDate || !endDate) return 'Dates not set';
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      return `${start.toLocaleDateString('en-US', formatOptions)} → ${end.toLocaleDateString('en-US', formatOptions)}`;
    };

    // Extract trip data based on the actual API response structure
    // The API response has: _id, originalTripId, tripName, startDate, endDate, baseCity, etc.
    const tripId = completedTrip._id || completedTrip.originalTripId || completedTrip.id || `trip_${Date.now()}_${Math.random()}`;
    
    console.log('🔍 Completed trip ID extraction:', {
      _id: completedTrip._id,
      originalTripId: completedTrip.originalTripId,
      id: completedTrip.id,
      selectedTripId: tripId,
      fullCompletedTrip: completedTrip
    });
    
    const tripName = completedTrip.tripName || completedTrip.name || completedTrip.title || 'Untitled Trip';
    const startDate = completedTrip.startDate;
    const endDate = completedTrip.endDate;
    const destination = completedTrip.baseCity || completedTrip.destination || completedTrip.location || 'Sri Lanka';
    
    // Calculate budget and spent from the cost fields
    const averageDriverCost = completedTrip.averageDriverCost || 0;
    const averageGuideCost = completedTrip.averageGuideCost || 0;
    const totalBudget = averageDriverCost + averageGuideCost;
    const spent = parseFloat(completedTrip.payedAmount) || 0;

    // Get city image for the destination
    const cityImage = getCityImageUrl(destination);
    
    // Build highlights array from dailyPlans, preferredTerrains, and preferredActivities
    let highlights = [];
    
    // Add destination
    if (destination) {
      highlights.push(destination);
    }
    
    // Add preferred terrains
    if (completedTrip.preferredTerrains && Array.isArray(completedTrip.preferredTerrains)) {
      highlights = [...highlights, ...completedTrip.preferredTerrains.slice(0, 2)];
    }
    
    // Add preferred activities
    if (completedTrip.preferredActivities && Array.isArray(completedTrip.preferredActivities)) {
      highlights = [...highlights, ...completedTrip.preferredActivities.slice(0, 2)];
    }
    
    // Add cities from daily plans
    if (completedTrip.dailyPlans && Array.isArray(completedTrip.dailyPlans)) {
      const cities = completedTrip.dailyPlans
        .map(plan => plan.city)
        .filter(city => city && city !== destination)
        .slice(0, 2);
      highlights = [...highlights, ...cities];
    }
    
    // Remove duplicates and limit to 5 highlights
    highlights = [...new Set(highlights)].slice(0, 5);
    
    // Calculate number of days
    const numberOfDays = completedTrip.dailyPlans ? completedTrip.dailyPlans.length : 
                        (startDate && endDate ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1 : 1);
    
    // Calculate rating based on reviews
    let rating = null;
    let reviewCount = 0;
    let totalRating = 0;
    
    if (completedTrip.driver_reviewed && completedTrip.driver_review) {
      reviewCount++;
      // Assume driver review has rating (you might need to extract this from the review content)
      totalRating += 4.5; // Default rating if not available
    }
    
    if (completedTrip.guide_reviewed && completedTrip.guide_review) {
      reviewCount++;
      // Assume guide review has rating (you might need to extract this from the review content)
      totalRating += 4.5; // Default rating if not available
    }
    
    if (reviewCount > 0) {
      rating = (totalRating / reviewCount).toFixed(1);
    }
    
    return {
      id: tripId,
      tripId: tripId, // Explicitly preserve the backend trip ID
      name: tripName,
      dates: formatTripDates(startDate, endDate),
      destination: destination,
      image: cityImage,
      status: 'completed', // All trips from this API are completed
      progress: 100, // Completed trips have 100% progress
      daysLeft: 0, // Completed trips have no days left
      travelers: 1, // Default as the API doesn't seem to have group size info
      rating: rating ? parseFloat(rating) : null,
      memories: 0, // Could be calculated from photos/reviews if available
      highlights: highlights,
      budget: totalBudget,
      spent: spent,
      numberOfDays: numberOfDays,
      message: `${completedTrip.activityPacing || 'Normal'} paced trip with ${completedTrip.budgetLevel || 'Medium'} budget`,
      createdAt: completedTrip.createdAt,
      _originalData: completedTrip,
      _source: 'completed_trips_api'
    };
  };

  // Handle new trip data from the complete trip flow
  useEffect(() => {
    if (location.state?.newTrip) {
      const newTrip = location.state.newTrip;
      const formattedTrip = {
        id: Date.now(),
        name: newTrip.name,
        dates: newTrip.dates.length === 2 
          ? `${newTrip.dates[0].toLocaleDateString()} → ${newTrip.dates[1].toLocaleDateString()}`
          : newTrip.dates.length === 1 
          ? newTrip.dates[0].toLocaleDateString()
          : 'Dates not set',
        destination: 'Sri Lanka',
        image: placeholder,
        isCompleted: false,
        terrains: newTrip.terrains || [],
        activities: newTrip.activities || [],
        createdAt: newTrip.createdAt
      };
      
      setTrips(prev => [formattedTrip, ...prev]);
      navigate('/trips', { replace: true });
    }
  }, [location.state, navigate]);

  // Handle body scroll when mobile filters popup is open
  useEffect(() => {
    if (isMobileFiltersOpen) {
      // Prevent scrolling on mobile when popup is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      // Restore scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isMobileFiltersOpen]);

  // List all trips for authenticated user
  const getUserTrips = async () => {
    const response = await fetch('/api/trip/my-trips', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get user trips: ${response.status}`);
    }
    
    const result = await response.json();
    return {
      trips: result.trips,
      userId: result.userId,
      count: result.count
    };
  };

  // Filter and sort trips
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If filter is 'active', we already fetched only active trips from the active trips API
    // If filter is 'all', we show all trips from the main API
    // If filter is 'completed' or 'draft', we filter from the 'all' trips
    let matchesFilter = true;
    if (filterStatus === 'active') {
      // Already filtered by API, no need to filter again
      matchesFilter = true;
    } else if (filterStatus === 'all') {
      // Show all trips
      matchesFilter = true;
    } else {
      // For 'completed', 'draft', filter from the fetched trips
      matchesFilter = trip.status === filterStatus;
    }
    
    return matchesSearch && matchesFilter;
  });

  // Debug logging
  console.log('🔍 FILTERING DEBUG:', {
    totalTrips: trips.length,
    filteredTrips: filteredTrips.length,
    filterStatus: filterStatus,
    searchTerm: searchTerm,
    tripsFirstFew: trips.slice(0, 3).map(t => ({ id: t.id, name: t.name, status: t.status }))
  });

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        if (!a.dates || a.dates === 'Not set') return 1;
        if (!b.dates || b.dates === 'Not set') return -1;
        return new Date(a.dates.split(' → ')[0]) - new Date(b.dates.split(' → ')[0]);
      default:
        return b.id - a.id;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCreateTrip = (tripData) => {
    console.log('🚀 Creating trip with user UID:', currentUser?.uid);
    console.log('📝 Trip data:', tripData);
    
    navigate('/trip-duration', { 
      state: { 
        tripName: tripData.name,
        userUid: currentUser?.uid
      } 
    });
    setIsCreateTripModalOpen(false);
  };

  const handleCreateAITrip = (tripData) => {
    console.log('🚀 Creating trip with user UID:', currentUser?.uid);
    console.log('📝 Trip data:', tripData);
    
    navigate('/ai-trip-duration', { 
      state: { 
        tripName: tripData.name,
        userUid: currentUser?.uid
      } 
    });
    setIsCreateAiTripModalOpen(false);
  };

  const handleTripClick = (trip) => {
    console.log('🔍 Viewing trip:', trip.name);
    
    // If it's an active trip, navigate to ongoing-trip page
    if (trip.status === 'active') {
      console.log('🚀 Navigating to ongoing trip page with data:', trip._originalData || trip);
      navigate('/ongoing-trip', { 
        state: { 
          tripData: trip._originalData || trip
        } 
      });
    } else if (trip.status === 'completed') {
      // If it's a completed trip, navigate to completed trip details page
      console.log('🚀 Navigating to completed trip details page with data:', trip._originalData || trip);
      navigate(`/completed-trip/${trip.tripId || trip.id}`, { 
        state: { 
          trip: trip
        } 
      });
    } else {
      // For non-active trips, use the regular trip view
      navigate(`/trip/${trip.id}`, { 
        state: { 
          trip: trip
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />

      {/* Enhanced Hero Video Section */}
      <section className="relative w-full h-[75vh] md:h-[45vh] overflow-hidden">
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover scale-105 z-0"
          autoPlay 
          muted 
          loop
          playsInline
        >
          <source src={myTripsVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/30 z-10" />
        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl mx-auto mt-24 sm:mt-16 md:mt-20 lg:mt-24">
            <h1 className="text-4xl md:text-6xl font-normal mb-8 leading-tight text-white">
              Your Travel Dreams Come to Life
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-blue-100">
              Plan, organize, and experience unforgettable journeys with our intelligent trip planner
            </p>
            <div className="flex flex-row gap-3 sm:gap-4 justify-center mb-8">
              <button
                onClick={handlePlanNewAdventure}
                className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-900 rounded-full font-bold text-sm sm:text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-xl flex-1 sm:flex-none"
              >
                <Plus className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">Plan New Adventure</span>
                <span className="sm:hidden">Plan Adventure</span>
              </button>
              <button 
                onClick={handleAITripSuggestions}
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-full font-bold text-sm sm:text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex-1 sm:flex-none"
              >
                <Sparkles className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6" />
                <span className="hidden sm:inline">AI Trip Suggestions</span>
                <span className="sm:hidden">AI Suggestions</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Main Content */}
      <main className="relative z-10 -mt-8 sm:-mt-2 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Control Panel */}
          <div className="bg-white rounded-full shadow-xl border border-gray-100 p-4 sm:p-5 mb-6 sm:mb-20 w-full sm:w-fit mx-auto relative z-20">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-end">
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-4 w-full sm:justify-end">
                {/* Search */}
                <div className="relative w-full sm:flex-[3_3_0%] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] xl:min-w-[700px]">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <form onSubmit={e => { e.preventDefault(); }} className="w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Search trips..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-16 sm:pr-28 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-base bg-white"
                      />
                      {/* Mobile Filter Button */}
                      <button
                        type="button"
                        onClick={() => setIsMobileFiltersOpen(true)}
                        className="sm:hidden absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <Filter className="h-5 w-5" />
                      </button>
                      {/* Desktop Search Button */}
                      <button
                        type="submit"
                        className="hidden sm:block absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition-colors text-sm"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Filter and Sort - Hidden on mobile, shown on larger screens */}
                <div className="hidden sm:flex gap-4">
                  {/* Filter */}
                  <CustomDropdown
                    value={filterStatus}
                    onChange={setFilterStatus}
                    options={filterOptions}
                    className="flex-1 sm:flex-[0_1_160px] sm:min-w-[120px] sm:max-w-[160px]"
                  />
                  {/* Sort */}
                  <CustomDropdown
                    value={sortBy}
                    onChange={setSortBy}
                    options={sortOptions}
                    className="flex-1 sm:flex-[0_1_160px] sm:min-w-[120px] sm:max-w-[160px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {apiError && (
            <div className="flex justify-center mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl w-full">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800 mb-1">
                      Connection Issue
                    </h3>
                    <p className="text-sm text-red-700 mb-3">
                      {apiError}
                    </p>
                    {apiError.includes('backend') && (
                      <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
                        <strong>For developers:</strong> Make sure your backend servers are running on:
                        <br />• Trip Planning: {process.env.REACT_APP_API_BASE_URL_TRIP_PLANNING || 'http://localhost:8085/api/v1'}
                        <br />• User Services: {process.env.REACT_APP_API_BASE_URL_USER_SERVICES || 'http://localhost:8083/api/v1'}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setApiError(null);
                        window.location.reload();
                      }}
                      className="mt-3 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Retry Connection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Highlight Ongoing Trip and Other Trips */}
          {(() => {
            // When viewing active trips, we want to show the first active trip as "ongoing"
            // and the rest as "other active trips" instead of filtering them out
            let ongoingTrip, otherTrips;
            
            if (filterStatus === 'active' && sortedTrips.length > 0) {
              // For active filter: show first trip as ongoing, rest as other active trips
              ongoingTrip = sortedTrips[0];
              otherTrips = sortedTrips.slice(1); // All remaining active trips
              console.log('🔄 Active filter UI logic - ongoing trip:', ongoingTrip?.name);
              console.log('🔄 Active filter UI logic - other active trips:', otherTrips.length);
            } else {
              // For other filters: use original logic
              ongoingTrip = sortedTrips.find(trip => trip.status === 'active');
              otherTrips = sortedTrips.filter(trip => trip.status !== 'active');
              console.log('🔄 Regular filter UI logic - ongoing trip:', ongoingTrip?.name);
              console.log('🔄 Regular filter UI logic - other trips:', otherTrips.length);
            }
            
            return (
              <>
                {ongoingTrip && (
                  <div className="flex justify-center mb-12 sm:mb-16">
                    <div
                      className="relative bg-blue-50 rounded-2xl sm:rounded-3xl border-2 border-blue-200 flex flex-col md:flex-row w-full max-w-sm sm:max-w-4xl overflow-hidden cursor-pointer hover:shadow-lg transition"
                      onClick={() => navigate('/ongoing-trip', { 
                        state: { 
                          tripData: ongoingTrip._originalData || ongoingTrip
                        } 
                      })}
                      role="button"
                      tabIndex={0}
                      onKeyPress={e => { 
                        if (e.key === 'Enter' || e.key === ' ') {
                          navigate('/ongoing-trip', { 
                            state: { 
                              tripData: ongoingTrip._originalData || ongoingTrip
                            } 
                          });
                        }
                      }}
                    >
                      {/* Image */}
                      <div className="md:w-2/5 w-full min-h-[180px] sm:min-h-[260px] relative">
                        <img
                          src={ongoingTrip.image}
                          alt={ongoingTrip.destination}
                          className="absolute inset-0 w-full h-full object-cover object-center md:rounded-none"
                          style={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2 py-1 sm:px-3 sm:py-1 bg-blue-500 text-white text-xs rounded-full font-semibold uppercase tracking-wide">Ongoing Trip</span>
                      </div>
                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-center px-4 py-4 sm:px-8 sm:py-8">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <span className="text-gray-500 text-xs">{ongoingTrip.dates}</span>
                        </div>
                        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-900 mb-1 sm:mb-2">{ongoingTrip.name}</h2>
                        <div className="flex items-center text-gray-700 mb-1 sm:mb-2">
                          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
                          <span className="text-sm sm:text-base font-medium">{ongoingTrip.destination}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                          <div className="flex items-center text-gray-600">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-400" />
                            <span className="text-xs sm:text-sm">{ongoingTrip.travelers} traveler{ongoingTrip.travelers !== 1 ? 's' : ''}</span>
                          </div>
                          {ongoingTrip.daysLeft && (
                            <span className="px-2 py-1 sm:px-3 sm:py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-semibold">{ongoingTrip.daysLeft} days left</span>
                          )}
                        </div>
                        <div className="w-full bg-blue-200/40 rounded-full h-2 sm:h-3 mb-1 sm:mb-2">
                          <div className="bg-blue-500 h-2 sm:h-3 rounded-full transition-all duration-500" style={{ width: `${ongoingTrip.progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mb-2 sm:mb-4">
                          <span>Progress</span>
                          <span>{ongoingTrip.progress}%</span>
                        </div>
                        {ongoingTrip.highlights && ongoingTrip.highlights.length > 0 && (
                          <div className="mb-2">
                            <div className="flex flex-wrap gap-1">
                              {ongoingTrip.highlights.slice(0, 3).map((highlight, index) => (
                                <span key={index} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">{highlight}</span>
                              ))}
                              {ongoingTrip.highlights.length > 3 && (
                                <span className="inline-block px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">+{ongoingTrip.highlights.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3 sm:gap-6 mt-2 sm:mt-4">
                          {ongoingTrip.rating && (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current mr-1" />
                              <span className="font-semibold text-sm sm:text-lg text-gray-700">{ongoingTrip.rating}</span>
                            </div>
                          )}
                          {ongoingTrip.memories > 0 && (
                            <div className="flex items-center">
                              <Camera className="h-4 w-4 sm:h-5 sm:w-5 mr-1 text-blue-400" />
                              <span className="font-semibold text-sm sm:text-lg text-gray-700">{ongoingTrip.memories} memories</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <span className="font-semibold text-sm sm:text-lg text-gray-700">Budget: ${ongoingTrip.budget}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Categorized Other Trips */}
                {(() => {
                  if (filterStatus === 'active') {
                    // When viewing active trips, all "otherTrips" are active trips
                    return (
                      <>
                        {otherTrips.length > 0 && (
                          <div className="mb-12">
                            <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-6">Other Active Trips</h2>
                            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                              {otherTrips.map((trip) => (
                                <div key={trip.id} className="min-w-[240px] max-w-[260px] sm:max-w-xs flex-shrink-0">
                                  <TripCard trip={trip} getStatusColor={getStatusColor} onClick={() => handleTripClick(trip)} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  } else {
                    // Regular categorization for other filters
                    const upcoming = otherTrips.filter(trip => trip.status === 'draft' || trip.status === 'upcoming' || trip.status === 'active');
                    const history = otherTrips.filter(trip => trip.status === 'completed' || trip.status === 'expired');
                    return (
                      <>
                        {upcoming.length > 0 && (
                          <div className="mb-12">
                            <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-6">Upcoming Trips</h2>
                            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                              {upcoming.map((trip) => (
                                <div key={trip.id} className="min-w-[240px] max-w-[260px] sm:max-w-xs flex-shrink-0">
                                  <TripCard trip={trip} getStatusColor={getStatusColor} onClick={() => handleTripClick(trip)} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {history.length > 0 && (
                          <div className="mb-12">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">Trip History</h2>
                            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                              {history.map((trip) => (
                                <div key={trip.id} className="min-w-[240px] max-w-[260px] sm:max-w-xs flex-shrink-0">
                                  <TripCard trip={trip} getStatusColor={getStatusColor} onClick={() => handleTripClick(trip)} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  }
                })()}

                {/* Empty State */}
                {(filterStatus === 'active' ? otherTrips.length === 0 : 
                  otherTrips.filter(trip => trip.status === 'draft' || trip.status === 'upcoming' || trip.status === 'active').length === 0 &&
                  otherTrips.filter(trip => trip.status === 'completed' || trip.status === 'expired').length === 0) && (
                  <div className="text-center py-20">
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 mx-auto mb-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Globe className="h-12 w-12 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">No trips found</h3>
                      <p className="text-gray-600 mb-8">
                        {searchTerm || filterStatus !== 'all' 
                          ? "Try adjusting your search or filter criteria"
                          : "Your travel adventure starts with a single step. Create your first trip!"}
                      </p>
                      <button
                        onClick={handlePlanNewAdventure}
                        className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-full font-semibold text-base hover:bg-blue-700 transition-colors shadow"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        Create Your First Trip
                      </button>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </main>

      {/* Enhanced Create Trip Modal */}
      <CreateTripModal
        isOpen={isCreateTripModalOpen}
        onClose={() => setIsCreateTripModalOpen(false)}
        onCreateTrip={handleCreateTrip}
      />
      {/* Enhanced Create Trip Modal */}
      <CreateAiTripModal
        isOpen={isCreateAiTripModalOpen}
        onClose={() => setIsCreateTripModalOpen(false)}
        onCreateTrip={handleCreateAITrip}
      />

      {/* Login Required Popup */}
      <LoginRequiredPopup
        show={showLoginRequiredPopup}
        onClose={() => setShowLoginRequiredPopup(false)}
        actionName={currentActionName}
      />

      {/* Complete Profile Popup */}
      <CompleteProfilePopup
        show={showCompleteProfilePopup}
        onClose={() => setShowCompleteProfilePopup(false)}
        actionName={currentActionName}
      />

      {/* Mobile Filter Popup */}
      {isMobileFiltersOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 sm:hidden"
          style={{ zIndex: 99999 }}
          onClick={() => setIsMobileFiltersOpen(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-2xl transform transition-transform duration-300 ease-out"
            style={{ zIndex: 100000 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filter & Sort</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Filter Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilterStatus(option.value)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                        filterStatus === option.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Sort by</label>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 text-left ${
                        sortBy === option.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setFilterStatus('all');
                    setSortBy('recent');
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyTripsPage;

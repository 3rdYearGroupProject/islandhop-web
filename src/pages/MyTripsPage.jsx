import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
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
import TripCard from '../components/tourist/TripCard';
import myTripsVideo from '../assets/mytrips.mp4';
import { tripPlanningApi } from '../api/axios';
// import { fetchUserTrips as fetchUserTripsApi } from '../api/tripApi'; // Function moved to TripPreferencesPage
import { getUserUID } from '../utils/userStorage';
import Footer from '../components/Footer';

import { getCityImageUrl, placeholderImage, logImageError } from '../utils/imageUtils';

// Always use the placeholder from imageUtils to ensure consistency
const placeholder = placeholderImage;

const MyTripsPage = () => {
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, completed, draft
  const [sortBy, setSortBy] = useState('recent'); // recent, name, date
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [apiError, setApiError] = useState(null);
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
        
        // Fetch user trips from backend
        try {
          const userTrips = await fetchUserTrips(user.uid);
          console.log('📊 Setting trips from backend:', userTrips.length, 'trips');
          setTrips(userTrips);
        } catch (error) {
          console.warn('⚠️ Failed to fetch trips from backend, using mock data');
          console.error('Backend fetch error:', error);
          // Keep the existing mock data as fallback
          setTrips(mockTrips);
        }
      } else {
        setCurrentUser(null);
        setTrips([]); // Clear trips when user logs out
      }
    });

    return () => unsubscribe();
  }, []);
  
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

  // Handle new trip data from the complete trip flow
  useEffect(() => {
    if (location.state?.newTrip) {
      const newTrip = location.state.newTrip;
      const formattedTrip = {
        id: Date.now(), // Simple ID generation
        name: newTrip.name,
        dates: newTrip.dates.length === 2 
          ? `${newTrip.dates[0].toLocaleDateString()} → ${newTrip.dates[1].toLocaleDateString()}`
          : newTrip.dates.length === 1 
          ? newTrip.dates[0].toLocaleDateString()
          : 'Dates not set',
        destination: 'Sri Lanka', // Default destination
        image: placeholder,
        isCompleted: false,
        terrains: newTrip.terrains || [],
        activities: newTrip.activities || [],
        createdAt: newTrip.createdAt
      };
      
      setTrips(prev => [formattedTrip, ...prev]);
      
      // Clear the location state to prevent re-adding on refresh
      navigate('/trips', { replace: true });
    }
  }, [location.state, navigate]);

  // API function to fetch user trips
  const fetchUserTrips = async (userId) => {
    console.log('📥 FETCH USER TRIPS START');
    console.log('👤 Fetching trips for userId:', userId);
    
    try {
      setIsLoadingTrips(true);
      setApiError(null);
      
      console.log('📡 Making GET ITINERARIES API request to:', `/api/v1/itinerary?userId=${userId}`);
      
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL_TRIP_PLANNING || 'http://localhost:8084/api/v1'}/itinerary?userId=${userId}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      console.log('📨 GET ITINERARIES API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        
        if (response.status === 400) {
          alert(`Invalid user ID: ${errorData.message || 'Please check your login status'}`);
          throw new Error(`Invalid userId: ${errorData.message}`);
        } else if (response.status === 404) {
          console.log('📝 No trips found for user');
          alert('No trips found. Start planning your first adventure!');
          return []; // Return empty array for no trips
        } else if (response.status === 500) {
          alert(`Server error: ${errorData.message || 'Please try again later'}`);
          throw new Error(`Server error: ${errorData.message}`);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('📦 GET ITINERARIES API Response data:', data);
      
      // Transform backend trip summaries to match frontend expected format
      const backendTrips = Array.isArray(data) ? data : [];
      const transformedTrips = backendTrips.map(trip => transformBackendTripSummary(trip));
      
      console.log('✅ FETCH USER TRIPS SUCCESS - Found', transformedTrips.length, 'trips');
      console.log('📊 Transformed trips:', transformedTrips);
      
      return transformedTrips;
    } catch (error) {
      console.error('❌ FETCH USER TRIPS FAILED');
      console.error('❌ Fetch trips error:', error);
      console.error('❌ Fetch trips error message:', error.message);
      
      setApiError(error.message || 'Failed to fetch trips');
      
      // Don't show alert for network errors to avoid double alerts
      if (!error.message.includes('Invalid userId') && 
          !error.message.includes('Server error') && 
          !error.message.includes('No trips found')) {
        alert(`Failed to fetch trips: ${error.message}`);
      }
      
      throw error;
    } finally {
      setIsLoadingTrips(false);
    }
  };

  // Transform backend trip data to frontend format
  const transformTripData = (backendTrip) => {
    console.log('🔄 Transforming trip data:', backendTrip);
    
    // Calculate trip status based on dates
    const calculateTripStatus = (trip) => {
      if (!trip.startDate || !trip.endDate) return 'draft';
      
      const now = new Date();
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      
      if (now < startDate) return 'upcoming';
      if (now >= startDate && now <= endDate) return 'active';
      return 'completed';
    };

    // Calculate days left for upcoming/active trips
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

    // Format dates for display
    const formatTripDates = (startDate, endDate) => {
      if (!startDate || !endDate) return 'Dates not set';
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      return `${start.toLocaleDateString('en-US', formatOptions)} → ${end.toLocaleDateString('en-US', formatOptions)}`;
    };

    const status = calculateTripStatus(backendTrip);
    
    const destination = backendTrip.destination || backendTrip.cities?.[0] || 'Sri Lanka';
    
    // Always prioritize local images for reliability
    const cityImage = getCityImageUrl(destination);
    
    // Check if backendTrip.coverImage is a valid image URL
    // If not, use our local cityImage instead
    let coverImage = cityImage;
    if (backendTrip.coverImage) {
      try {
        // If it's an object (already imported) or valid URL, use it
        if (typeof backendTrip.coverImage === 'object') {
          coverImage = backendTrip.coverImage;
        } else {
          // Test if it's a valid URL
          new URL(backendTrip.coverImage);
          // For this component, we prefer local images over remote URLs for reliability
          coverImage = cityImage;
        }
      } catch (e) {
        // If not a valid URL, use the local image
        coverImage = cityImage;
      }
    }
    
    return {
      id: backendTrip.id || backendTrip._id,
      name: backendTrip.name || backendTrip.tripName || 'Untitled Trip',
      dates: formatTripDates(backendTrip.startDate, backendTrip.endDate),
      destination: destination,
      image: coverImage, // Always use our reliable local image
      status: status,
      progress: backendTrip.progress || (status === 'completed' ? 100 : status === 'active' ? 50 : 10),
      daysLeft: calculateDaysLeft(backendTrip),
      travelers: backendTrip.travelers || backendTrip.groupSize || 1,
      rating: backendTrip.rating || null,
      memories: backendTrip.photos?.length || 0,
      highlights: backendTrip.highlights || backendTrip.cities || [],
      budget: backendTrip.budget || 0,
      spent: backendTrip.spent || 0,
      createdAt: backendTrip.createdAt,
      // Keep backend data for future use
      _originalData: backendTrip
    };
  };

  // Transform backend trip summary data to frontend format (for new API)
  // getCityImageUrl is now imported from utils/imageUtils

  const transformBackendTripSummary = (tripSummary) => {
    console.log('🔄 Transforming trip summary data:', tripSummary);
    
    // Calculate trip status based on dates
    const calculateTripStatus = (trip) => {
      if (!trip.startDate || !trip.endDate) return 'draft';
      
      const now = new Date();
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      
      if (now < startDate) return 'upcoming';
      if (now >= startDate && now <= endDate) return 'active';
      return 'completed';
    };

    // Calculate days left for upcoming/active trips
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

    // Format dates for display
    const formatTripDates = (startDate, endDate) => {
      if (!startDate || !endDate) return 'Dates not set';
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      return `${start.toLocaleDateString('en-US', formatOptions)} → ${end.toLocaleDateString('en-US', formatOptions)}`;
    };

    const status = calculateTripStatus(tripSummary);
    // Always use local city images for consistency and reliability
    const cityImage = getCityImageUrl(tripSummary.destination || 'Sri Lanka');
    
    // Extract highlights from the destination or any available data
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
    
    // Remove duplicates from highlights
    highlights = [...new Set(highlights)];
    
    return {
      id: tripSummary.tripId,
      name: tripSummary.tripName || 'Untitled Trip',
      dates: formatTripDates(tripSummary.startDate, tripSummary.endDate),
      destination: tripSummary.destination || 'Sri Lanka',
      image: cityImage, // Use local city image
      status: status,
      progress: status === 'completed' ? 100 : status === 'active' ? 50 : 10,
      daysLeft: calculateDaysLeft(tripSummary),
      travelers: tripSummary.groupSize || 1, // Try to use groupSize if available
      rating: null, // Not provided in summary
      memories: 0, // Not provided in summary
      highlights: highlights,
      budget: tripSummary.budget || 0, 
      spent: tripSummary.spent || 0,
      numberOfDays: tripSummary.numberOfDays,
      message: tripSummary.message,
      createdAt: tripSummary.startDate,
      // Keep backend data for future use
      _originalData: tripSummary
    };
  };

  // List all trips for authenticated user
  const getUserTrips = async () => {
    const response = await fetch('/api/trip/my-trips', {
      credentials: 'include' // Session required
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

  // Fetch backend trips and merge with hardcoded trips
  useEffect(() => {
    let isMounted = true;
    const fetchTrips = async () => {
      try {
        const backend = await getUserTrips();
        if (backend && backend.trips) {
          // Avoid duplicates by id or name
          setTrips(prev => {
            const prevIds = new Set(prev.map(t => t.id));
            const prevNames = new Set(prev.map(t => t.name));
            const backendFormatted = backend.trips.map(trip => {
              const destination = trip.destination || 'Sri Lanka';
              return {
                ...trip,
                id: trip.id || trip._id || Date.now() + Math.random(),
                image: trip.image || getCityImageUrl(destination),
                status: trip.status || 'active',
                dates: trip.dates || 'Not set',
                destination: destination,
                // Add any other mapping as needed
              };
            }).filter(trip => !prevNames.has(trip.name));
            return [...backendFormatted, ...prev];
          });
        }
      } catch (err) {
        console.error('Failed to fetch user trips:', err);
      }
    };
    fetchTrips();
    return () => { isMounted = false; };
  }, []);

  // Filter and sort trips
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        if (!a.dates || a.dates === 'Not set') return 1;
        if (!b.dates || b.dates === 'Not set') return -1;
        return new Date(a.dates.split(' → ')[0]) - new Date(b.dates.split(' → ')[0]);
      default: // recent
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
    
    // Navigate to trip duration page with trip name and user UID
    navigate('/trip-duration', { 
      state: { 
        tripName: tripData.name,
        userUid: currentUser?.uid
      } 
    });
    setIsCreateTripModalOpen(false);
  };

  const handleTripClick = (trip) => {
    console.log('🔍 Viewing trip:', trip.name);
    // Navigate to the view trip page with trip data
    navigate(`/trip/${trip.id}`, { 
      state: { 
        trip: trip
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Removed driver/guide confirmation banner at top */}
      {/* Navbar */}
      <Navbar />

      {/* Enhanced Hero Video Section */}
      <section className="relative w-full h-[25vh] md:h-[45vh] overflow-hidden">
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover scale-105"
          autoPlay 
          muted 
          loop
          playsInline
        >
          <source src={myTripsVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Overlay Removed */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/30 to-blue-900/50"></div> */}
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl mx-auto mt-16 md:mt-24">
            <h1 className="text-4xl md:text-6xl font-normal mb-6 leading-tight text-white">
              Your Travel Dreams Come to Life
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-blue-100">
              Plan, organize, and experience unforgettable journeys with our intelligent trip planner
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsCreateTripModalOpen(true)}
                className="group inline-flex items-center px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Plus className="mr-3 h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                Plan New Adventure
              </button>
              <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                <Sparkles className="mr-3 h-6 w-6" />
                AI Trip Suggestions
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Enhanced Main Content */}
      <main className="relative z-10 -mt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Control Panel */}
          <div className="bg-white rounded-full shadow-xl border border-gray-100 p-5 mb-20 w-fit mx-auto relative z-20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-end">
                {/* Search */}
                <div className="relative flex-[3_3_0%] min-w-[500px] md:min-w-[600px] lg:min-w-[700px]">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <form onSubmit={e => { e.preventDefault(); }} className="w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Search trips..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-28 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-base bg-white"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition-colors text-sm"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
                {/* Filter */}
                <div className="relative flex-[0_1_160px] min-w-[120px] max-w-[160px]">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white appearance-none pr-10"
                  >
                    <option value="all">All Trips</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Drafts</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {/* Sort */}
                <div className="relative flex-[0_1_160px] min-w-[120px] max-w-[160px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white appearance-none pr-10"
                  >
                    <option value="recent">Recent</option>
                    <option value="name">Name</option>
                    <option value="date">Date</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Removed */}

          {/* Highlight Ongoing Trip */}
          {(() => {
            const ongoingTrip = sortedTrips.find(trip => trip.status === 'active');
            const otherTrips = sortedTrips.filter(trip => trip.status !== 'active');
            return (
              <>
                {ongoingTrip && (
                  <div className="flex justify-center mb-16">
                    <div className="relative bg-blue-50 rounded-3xl shadow-2xl border-2 border-blue-200 flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
                      {/* Image */}
                      <div className="md:w-2/5 w-full min-h-[260px] relative">
                        <img
                          src={ongoingTrip.image}
                          alt={ongoingTrip.destination}
                          className="absolute inset-0 w-full h-full object-cover object-center md:rounded-none"
                          style={{ borderTopLeftRadius: '1.5rem', borderBottomLeftRadius: '1.5rem' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <span className="absolute top-4 left-4 px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold uppercase tracking-wide">Ongoing Trip</span>
                      </div>
                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-center px-8 py-8">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-gray-500 text-xs">{ongoingTrip.dates}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">{ongoingTrip.name}</h2>
                        <div className="flex items-center text-gray-700 mb-2">
                          <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                          <span className="text-base font-medium">{ongoingTrip.destination}</span>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-1 text-blue-400" />
                            <span className="text-sm">{ongoingTrip.travelers} traveler{ongoingTrip.travelers !== 1 ? 's' : ''}</span>
                          </div>
                          {ongoingTrip.daysLeft && (
                            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-semibold">{ongoingTrip.daysLeft} days left</span>
                          )}
                        </div>
                        <div className="w-full bg-blue-200/40 rounded-full h-3 mb-2">
                          <div className="bg-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${ongoingTrip.progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mb-4">
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
                        <div className="flex items-center gap-6 mt-4">
                          {ongoingTrip.rating && (
                            <div className="flex items-center">
                              <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                              <span className="font-semibold text-lg text-gray-700">{ongoingTrip.rating}</span>
                            </div>
                          )}
                          {ongoingTrip.memories > 0 && (
                            <div className="flex items-center">
                              <Camera className="h-5 w-5 mr-1 text-blue-400" />
                              <span className="font-semibold text-lg text-gray-700">{ongoingTrip.memories} memories</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <span className="font-semibold text-lg text-gray-700">Budget: ${ongoingTrip.budget}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Categorized Other Trips */}
                {(() => {
                  const upcoming = otherTrips.filter(trip => trip.status === 'draft' || trip.status === 'upcoming' || trip.status === 'active');
                  const history = otherTrips.filter(trip => trip.status === 'completed' || trip.status === 'expired');
                  return (
                    <>
                      {upcoming.length > 0 && (
                        <div className="mb-12">
                          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-6">Upcoming Trips</h2>
                          <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
                            {upcoming.map((trip) => (
                              <div key={trip.id} className="min-w-[320px] max-w-xs flex-shrink-0">
                                <TripCard trip={trip} getStatusColor={getStatusColor} onClick={() => handleTripClick(trip)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {history.length > 0 && (
                        <div className="mb-12">
                          <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">Trip History</h2>
                          <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
                            {history.map((trip) => (
                              <div key={trip.id} className="min-w-[320px] max-w-xs flex-shrink-0">
                                <TripCard trip={trip} getStatusColor={getStatusColor} onClick={() => handleTripClick(trip)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {upcoming.length === 0 && history.length === 0 && (
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
                              onClick={() => setIsCreateTripModalOpen(true)}
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

      <Footer />
    </div>
  );
};

export default MyTripsPage;

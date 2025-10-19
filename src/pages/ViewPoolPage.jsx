import React, { useState, useEffect } from 'react';
import { useLocation as useRouterLocation, useNavigate, useParams } from 'react-router-dom';
import { MapPin, Plus, Utensils, Bed, Car, Camera, Search, Calendar, ChevronDown, Clock, Edit3, Share2, Heart, Star, Users, CheckCircle, AlertCircle, Timer, X } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_LIBRARIES } from '../utils/googleMapsConfig';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SharePoolModal from '../components/SharePoolModal';
import JoinPoolModal from '../components/JoinPoolModal';
import InviteUserModal from '../components/InviteUserModal';
import LoginRequiredPopup from '../components/LoginRequiredPopup';
import MapInfoWindow from '../components/MapInfoWindow';
import { PoolsApi, poolsApi } from '../api/poolsApi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ToastProvider';

// Mock participant data (replace with real data as needed)
const mockParticipants = {
  current: 3,
  max: 5,
  owner: {
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    email: 'john.doe@email.com',
    nationality: 'Sri Lankan',
    languages: ['English', 'Sinhala'],
    age: 34
  },
  participants: [
    {
      name: 'Alice Smith',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      email: 'alice.smith@email.com',
      nationality: 'British',
      languages: ['English', 'French'],
      age: 28
    },
    {
      name: 'Bob Lee',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      email: 'bob.lee@email.com',
      nationality: 'Singaporean',
      languages: ['English', 'Mandarin'],
      age: 31
    },
    {
      name: 'Charlie Kim',
      avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
      email: 'charlie.kim@email.com',
      nationality: 'Korean',
      languages: ['Korean', 'English'],
      age: 26
    }
  ]
};

const ViewPoolPage = () => {
  const location = useRouterLocation();
  const navigate = useNavigate();
  const { poolId } = useParams();
  const toast = useToast();
  
  // Get pool data from route state or use mock data if none provided
  const poolFromState = location.state?.pool;
  const sourcePage = location.state?.sourcePage;
  
  const [currentDay, setCurrentDay] = useState(0);
  const [expandedDays, setExpandedDays] = useState({});
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [joinRequestsModalOpen, setJoinRequestsModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  // Trip Confirmation State
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showParticipantConfirmModal, setShowParticipantConfirmModal] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState('pending'); // 'pending', 'confirming', 'confirmed', 'failed', 'initiated'
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isMember, setIsMember] = useState(false);
  
  // Join Requests State
  const [joinRequests, setJoinRequests] = useState([]);
  const [joinRequestsLoading, setJoinRequestsLoading] = useState(false);
  
  // Request action loading states (for individual accept/reject buttons)
  const [requestActionLoading, setRequestActionLoading] = useState({});
  
  // Trip Summary State
  const [tripSummary, setTripSummary] = useState(null);
  const [tripSummaryLoading, setTripSummaryLoading] = useState(false);
  const [tripSummaryError, setTripSummaryError] = useState(null);
  
  // Map State
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 7.8731, lng: 80.7718 }); // Sri Lanka center
  const [places, setPlaces] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  
  const { user } = useAuth();
  
  // Capacity helpers
  const currentParticipants = pool?.participants || pool?.members?.length || 0;
  const maxParticipants = pool?.maxParticipants || 0;
  const hasCapacity = currentParticipants < maxParticipants;

  const handleAcceptRequest = async (email, name) => {
    setRequestActionLoading(prev => ({ ...prev, [email]: 'accepting' }));
    try {
      console.log(`Accepting join request from ${name} (${email})`);
      
      // Find the join request to get the requestId
      const request = joinRequests.find(req => req.email === email);
      if (!request) {
        toast.error('Could not find join request', { duration: 3000 });
        setRequestActionLoading(prev => ({ ...prev, [email]: null }));
        return;
      }
      
      // Use correct API parameters based on poolsApi.js documentation
      await PoolsApi.voteOnJoinRequest(pool.groupId, {
        userId: user.uid,
        joinRequestId: request.requestId,
        action: 'approve'
      });
      
      toast.success(`Accepted join request from ${name}!`, { duration: 2000 });
      
      // Refresh join requests
      await loadJoinRequests();
    } catch (error) {
      console.error('Error accepting join request:', error);
      toast.error(`Failed to accept request: ${error.message}`, { duration: 3000 });
    } finally {
      setRequestActionLoading(prev => ({ ...prev, [email]: null }));
    }
  };

  const handleRejectRequest = async (email, name) => {
    setRequestActionLoading(prev => ({ ...prev, [email]: 'rejecting' }));
    try {
      console.log(`Rejecting join request from ${name} (${email})`);
      
      // Find the join request to get the requestId
      const request = joinRequests.find(req => req.email === email);
      if (!request) {
        toast.error('Could not find join request', { duration: 3000 });
        setRequestActionLoading(prev => ({ ...prev, [email]: null }));
        return;
      }
      
      // Use correct API parameters based on poolsApi.js documentation
      await PoolsApi.voteOnJoinRequest(pool.groupId, {
        userId: user.uid,
        joinRequestId: request.requestId,
        action: 'reject'
      });
      
      toast.warning(`Rejected join request from ${name}`, { duration: 2000 });
      
      // Refresh join requests
      await loadJoinRequests();
    } catch (error) {
      console.error('Error rejecting join request:', error);
      toast.error(`Failed to reject request: ${error.message}`, { duration: 3000 });
    } finally {
      setRequestActionLoading(prev => ({ ...prev, [email]: null }));
    }
  };

  // Function to load join requests separately
  const loadJoinRequests = async () => {
    if (!pool?.groupId || !user?.uid) {
      return;
    }
    
    try {
      setJoinRequestsLoading(true);
      console.log('📋 Loading join requests for group:', pool.groupId);
      
      const response = await PoolsApi.getPendingJoinRequests(pool.groupId, user.uid);
      console.log('📋🔍 Full API response:', response);
      
      // Try multiple possible response structures
      let requests = [];
      if (response.pendingRequests) {
        requests = response.pendingRequests;
        console.log('📋🔍 Found pendingRequests:', requests);
      } else if (response.joinRequests) {
        requests = response.joinRequests;
        console.log('📋🔍 Found joinRequests:', requests);
      } else if (response.data?.joinRequests) {
        requests = response.data.joinRequests;
        console.log('📋🔍 Found data.joinRequests:', requests);
      } else if (response.data?.pendingRequests) {
        requests = response.data.pendingRequests;
        console.log('📋🔍 Found data.pendingRequests:', requests);
      } else if (Array.isArray(response)) {
        requests = response;
        console.log('📋🔍 Response is array:', requests);
      } else {
        console.log('📋⚠️ No requests found in response structure:', Object.keys(response));
        requests = [];
      }
      
      console.log('📋🔍 Extracted requests before transformation:', requests);
      
      // Transform requests to match the expected format
      const transformedRequests = requests.map(req => {
        console.log('📋🔍 Transforming request:', req);
        return {
          requestId: req.requestId || req.id || req.joinRequestId,
          name: req.requesterName || req.name || req.userName || 'Unknown User',
          email: req.requesterEmail || req.email || req.userEmail || 'unknown@email.com',
          nationality: req.nationality || req.requesterNationality || 'Sri Lanka',
          languages: req.languages && req.languages.length > 0 ? req.languages : ['English'],
          age: req.age || req.requesterAge || 25,
          message: req.message || req.requestMessage || 'Would like to join your trip!',
          avatar: req.avatar || req.requesterAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.requesterName || req.name || 'User')}&background=random&color=fff`
        };
      });
      
      console.log('📋🔍 Transformed requests:', transformedRequests);
      setJoinRequests(transformedRequests);
      console.log('📋✅ Join requests loaded:', transformedRequests.length, 'requests');
    } catch (error) {
      console.error('📋❌ Error loading join requests:', error);
      // Keep existing requests on error
    } finally {
      setJoinRequestsLoading(false);
    }
  };

  // Function to load trip summary
  const loadTripSummary = async (tripId) => {
    if (!tripId) {
      console.warn('⚠️ No tripId provided for trip summary');
      return;
    }
    
    try {
      setTripSummaryLoading(true);
      setTripSummaryError(null);
      console.log('📊 Loading trip summary for tripId:', tripId);
      
      const response = await fetch(`http://127.0.0.1:8074/api/v1/pooling-confirm/initiated-trip/${tripId}/summary`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch trip summary: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊✅ Trip summary response:', data);
      
      if (data.success && data.data) {
        setTripSummary(data.data);
        console.log('📊✅ Trip summary loaded:', data.data);
      } else {
        throw new Error(data.message || 'Failed to load trip summary');
      }
    } catch (error) {
      console.error('📊❌ Error loading trip summary:', error);
      setTripSummaryError(error.message);
      toast.error(`Failed to load trip summary: ${error.message}`, { duration: 3000 });
    } finally {
      setTripSummaryLoading(false);
    }
  };

  // Trip Confirmation Functions
  const handleInitiateTripConfirmation = async () => {
    setConfirmationLoading(true);
    try {
      // Prepare confirmation data object matching backend API spec
      const confirmationData = {
        groupId: pool.id,     // The pool ID is the group ID
        tripId: pool.tripId,  // Use the separate tripId field
        userId: user?.uid || user?.id,
        minMembers: pool?.minParticipants || 2,
        maxMembers: pool?.maxParticipants || 6,
        tripStartDate: pool?.startDate ? new Date(pool.startDate).toISOString() : new Date().toISOString(),
        tripEndDate: pool?.endDate ? new Date(pool.endDate).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        confirmationHours: 48,
        totalAmount: pool?.totalCost || pool?.budget || 40000,
        pricePerPerson: pool?.costPerPerson || pool?.pricePerPerson || 10000,
        currency: "LKR",
        paymentDeadlineHours: 72,
        tripDetails: {
          destinations: Array.isArray(pool?.destinations) ? pool.destinations : [pool?.destinations || "Sri Lanka"],
          activities: pool?.preferredActivities || pool?.activities || ["sightseeing"],
          accommodation: pool?.accommodation || "hotel",
          transportation: pool?.transportation || "private_van"
        }
      };
      
      console.log('🎯 Sending confirmation data:', confirmationData);
      console.log('🎯 Pool ID (groupId):', pool.id);
      console.log('🎯 Trip ID:', pool.tripId);
      const result = await poolsApi.initiateTripConfirmation(confirmationData);
      console.log('Trip confirmation initiated:', result);
      setConfirmationStatus('initiated');
      toast.success('Trip confirmation initiated! All participants will be notified.', { duration: 3000 });
    } catch (error) {
      console.error('Failed to initiate trip confirmation:', error);
      toast.error('Failed to initiate trip confirmation. Please try again.', { duration: 3000 });
    } finally {
      setConfirmationLoading(false);
    }
  };

  // Function to open the confirmation modal
  const handleOpenConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  // Function to open participant confirmation modal
  const handleOpenParticipantConfirmModal = () => {
    setShowParticipantConfirmModal(true);
  };

  const handleConfirmParticipation = async () => {
    setConfirmationLoading(true);
    try {
      // Pass both confirmedTripId and userId as required by the API
      const result = await poolsApi.confirmParticipation(pool.id, user?.uid || user?.id);
      console.log('Participation confirmed:', result);
      setConfirmationStatus('confirmed');
      toast.success('Participation confirmed successfully!', { duration: 2000 });
      // Navigate to confirmed pools page
      setTimeout(() => {
        navigate('/pools', { state: { activeTab: 'confirmed' } });
      }, 2000);
    } catch (error) {
      console.error('Failed to confirm participation:', error);
      toast.error('Failed to confirm participation. Please try again.', { duration: 3000 });
    } finally {
      setConfirmationLoading(false);
      setShowParticipantConfirmModal(false);
    }
  };

  const checkUserRole = () => {
    // Check if current user is the pool creator and member using the proper API structure
    console.log('🔍🔑 checkUserRole called with:', { 
      hasUser: !!user, 
      hasPool: !!pool,
      userId: user?.uid || user?.id,
      userEmail: user?.email
    });
    
    if (user && pool) {
      // Check if user is the group leader (creator) using groupLeader from API
      const creatorCheck = pool.groupInfo?.groupLeader === user.uid || 
                          pool.groupInfo?.groupLeader === user.id ||
                          pool.members?.some(m => m.userId === user.uid && m.role === 'leader') ||
                          pool.members?.some(m => m.userId === user.id && m.role === 'leader');
      setIsCreator(creatorCheck);
      
      // Check if user is a member
      const memberCheck = pool.members?.some(m => 
        m.userId === user.uid || 
        m.userId === user.id ||
        m.email === user.email
      );
      setIsMember(memberCheck);
      
      console.log('🔍🔑 User role check result:', {
        userId: user.uid || user.id,
        userEmail: user.email,
        groupLeader: pool.groupInfo?.groupLeader,
        isCreator: creatorCheck,
        isMember: memberCheck,
        members: pool.members?.map(m => ({ userId: m.userId, role: m.role, email: m.email })),
        poolGroupInfo: pool.groupInfo
      });
    } else {
      console.log('🔍🔑 User or pool not available for role check');
    }
  };

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

  // Convert pool itinerary to match trip structure
  const convertPoolToTripFormat = (poolData) => {
    if (!poolData) return null;

    // Convert pool itinerary to trip format with activities
    const convertedItinerary = {};
    if (poolData.itinerary && Array.isArray(poolData.itinerary)) {
      poolData.itinerary.forEach((day, index) => {
        convertedItinerary[index] = {
          date: new Date(day.date),
          activities: day.activities ? day.activities.map((activity, actIndex) => ({
            id: actIndex + 1,
            name: activity,
            location: day.location,
            duration: '2 hours',
            rating: 4.5,
            description: `Experience ${activity} in ${day.location}`,
            price: '$25',
            time: `${8 + actIndex * 2}:00`
          })) : [],
          places: [],
          food: [],
          transportation: []
        };
      });
    }

    return {
      id: poolData.id,
      name: poolData.name,
      dates: [poolData.date.split(' - ')[0] || poolData.date, poolData.date.split(' - ')[1] || poolData.date],
      terrains: ['Adventure'],
      activities: poolData.highlights || [],
      createdAt: new Date().toISOString(),
      status: poolData.status === 'open' ? 'upcoming' : 'completed',
      totalDays: poolData.itinerary ? poolData.itinerary.length : parseInt(poolData.duration) || 1,
      destinations: poolData.destinations ? poolData.destinations.split(', ') : [],
      coverImage: poolData.image,
      itinerary: convertedItinerary
    };
  };

  /**
   * Transform comprehensive trip response to existing pool format
   * @param {Object} comprehensiveData - Response from comprehensive trip endpoint
   * @returns {Object} Pool object in existing format
   */
  const transformComprehensiveToPoolFormat = (comprehensiveData) => {
    console.log('🔄 Transforming comprehensive data to pool format:', comprehensiveData);
    
    const { tripDetails, groupInfo, members } = comprehensiveData;
    
    // Extract dates
    const startDate = tripDetails?.startDate ? new Date(tripDetails.startDate) : new Date();
    const endDate = tripDetails?.endDate ? new Date(tripDetails.endDate) : new Date();
    
    // Calculate duration
    const diffTime = Math.abs(endDate - startDate);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
  // Transform daily plans to itinerary format
  const itinerary = {};
  if (tripDetails?.dailyPlans) {
    tripDetails.dailyPlans.forEach((dayPlan, index) => {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + index);
      
      itinerary[index] = {
        date: dayDate,
        city: dayPlan.city,
        userSelected: dayPlan.userSelected,
        attractionsCount: dayPlan.attractionsCount || 0,
        hotelsCount: dayPlan.hotelsCount || 0,
        restaurantsCount: dayPlan.restaurantsCount || 0,
        activities: dayPlan.attractions?.map((attraction, actIndex) => ({
          id: `${index}-${actIndex}`,
          name: attraction.name,
          location: attraction.address || dayPlan.city || tripDetails.baseCity,
          coordinates: attraction.location || attraction.coordinates, // Include coordinates from API
          duration: '2-3 hours',
          rating: attraction.rating || 4.5,
          description: `Visit ${attraction.name} in ${dayPlan.city || tripDetails.baseCity}`,
          price: 'Varies',
          time: `${9 + actIndex * 2}:00`,
          category: attraction.category || 'Attraction',
          userSelected: attraction.userSelected
        })) || [],
        places: dayPlan.hotels?.map((hotel, hotelIndex) => ({
          id: `${index}-hotel-${hotelIndex}`,
          name: hotel.name,
          location: hotel.address || dayPlan.city || tripDetails.baseCity,
          coordinates: hotel.location || hotel.coordinates, // Include coordinates from API
          rating: hotel.rating || 4.0,
          description: `Stay at ${hotel.name}`,
          price: 'Contact for rates',
          category: hotel.category || 'Hotel',
          userSelected: hotel.userSelected
        })) || [],
        food: dayPlan.restaurants?.map((restaurant, restIndex) => ({
          id: `${index}-restaurant-${restIndex}`,
          name: restaurant.name,
          location: restaurant.address || dayPlan.city || tripDetails.baseCity,
          coordinates: restaurant.location || restaurant.coordinates, // Include coordinates from API
          rating: restaurant.rating || 4.2,
          description: `Dine at ${restaurant.name}`,
          price: 'Rs. 1,500 - 3,000',
          category: restaurant.category || 'Restaurant',
          userSelected: restaurant.userSelected
        })) || [],
        transportation: []
      };
    });
  }    // Extract destinations from daily plans or use base city
    const destinations = tripDetails?.dailyPlans?.map(plan => plan.city).filter(Boolean) || [tripDetails?.baseCity || 'Various Locations'];
    const uniqueDestinations = [...new Set(destinations)];
    
    // Format dates for display
    const dateRange = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${endDate.getFullYear()}`;
    
    // Determine price based on budget level
    const priceMap = {
      'low': 'Rs. 10,000 - 15,000',
      'medium': 'Rs. 15,000 - 25,000', 
      'high': 'Rs. 25,000+',
      'budget': 'Rs. 8,000 - 12,000',
      'luxury': 'Rs. 30,000+'
    };
    const price = priceMap[tripDetails?.budgetLevel?.toLowerCase()] || 'Contact for pricing';
    
    // Transform members with proper defaults
    const transformedMembers = members?.map(member => ({
      ...member,
      nationality: member.nationality || 'Sri Lanka', // Default nationality
      languages: member.languages && member.languages.length > 0 ? member.languages : ['English'], // Default language
      age: member.age || 25, // Default age
      avatar: member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff`
    })) || [];
    
    const transformedData = {
      id: tripDetails?.tripId || 'unknown',
      tripId: tripDetails?.tripId,
      groupId: groupInfo?.groupId,
      name: groupInfo?.groupName || tripDetails?.tripName || 'Trip Adventure',
      owner: members?.find(m => m.role === 'leader')?.name || 'Trip Leader',
      destinations: uniqueDestinations.join(', '),
      destinationsArray: uniqueDestinations,
      participants: groupInfo?.currentMembers || members?.length || 0,
      maxParticipants: groupInfo?.maxMembers || 6,
      rating: 4.5, // Default rating
      price: price,
      date: dateRange,
      duration: `${totalDays} day${totalDays > 1 ? 's' : ''}`,
      status: groupInfo?.status || 'active',
      
      // Additional pool-specific data
      dates: [tripDetails?.startDate, tripDetails?.endDate],
      terrains: tripDetails?.preferredTerrains || ['Mixed'],
      activities: tripDetails?.preferredActivities || [],
      createdAt: tripDetails?.createdAt || new Date().toISOString(),
      totalDays: totalDays,
      coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      
      // Group and member information
      groupInfo: groupInfo,
      members: transformedMembers,
      
      // Itinerary data
      itinerary: itinerary,
      
      // Trip preferences
      budgetLevel: tripDetails?.budgetLevel,
      activityPacing: tripDetails?.activityPacing,
      multiCityAllowed: tripDetails?.multiCityAllowed,
      
      // Highlights based on attractions
      highlights: tripDetails?.dailyPlans?.flatMap(day => 
        day.attractions?.slice(0, 2).map(attraction => attraction.name) || []
      ).slice(0, 5) || ['Scenic Views', 'Cultural Experience', 'Adventure Activities']
    };
    
    console.log('🔄 Transformed pool data:', transformedData);
    return transformedData;
  };

  useEffect(() => {
    // Load pool data using comprehensive trip endpoint
    const loadPool = async () => {
      console.log('🔍📋 ===== LOADING POOL DATA =====');
      console.log('🔍📋 Pool ID from URL:', poolId);
      console.log('🔍📋 Pool from state:', poolFromState);
      console.log('🔍📋 Current user:', user);
      
      setLoading(true);
      
      try {
        let tripId = null;
        
        // First, try to get tripId from the pool state if available
        if (poolFromState && poolFromState.tripId) {
          tripId = poolFromState.tripId;
          console.log('🔍📋 Using tripId from pool state:', tripId);
        } else if (poolId) {
          // poolId in URL is actually groupId, we need to get tripId
          console.log('🔍📋 URL poolId is actually groupId:', poolId);
          console.log('🔍📋 Need to get tripId from groupId...');
          
          // If no pool state available, we need to get tripId from groupId
          // For now, let's try using the poolId directly as tripId
          // This will fail if it's a groupId, but we have fallback logic
          tripId = poolId;
        }
        
        // If we have tripId, fetch comprehensive trip details from API
        if (tripId) {
          console.log('🔍📋 Fetching comprehensive trip details for tripId:', tripId);
          
          // Call the comprehensive trip endpoint
          const comprehensiveData = await PoolsApi.getComprehensiveTripDetails(
            tripId, // Use the tripId we determined
            user?.uid || null // Optional userId for personalized data
          );
          
          console.log('🔍📋 Comprehensive data received:', comprehensiveData);
          
          // Transform comprehensive response to existing pool format
          const tripData = transformComprehensiveToPoolFormat(comprehensiveData);
          console.log('🔍📋 Transformed trip data:', tripData);
          
          setPool(tripData);
          
          // Set initial join requests from comprehensive data
          console.log('📋🔍 Checking comprehensive data for join requests:', comprehensiveData);
          if (comprehensiveData.pendingJoinRequests) {
            console.log('📋🔍 Found pendingJoinRequests in comprehensive data:', comprehensiveData.pendingJoinRequests);
            const transformedRequests = comprehensiveData.pendingJoinRequests.map(req => ({
              requestId: req.requestId || req.id,
              name: req.requesterName || req.name || 'Unknown User',
              email: req.requesterEmail || req.email || 'unknown@email.com',
              nationality: req.nationality || 'Sri Lanka',
              languages: req.languages && req.languages.length > 0 ? req.languages : ['English'],
              age: req.age || 25,
              message: req.message || 'Would like to join your trip!'
            }));
            console.log('📋🔍 Setting initial join requests:', transformedRequests);
            setJoinRequests(transformedRequests);
          } else {
            console.log('📋🔍 No pendingJoinRequests found in comprehensive data');
          }
          
          // Initialize expanded days - expand first few days by default
          const totalDays = tripData.totalDays || 5;
          const initialExpanded = {};
          for (let i = 0; i < totalDays; i++) {
            initialExpanded[i] = i < 3; // Expand first 3 days
          }
          setExpandedDays(initialExpanded);
          
        } else {
          console.log('🔍📋 No poolId provided, using fallback data');
          
          // Use pool from state if available, otherwise use mock data
          let poolData = poolFromState;
          
          // If no pool data provided, use mock data
          if (!poolData) {
            console.log('🔍📋 Using mock data as fallback');
            poolData = {
              id: 1,
              image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
              name: 'Adventure to Ella',
              owner: 'John Doe',
              destinations: 'Kandy, Nuwara Eliya, Ella',
              participants: 3,
              maxParticipants: 5,
              rating: 4.8,
              price: 'Rs. 15,000',
              date: 'Aug 15-17, 2025',
              duration: '3 days',
              status: 'open',
              highlights: ['Tea Plantations', 'Nine Arch Bridge', 'Little Adams Peak'],
              itinerary: [
                {
                  day: 1,
                  date: 'Aug 15, 2025',
                  location: 'Kandy',
                  activities: [
                    'Temple of the Sacred Tooth visit',
                    'Kandy Lake walk',
                    'Traditional cultural show'
                  ]
                },
                {
                  day: 2,
                  date: 'Aug 16, 2025',
                  location: 'Nuwara Eliya',
                  activities: [
                    'Tea plantation tour',
                    'Gregory Lake activities',
                    'Strawberry farm visit'
                  ]
                },
                {
                  day: 3,
                  date: 'Aug 17, 2025',
                  location: 'Ella',
                  activities: [
                    'Nine Arch Bridge exploration',
                    'Little Adams Peak hike',
                    'Ella Rock viewpoint'
                  ]
                }
              ]
            };
          }
          
          // Convert pool data to trip format
          const tripData = convertPoolToTripFormat(poolData);
          setPool(tripData);
          
          // Initialize expanded days - expand first few days by default
          const totalDays = tripData.totalDays || 5;
          const initialExpanded = {};
          for (let i = 0; i < totalDays; i++) {
            initialExpanded[i] = i < 3; // Expand first 3 days
          }
          setExpandedDays(initialExpanded);
        }
        
      } catch (error) {
        console.error('🔍📋❌ Error loading pool data:', error);
        console.log('🔍📋 Falling back to mock data due to error');
        
        // Fallback to mock data on error
        const mockData = {
          id: 1,
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          name: 'Adventure to Ella',
          owner: 'John Doe',
          destinations: 'Kandy, Nuwara Eliya, Ella',
          participants: 3,
          maxParticipants: 5,
          rating: 4.8,
          price: 'Rs. 15,000',
          date: 'Aug 15-17, 2025',
          duration: '3 days',
          status: 'open',
          highlights: ['Tea Plantations', 'Nine Arch Bridge', 'Little Adams Peak'],
          itinerary: [
            {
              day: 1,
              date: 'Aug 15, 2025',
              location: 'Kandy',
              activities: ['Temple of the Sacred Tooth visit', 'Kandy Lake walk']
            }
          ]
        };
        
        const tripData = convertPoolToTripFormat(mockData);
        setPool(tripData);
        
        const initialExpanded = {};
        for (let i = 0; i < 3; i++) {
          initialExpanded[i] = i < 3;
        }
        setExpandedDays(initialExpanded);
      }
      
      setLoading(false);
      console.log('🔍📋 ===== POOL DATA LOADING COMPLETE =====');
    };

    loadPool();
  }, [poolFromState, poolId, user]);

  // Load join requests when pool data is available and user is the creator
  useEffect(() => {
    console.log('📋🔍 useEffect for join requests triggered:', { 
      hasPool: !!pool, 
      hasUser: !!user, 
      isCreator, 
      groupId: pool?.groupId 
    });
    
    if (pool && user && isCreator && pool.groupId) {
      console.log('📋🔍 Conditions met, calling loadJoinRequests');
      loadJoinRequests();
    } else {
      console.log('📋🔍 Conditions not met for loading join requests');
    }
  }, [pool, user, isCreator]);

  // Load trip summary when pool data is available and has a tripId
  useEffect(() => {
    console.log('📊🔍 useEffect for trip summary triggered:', { 
      hasPool: !!pool, 
      tripId: pool?.tripId 
    });
    
    if (pool && pool.tripId) {
      console.log('📊🔍 Conditions met, calling loadTripSummary');
      loadTripSummary(pool.tripId);
    } else {
      console.log('📊🔍 Conditions not met for loading trip summary - no tripId');
    }
  }, [pool?.tripId]);

  // Load join requests when modal opens
  useEffect(() => {
    console.log('📋🔍 Modal useEffect triggered:', { 
      joinRequestsModalOpen, 
      groupId: pool?.groupId, 
      userId: user?.uid, 
      isCreator 
    });
    
    if (joinRequestsModalOpen && pool?.groupId && user?.uid && isCreator) {
      console.log('📋🔍 Modal opened and conditions met, calling loadJoinRequests');
      loadJoinRequests();
    }
  }, [joinRequestsModalOpen, pool?.groupId, user?.uid, isCreator]);

  // Generate days array from pool dates
  const generateDays = () => {
    if (!pool || !pool.dates || pool.dates.length < 2) return [];
    
    const days = [];
    const startDate = new Date(pool.dates[0]);
    const totalDays = pool.totalDays || 5;
    
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
    navigate('/pools');
  };

  const handleEdit = () => {
    navigate('/pool-itinerary', {
      state: {
        poolName: pool.name,
        selectedDates: pool.dates,
        selectedTerrains: pool.terrains,
        selectedActivities: pool.activities,
        poolId: pool.id,
        editMode: true
      }
    });
  };

  const handleCopyLink = async () => {
    try {
      // Get the current pool URL
      const poolUrl = `${window.location.origin}/pool/${poolId}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(poolUrl);
      
      // Show success notification
      toast.success('Pool link copied to clipboard!', { duration: 2000 });
      
      console.log('Pool link copied:', poolUrl);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link. Please try again.', { duration: 3000 });
    }
  };

  const handleInvite = (emails) => {
    // Implement invite logic here (e.g., send emails)
    console.log('Inviting:', emails);
  };

  const handleFavorite = () => {
    console.log('Toggle favorite for pool:', pool.name);
    // Implement favorite functionality
  };

  const handleProceed = () => {
    setJoinModalOpen(true);
  };

  const handleRequestJoin = () => {
    // Implement request to join logic here
    console.log('Request to join pool:', pool?.name);
    setJoinModalOpen(false);
  };

  // Prevent background scroll when join requests modal is open
  useEffect(() => {
    if (joinRequestsModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Clean up on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [joinRequestsModalOpen]);

  // Check user role when pool or user data changes
  useEffect(() => {
    checkUserRole();
    // Also extract places for map when pool data is available
    if (pool?.itinerary) {
      const allPlaces = [];
      Object.entries(pool.itinerary).forEach(([dayIndex, dayData]) => {
        // Add activities/attractions
        if (dayData.activities && dayData.activities.length > 0) {
          dayData.activities.forEach(activity => {
            // Check for coordinates in multiple possible properties
            const locationData = activity.coordinates || activity.location;
            if (locationData && typeof locationData === 'object' && locationData.lat && locationData.lng) {
              allPlaces.push({
                ...activity,
                location: locationData,
                dayNumber: parseInt(dayIndex) + 1,
                placeType: 'attraction'
              });
            }
          });
        }
        
        // Add hotels/places
        if (dayData.places && dayData.places.length > 0) {
          dayData.places.forEach(place => {
            // Check for coordinates in multiple possible properties
            const locationData = place.coordinates || place.location;
            if (locationData && typeof locationData === 'object' && locationData.lat && locationData.lng) {
              allPlaces.push({
                ...place,
                location: locationData,
                dayNumber: parseInt(dayIndex) + 1,
                placeType: 'hotel'
              });
            }
          });
        }
        
        // Add restaurants/food
        if (dayData.food && dayData.food.length > 0) {
          dayData.food.forEach(restaurant => {
            // Check for coordinates in multiple possible properties
            const locationData = restaurant.coordinates || restaurant.location;
            if (locationData && typeof locationData === 'object' && locationData.lat && locationData.lng) {
              allPlaces.push({
                ...restaurant,
                location: locationData,
                dayNumber: parseInt(dayIndex) + 1,
                placeType: 'restaurant'
              });
            }
          });
        }
        
        // Add transportation if it has coordinates
        if (dayData.transportation && dayData.transportation.length > 0) {
          dayData.transportation.forEach(transport => {
            // Check for coordinates in multiple possible properties
            const locationData = transport.coordinates || transport.location;
            if (locationData && typeof locationData === 'object' && locationData.lat && locationData.lng) {
              allPlaces.push({
                ...transport,
                location: locationData,
                dayNumber: parseInt(dayIndex) + 1,
                placeType: 'attraction'
              });
            }
          });
        }
      });
      
      console.log('🗺️ Extracted places for map:', allPlaces.length, 'locations');
      setPlaces(allPlaces);
      
      // Set map center to first place with coordinates
      if (allPlaces.length > 0 && allPlaces[0].location) {
        setMapCenter({
          lat: allPlaces[0].location.lat,
          lng: allPlaces[0].location.lng
        });
        console.log('🗺️ Map center set to:', allPlaces[0].name);
      } else {
        console.log('🗺️ No places with coordinates found, using default Sri Lanka center');
      }
    }
  }, [pool, user]);

  // Google Maps API loading
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_MAPS_LIBRARIES,
    version: 'weekly'
  });

  // Google Maps styles and settings
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '300px',
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
    
    // Smoothly pan to the selected place
    if (place.location && mapInstance) {
      mapInstance.panTo({
        lat: place.location.lat,
        lng: place.location.lng
      });
    }
  };
  
  // Close info window
  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  // Handle map load
  const handleMapLoad = (map) => {
    setMapInstance(map);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pool details...</p>
        </div>
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Pool not found</p>
          <button 
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Pools
          </button>
        </div>
      </div>
    );
  }

  // Calculate costs per category
  const accommodationItems = Object.values(pool?.itinerary || {}).flatMap(day => day?.places || []);
  const accommodationTotal = accommodationItems.reduce((sum, place) => sum + parsePrice(place.price), 0);

  const foodItems = Object.values(pool?.itinerary || {}).flatMap(day => day?.food || []);
  const foodTotal = foodItems.reduce((sum, food) => sum + parsePriceRange(food.priceRange), 0);

  const activityItems = Object.values(pool?.itinerary || {}).flatMap(day => day?.activities || []);
  const activityTotal = activityItems.reduce((sum, act) => sum + parsePrice(act.price), 0);

  const transportationItems = Object.values(pool?.itinerary || {}).flatMap(day => day?.transportation || []);
  const transportationTotal = transportationItems.reduce((sum, t) => sum + parsePrice(t.price), 0);

  // For demo, driver/guide costs are fixed
  const driverCost = 200;
  const guideCost = 150;

  const grandTotal = accommodationTotal + foodTotal + activityTotal + transportationTotal + driverCost + guideCost;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SharePoolModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        participants={pool?.members || []}
        currentCount={pool?.participants || 0}
        maxCount={pool?.maxParticipants || 0}
        onInvite={handleInvite}
      />
      <JoinPoolModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        poolData={pool}
        onSuccess={(result) => {
          console.log('Join request sent:', result);
          toast.success('Join request sent successfully!', { duration: 2000 });
        }}
      />
      <InviteUserModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        groupData={pool}
        onSuccess={(result) => {
          console.log('Invitation sent:', result);
          toast.success('Invitation sent successfully!', { duration: 2000 });
        }}
      />

      {/* Trip Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0" style={{ zIndex: 1000 }}>
          <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6 relative" style={{ zIndex: 1001 }}>
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowConfirmationModal(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                {confirmationStatus === 'initiated' ? (
                  <>
                    <div className="flex items-center gap-3 mb-6 justify-center">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <h2 className="text-2xl font-bold text-gray-900">Trip Confirmation Initiated!</h2>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                      Trip confirmation has been initiated successfully! All participants will be notified and can now confirm their participation.
                    </p>
                    
                    <button
                      onClick={() => setShowConfirmationModal(false)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full text-sm font-medium transition-colors"
                    >
                      Got it!
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6 justify-center">
                      <AlertCircle className="w-6 h-6 text-orange-500" />
                      <h2 className="text-2xl font-bold text-gray-900">Confirm Trip</h2>
                    </div>
                    
                    <p className="text-gray-600 mb-6 text-left">
                      You're about to initiate trip confirmation. This will notify all participants to confirm their participation within the confirmation period.
                    </p>
                    
                    <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Trip Details:
                      </h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <div className="flex justify-between">
                          <span className="font-medium">Destination:</span>
                          <span>{Array.isArray(pool?.destinations) ? pool.destinations.join(', ') : pool?.destinations || pool?.destination}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Duration:</span>
                          <span>{pool?.totalDays} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Dates:</span>
                          <span>{pool?.dates ? `${formatDate(new Date(pool.dates[0]))} - ${formatDate(new Date(pool.dates[1]))}` : 'TBA'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Cost per person:</span>
                          <span className="font-semibold">{tripSummary?.summary?.costPerParticipant || `Rs. ${pool?.costPerPerson || 'TBA'}`}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
                      <p className="text-sm text-amber-800">
                        <strong>Note:</strong> As the trip creator, your participation will be automatically confirmed when you initiate this confirmation process.
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowConfirmationModal(false)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-full text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleInitiateTripConfirmation}
                        disabled={confirmationLoading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full text-sm font-medium transition-colors disabled:bg-gray-400 flex items-center justify-center"
                      >
                        {confirmationLoading ? (
                          <>
                            <Timer className="w-4 h-4 mr-2 animate-spin" />
                            Initiating...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm & Initiate Trip
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Participant Confirmation Modal */}
      {showParticipantConfirmModal && (
        <div className="fixed inset-0" style={{ zIndex: 1000 }}>
          <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6 relative" style={{ zIndex: 1001 }}>
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowParticipantConfirmModal(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Confirm Your Participation</h2>
                </div>
                
                <p className="text-gray-600 mb-6 text-left">
                  The trip organizer has initiated trip confirmation. Please confirm your participation to proceed with this amazing journey!
                </p>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Trip Details:
                  </h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex justify-between">
                      <span className="font-medium">Destination:</span>
                      <span>{Array.isArray(pool?.destinations) ? pool.destinations.join(', ') : pool?.destinations || pool?.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span>{pool?.totalDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Dates:</span>
                      <span>{pool?.dates ? `${formatDate(new Date(pool.dates[0]))} - ${formatDate(new Date(pool.dates[1]))}` : 'TBA'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Cost per person:</span>
                      <span className="font-semibold">{tripSummary?.summary?.costPerParticipant || `Rs. ${pool?.costPerPerson || 'TBA'}`}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-amber-800">
                    <strong>Important:</strong> By confirming, you agree to participate in this trip and commit to the payment within the specified deadline.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowParticipantConfirmModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-full text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmParticipation}
                    disabled={confirmationLoading}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-full text-sm font-medium transition-colors disabled:bg-gray-400 flex items-center justify-center"
                  >
                    {confirmationLoading ? (
                      <>
                        <Timer className="w-4 h-4 mr-2 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm My Participation
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bill-shaped Navbar overlays the top, so pull content down and let blue header go behind */}
      <div className="relative z-10">
        <Navbar />
      </div>
      {/* Participants Card */}
      {/* Participants Detail Modal/Section */}

      {/* Pool Header - blue background behind navbar, pulled up to be visible behind floating navbar */}
      <div className="relative">
        <div className="absolute inset-0 w-full h-[300px] bg-gradient-to-r from-primary-600 to-primary-700 pointer-events-none" style={{ zIndex: 0 }}></div>
        <div className="relative max-w-7xl mx-auto px-4 pt-40 pb-12" style={{ zIndex: 1 }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {pool.status === 'completed' ? 'Completed' : 'Upcoming'}
                </span>
                <span className="text-white/80 text-sm">
                  {pool.totalDays} days • {Array.isArray(pool.destinations) ? pool.destinations.join(', ') : pool.destinations || pool.destination || 'Sri Lanka'}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2 text-white drop-shadow">{pool.name}</h1>
              <p className="text-white/90 text-lg">
                {formatDate(new Date(pool.dates[0]))} - {formatDate(new Date(pool.dates[1]))}
              </p>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Join Pool - shown if user is not a member and there's capacity */}
              {!isMember && hasCapacity && (
                <button
                  onClick={() => {
                    if (!user) {
                      setShowLoginPopup(true);
                    } else {
                      setJoinModalOpen(true);
                    }
                  }}
                  className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full transition-colors border border-white/30"
                  title="Join Pool"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Join Pool
                </button>
              )}
              
              {/* Invite Users - shown only for private pools if there's capacity and user is creator or member */}
              {hasCapacity && (isCreator || isMember) && pool?.visibility !== 'public' && (
                <button
                  onClick={() => setInviteModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white font-semibold rounded-full transition-colors border border-blue-500"
                  title="Invite specific users to this pool"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Invite
                </button>
              )}
              
              {/* Join Requests - shown only to creator */}
              {isCreator && (
                <button
                  onClick={() => setJoinRequestsModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full transition-colors border border-white/30"
                  title="Join Requests"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join Requests ({joinRequests.length})
                </button>
              )}
              
              {/* Trip Confirmation Buttons with proper visibility rules */}
              {pool && pool.status !== 'completed' && (
                <>
                  {/* Confirm Trip shown only to creator */}
                  {isCreator && (
                    <button
                      onClick={handleOpenConfirmationModal}
                      disabled={confirmationLoading}
                      className="flex items-center px-4 py-2 bg-green-600/80 hover:bg-green-600 text-white font-semibold rounded-full transition-colors border border-green-500 disabled:bg-gray-500/50 disabled:cursor-not-allowed"
                      title="Initiate Trip Confirmation"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirm Trip
                    </button>
                  )}
                  
                  {/* Confirm Participation shown only to participants who are not the creator */}
                  {isMember && !isCreator && (
                    <button
                      onClick={handleOpenParticipantConfirmModal}
                      className="flex items-center px-4 py-2 bg-orange-600/80 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors border border-orange-500"
                      title="Confirm Your Participation"
                    >
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Confirm Participation
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Join Requests Modal */}
          {joinRequestsModalOpen && (
            <div className="fixed inset-0" style={{ zIndex: 1000 }}>
              <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-40">
                <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6 relative" style={{ zIndex: 1001 }}>
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setJoinRequestsModalOpen(false)}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="w-6 h-6 text-primary-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Join Requests</h2>
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm font-medium">
                      {joinRequests.length} pending
                    </span>
                  </div>
                  
                  {joinRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 text-lg mb-2">No join requests</p>
                      <p className="text-gray-400 text-sm">When people request to join your pool, they'll appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {joinRequests.map((req, idx) => {
                        // Create avatar URL - use a placeholder if no avatar provided
                        const avatarUrl = req.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.name || 'User')}&background=random&color=fff`;
                        // Set defaults for missing data
                        const nationality = req.nationality || 'Not specified';
                        const languages = req.languages && req.languages.length > 0 ? req.languages : ['English'];
                        const age = req.age && req.age > 0 ? req.age : 'Not specified';
                        
                        return (
                        <div key={req.userId || req.email || idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start gap-4">
                            <img 
                              src={avatarUrl} 
                              alt={req.name || 'User'} 
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-lg">{req.name || 'Unknown User'}</h3>
                                  <p className="text-gray-600 text-sm">{req.email}</p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <button
                                    onClick={() => handleRejectRequest(req.email, req.name)}
                                    disabled={requestActionLoading[req.email] === 'rejecting' || requestActionLoading[req.email] === 'accepting'}
                                    className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center gap-1"
                                  >
                                    {requestActionLoading[req.email] === 'rejecting' ? (
                                      <>
                                        <Timer className="w-4 h-4 animate-spin" />
                                        Rejecting...
                                      </>
                                    ) : (
                                      'Reject'
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleAcceptRequest(req.email, req.name)}
                                    disabled={requestActionLoading[req.email] === 'accepting' || requestActionLoading[req.email] === 'rejecting'}
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                                  >
                                    {requestActionLoading[req.email] === 'accepting' ? (
                                      <>
                                        <Timer className="w-4 h-4 animate-spin" />
                                        Accepting...
                                      </>
                                    ) : (
                                      'Accept'
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500 block">Nationality</span>
                                  <span className="font-medium">{nationality}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 block">Languages</span>
                                  <span className="font-medium">{Array.isArray(languages) ? languages.join(', ') : languages}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 block">Age</span>
                                  <span className="font-medium">{age}{typeof age === 'number' ? ' years' : ''}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center">
                      Pool capacity: {pool?.participants || 0}/{pool?.maxParticipants || 0} participants
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 pt-8 relative" style={{ zIndex: 0 }}>
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 mb-8" style={{ boxShadow: 'none' }}>
          {/* Participants Avatars & Progress + Info */}
          <div className="w-full">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-lg font-semibold text-gray-900">Participants</div>
              <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                {pool?.participants || 0} / {pool?.maxParticipants || 0}
              </span>
            </div>
            <div className="flex items-center mb-2">
              {pool?.members?.map((member, idx) => {
                // Generate a placeholder avatar URL if none provided
                const avatarUrl = member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff`;
                
                return (
                  <img
                    key={member.userId || idx}
                    src={avatarUrl}
                    alt={member.name}
                    title={`${member.name} (${member.role})`}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover -ml-2 first:ml-0 cursor-pointer"
                    style={{ zIndex: 10 - idx }}
                    onClick={() => setSelectedParticipant(idx)}
                  />
                );
              })}
              {(pool?.participants || 0) < (pool?.maxParticipants || 0) && (
                <span className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xl font-bold -ml-2 bg-gray-50">+</span>
              )}
            </div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${((pool?.participants || 0) / (pool?.maxParticipants || 1)) * 100}%` }}
                ></div>
              </div>
              <div className="flex flex-col items-end min-w-[80px]">
                <span className="text-xs text-gray-500">Capacity</span>
                <span className="font-bold text-primary-700 text-lg">{pool?.maxParticipants || 0}</span>
              </div>
            </div>
            {/* Extra Info Row */}
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm mt-2">
              {/* Number of Days */}
              <div className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-1 text-primary-600" />
                <span>{pool.totalDays} days</span>
              </div>
              {/* Cost per participant - Use API data if available, fallback to calculated */}
              <div className="flex items-center text-gray-700">
                <span className="font-medium mr-1">Cost/participant:</span>
                {tripSummaryLoading ? (
                  <span className="text-gray-500">Loading...</span>
                ) : tripSummary?.summary?.costPerParticipant ? (
                  <span className="text-primary-700 font-semibold">{tripSummary.summary.costPerParticipant}</span>
                ) : (
                  <span className="text-primary-700 font-semibold">Rs. {(grandTotal / (pool?.participants || 1)).toFixed(2)}</span>
                )}
              </div>
              {/* Driver appointed - Use API data if available */}
              <div className="flex items-center text-gray-700">
                <Car className="w-4 h-4 mr-1 text-blue-600" />
                {tripSummaryLoading ? (
                  <span>Driver: <span className="text-gray-500">Loading...</span></span>
                ) : tripSummary?.summary?.driver ? (
                  <span>Driver: <span className={"font-semibold " + (tripSummary.summary.driver === 'Confirmed' ? 'text-green-600' : tripSummary.summary.driver === 'Requested' ? 'text-amber-600' : 'text-gray-500')}>{tripSummary.summary.driver}</span></span>
                ) : (
                  <span>Driver: <span className="text-gray-500">Not appointed</span></span>
                )}
              </div>
              {/* Guide appointed - Use API data if available */}
              <div className="flex items-center text-gray-700">
                <Camera className="w-4 h-4 mr-1 text-primary-600" />
                {tripSummaryLoading ? (
                  <span>Guide: <span className="text-gray-500">Loading...</span></span>
                ) : tripSummary?.summary?.guide ? (
                  <span>Guide: <span className={"font-semibold " + (tripSummary.summary.guide === 'Confirmed' ? 'text-green-600' : tripSummary.summary.guide === 'Requested' ? 'text-amber-600' : 'text-gray-500')}>{tripSummary.summary.guide}</span></span>
                ) : (
                  <span>Guide: <span className="text-gray-500">Not appointed</span></span>
                )}
              </div>
            </div>
            {/* Participants Detail Table */}
            <div className="mt-4">
              <table className="min-w-full text-xs text-left border border-gray-100 rounded-xl overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-gray-700">Avatar</th>
                    <th className="px-3 py-2 font-semibold text-gray-700">Name</th>
                    <th className="px-3 py-2 font-semibold text-gray-700">Nationality</th>
                    <th className="px-3 py-2 font-semibold text-gray-700">Languages</th>
                    <th className="px-3 py-2 font-semibold text-gray-700">Age</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Member rows */}
                  {pool?.members?.map((member, idx) => {
                    const avatarUrl = member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff`;
                    const isLeader = member.role === 'leader';
                    
                    return (
                      <tr key={member.userId || idx} className={isLeader ? "bg-primary-50" : "even:bg-gray-50"}>
                        <td className="px-3 py-2">
                          <img src={avatarUrl} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                        </td>
                        <td className="px-3 py-2 font-medium">
                          <span className={isLeader ? "text-primary-700" : ""}>{member.name}</span>
                          {isLeader && <span className="text-xs text-gray-400 ml-1">(Organizer)</span>}
                        </td>
                        <td className="px-3 py-2">{member.nationality || 'Sri Lanka'}</td>
                        <td className="px-3 py-2">{
                          member.languages && member.languages.length > 0 
                            ? member.languages.join(', ') 
                            : 'English'
                        }</td>
                        <td className="px-3 py-2">{member.age || '25'}</td>
                      </tr>
                    );
                  })}
                  {/* Show placeholder rows if no members */}
                  {(!pool?.members || pool.members.length === 0) && (
                    <tr>
                      <td colSpan="5" className="px-3 py-6 text-center text-gray-500">
                        No participants yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Itinerary + Map (sticky/fixed) */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 py-8">
        <div className="flex gap-8 w-full">
          {/* Left: Itinerary, scrollable - 50% width */}
          <div className="w-1/2 min-w-0 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Pool Itinerary</h2>
            <button
              onClick={handleBack}
              className="text-primary-600 hover:text-primary-700 font-medium px-5 py-1 rounded-full border border-primary-100"
            >
              ← Back to Pools
            </button>
          </div>
          
          {/* Day Timeline */}
          <div className="space-y-0">
            {days.map((day, dayIndex) => {
              const dayItinerary = pool.itinerary?.[dayIndex] || { 
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
                      <div className="flex flex-col items-start">
                        <span>Day {dayIndex + 1} - {formatDate(day)}</span>
                        {dayItinerary.city && (
                          <span className="text-sm font-normal text-gray-600">{dayItinerary.city}</span>
                        )}
                      </div>
                      <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {hasItems && (
                      <span className="ml-3 text-sm text-gray-500">
                        ({Object.entries(dayItinerary).reduce((total, [key, items]) => 
                          key !== 'city' && key !== 'userSelected' && key !== 'attractionsCount' && key !== 'hotelsCount' && key !== 'restaurantsCount' 
                            ? total + (Array.isArray(items) ? items.length : 0) 
                            : total, 0)} items)
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
                            .filter(([category]) => ['activities', 'places', 'food', 'transportation'].includes(category))
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
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                                            {item.userSelected && (
                                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                Selected
                                              </span>
                                            )}
                                          </div>
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
                                              <span className="flex items-center">
                                                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                                <span>{item.rating}</span>
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
          {/* Pool Summary moved below both columns */}
        </div>
          {/* Right: Map, sticky/fixed on viewport - exactly 50% width */}
          <div className="hidden lg:flex w-1/2 min-w-0">
            <div className="bg-white rounded-xl w-full h-[calc(100vh-160px)] sticky top-20 shadow-lg border border-gray-200 overflow-hidden flex flex-col">
              {isLoaded ? (
                <div className="flex-1 flex flex-col h-full">
                  <div className="p-4 border-b border-gray-100 shrink-0">
                    <h2 className="font-bold text-lg">Pool Map</h2>
                    <p className="text-sm text-gray-500">Explore pool destinations</p>
                  </div>
                  <div className="flex-1 relative overflow-hidden">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapCenter}
                      zoom={12}
                      onLoad={handleMapLoad}
                      options={{
                        fullscreenControl: true,
                        streetViewControl: false,
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
                      <MapInfoWindow 
                        selectedMarker={selectedMarker}
                        onClose={handleInfoWindowClose}
                      />
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
      {/* Footer at the very bottom */}
      <Footer />
      
      {/* Login Required Popup */}
      <LoginRequiredPopup 
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </div>
  );
};

export default ViewPoolPage;

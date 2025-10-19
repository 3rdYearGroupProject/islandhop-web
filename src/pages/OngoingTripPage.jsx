import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmStartModal from '../components/ConfirmStartModal';
import ConfirmEndModal from '../components/ConfirmEndModal';
import TripCompletionModal from '../components/TripCompletionModal';
import TripBanner from '../components/trip/TripBanner';
import { getUserData } from '../utils/userStorage';
import TripStatusCard from '../components/trip/TripStatusCard';
import TripItinerary from '../components/trip/TripItinerary';
import TripMapView from '../components/trip/TripMapView';
import TripChat from '../components/trip/TripChat';
import { shouldShowChat } from '../utils/chatService';
import { useToast } from '../components/ToastProvider';

// API functions for trip confirmation
const confirmDayStart = async (tripId, day) => {
  try {
    const response = await axios.post(`http://localhost:5007/api/trips/confirm-day-${day}-start`, {
      tripId: tripId
    });
    return response.data;
  } catch (error) {
    console.error(`Error confirming day ${day} start:`, error);
    throw error;
  }
};

const confirmDayEnd = async (tripId, day) => {
  try {
    const response = await axios.post(`http://localhost:5007/api/trips/confirm-day-${day}-end`, {
      tripId: tripId
    });
    return response.data;
  } catch (error) {
    console.error(`Error confirming day ${day} end:`, error);
    throw error;
  }
};

// Mock daily plans in the format expected by the collapsible itinerary
const mockDailyPlans = [
  {
    day: 1,
    city: 'Kandy',
    attractions: [
      {
        id: 1,
        name: 'Temple of the Tooth',
        location: { lat: 7.2936, lng: 80.6411 },
        rating: 4.7,
        description: 'Visit the famous Kandy Temple',
        time: '14:00',
        image: '/src/assets/destinations/kandy-temple.jpg'
      },
      {
        id: 2,
        name: 'Kandy Lake',
        location: { lat: 7.2906, lng: 80.6337 },
        rating: 4.2,
        description: 'Relaxing walk around the lake',
        time: '17:00',
        image: '/src/assets/destinations/kandy-lake.jpg'
      }
    ],
    restaurants: [
      {
        id: 1,
        name: 'Cafe Aroma',
        location: { lat: 7.2955, lng: 80.6357 },
        rating: 4.6,
        description: 'Authentic local food',
        time: '19:00'
      },
      {
        id: 2,
        name: 'Royal Bar & Hotel',
        location: { lat: 7.2944, lng: 80.6378 },
        rating: 4.1,
        description: 'Historic bar for drinks',
        time: '21:00'
      }
    ],
    hotels: [
      {
        id: 1,
        name: 'Kandy City Hotel',
        location: { lat: 7.2965, lng: 80.6345 },
        rating: 4.3,
        description: 'Central hotel in Kandy'
      }
    ]
  },
  {
    day: 2,
    city: 'Nuwara Eliya',
    attractions: [
      {
        id: 3,
        name: 'Tea Plantations Tour',
        location: { lat: 6.9497, lng: 80.7891 },
        rating: 4.8,
        description: 'Explore tea plantations',
        time: '10:00',
        image: '/src/assets/destinations/tea-plantation.jpg'
      },
      {
        id: 4,
        name: 'Gregory Lake',
        location: { lat: 6.9514, lng: 80.7844 },
        rating: 4.6,
        description: 'Boat ride and lakeside picnic',
        time: '15:00',
        image: '/src/assets/destinations/gregory-lake.jpg'
      }
    ],
    restaurants: [
      {
        id: 3,
        name: 'Tea Lounge',
        location: { lat: 6.9488, lng: 80.7903 },
        rating: 4.2,
        description: 'Tea and snacks',
        time: '13:00'
      },
      {
        id: 4,
        name: 'Salmiya Italian Restaurant',
        location: { lat: 6.9502, lng: 80.7865 },
        rating: 4.4,
        description: 'Popular for pizza and pasta',
        time: '19:00'
      }
    ],
    hotels: [
      {
        id: 2,
        name: 'Grand Hotel',
        location: { lat: 6.9485, lng: 80.7888 },
        rating: 4.7,
        description: 'Historic hotel with gardens'
      }
    ]
  },
  {
    day: 3,
    city: 'Horton Plains',
    attractions: [
      {
        id: 5,
        name: 'World\'s End',
        location: { lat: 6.8081, lng: 80.8056 },
        rating: 4.9,
        description: 'Hike to World\'s End and Baker\'s Falls',
        time: '06:00',
        image: '/src/assets/destinations/worlds-end.jpg'
      },
      {
        id: 6,
        name: 'Strawberry Farm',
        location: { lat: 6.9520, lng: 80.7832 },
        rating: 4.3,
        description: 'Pick and taste fresh strawberries',
        time: '15:00',
        image: '/src/assets/destinations/strawberry-farm.jpg'
      }
    ],
    restaurants: [
      {
        id: 5,
        name: 'Grand Indian',
        location: { lat: 6.9495, lng: 80.7870 },
        rating: 4.5,
        description: 'Famous for curries',
        time: '18:00'
      }
    ],
    hotels: [
      {
        id: 3,
        name: 'Jetwing St. Andrew\'s',
        location: { lat: 6.9490, lng: 80.7885 },
        rating: 4.5,
        description: 'Colonial-style hotel'
      }
    ]
  },
  {
    day: 4,
    city: 'Nuwara Eliya',
    attractions: [
      {
        id: 7,
        name: 'Pedro Tea Estate',
        location: { lat: 6.9510, lng: 80.7920 },
        rating: 4.6,
        description: 'Learn about tea production',
        time: '09:00',
        image: '/src/assets/destinations/tea-factory.jpg'
      }
    ],
    restaurants: [
      {
        id: 6,
        name: 'The Pub',
        location: { lat: 6.9488, lng: 80.7895 },
        rating: 4.0,
        description: 'Casual pub for dinner',
        time: '20:00'
      }
    ],
    hotels: [
      {
        id: 4,
        name: 'Araliya Green Hills',
        location: { lat: 6.9475, lng: 80.7910 },
        rating: 4.4,
        description: 'Modern hotel with mountain views'
      }
    ]
  }
];

// Mock data for other travelers at destinations
const mockTravelersData = {
  'Kandy Temple': [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://via.placeholder.com/40/FF6B6B/FFFFFF?text=SJ',
      arrivalTime: '2:30 PM',
      groupSize: 2,
      tripType: 'Cultural Tour',
      isPublic: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar: 'https://via.placeholder.com/40/4ECDC4/FFFFFF?text=MC',
      arrivalTime: '3:15 PM',
      groupSize: 1,
      tripType: 'Solo Adventure',
      isPublic: true
    },
    {
      id: 3,
      name: 'Emma & David',
      avatar: 'https://via.placeholder.com/40/45B7D1/FFFFFF?text=ED',
      arrivalTime: '4:00 PM',
      groupSize: 2,
      tripType: 'Honeymoon',
      isPublic: true
    }
  ],
  'Nuwara Eliya': [
    {
      id: 4,
      name: 'Alex Rivera',
      avatar: 'https://via.placeholder.com/40/96CEB4/FFFFFF?text=AR',
      arrivalTime: '11:00 AM',
      groupSize: 3,
      tripType: 'Family Trip',
      isPublic: true
    },
    {
      id: 5,
      name: 'Lisa Park',
      avatar: 'https://via.placeholder.com/40/FFEAA7/000000?text=LP',
      arrivalTime: '1:30 PM',
      groupSize: 1,
      tripType: 'Photography Tour',
      isPublic: true
    }
  ]
};

// Travelers Modal Component
const TravelersModal = ({ isOpen, onClose, destination, isPublic, setIsPublic, tripId, locationData, toast }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [realTravelers, setRealTravelers] = useState([]);
  const [isLoadingTravelers, setIsLoadingTravelers] = useState(false);

  // Check if location is already shared when modal opens
  useEffect(() => {
    const checkLocationStatus = async () => {
      if (!isOpen || !tripId) return;

      try {
        setIsCheckingStatus(true);
        
        // Get user data from encrypted storage
        const userData = getUserData();
        if (!userData || !userData.uid) return;

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Check if location is already shared
        const response = await axios.get('http://localhost:5008/api/v1/check-location-shared', {
          params: {
            tripId: tripId,
            userId: userData.uid,
            date: today
          }
        });

        console.log('📍 Location status check:', response.data);

        // Update isPublic state based on API response
        if (response.data && response.data.shared) {
          setIsPublic(true);
        }
      } catch (error) {
        console.error('❌ Error checking location status:', error);
        // Don't show error to user, just default to not shared
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkLocationStatus();
  }, [isOpen, tripId, setIsPublic]);

  // Fetch users at the same location when isPublic becomes true
  useEffect(() => {
    const fetchUsersAtLocation = async () => {
      if (!isPublic || !locationData || !locationData.lat || !locationData.lng) return;

      try {
        setIsLoadingTravelers(true);
        
        console.log('👥 Fetching users at location:', locationData);

        const response = await axios.get('http://localhost:5008/api/v1/users-at-location', {
          params: {
            latitude: locationData.lat,
            longitude: locationData.lng
          }
        });

        console.log('✅ Users at location response:', response.data);

        // Extract users array from response
        const usersArray = response.data.users || response.data || [];
        console.log('✅ Extracted users array:', usersArray);

        // Filter out current user
        const userData = getUserData();
        const currentUserId = userData?.uid;
        const otherUsers = usersArray.filter(user => user.userId !== currentUserId);
        
        console.log('✅ Other travelers (excluding current user):', otherUsers);
        setRealTravelers(otherUsers);
      } catch (error) {
        console.error('❌ Error fetching users at location:', error);
        setRealTravelers([]);
      } finally {
        setIsLoadingTravelers(false);
      }
    };

    fetchUsersAtLocation();
  }, [isPublic, locationData]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Function to share location with the API
  const handleShareLocation = async () => {
    try {
      setIsSharing(true);
      setShareError(null);

      // Get user data from encrypted storage
      const userData = getUserData();
      
      if (!userData || !userData.uid || !userData.email) {
        throw new Error('User not logged in. Please log in to share your location.');
      }

      if (!locationData || !locationData.lat || !locationData.lng) {
        throw new Error('Location data not available.');
      }

      if (!tripId) {
        throw new Error('Trip ID not found.');
      }

      // Prepare the payload
      const payload = {
        tripId: tripId,
        userId: userData.uid,
        latitude: locationData.lat,
        longitude: locationData.lng,
        email: userData.email
      };

      console.log('📍 Sharing location:', payload);

      // Call the share location API
      const response = await axios.post('http://localhost:5008/api/v1/share-location', payload);

      console.log('✅ Location shared successfully:', response.data);

      // Update the public state
      setIsPublic(true);
    } catch (error) {
      console.error('❌ Error sharing location:', error);
      setShareError(error.response?.data?.message || error.message || 'Failed to share location');
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  const travelers = mockTravelersData[destination] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Who's Going to {destination}?</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[calc(90vh-120px)] overflow-y-auto">
          {isCheckingStatus ? (
            /* Loading state while checking if location is shared */
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Checking your status...</p>
            </div>
          ) : !isPublic ? (
            /* Initial state - Make arrival public */
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect with Fellow Travelers</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Make your arrival time public to see other travelers visiting {destination} and potentially meet up!
                </p>
              </div>
              
              {shareError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{shareError}</p>
                </div>
              )}
              
              <button
                onClick={handleShareLocation}
                disabled={isSharing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
              >
                {isSharing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sharing Location...</span>
                  </>
                ) : (
                  'Make My Arrival Public'
                )}
              </button>
              <p className="text-xs text-gray-500 mt-3">
                You can change this anytime in your privacy settings
              </p>
            </div>
          ) : (
            /* Show other travelers */
            <div>
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-800">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Your arrival is now public!</span>
                </div>
              </div>

              {isLoadingTravelers ? (
                /* Loading travelers */
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-600 text-sm">Finding other travelers...</p>
                </div>
              ) : realTravelers.length > 0 ? (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Other travelers at {destination} today ({realTravelers.length})
                  </h4>
                  <div className="space-y-3">
                    {realTravelers.map((traveler, index) => {
                      const fullName = `${traveler.firstName || ''} ${traveler.lastName || ''}`.trim() || 'Anonymous Traveler';
                      const arrivalTime = traveler.timestamp ? new Date(traveler.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Unknown';
                      const profilePic = traveler.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`;
                      
                      return (
                        <div key={traveler.userId || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <img
                              src={profilePic}
                              alt={fullName}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`;
                              }}
                            />
                            <div>
                              <p className="font-medium text-gray-900">{fullName}</p>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>Shared at {arrivalTime}</span>
                                {traveler.nationality && (
                                  <>
                                    <span>•</span>
                                    <span>{traveler.nationality}</span>
                                  </>
                                )}
                              </div>
                              {traveler.languages && traveler.languages.length > 0 && (
                                <p className="text-xs text-blue-600">
                                  Speaks: {Array.isArray(traveler.languages) ? traveler.languages.join(', ') : traveler.languages}
                                </p>
                              )}
                              {traveler.profileCompletion && (
                                <div className="flex items-center gap-1 mt-1">
                                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-green-500 rounded-full" 
                                      style={{ width: `${traveler.profileCompletion}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500">{traveler.profileCompletion}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              // TODO: Implement connect/chat functionality
                              console.log('Connect with:', traveler);
                              toast.info(`Connect feature coming soon! User: ${fullName}`, { duration: 2000 });
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                          >
                            Connect
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No other travelers at this location today.</p>
                  <p className="text-sm text-gray-500 mt-1">You're the first one here! Others might join soon.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OngoingTripPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Get initial trip data from navigation state (passed from MyTripsPage)
  const initialTripData = location.state?.tripData;
  
  // State for real-time trip data
  const [tripData, setTripData] = useState(initialTripData);
  const [isLoadingTripData, setIsLoadingTripData] = useState(false);
  const [tripDataError, setTripDataError] = useState(null);
  const [isWaitingForAssignments, setIsWaitingForAssignments] = useState(false);

  // Extract trip ID for API calls
  const getTripId = (data) => {
    return data?._id || data?.tripId || data?.id || data?.mongodb_id || data?.objectId;
  };

  // Calculate total distance from meter readings
  const calculateTotalTripDistance = () => {
    if (!tripData?.dailyPlans) return 0;
    
    let totalDistance = 0;
    tripData.dailyPlans.forEach(plan => {
      if (plan.start_meter_read && plan.end_meter_read) {
        const dayDistance = plan.end_meter_read - plan.start_meter_read - (plan.deduct_amount || 0);
        totalDistance += Math.max(0, dayDistance); // Ensure no negative distances
      }
    });
    
    return totalDistance;
  };

  // Fetch updated trip data from API
  const fetchTripData = async (tripId) => {
    if (!tripId) return;
    
    try {
      setIsLoadingTripData(true);
      setTripDataError(null);
      
      const response = await fetch(`http://localhost:5007/api/trips/trip/${tripId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch trip data: ${response.status} ${response.statusText}`);
      }
      
      const apiResponse = await response.json();
      console.log('API Response:', apiResponse);
      
      // Check if trip was not found (waiting for driver/guide assignment)
      if (apiResponse.success === false && apiResponse.message === "Trip not found") {
        console.log('Trip not found - waiting for driver/guide assignment');
        setIsWaitingForAssignments(true);
        setTripData(null);
        return;
      }
      
      // Extract the actual trip data from the response
      const updatedTripData = apiResponse.data || apiResponse;
      console.log('Extracted trip data:', updatedTripData);
      
      // Check if driver or guide are needed but not assigned
      const needsDriver = updatedTripData.driverNeeded === 1 || updatedTripData.driverNeeded === true;
      const needsGuide = updatedTripData.guideNeeded === 1 || updatedTripData.guideNeeded === true;
      const hasDriver = updatedTripData.driver_email && updatedTripData.driver_email.trim() !== '';
      const hasGuide = updatedTripData.guide_email && updatedTripData.guide_email.trim() !== '';
      
      // If driver/guide needed but not assigned, show waiting screen
      if ((needsDriver && !hasDriver) || (needsGuide && !hasGuide)) {
        console.log('Waiting for assignments:', {
          needsDriver,
          hasDriver,
          needsGuide,
          hasGuide
        });
        setIsWaitingForAssignments(true);
        setTripData(updatedTripData); // Keep trip data for display purposes
      } else {
        setIsWaitingForAssignments(false);
        setTripData(updatedTripData);
      }
    } catch (error) {
      console.error('Error fetching trip data:', error);
      setTripDataError(error.message);
    } finally {
      setIsLoadingTripData(false);
    }
  };

  // If no initial trip data provided, redirect back to trips page
  useEffect(() => {
    if (!initialTripData) {
      navigate('/trips');
    }
  }, [initialTripData, navigate]);

  // Fetch updated trip data on component mount and when trip ID changes
  useEffect(() => {
    const tripId = getTripId(tripData);
    if (tripId) {
      fetchTripData(tripId);
    }
  }, [getTripId(initialTripData)]); // Only fetch once on mount

  // Refresh trip data function (can be called by child components)
  const refreshTripData = () => {
    const tripId = getTripId(tripData);
    if (tripId) {
      fetchTripData(tripId);
    }
  };
  
  // If no initial trip data provided, redirect back to trips page
  useEffect(() => {
    if (!initialTripData) {
      navigate('/trips');
    }
  }, [initialTripData, navigate]);

  // Fetch updated trip data on component mount and when trip ID changes
  useEffect(() => {
    const tripId = getTripId(tripData);
    if (tripId) {
      fetchTripData(tripId);
    }
  }, [getTripId(initialTripData)]); // Only fetch once on mount

  // If trip data is not available, show loading or return null
  if (!tripData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg mb-2">Loading trip details...</div>
        {isLoadingTripData && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        )}
        {tripDataError && (
          <div className="text-red-600 text-sm mt-2">Error: {tripDataError}</div>
        )}
      </div>
    </div>;
  }

  // Determine if chat should be shown based on trip data
  const showChat = shouldShowChat(tripData);
  console.log('OngoingTripPage - Trip data:', tripData);
  console.log('OngoingTripPage - Show chat:', showChat);

  // Extract trip information from the real data
  const {
    tripId: backendTripId,
    _id: mongoId,
    id: generalId,
    tripName = 'Untitled Trip',
    baseCity: destination = 'Unknown Destination',
    startDate,
    endDate,
    driverNeeded = 0,
    guideNeeded = 0,
    userId,
    dailyPlans = [],
    travelers = 1,
    _originalData
  } = tripData || {};

  console.log('Extracted data:', {
    tripName,
    destination,
    dailyPlansCount: dailyPlans.length,
    driverNeeded,
    guideNeeded,
    tripData
  });

  // Detect if we're in offline mode or showing mock data
  const isMockData = generalId === 2 || 
                     tripName === 'Cultural Heritage Tour' ||
                     (dailyPlans.length === 0 && destination === 'Central Province');
  
  // Use mockDailyPlans when we detect offline/mock scenario
  const effectiveDailyPlans = isMockData ? mockDailyPlans : dailyPlans;

  // Determine the correct trip ID for chat functionality
  let actualTripId = (_originalData && _originalData.tripId) || 
                     backendTripId || 
                     tripData.tripId ||
                     mongoId || 
                     generalId ||
                     tripData._id ||
                     tripData.id ||
                     tripData.mongodb_id || 
                     tripData.objectId ||
                     tripData.uuid ||
                     tripData.trip_id;

  // TEMPORARY FIX: If we still don't have a trip ID, but we know the mapping based on tripName
  if (!actualTripId && tripData.tripName) {
    const tempTripMapping = {
      'tt2-trip1': 'f5b9ac55-788d-43df-be16-4bdbce426346',
      'tt2-trip2': '0d989cc5-de6b-429a-8790-13fb3ed1a5a7', 
      'tt2-trip3': '06ed669b-296a-4a2e-9ab4-21f5f8260f25'
    };
    
    actualTripId = tempTripMapping[tripData.tripName];
  }

  // Format dates
  const formatTripDates = () => {
    if (!startDate || !endDate) return 'Dates not available';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    const startFormatted = formatDate(start);
    const endFormatted = formatDate(end);
    const year = start.getFullYear();
    
    return `${startFormatted} → ${endFormatted}, ${year}`;
  };

  // Calculate days left
  const calculateDaysLeft = () => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const formattedDates = formatTripDates();
  const daysLeft = calculateDaysLeft();
  
  // Expand all days by default
  const [expandedDays, setExpandedDays] = useState(() => {
    const expanded = {};
    effectiveDailyPlans.forEach((_, index) => {
      expanded[index] = true;
    });
    return expanded;
  });
  
  const [itineraryCollapsed, setItineraryCollapsed] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [dayStarted, setDayStarted] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [startModalData, setStartModalData] = useState(null);
  const [startMeterReading, setStartMeterReading] = useState(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [endModalData, setEndModalData] = useState(null);
  const [dayEnded, setDayEnded] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [showTripCompletionModal, setShowTripCompletionModal] = useState(false);
  const [endMeterReadings, setEndMeterReadings] = useState([]);
  
  // Create map center from first attraction if available
  const getMapCenter = () => {
    if (effectiveDailyPlans.length > 0 && effectiveDailyPlans[0].attractions && effectiveDailyPlans[0].attractions.length > 0) {
      return effectiveDailyPlans[0].attractions[0].location;
    }
    return { lat: 7.2906, lng: 80.6337 }; // Default to Kandy, Sri Lanka
  };
  
  const [mapCenter, setMapCenter] = useState(getMapCenter());
  
  // Modal states for "See who else is coming"
  const [showTravelersModal, setShowTravelersModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedLocationData, setSelectedLocationData] = useState(null);
  const [isPublic, setIsPublic] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="relative z-10">
        <Navbar />
        {/* Trip data refresh indicator */}
        {isLoadingTripData && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-700 font-medium">Updating trip data...</span>
            </div>
          </div>
        )}
        {tripDataError && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <span className="text-sm text-red-700">Error updating trip data: {tripDataError}</span>
              <button 
                onClick={refreshTripData}
                className="text-sm text-red-700 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Waiting for Driver/Guide Assignment Screen */}
      {isWaitingForAssignments && (
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-2xl w-full text-center">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl p-8 md:p-12">
              {/* Animated Icon */}
              <div className="mb-8">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 w-24 h-24 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                </div>
              </div>
              
              {/* Main Message */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Preparing Your Trip
              </h2>
              
              <p className="text-lg text-gray-700 mb-6">
                We're currently assigning the best professionals for your journey
              </p>
              
              {/* Status Details */}
              <div className="bg-white rounded-xl p-6 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-4">What's happening:</h3>
                <div className="space-y-3">
                  {tripData?.driverNeeded === 1 && !tripData?.driver_email && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-700">Finding an experienced driver for you...</span>
                    </div>
                  )}
                  {tripData?.guideNeeded === 1 && !tripData?.guide_email && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-700">Matching you with a knowledgeable guide...</span>
                    </div>
                  )}
                  {tripData?.driver_email && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">✓ Driver assigned</span>
                    </div>
                  )}
                  {tripData?.guide_email && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">✓ Guide assigned</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Trip Details */}
              {tripData && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">Your Trip</p>
                  <p className="font-semibold text-gray-900 text-lg">{tripData.tripName}</p>
                  <p className="text-sm text-gray-600 mt-2">{tripData.baseCity}</p>
                </div>
              )}
              
              {/* Refresh Button */}
              <button
                onClick={refreshTripData}
                disabled={isLoadingTripData}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingTripData ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Checking Status...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Status
                  </>
                )}
              </button>
              
              {/* Help Text */}
              <p className="text-sm text-gray-600 mt-6">
                This usually takes just a few moments. We'll notify you once everything is ready!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Trip Content - Only show when not waiting */}
      {!isWaitingForAssignments && (
        <>
          <TripBanner 
            tripData={tripData}
            formattedDates={formattedDates}
        daysLeft={daysLeft}
      />

      {/* Trip Actions Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Last Updated: {tripData?.updatedAt ? new Date(tripData.updatedAt.$date || tripData.updatedAt).toLocaleString() : 'Unknown'}
            </span>
          </div>
          <button
            onClick={refreshTripData}
            disabled={isLoadingTripData}
            className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
              isLoadingTripData 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isLoadingTripData ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Main Content: Itinerary + Map */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Left: Itinerary and Status */}
          <div className="w-full md:w-1/2 min-w-0 flex flex-col">
            <TripStatusCard
              tripName={tripName}
              currentDayIndex={currentDayIndex}
              dailyPlansLength={effectiveDailyPlans.length}
              daysLeft={daysLeft}
              dayStarted={dayStarted}
              dayEnded={dayEnded}
              startMeterReading={startMeterReading}
              setShowStartModal={(show, data) => {
                setShowStartModal(show);
                if (data) {
                  // Store the modal data containing meter reading
                  setStartModalData(data);
                  console.log('Start modal data:', data);
                }
              }}
              setShowEndModal={(show, data) => {
                setShowEndModal(show);
                if (data) {
                  // Store the modal data containing meter reading
                  setEndModalData(data);
                  console.log('End modal data:', data);
                }
              }}
              setShowTripCompletionModal={setShowTripCompletionModal}
              tripData={tripData}
              refreshTripData={refreshTripData}
              onNextDay={() => {
                setCurrentDayIndex(prev => prev + 1);
                setDayStarted(false);
                setDayEnded(false);
                refreshTripData(); // Refresh data when moving to next day
              }}
            />

            <TripItinerary
              dailyPlans={effectiveDailyPlans}
              itineraryCollapsed={itineraryCollapsed}
              setItineraryCollapsed={setItineraryCollapsed}
              expandedDays={expandedDays}
              setExpandedDays={setExpandedDays}
              setSelectedMarker={setSelectedMarker}
              setShowTravelersModal={setShowTravelersModal}
              setSelectedDestination={setSelectedDestination}
            />

            {/* Chat Section */}
            {(driverNeeded === 1 || guideNeeded === 1) && (
              <div className="mt-8">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                  <h3 className="text-lg font-semibold text-primary-700 mb-2">Chat with Driver &amp; Guide</h3>
                  {actualTripId ? (
                    <TripChat 
                      tripId={actualTripId} 
                      tripData={tripData}
                    />
                  ) : (
                    <div className="border rounded-lg bg-yellow-50 h-32 mb-4 p-4 flex items-center justify-center">
                      <div className="text-center text-yellow-600">
                        <p className="mb-2">Chat Unavailable</p>
                        <p className="text-sm">Valid trip ID required for chat functionality</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Right: Map */}
          <TripMapView
            dailyPlans={effectiveDailyPlans}
            mapCenter={mapCenter}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            setShowTravelersModal={setShowTravelersModal}
            setSelectedDestination={setSelectedDestination}
            setSelectedLocationData={setSelectedLocationData}
          />
        </div>
      </div>
      
      {/* Modals */}
      <TravelersModal
        isOpen={showTravelersModal}
        onClose={() => {
          setShowTravelersModal(false);
          // Reset isPublic state when modal closes so it checks fresh next time
          setIsPublic(false);
        }}
        destination={selectedDestination}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
        tripId={actualTripId}
        locationData={selectedLocationData}
        toast={toast}
      />
      
      <ConfirmStartModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        driverMeterReading={startModalData?.meterReading?.toString() || "0"}
        onConfirm={async (meterReading) => {
          try {
            // Get the trip ID and day number
            const tripId = getTripId(tripData);
            const dayNumber = startModalData?.day || 1;
            
            if (!tripId) {
              throw new Error('Trip ID not found');
            }
            
            // Call the API to confirm day start
            await confirmDayStart(tripId, dayNumber);
            
            // Update local state
            setStartMeterReading(meterReading);
            setDayStarted(true);
            setShowStartModal(false);
            
            // Refresh trip data after start confirmation
            refreshTripData();
            
            console.log(`Day ${dayNumber} start confirmed successfully`);
            toast.success(`Day ${dayNumber} started successfully!`, { duration: 2000 });
          } catch (error) {
            console.error('Failed to confirm day start:', error);
            toast.error('Failed to confirm day start. Please try again.');
          }
        }}
      />

      <ConfirmEndModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        driverMeterReading={endModalData?.endMeterReading?.toString() || "0"}
        startMeterReading={endModalData?.startMeterReading?.toString() || startMeterReading}
        deductAmount={endModalData?.deductAmount || 0}
        additionalNote={endModalData?.additionalNote || ""}
        onConfirm={async (endMeterReading) => {
          try {
            // Get the trip ID and day number
            const tripId = getTripId(tripData);
            const dayNumber = endModalData?.day || 1;
            
            if (!tripId) {
              throw new Error('Trip ID not found');
            }
            
            // Call the API to confirm day end
            await confirmDayEnd(tripId, dayNumber);
            
            // Update local state
            setEndMeterReadings([...endMeterReadings, endMeterReading]);
            setDayEnded(true);
            setShowEndModal(false);
            
            // Refresh trip data after end confirmation
            refreshTripData();
            
            console.log(`Day ${dayNumber} end confirmed successfully`);
            toast.success(`Day ${dayNumber} completed successfully!`, { duration: 2000 });
          } catch (error) {
            console.error('Failed to confirm day end:', error);
            toast.error('Failed to confirm day end. Please try again.');
          }
        }}
      />

      <TripCompletionModal
        isOpen={showTripCompletionModal}
        onClose={() => setShowTripCompletionModal(false)}
        tripData={tripData}
        totalDistance={calculateTotalTripDistance()}
        totalDays={effectiveDailyPlans.length}
      />
      
      <Footer />
        </>
      )}
    </div>
  );
};

export default OngoingTripPage;

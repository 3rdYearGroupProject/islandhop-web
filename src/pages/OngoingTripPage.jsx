import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmStartModal from '../components/ConfirmStartModal';
import ConfirmEndModal from '../components/ConfirmEndModal';
import TripCompletionModal from '../components/TripCompletionModal';
import TripBanner from '../components/trip/TripBanner';
import TripStatusCard from '../components/trip/TripStatusCard';
import TripItinerary from '../components/trip/TripItinerary';
import TripMapView from '../components/trip/TripMapView';
import TripChat from '../components/trip/TripChat';
import { shouldShowChat } from '../utils/chatService';

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
const TravelersModal = ({ isOpen, onClose, destination, isPublic, setIsPublic }) => {
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
          {!isPublic ? (
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
              <button
                onClick={() => setIsPublic(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Make My Arrival Public
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

              {travelers.length > 0 ? (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Other travelers visiting today ({travelers.length})
                  </h4>
                  <div className="space-y-3">
                    {travelers.map((traveler) => (
                      <div key={traveler.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <img
                            src={traveler.avatar}
                            alt={traveler.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{traveler.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>Arriving at {traveler.arrivalTime}</span>
                              <span>•</span>
                              <span>{traveler.groupSize} {traveler.groupSize === 1 ? 'person' : 'people'}</span>
                            </div>
                            <p className="text-xs text-blue-600">{traveler.tripType}</p>
                          </div>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No other public travelers at this destination today.</p>
                  <p className="text-sm text-gray-500 mt-1">Check back later or explore other destinations!</p>
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
  
  // Get initial trip data from navigation state (passed from MyTripsPage)
  const initialTripData = location.state?.tripData;
  
  // State for real-time trip data
  const [tripData, setTripData] = useState(initialTripData);
  const [isLoadingTripData, setIsLoadingTripData] = useState(false);
  const [tripDataError, setTripDataError] = useState(null);

  // Extract trip ID for API calls
  const getTripId = (data) => {
    return data?._id || data?.tripId || data?.id || data?.mongodb_id || data?.objectId;
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
      
      // Extract the actual trip data from the response
      const updatedTripData = apiResponse.data || apiResponse;
      console.log('Extracted trip data:', updatedTripData);
      
      setTripData(updatedTripData);
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
  const [startMeterReading, setStartMeterReading] = useState(null);
  const [showEndModal, setShowEndModal] = useState(false);
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
              Trip ID: <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{actualTripId}</span>
            </span>
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
                  // Store additional data if needed
                  console.log('Start modal data:', data);
                }
              }}
              setShowEndModal={(show, data) => {
                setShowEndModal(show);
                if (data) {
                  // Store additional data if needed
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
          />
        </div>
      </div>
      
      {/* Modals */}
      <TravelersModal
        isOpen={showTravelersModal}
        onClose={() => setShowTravelersModal(false)}
        destination={selectedDestination}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
      />
      
      <ConfirmStartModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        driverMeterReading="45,230"
        onConfirm={(meterReading) => {
          setStartMeterReading(meterReading);
          setDayStarted(true);
          setShowStartModal(false);
          // Refresh trip data after start confirmation
          refreshTripData();
        }}
      />

      <ConfirmEndModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        driverMeterReading="45,387"
        startMeterReading={startMeterReading}
        onConfirm={(endMeterReading) => {
          setEndMeterReadings([...endMeterReadings, endMeterReading]);
          setDayEnded(true);
          setShowEndModal(false);
          // Refresh trip data after end confirmation
          refreshTripData();
        }}
      />

      <TripCompletionModal
        isOpen={showTripCompletionModal}
        onClose={() => setShowTripCompletionModal(false)}
        tripData={tripData}
        totalDistance={157}
        totalDays={effectiveDailyPlans.length}
        startMeterReading="45,230"
        endMeterReading="45,387"
      />
      
      <Footer />
    </div>
  );
};

export default OngoingTripPage;

import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Users, Star, Camera, Bed, Utensils, Car, Calendar, ChevronDown, Clock } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  useChatMessages, 
  useSendMessage, 
  useTypingIndicator, 
  formatMessageTime,
  groupMessagesByDate,
  shouldShowChat 
} from '../utils/chatService';
import { getCityImageUrl } from '../utils/imageUtils';

// Chat Component using our chat service
const ChatComponent = ({ tripId }) => {
  const { messages, loading, error } = useChatMessages(tripId);
  const { sendMessage, sending } = useSendMessage(tripId);
  const { isTyping } = useTypingIndicator(tripId);
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim() && !sending) {
      await sendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const groupedMessages = groupMessagesByDate(messages);

  if (loading) {
    return (
      <div className="border rounded-lg bg-gray-50 h-64 mb-4 p-4 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-lg bg-red-50 h-64 mb-4 p-4 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="mb-2">Error loading chat</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chat Messages Area */}
      <div className="border rounded-lg bg-gray-50 h-64 mb-4 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="mb-2">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([date, dayMessages]) => (
              <div key={date}>
                <div className="text-center text-xs text-gray-400 mb-2">{date}</div>
                {dayMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
                  >
                    <div 
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        message.isCurrentUser 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      {!message.isCurrentUser && (
                        <div className="text-xs font-medium mb-1 text-gray-600">
                          {message.sender}
                        </div>
                      )}
                      <div className="text-sm">{message.text}</div>
                      <div className={`text-xs mt-1 ${
                        message.isCurrentUser ? 'text-blue-200' : 'text-gray-400'
                      }`}>
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Chat Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={sending}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={sending || !messageText.trim()}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </>
  );
};


// Component for displaying ongoing trip banner
const mockItinerary = {
  0: {
    date: new Date('2025-08-15'),
    activities: [
      {
        id: 1,
        name: 'Arrival in Kandy',
        location: 'Kandy',
        duration: '2 hours',
        rating: 4.5,
        description: 'Arrive and check in to hotel',
        price: '$25',
        time: '10:00'
      },
      {
        id: 2,
        name: 'Temple Visit',
        location: 'Kandy Temple',
        duration: '2 hours',
        rating: 4.7,
        description: 'Visit the famous Kandy Temple',
        price: '$10',
        time: '14:00'
      },
      {
        id: 10,
        name: 'Evening Walk by Lake',
        location: 'Kandy Lake',
        duration: '1 hour',
        rating: 4.2,
        description: 'Relaxing walk around the lake',
        price: '$0',
        time: '17:00'
      }
    ],
    places: [
      {
        id: 1,
        name: 'Kandy City Hotel',
        location: 'Kandy',
        price: '$100/night',
        rating: 4.3,
        reviews: 120,
        description: 'Central hotel in Kandy',
        checkIn: '12:00',
        checkOut: '11:00'
      }
    ],
    food: [
      {
        id: 1,
        name: 'Cafe Aroma',
        location: 'Kandy',
        cuisine: 'Sri Lankan',
        rating: 4.6,
        reviews: 200,
        description: 'Authentic local food',
        priceRange: '$10-20',
        time: '19:00'
      },
      {
        id: 11,
        name: 'Royal Bar & Hotel',
        location: 'Kandy',
        cuisine: 'Bar',
        rating: 4.1,
        reviews: 90,
        description: 'Historic bar for drinks',
        priceRange: '$15-30',
        time: '21:00'
      }
    ],
    transportation: [
      {
        id: 1,
        name: 'Airport Transfer',
        type: 'Private Car',
        price: '$30',
        rating: 4.5,
        description: 'Pickup from airport',
        time: '09:00',
        duration: '1 hour'
      }
    ]
  },
  1: {
    date: new Date('2025-08-16'),
    activities: [
      {
        id: 3,
        name: 'Nuwara Eliya Tour',
        location: 'Nuwara Eliya',
        duration: '4 hours',
        rating: 4.8,
        description: 'Explore tea plantations',
        price: '$20',
        time: '10:00'
      },
      {
        id: 12,
        name: 'Gregory Lake Boating',
        location: 'Gregory Lake',
        duration: '2 hours',
        rating: 4.6,
        description: 'Boat ride and lakeside picnic',
        price: '$15',
        time: '15:00'
      }
    ],
    places: [
      {
        id: 2,
        name: 'Grand Hotel',
        location: 'Nuwara Eliya',
        price: '$150/night',
        rating: 4.7,
        reviews: 300,
        description: 'Historic hotel with gardens',
        checkIn: '14:00',
        checkOut: '12:00'
      }
    ],
    food: [
      {
        id: 2,
        name: 'Tea Lounge',
        location: 'Nuwara Eliya',
        cuisine: 'Cafe',
        rating: 4.2,
        reviews: 80,
        description: 'Tea and snacks',
        priceRange: '$5-15',
        time: '13:00'
      },
      {
        id: 13,
        name: 'Salmiya Italian Restaurant',
        location: 'Nuwara Eliya',
        cuisine: 'Italian',
        rating: 4.4,
        reviews: 60,
        description: 'Popular for pizza and pasta',
        priceRange: '$10-25',
        time: '19:00'
      }
    ],
    transportation: [
      {
        id: 2,
        name: 'Kandy to Nuwara Eliya',
        type: 'Train',
        price: '$8',
        rating: 4.9,
        description: 'Scenic train ride',
        time: '08:00',
        duration: '3 hours'
      }
    ]
  },
  2: {
    date: new Date('2025-08-17'),
    activities: [
      {
        id: 4,
        name: 'Horton Plains Hike',
        location: 'Horton Plains',
        duration: '6 hours',
        rating: 4.9,
        description: 'Hike to World’s End and Baker’s Falls',
        price: '$30',
        time: '06:00'
      },
      {
        id: 5,
        name: 'Visit Strawberry Farm',
        location: 'Nuwara Eliya',
        duration: '1 hour',
        rating: 4.3,
        description: 'Pick and taste fresh strawberries',
        price: '$8',
        time: '15:00'
      }
    ],
    places: [
      {
        id: 3,
        name: 'Jetwing St. Andrew’s',
        location: 'Nuwara Eliya',
        price: '$120/night',
        rating: 4.5,
        reviews: 180,
        description: 'Colonial-style hotel',
        checkIn: '14:00',
        checkOut: '12:00'
      }
    ],
    food: [
      {
        id: 3,
        name: 'Grand Indian',
        location: 'Nuwara Eliya',
        cuisine: 'Indian',
        rating: 4.5,
        reviews: 150,
        description: 'Famous for curries',
        priceRange: '$10-20',
        time: '18:00'
      }
    ],
    transportation: [
      {
        id: 3,
        name: 'Private Van',
        type: 'Van',
        price: '$40',
        rating: 4.7,
        description: 'Transport for the day',
        time: '05:30',
        duration: '12 hours'
      }
    ]
  },
  3: {
    date: new Date('2025-08-18'),
    activities: [
      {
        id: 6,
        name: 'Tea Factory Tour',
        location: 'Pedro Tea Estate',
        duration: '2 hours',
        rating: 4.6,
        description: 'Learn about tea production',
        price: '$12',
        time: '09:00'
      }
    ],
    places: [
      {
        id: 4,
        name: 'Araliya Green Hills',
        location: 'Nuwara Eliya',
        price: '$110/night',
        rating: 4.4,
        reviews: 140,
        description: 'Modern hotel with mountain views',
        checkIn: '14:00',
        checkOut: '12:00'
      }
    ],
    food: [
      {
        id: 4,
        name: 'The Pub',
        location: 'Nuwara Eliya',
        cuisine: 'Pub',
        rating: 4.0,
        reviews: 70,
        description: 'Casual pub for dinner',
        priceRange: '$8-18',
        time: '20:00'
      }
    ],
    transportation: [
      {
        id: 4,
        name: 'Tuk Tuk',
        type: 'Tuk Tuk',
        price: '$5',
        rating: 4.2,
        description: 'Short rides in town',
        time: '08:30',
        duration: '1 hour'
      }
    ]
  }
};

const tripProgress = {
  currentDay: 1, // 1-based index for user display, 0-based for code
  totalDays: 2,
};
const mockPlaces = [
  {
    name: 'Kandy Temple',
    type: 'Attraction',
    location: { lat: 7.2936, lng: 80.6411 },
    dayNumber: 1,
    placeType: 'attraction',
    rating: 4.8,
    image: '/src/assets/destinations/kandy-temple.jpg',
    description: 'Sacred Buddhist temple with beautiful architecture and cultural significance.'
  },
  {
    name: 'Nuwara Eliya',
    type: 'City',
    location: { lat: 6.9497, lng: 80.7891 },
    dayNumber: 2,
    placeType: 'attraction',
    rating: 4.7,
    image: '/src/assets/destinations/nuwara-eliya.jpg',
    description: 'Cool hill station known as "Little England" with tea plantations and colonial architecture.'
  },
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
      // Save current body overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to restore scrolling when modal closes
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
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

const OngoingTripBanner = ({ trip }) => (
  <div className="relative">
    <div className="absolute inset-0 w-full h-[340px] bg-gradient-to-r from-primary-600 to-primary-700 pointer-events-none" style={{ zIndex: 0 }}></div>
    <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-8" style={{ zIndex: 1 }}>
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">Ongoing Trip</span>
            <span className="text-white/80 text-sm">{trip.dates}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 text-white drop-shadow">{trip.name}</h1>
          <div className="flex items-center text-white/90 mb-2">
            <MapPin className="h-5 w-5 mr-2 text-blue-200" />
            <span className="text-lg font-medium">{trip.destination}</span>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center text-blue-100">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">{trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}</span>
            </div>
            {trip.daysLeft && (
              <span className="px-3 py-1 bg-orange-100/80 text-orange-900 text-xs rounded-full font-semibold">{trip.daysLeft} days left</span>
            )}
          </div>
          {trip.highlights && trip.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {trip.highlights.slice(0, 3).map((highlight, idx) => (
                <span key={idx} className="inline-block px-2 py-1 bg-white/20 text-blue-100 text-xs rounded-md">{highlight}</span>
              ))}
              {trip.highlights.length > 3 && (
                <span className="inline-block px-2 py-1 bg-white/10 text-white text-xs rounded-md">+{trip.highlights.length - 3} more</span>
              )}
            </div>
          )}
          <div className="flex items-center gap-6 mt-2">
            {trip.rating && (
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                <span className="font-semibold text-lg text-white">{trip.rating}</span>
              </div>
            )}
            {trip.memories > 0 && (
              <div className="flex items-center">
                <Camera className="h-5 w-5 mr-1 text-blue-200" />
                <span className="font-semibold text-lg text-white">{trip.memories} memories</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OngoingTripPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get trip data from navigation state (passed from MyTripsPage)
  const tripData = location.state?.tripData;
  
  // If no trip data provided, redirect back to trips page
  useEffect(() => {
    if (!tripData) {
      navigate('/trips');
    }
  }, [tripData, navigate]);
  
  // If trip data is not available, show loading or return null
  if (!tripData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-lg">Loading trip details...</div>
    </div>;
  }

  // Determine if chat should be shown based on trip data
  const showChat = shouldShowChat(tripData);
  console.log('OngoingTripPage - Trip data:', tripData);
  console.log('OngoingTripPage - Show chat:', showChat);

  // Extract trip information from the real data
  const {
    tripName = 'Untitled Trip',
    baseCity: destination = 'Unknown Destination',
    startDate,
    endDate,
    driverNeeded = 0,
    guideNeeded = 0,
    userId,
    dailyPlans = [],
    travelers = 1
  } = tripData;

  // Format dates
  const formatTripDates = () => {
    if (!startDate || !endDate) return 'Dates not available';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
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
    dailyPlans.forEach((_, index) => { expanded[index] = true; });
    return expanded;
  });
  const [itineraryCollapsed, setItineraryCollapsed] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(null);
  
  // Create map center from first attraction if available
  const getMapCenter = () => {
    if (dailyPlans.length > 0 && dailyPlans[0].attractions && dailyPlans[0].attractions.length > 0) {
      return dailyPlans[0].attractions[0].location;
    }
    return { lat: 7.8731, lng: 80.7718 }; // Default Sri Lanka center
  };
  const [mapCenter, setMapCenter] = useState(getMapCenter());
  
  // Modal states for "See who else is coming"
  const [showTravelersModal, setShowTravelersModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
  });

  // Animation for itinerary collapse/expand
  const itineraryRef = useRef(null);
  const [itineraryMaxHeight, setItineraryMaxHeight] = useState('none');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!itineraryRef.current) return;
    if (!isAnimating) {
      // Set maxHeight to current scrollHeight for smooth expand
      setItineraryMaxHeight(itineraryRef.current.scrollHeight + 'px');
    }
  }, [itineraryCollapsed, isAnimating]);

  // Animate on collapse/expand
  useEffect(() => {
    if (!itineraryRef.current) return;
    setIsAnimating(true);
    if (itineraryCollapsed) {
      // Animate to collapsed height
      setItineraryMaxHeight('140px');
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      // Remove maxHeight restriction so it takes required height
      setItineraryMaxHeight('none');
      setIsAnimating(false);
    }
  }, [itineraryCollapsed]);

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

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="relative z-10">
        <Navbar />
      </div>
      {/* Blue Banner/Header */}
      <div className="relative">
        <div className="absolute inset-0 w-full h-[300px] bg-gradient-to-r from-primary-600 to-primary-700 pointer-events-none" style={{ zIndex: 0 }}></div>
        <div className="relative max-w-7xl mx-auto px-4 pt-40 pb-12" style={{ zIndex: 1 }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">Ongoing Trip</span>
                <span className="text-white/80 text-sm">{formattedDates}</span>
              </div>
              <h1 className="text-4xl font-bold mb-2 text-white drop-shadow">{tripName}</h1>
              <div className="flex items-center text-white/90 mb-2">
                <MapPin className="h-5 w-5 mr-2 text-blue-200" />
                <span className="text-lg font-medium">{destination}</span>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center text-blue-100">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">1 traveler</span>
                </div>
                {daysLeft > 0 && (
                  <span className="px-3 py-1 bg-orange-100/80 text-orange-900 text-xs rounded-full font-semibold">{daysLeft} days left</span>
                )}
              </div>
              {tripData.preferredActivities && tripData.preferredActivities.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {tripData.preferredActivities.slice(0, 3).map((activity, idx) => (
                    <span key={idx} className="inline-block px-2 py-1 bg-white/20 text-blue-100 text-xs rounded-md capitalize">{activity}</span>
                  ))}
                  {tripData.preferredActivities.length > 3 && (
                    <span className="inline-block px-2 py-1 bg-white/10 text-white text-xs rounded-md">+{tripData.preferredActivities.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Itinerary + Map */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Left: Itinerary, vertical timeline style, collapsible */}
          <div className="w-full md:w-1/2 min-w-0 flex flex-col">
            {/* Trip Progress Card */}
            <div className="mb-4">
              <div className="bg-white border border-primary-200 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full">
                  <h3 className="text-lg font-semibold text-primary-700 mb-1">Trip Progress</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-700 mb-2">
                    <span className="font-medium">{tripName}</span>
                    <span className="text-gray-400">|</span>
                    <span>Day <span className="font-bold">{1}</span> of <span className="font-bold">{dailyPlans.length || Math.max(1, daysLeft)}</span></span>
                    <span className="text-gray-400">|</span>
                    <span>{daysLeft} days left</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-1 mb-1">
                    <div
                      className="h-full bg-primary-500 transition-all"
                      style={{ width: `${Math.round((1) / Math.max(1, dailyPlans.length || daysLeft) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Start</span>
                    <span>End</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-semibold">Ongoing</span>
                </div>
              </div>
            </div>

            {/* Today's Details Card */}
            {(() => {
              const todayIdx = 0; // Currently showing first day as today
              const today = dailyPlans[todayIdx];
              if (!today) return null;
              
              // Gather all activities and attractions for today
              const stops = [
                ...(today.attractions?.map(a => ({ ...a, category: 'attractions' })) || []),
                ...(today.restaurants?.map(a => ({ ...a, category: 'restaurants' })) || []),
                ...(today.hotels?.map(a => ({ ...a, category: 'hotels' })) || []),
              ];
              
              const formatDateFromDay = (dayPlan) => {
                const startDate = new Date(tripData.startDate);
                const dayDate = new Date(startDate);
                dayDate.setDate(startDate.getDate() + (dayPlan.day - 1));
                return dayDate;
              };
              
              return (
                <div className="mb-6">
                  <div className="bg-white border border-blue-200 rounded-lg shadow p-4">
                    <h3 className="text-base font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      Today's Plan: <span className="font-medium text-blue-700 ml-1">Day {today.day} - {today.city}</span>
                    </h3>
                    <ol className="space-y-2">
                      {stops.length === 0 && (
                        <li className="text-gray-400 italic">No destinations or stops planned for today.</li>
                      )}
                      {stops.map((stop, idx) => {
                        const getCategoryIcon = (category) => {
                          switch(category) {
                            case 'attractions': return <Camera className="w-5 h-5 text-primary-600" />;
                            case 'hotels': return <Bed className="w-5 h-5 text-green-600" />;
                            case 'restaurants': return <Utensils className="w-5 h-5 text-orange-600" />;
                            default: return <MapPin className="w-5 h-5 text-gray-600" />;
                          }
                        };
                        
                        return (
                          <li key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-100">
                            {getCategoryIcon(stop.category)}
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">{stop.name}</span>
                              {stop.rating && (
                                <div className="flex items-center mt-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="text-sm text-gray-600 ml-1">{stop.rating}</span>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Trip Itinerary</h2>
              <button
                onClick={() => setItineraryCollapsed((prev) => !prev)}
                className="flex items-center text-primary-600 hover:text-primary-700 font-medium px-3 py-1 rounded transition-colors"
                aria-label={itineraryCollapsed ? 'Expand itinerary' : 'Collapse itinerary'}
              >
                {itineraryCollapsed ? 'Expand All' : 'Collapse All'}
                <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${itineraryCollapsed ? '' : 'rotate-180'}`} />
              </button>
            </div>
            {/* Animated collapse/expand for itinerary */}
            <div
              ref={itineraryRef}
              className={`relative transition-all duration-500 overflow-hidden${itineraryCollapsed ? ' opacity-70' : ''}`}
              style={{
                maxHeight: itineraryMaxHeight,
              }}
            >
              {itineraryCollapsed ? (
                <div>
                  {/* Show only the first day and first item as a preview, faded and compact */}
                  {(() => {
                    const dayData = dailyPlans[0];
                    if (!dayData) return <div className="text-gray-500 text-sm">No itinerary data available</div>;
                    
                    const hasItems = (dayData.attractions?.length || 0) > 0 ||
                      (dayData.restaurants?.length || 0) > 0 ||
                      (dayData.hotels?.length || 0) > 0;
                    const allItems = [
                      ...(dayData.attractions?.map(a => ({ ...a, category: 'attractions' })) || []),
                      ...(dayData.restaurants?.map(a => ({ ...a, category: 'restaurants' })) || []),
                      ...(dayData.hotels?.map(a => ({ ...a, category: 'hotels' })) || []),
                    ];
                    const previewItem = allItems[0];
                    const getCategoryIcon = (category) => {
                      switch(category) {
                        case 'attractions': return <Camera className="w-5 h-5 text-primary-600" />;
                        case 'restaurants': return <Utensils className="w-5 h-5 text-orange-600" />;
                        case 'hotels': return <Bed className="w-5 h-5 text-green-600" />;
                        default: return <MapPin className="w-5 h-5 text-gray-600" />;
                      }
                    };
                    const getCategoryColor = (category) => {
                      switch(category) {
                        case 'attractions': return 'bg-primary-50 border-primary-200';
                        case 'restaurants': return 'bg-orange-50 border-orange-200';
                        case 'hotels': return 'bg-green-50 border-green-200';
                        default: return 'bg-gray-50 border-gray-200';
                      }
                    };
                    return (
                      <div key={0} className="border-l-2 border-gray-200 relative opacity-60 pointer-events-none select-none">
                        <div className="flex items-center mb-2 -ml-3">
                          <div className="bg-white border-4 border-primary-600 w-5 h-5 rounded-full"></div>
                          <span className="ml-3 flex items-center text-base font-semibold text-gray-900">Day {dayData.day} - {dayData.city}</span>
                          {hasItems && (
                            <span className="ml-2 text-xs text-gray-500">
                              ({allItems.length} items)
                            </span>
                          )}
                        </div>
                        <div className="ml-6 pb-2">
                          {hasItems && previewItem ? (
                            <div className={`p-2 rounded border ${getCategoryColor(previewItem.category)} flex items-center gap-2`}>
                              {getCategoryIcon(previewItem.category)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-gray-900 truncate text-sm">{previewItem.name}</h4>
                                  {previewItem.time && (
                                    <span className="text-xs text-gray-500 ml-2">{previewItem.time}</span>
                                  )}
                                </div>
                                {previewItem.location && (
                                  <div className="flex items-center text-xs text-gray-600 mt-1">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {typeof previewItem.location === 'string' ? previewItem.location : 
                                     `${previewItem.location.lat?.toFixed(4) || 'N/A'}, ${previewItem.location.lng?.toFixed(4) || 'N/A'}`}
                                  </div>
                                )}
                                {previewItem.rating && (
                                  <span className="flex items-center text-yellow-500 mt-1">
                                    <Star className="w-4 h-4 mr-1 fill-yellow-400" />
                                    {previewItem.rating}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              <Calendar className="w-6 h-6 mx-auto mb-1 opacity-50" />
                              <p className="text-xs">No activities planned for this day</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                  {/* Overlay with expand prompt */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 pointer-events-none select-none">
                    <span className="text-primary-700 font-semibold text-base mb-1">Itinerary Collapsed</span>
                    <span className="text-gray-500 text-xs">Expand to see the full trip plan</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-0">
                  {dailyPlans.map((dayData, dayIndex) => {
                    const isExpanded = expandedDays[dayIndex];
                    const hasItems = (dayData.attractions?.length || 0) > 0 ||
                      (dayData.restaurants?.length || 0) > 0 ||
                      (dayData.hotels?.length || 0) > 0;
                    
                    // Gather all items from the real trip data
                    const allItems = [
                      ...(dayData.attractions?.map(a => ({ ...a, category: 'attractions' })) || []),
                      ...(dayData.restaurants?.map(a => ({ ...a, category: 'restaurants' })) || []),
                      ...(dayData.hotels?.map(a => ({ ...a, category: 'hotels' })) || []),
                    ];
                    
                    // Icon and color helpers
                    const getCategoryIcon = (category) => {
                      switch(category) {
                        case 'attractions': return <Camera className="w-5 h-5 text-primary-600" />;
                        case 'restaurants': return <Utensils className="w-5 h-5 text-orange-600" />;
                        case 'hotels': return <Bed className="w-5 h-5 text-green-600" />;
                        default: return <MapPin className="w-5 h-5 text-gray-600" />;
                      }
                    };
                    const getCategoryColor = (category) => {
                      switch(category) {
                        case 'attractions': return 'bg-primary-50 border-primary-200';
                        case 'restaurants': return 'bg-orange-50 border-orange-200';
                        case 'hotels': return 'bg-green-50 border-green-200';
                        default: return 'bg-gray-50 border-gray-200';
                      }
                    };
                    
                    // Highlight logic: highlight first day as current
                    const dayNum = dayData.day;
                    const isCurrentDay = dayNum === 1; // For demo, first day is current
                    const isUpcomingDay = dayNum > 1;
                    return (
                      <div key={dayIndex} className="border-l-2 border-gray-200 relative">
                        {/* Day Header */}
                        <div className="flex items-center mb-4 -ml-3">
                          <div className="bg-white border-4 border-primary-600 w-6 h-6 rounded-full"></div>
                          <button
                            onClick={() => setExpandedDays(prev => ({ ...prev, [dayIndex]: !prev[dayIndex] }))}
                            className="ml-4 flex items-center text-lg font-semibold text-gray-900 hover:text-primary-600"
                          >
                            Day {dayNum} - {dayData.city}
                            <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          {hasItems && (
                            <span className="ml-3 text-sm text-gray-500">
                              ({allItems.length} items)
                            </span>
                          )}
                        </div>
                        {/* Day Content */}
                        {isExpanded && (
                          <div className="ml-6 pb-8">
                            {hasItems ? (
                              <div className="space-y-4">
                                {allItems.map((item, itemIndex) => {
                                  // Middle index for current day
                                  let middleIndex = Math.floor((allItems.length - 1) / 2);
                                  const isCurrentItem = isCurrentDay && itemIndex === middleIndex;
                                  const isCompleted = isCurrentDay && itemIndex < middleIndex;
                                  // Mark as completed for all items after the current one in current and upcoming days
                                  const isMarkable = (isCurrentDay && itemIndex > middleIndex) || isUpcomingDay;
                                  return (
                                    <div
                                      key={`${item.category}-${itemIndex}`}
                                      className={`px-4 py-3 rounded-lg border max-w-[520px] relative ${getCategoryColor(item.category)} ${isCurrentItem ? 'ring-2 ring-primary-500 bg-primary-50/80 relative' : ''}`}
                                      style={{ marginLeft: 0 }}
                                    >
                                      {/* Time at true bottom right of card */}
                                      {item.time && (
                                        <span className="absolute bottom-2 right-4 text-sm text-gray-500">{item.time}</span>
                                      )}
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3 flex-1">
                                          {getCategoryIcon(item.category)}
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                              <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                                            </div>
                                            {item.location && (
                                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {typeof item.location === 'string' ? item.location : 
                                                 `${item.location.lat?.toFixed(4) || 'N/A'}, ${item.location.lng?.toFixed(4) || 'N/A'}`}
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
                                                  <span className="flex items-center text-yellow-500">
                                                    <Star className="w-4 h-4 mr-1 fill-yellow-400" />
                                                    {item.rating}
                                                  </span>
                                                )}
                                                {item.reviews && (
                                                  <span className="text-gray-500">({item.reviews} reviews)</span>
                                                )}
                                              </div>
                                              {/* No time here, handled by absolute at card bottom right */}
                                              <div className="text-right"></div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                          {isCompleted && (
                                            <span className="mb-1 px-2 py-1 bg-green-500 text-white text-xs rounded font-semibold shadow">Completed</span>
                                          )}
                                          {isCurrentItem && (
                                            <span className="ml-4 px-2 py-1 bg-primary-500 text-white text-xs rounded font-semibold shadow">Current</span>
                                          )}
                                          {isMarkable && (
                                            <button
                                              className="ml-4 px-2 py-1 bg-gray-300 hover:bg-green-500 text-gray-700 hover:text-white text-xs rounded font-semibold shadow transition-colors"
                                              style={{ minWidth: '110px' }}
                                              onClick={() => { /* Implement mark as completed logic here */ }}
                                            >
                                              Mark as Completed
                                            </button>
                                          )}
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
              )}
            </div>

            {/* Chat Interface Card below the whole itinerary - Only show if driver or guide is needed */}
            {(driverNeeded === 1 || guideNeeded === 1) && (
              <div className="mt-8">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                  <h3 className="text-lg font-semibold text-primary-700 mb-2">Chat with Driver &amp; Guide</h3>
                  <div className="h-56 overflow-y-auto bg-gray-50 rounded p-3 mb-3 flex flex-col gap-2" style={{ minHeight: '180px' }}>
                    {/* Example chat bubbles, replace with real chat logic */}
                    <div className="self-end max-w-[70%]">
                      <div className="bg-blue-100 text-blue-900 px-3 py-2 rounded-lg mb-1 text-sm">Hi, when will we reach the next stop?</div>
                      <div className="text-xs text-gray-400 text-right mr-1">You (Tourist)</div>
                    </div>
                    <div className="self-start max-w-[70%]">
                      <div className="bg-green-100 text-green-900 px-3 py-2 rounded-lg mb-1 text-sm">We will reach in about 30 minutes.</div>
                      <div className="text-xs text-gray-400 ml-1">Driver</div>
                    </div>
                    <div className="self-start max-w-[70%]">
                      <div className="bg-yellow-100 text-yellow-900 px-3 py-2 rounded-lg mb-1 text-sm">Let me know if you want to stop for food!</div>
                      <div className="text-xs text-gray-400 ml-1">Guide</div>
                    </div>
                  </div>
                  <form className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                      placeholder="Type your message..."
                    />
                    <button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded font-semibold text-sm transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
          {/* Right: Map */}
          <div className="w-full md:w-1/2 min-w-0 flex flex-col h-[calc(100vh-160px)] md:sticky top-32">
            <div className="bg-white rounded-xl w-full h-full shadow-lg border border-gray-200 overflow-hidden flex flex-col">
              {isLoaded ? (
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b border-gray-100 shrink-0">
                    <h2 className="font-bold text-lg">Trip Map</h2>
                    <p className="text-sm text-gray-500">Explore your trip destinations</p>
                  </div>
                  <div className="flex-1 min-h-[400px]">
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%', minHeight: '400px' }}
                      center={mapCenter}
                      zoom={10}
                      options={{
                        fullscreenControl: true,
                        streetViewControl: true,
                        mapTypeControl: true,
                        zoomControl: true,
                      }}
                    >
                      {dailyPlans.flatMap(dayPlan => 
                        dayPlan.attractions?.map((attraction, index) => (
                          <Marker
                            key={`${attraction.name}-${index}`}
                            position={attraction.location}
                            onClick={() => {
                              setSelectedMarker(attraction);
                              setMapCenter(attraction.location);
                            }}
                            icon={getMarkerIcon('attraction')}
                            title={attraction.name}
                          />
                        )) || []
                      )}
                      {selectedMarker && (
                        <InfoWindow
                          position={selectedMarker.location}
                          onCloseClick={() => setSelectedMarker(null)}
                        >
                          <div className="p-0 min-w-[280px] max-w-[320px]">
                            {/* Image Section */}
                            {selectedMarker.image && (
                              <div className="w-full h-32 mb-3 rounded-t-lg overflow-hidden">
                                <img
                                  src={selectedMarker.image}
                                  alt={selectedMarker.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to a placeholder if image fails to load
                                    e.target.src = 'https://via.placeholder.com/320x128/3B82F6/FFFFFF?text=No+Image';
                                  }}
                                />
                              </div>
                            )}
                            
                            <div className="px-3 pb-3">
                              <h3 className="font-bold text-lg mb-1">{selectedMarker.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{selectedMarker.type}</p>
                              
                              {selectedMarker.description && (
                                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                                  {selectedMarker.description}
                                </p>
                              )}
                              
                              <div className="flex items-center justify-between mb-3">
                                {selectedMarker.rating && (
                                  <div className="flex items-center">
                                    <span className="text-yellow-500 text-base">★</span>
                                    <span className="ml-1 text-sm font-medium">{selectedMarker.rating}</span>
                                    <span className="ml-1 text-xs text-gray-500">/5</span>
                                  </div>
                                )}
                                <div className="text-sm">
                                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                                    Day {selectedMarker.dayNumber}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      // Open in Google Maps for navigation
                                      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.location.lat},${selectedMarker.location.lng}`;
                                      window.open(url, '_blank');
                                    }}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                                    </svg>
                                    Navigate
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Mark as visited or current location
                                      console.log(`Marking ${selectedMarker.name} as current location`);
                                      // You can implement actual logic here
                                    }}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    I'm Here
                                  </button>
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedDestination(selectedMarker.name);
                                    setShowTravelersModal(true);
                                  }}
                                  className="w-full bg-blue-800 hover:bg-blue-900 text-white text-sm px-3 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                  <Users className="w-4 h-4" />
                                  See who else is coming
                                </button>
                              </div>
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
      </div>
      
      {/* Travelers Modal */}
      <TravelersModal
        isOpen={showTravelersModal}
        onClose={() => setShowTravelersModal(false)}
        destination={selectedDestination}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
      />
      
      <Footer />
    </div>
  );
};

export default OngoingTripPage;

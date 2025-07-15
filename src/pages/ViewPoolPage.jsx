import React, { useState, useEffect } from 'react';
import { useLocation as useRouterLocation, useNavigate, useParams } from 'react-router-dom';
import { MapPin, Plus, Utensils, Bed, Car, Camera, Search, Calendar, ChevronDown, Clock, Edit3, Share2, Heart, Star, Users } from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SharePoolModal from '../components/SharePoolModal';
import JoinPoolModal from '../components/JoinPoolModal';

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
  
  // Get pool data from route state or use mock data if none provided
  const poolFromState = location.state?.pool;
  const sourcePage = location.state?.sourcePage;
  
  const [currentDay, setCurrentDay] = useState(0);
  const [expandedDays, setExpandedDays] = useState({});
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinRequestsModalOpen, setJoinRequestsModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  // Mock join requests data
  const mockJoinRequests = [
    {
      name: 'Emily Carter',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      email: 'emily.carter@email.com',
      nationality: 'Australian',
      languages: ['English'],
      age: 29
    },
    {
      name: 'David Brown',
      avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
      email: 'david.brown@email.com',
      nationality: 'Canadian',
      languages: ['English', 'French'],
      age: 35
    }
  ];

  const handleAcceptRequest = (email, name) => {
    // Implement accept logic here
    console.log(`Accepting join request from ${name} (${email})`);
    // In a real app, this would make an API call to accept the request
    // For now, show a success message and remove from pending requests
    alert(`✅ Accepted join request from ${name}!`);
    // You could update the mockJoinRequests state here to remove the accepted request
  };

  const handleRejectRequest = (email, name) => {
    // Implement reject logic here
    console.log(`Rejecting join request from ${name} (${email})`);
    // In a real app, this would make an API call to reject the request
    alert(`❌ Rejected join request from ${name}`);
    // You could update the mockJoinRequests state here to remove the rejected request
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

  useEffect(() => {
    // Load pool data - either from route state or mock data
    const loadPool = () => {
      setLoading(true);
      
      // Use pool from state if available, otherwise use mock data
      let poolData = poolFromState;
      
      // If no pool data provided, use mock data
      if (!poolData) {
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
      
      setLoading(false);
    };

    loadPool();
  }, [poolFromState, poolId]);

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

  const handleShare = () => {
    setShareModalOpen(true);
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
        participants={[mockParticipants.owner, ...mockParticipants.participants]}
        onInvite={handleInvite}
      />
      <JoinPoolModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        participants={[mockParticipants.owner, ...mockParticipants.participants]}
        onRequestJoin={handleRequestJoin}
      />
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
            {/* Share/Join Pool Button */}
            <div className="flex items-center gap-2">
              {sourcePage === 'findPools' ? (
                <button
                  onClick={() => setJoinModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full transition-colors border border-white/30"
                  title="Join Pool"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Join Pool
                </button>
              ) : (
                <>
                  <button
                    onClick={handleShare}
                    className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full transition-colors border border-white/30"
                    title="Share Pool"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share Pool
                  </button>
                  <button
                    onClick={() => setJoinRequestsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full transition-colors border border-white/30"
                    title="Join Requests"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Join Requests
                  </button>
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
                            <span className="text-2xl">×</span>
                          </button>
                          
                          <div className="flex items-center gap-3 mb-6">
                            <Users className="w-6 h-6 text-primary-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Join Requests</h2>
                            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm font-medium">
                              {mockJoinRequests.length} pending
                            </span>
                          </div>
                          
                          {mockJoinRequests.length === 0 ? (
                            <div className="text-center py-12">
                              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                              <p className="text-gray-500 text-lg mb-2">No join requests</p>
                              <p className="text-gray-400 text-sm">When people request to join your pool, they'll appear here.</p>
                            </div>
                          ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {mockJoinRequests.map((req, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                  <div className="flex items-start gap-4">
                                    <img 
                                      src={req.avatar} 
                                      alt={req.name} 
                                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h3 className="font-semibold text-gray-900 text-lg">{req.name}</h3>
                                          <p className="text-gray-600 text-sm">{req.email}</p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                          <button
                                            onClick={() => handleRejectRequest(req.email, req.name)}
                                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                                          >
                                            Reject
                                          </button>
                                          <button
                                            onClick={() => handleAcceptRequest(req.email, req.name)}
                                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                                          >
                                            Accept
                                          </button>
                                        </div>
                                      </div>
                                      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                          <span className="text-gray-500 block">Nationality</span>
                                          <span className="font-medium">{req.nationality}</span>
                                        </div>
                                        <div>
                                          <span className="text-gray-500 block">Languages</span>
                                          <span className="font-medium">{req.languages.join(', ')}</span>
                                        </div>
                                        <div>
                                          <span className="text-gray-500 block">Age</span>
                                          <span className="font-medium">{req.age} years</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 text-center">
                              Pool capacity: {mockParticipants.current}/{mockParticipants.max} participants
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 pt-8 relative" style={{ zIndex: 0 }}>
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 mb-8" style={{ boxShadow: 'none' }}>
          {/* Participants Avatars & Progress + Info */}
          <div className="w-full">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-lg font-semibold text-gray-900">Participants</div>
              <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{mockParticipants.current} / {mockParticipants.max}</span>
            </div>
            <div className="flex items-center mb-2">
              {mockParticipants.participants.map((p, idx) => (
                <img
                  key={idx}
                  src={p.avatar}
                  alt={p.name}
                  title={p.name}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover -ml-2 first:ml-0 cursor-pointer"
                  style={{ zIndex: 10 - idx }}
                  onClick={() => setSelectedParticipant(idx)}
                />
              ))}
              {mockParticipants.current < mockParticipants.max && (
                <span className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xl font-bold -ml-2 bg-gray-50">+</span>
              )}
            </div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${(mockParticipants.current / mockParticipants.max) * 100}%` }}
                ></div>
              </div>
              <div className="flex flex-col items-end min-w-[80px]">
                <span className="text-xs text-gray-500">Capacity</span>
                <span className="font-bold text-primary-700 text-lg">{mockParticipants.max}</span>
              </div>
            </div>
            {/* Extra Info Row */}
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm mt-2">
              {/* Number of Days */}
              <div className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-1 text-primary-600" />
                <span>{pool.totalDays} days</span>
              </div>
              {/* Cost per participant */}
              <div className="flex items-center text-gray-700">
                <span className="font-medium mr-1">Cost/participant:</span>
                <span className="text-primary-700 font-semibold">${(grandTotal / (mockParticipants.current || 1)).toFixed(2)}</span>
              </div>
              {/* Driver appointed */}
              <div className="flex items-center text-gray-700">
                <Car className="w-4 h-4 mr-1 text-blue-600" />
                <span>Driver: <span className={"font-semibold " + (true ? 'text-green-600' : 'text-red-500')}>{true ? 'Appointed' : 'Not appointed'}</span></span>
              </div>
              {/* Guide appointed */}
              <div className="flex items-center text-gray-700">
                <Camera className="w-4 h-4 mr-1 text-primary-600" />
                <span>Guide: <span className={"font-semibold " + (true ? 'text-green-600' : 'text-red-500')}>{true ? 'Appointed' : 'Not appointed'}</span></span>
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
                  {/* Owner row */}
                  <tr className="bg-primary-50">
                    <td className="px-3 py-2"><img src={mockParticipants.owner.avatar} alt={mockParticipants.owner.name} className="w-8 h-8 rounded-full object-cover" /></td>
                    <td className="px-3 py-2 font-medium text-primary-700">{mockParticipants.owner.name} <span className="text-xs text-gray-400">(Organizer)</span></td>
                    <td className="px-3 py-2">{mockParticipants.owner.nationality}</td>
                    <td className="px-3 py-2">{mockParticipants.owner.languages.join(', ')}</td>
                    <td className="px-3 py-2">{mockParticipants.owner.age}</td>
                  </tr>
                  {/* Participants rows */}
                  {mockParticipants.participants.map((p, idx) => (
                    <tr key={idx} className="even:bg-gray-50">
                      <td className="px-3 py-2"><img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" /></td>
                      <td className="px-3 py-2 font-medium">{p.name}</td>
                      <td className="px-3 py-2">{p.nationality}</td>
                      <td className="px-3 py-2">{p.languages.join(', ')}</td>
                      <td className="px-3 py-2">{p.age}</td>
                    </tr>
                  ))}
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
            <div className="bg-gray-200 rounded-xl w-full h-[calc(100vh-160px)] sticky top-20">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-medium">Interactive Map</p>
                  <p className="text-sm">Pool route and locations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Pool Summary (below itinerary, left column only) */}
        <div className="flex gap-8 w-full">
          {/* Left: Pool Summary Card */}
          <div className="w-1/2 min-w-0 flex flex-col">
            <div className="w-full mt-10">
              <div
                id="pool-summary-card"
                className="bg-gray-50 rounded-xl p-6 mb-8 w-full border border-gray-200"
                style={{ minHeight: '220px', boxShadow: 'none', border: '1px solid #e5e7eb' }}
                ref={el => (window.poolSummaryCardRef = el)}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Pool Cost Breakdown</h3>
                <div className="space-y-3">
                  {/* Accommodation */}
                  <div className="flex flex-col border-b border-gray-100 pb-2">
                    <button
                      className="flex justify-between items-center w-full text-left focus:outline-none"
                      onClick={() => toggleCostExpand('accommodation')}
                    >
                      <span className="text-gray-600">Accommodation</span>
                      <span className="font-medium flex items-center">
                        ${accommodationTotal.toFixed(2)}
                        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${costExpanded.accommodation ? 'rotate-180' : ''}`} />
                      </span>
                    </button>
                    {costExpanded.accommodation && (
                      <div className="pl-4 mt-2 space-y-1">
                        {accommodationItems.length === 0 && <span className="text-gray-400 text-sm">No accommodations</span>}
                        {accommodationItems.map((place, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-gray-700">
                            <span>{place.name} <span className="text-gray-400">({place.location})</span></span>
                            <span>{place.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Food */}
                  <div className="flex flex-col border-b border-gray-100 pb-2">
                    <button
                      className="flex justify-between items-center w-full text-left focus:outline-none"
                      onClick={() => toggleCostExpand('food')}
                    >
                      <span className="text-gray-600">Food</span>
                      <span className="font-medium flex items-center">
                        ${foodTotal.toFixed(2)}
                        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${costExpanded.food ? 'rotate-180' : ''}`} />
                      </span>
                    </button>
                    {costExpanded.food && (
                      <div className="pl-4 mt-2 space-y-1">
                        {foodItems.length === 0 && <span className="text-gray-400 text-sm">No food entries</span>}
                        {foodItems.map((food, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-gray-700">
                            <span>{food.name} <span className="text-gray-400">({food.location})</span></span>
                            <span>{food.priceRange}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Activities */}
                  <div className="flex flex-col border-b border-gray-100 pb-2">
                    <button
                      className="flex justify-between items-center w-full text-left focus:outline-none"
                      onClick={() => toggleCostExpand('activities')}
                    >
                      <span className="text-gray-600">Activities</span>
                      <span className="font-medium flex items-center">
                        ${activityTotal.toFixed(2)}
                        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${costExpanded.activities ? 'rotate-180' : ''}`} />
                      </span>
                    </button>
                    {costExpanded.activities && (
                      <div className="pl-4 mt-2 space-y-1">
                        {activityItems.length === 0 && <span className="text-gray-400 text-sm">No activities</span>}
                        {activityItems.map((act, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-gray-700">
                            <span>{act.name} <span className="text-gray-400">({act.location})</span></span>
                            <span>{act.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Transportation */}
                  <div className="flex flex-col border-b border-gray-100 pb-2">
                    <button
                      className="flex justify-between items-center w-full text-left focus:outline-none"
                      onClick={() => toggleCostExpand('transportation')}
                    >
                      <span className="text-gray-600">Transportation</span>
                      <span className="font-medium flex items-center">
                        ${transportationTotal.toFixed(2)}
                        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${costExpanded.transportation ? 'rotate-180' : ''}`} />
                      </span>
                    </button>
                    {costExpanded.transportation && (
                      <div className="pl-4 mt-2 space-y-1">
                        {transportationItems.length === 0 && <span className="text-gray-400 text-sm">No transportation</span>}
                        {transportationItems.map((t, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-gray-700">
                            <span>{t.name} <span className="text-gray-400">({t.type || t.location})</span></span>
                            <span>{t.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                style={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Actions</h3>
                <div className="flex flex-row gap-4 w-full mb-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-full transition-colors border border-gray-200"
                  >
                    Back
                  </button>
                  {/* Delete button removed as requested */}
                <button
                  onClick={sourcePage === 'findPools' ? undefined : handleProceed}
                  className={`flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-full transition-colors border border-blue-200 ${sourcePage === 'findPools' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={sourcePage === 'findPools'}
                >
                  Join Pool
                </button>
                </div>
                {/* Disclaimers and info */}
                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <p>By joining, you agree to our <a href="#" className="underline hover:text-primary-600">Terms & Conditions</a> and <a href="#" className="underline hover:text-primary-600">Privacy Policy</a>.</p>
                  <p>Payments are processed securely. You will be able to contact the organizer after joining.</p>
                  {/* Delete disclaimer removed as requested */}
                  <p>For support, contact <a href="mailto:support@islandhop.com" className="underline hover:text-primary-600">support@islandhop.com</a>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer at the very bottom */}
      <Footer />
    </div>
  );
};

export default ViewPoolPage;

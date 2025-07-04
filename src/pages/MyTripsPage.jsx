import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import api from '../api/axios';

const placeholder = 'https://placehold.co/400x250';

const MyTripsPage = () => {
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, completed, draft
  const [sortBy, setSortBy] = useState('recent'); // recent, name, date
  const navigate = useNavigate();
  const location = useLocation();
  
  const [trips, setTrips] = useState([
    // Trip History (mostly expired, some completed)
    {
      id: 1,
      name: 'Summer Adventure in Sri Lanka',
      dates: 'Jun 11 → Jun 21, 2025',
      destination: 'Sri Lanka',
      image: require('../assets/destinations/sigiriya.jpg'),
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
      image: require('../assets/destinations/anuradhapura.jpg'),
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
      image: require('../assets/destinations/nuwara-eliya.jpg'),
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
      image: require('../assets/destinations/anuradhapura.jpg'),
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
      image: require('../assets/destinations/colombo.jpg'),
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
      image: require('../assets/destinations/ella.jpg'),
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
      image: require('../assets/destinations/mirissa.jpg'),
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
      image: require('../assets/destinations/kandy.jpg'),
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
      image: require('../assets/destinations/kandy.jpg'),
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
      image: require('../assets/destinations/mirissa.jpg'),
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
      image: require('../assets/destinations/colombo.jpg'),
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
      image: require('../assets/destinations/ella.jpg'),
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
      image: require('../assets/destinations/kandy.jpg'),
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
  ]);

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

  // Create basic trip with minimal information to reduce initial friction
  const createBasicTrip = async (tripData) => {
    console.log('[createBasicTrip] Sending request:', tripData);
    try {
      const response = await api.post('/trip/create-basic', {
        tripName: tripData.name,
        startDate: tripData.startDate, // ISO date string
        endDate: tripData.endDate // ISO date string
      }, {
        withCredentials: true // Essential for session management
      });
      console.log('[createBasicTrip] Response:', response);
      if (response.status !== 200 || !response.data) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return {
        tripId: response.data.tripId,
        trip: response.data.trip,
        message: response.data.message
      };
    } catch (err) {
      console.error('[createBasicTrip] Error:', err);
      throw err;
    }
  };

  const handleCreateTrip = async (tripData) => {
    try {
      // You may want to collect startDate/endDate from tripData or UI in the future
      const basicTrip = await createBasicTrip(tripData);
      // Optionally, you can store tripId or pass it to the next page
      console.log('[handleCreateTrip] Created trip:', basicTrip);
      // Navigate to trip duration page with trip name (and optionally tripId)
      navigate('/trip-duration', { state: { tripName: tripData.name, tripId: basicTrip.tripId } });
      setIsCreateTripModalOpen(false);
    } catch (err) {
      // Handle error (show toast, etc.)
      console.error('[handleCreateTrip] Failed to create trip:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navbar */}
      <Navbar />

      {/* Enhanced Hero Video Section */}
      <section className="relative w-full h-[18vh] md:h-[37.5vh] overflow-hidden">
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
          <div className="max-w-4xl mx-auto">
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
                <div className="relative flex-[3_3_0%] min-w-[340px] max-w-2xl">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search trips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-base"
                  />
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
                                <TripCard trip={trip} getStatusColor={getStatusColor} />
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
                                <TripCard trip={trip} getStatusColor={getStatusColor} />
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
                              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    </div>
  );
};

export default MyTripsPage;

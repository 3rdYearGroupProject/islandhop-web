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
  Heart
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CreateTripModal from '../components/CreateTripModal';
import myTripsVideo from '../assets/mytrips.mp4';

const placeholder = 'https://placehold.co/400x250';

const MyTripsPage = () => {
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, completed, draft
  const [sortBy, setSortBy] = useState('recent'); // recent, name, date
  const navigate = useNavigate();
  const location = useLocation();
  
  const [trips, setTrips] = useState([
    {
      id: 1,
      name: 'Summer Adventure in Sri Lanka',
      dates: 'Jun 11 → Jun 21, 2025',
      destination: 'Sri Lanka',
      image: placeholder,
      status: 'completed',
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
      id: 2,
      name: 'Cultural Heritage Tour',
      dates: 'Aug 15 → Aug 25, 2025',
      destination: 'Central Province',
      image: placeholder,
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
    {
      id: 3,
      name: 'Beach Retreat',
      dates: 'Not set',
      destination: 'Southern Coast',
      image: placeholder,
      status: 'draft',
      progress: 25,
      daysLeft: null,
      travelers: 2,
      rating: null,
      memories: 0,
      highlights: [],
      budget: 1800,
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
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const TripCard = ({ trip }) => (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={trip.image} 
          alt={trip.destination}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(trip.status)}`}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>
        {trip.status === 'active' && trip.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
            <div className="flex items-center justify-between text-white text-sm mb-2">
              <span>Trip Progress</span>
              <span>{trip.progress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${trip.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {trip.name}
          </h3>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm">{trip.destination}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm">{trip.dates}</span>
            {trip.daysLeft && trip.daysLeft > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                {trip.daysLeft} days left
              </span>
            )}
          </div>
          
          {trip.travelers && (
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm">{trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {trip.highlights && trip.highlights.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {trip.highlights.slice(0, 3).map((highlight, index) => (
                <span key={index} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  {highlight}
                </span>
              ))}
              {trip.highlights.length > 3 && (
                <span className="inline-block px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                  +{trip.highlights.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {trip.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span>{trip.rating}</span>
              </div>
            )}
            {trip.memories > 0 && (
              <div className="flex items-center">
                <Camera className="h-4 w-4 mr-1" />
                <span>{trip.memories}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleCreateTrip = (tripData) => {
    // Navigate to trip duration page with trip name
    navigate('/trip-duration', { state: { tripName: tripData.name } });
    setIsCreateTripModalOpen(false);
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
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-[0_1_160px] min-w-[120px] max-w-[160px] px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white appearance-none"
                >
                  <option value="all">All Trips</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Drafts</option>
                </select>
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-[0_1_160px] min-w-[120px] max-w-[160px] px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white appearance-none"
                >
                  <option value="recent">Recent</option>
                  <option value="name">Name</option>
                  <option value="date">Date</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <button
              onClick={() => setIsCreateTripModalOpen(true)}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl p-8 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <Plus className="h-8 w-8 mb-4 group-hover:rotate-90 transition-transform duration-300" />
                <h3 className="text-xl font-bold mb-2">Create New Trip</h3>
                <p className="text-blue-100">Start planning your next adventure</p>
              </div>
            </button>
            
            <button className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl p-8 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <Sparkles className="h-8 w-8 mb-4 group-hover:rotate-12 transition-transform duration-300" />
                <h3 className="text-xl font-bold mb-2">AI Trip Planner</h3>
                <p className="text-purple-100">Let AI create the perfect itinerary</p>
              </div>
            </button>
            
            <button className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl p-8 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <Globe className="h-8 w-8 mb-4 group-hover:rotate-12 transition-transform duration-300" />
                <h3 className="text-xl font-bold mb-2">Explore Templates</h3>
                <p className="text-green-100">Browse popular trip templates</p>
              </div>
            </button>
          </div>

          {/* Trips Grid */}
          {sortedTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {sortedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
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

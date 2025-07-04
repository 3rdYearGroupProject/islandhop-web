import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  DollarSign, 
  Phone, 
  MessageCircle, 
  Check, 
  X, 
  Navigation,
  Star,
  Filter,
  Search,
  ChevronDown,
  AlertCircle,
  Eye,
  Route,
  Clock4
} from 'lucide-react';

const GuideTrips = () => {
  const [trips, setTrips] = useState([
    {
      id: 'TR001',
      tourist: {
        name: 'Emily Johnson',
        profile: 'https://images.unsplash.com/photo-1494790108755-2616b612d9e3?w=150&h=150&fit=crop&crop=face',
        phone: '+1 555 123 4567',
        rating: 4.8,
        joinedDate: '2023-01-15'
      },
      package: 'Kandy Cultural Heritage Tour',
      requestedDate: '2024-12-15',
      requestedTime: '09:00 AM',
      duration: '6 hours',
      groupSize: 4,
      totalAmount: 600,
      currency: 'USD',
      status: 'pending',
      location: {
        pickup: 'Kandy City Center',
        destination: 'Temple of the Tooth',
        coordinates: { lat: 7.2906, lng: 80.6337 }
      },
      specialRequests: 'Vegetarian lunch required',
      submittedAt: '2024-12-10T10:30:00Z',
      priority: 'high'
    },
    {
      id: 'TR002',
      tourist: {
        name: 'Marco Rodriguez',
        profile: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        phone: '+34 600 123 456',
        rating: 4.6,
        joinedDate: '2023-05-20'
      },
      package: 'Ella Adventure Trek',
      requestedDate: '2024-12-18',
      requestedTime: '07:00 AM',
      duration: '8 hours',
      groupSize: 2,
      totalAmount: 360,
      currency: 'USD',
      status: 'accepted',
      location: {
        pickup: 'Ella Train Station',
        destination: 'Ella Rock',
        coordinates: { lat: 6.8667, lng: 81.0463 }
      },
      specialRequests: 'Early morning start preferred',
      submittedAt: '2024-12-08T14:20:00Z',
      priority: 'medium'
    },
    {
      id: 'TR003',
      tourist: {
        name: 'Sarah Chen',
        profile: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        phone: '+86 138 0013 8000',
        rating: 4.9,
        joinedDate: '2023-08-10'
      },
      package: 'Colombo Food Discovery',
      requestedDate: '2024-12-20',
      requestedTime: '04:00 PM',
      duration: '4 hours',
      groupSize: 3,
      totalAmount: 285,
      currency: 'USD',
      status: 'in_progress',
      location: {
        pickup: 'Galle Face Green',
        destination: 'Pettah Market',
        coordinates: { lat: 6.9271, lng: 79.8612 }
      },
      specialRequests: 'No spicy food',
      submittedAt: '2024-12-05T09:15:00Z',
      priority: 'low'
    },
    {
      id: 'TR004',
      tourist: {
        name: 'James Wilson',
        profile: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        phone: '+44 20 7946 0958',
        rating: 4.7,
        joinedDate: '2023-03-12'
      },
      package: 'Sigiriya Historical Tour',
      requestedDate: '2024-12-12',
      requestedTime: '08:00 AM',
      duration: '5 hours',
      groupSize: 6,
      totalAmount: 900,
      currency: 'USD',
      status: 'completed',
      location: {
        pickup: 'Dambulla',
        destination: 'Sigiriya Rock',
        coordinates: { lat: 7.9570, lng: 80.7603 }
      },
      specialRequests: 'Photography tour focus',
      submittedAt: '2024-12-01T12:00:00Z',
      priority: 'medium',
      completedAt: '2024-12-12T15:00:00Z',
      touristRating: 5
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    accepted: 'bg-blue-100 text-blue-800 border-blue-200',
    in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  const filteredTrips = trips.filter(trip => {
    const matchesFilter = filter === 'all' || trip.status === filter;
    const matchesSearch = trip.tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.package.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.requestedDate) - new Date(b.requestedDate);
      case 'amount':
        return b.totalAmount - a.totalAmount;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  });

  const handleAcceptTrip = (tripId) => {
    setTrips(trips.map(trip => 
      trip.id === tripId ? { ...trip, status: 'accepted' } : trip
    ));
  };

  const handleRejectTrip = (tripId) => {
    if (window.confirm('Are you sure you want to reject this trip request?')) {
      setTrips(trips.map(trip => 
        trip.id === tripId ? { ...trip, status: 'cancelled' } : trip
      ));
    }
  };

  const handleStartTrip = (tripId) => {
    setTrips(trips.map(trip => 
      trip.id === tripId ? { ...trip, status: 'in_progress' } : trip
    ));
  };

  const handleCompleteTrip = (tripId) => {
    setTrips(trips.map(trip => 
      trip.id === tripId ? { 
        ...trip, 
        status: 'completed',
        completedAt: new Date().toISOString()
      } : trip
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <Check className="h-4 w-4" />;
      case 'in_progress':
        return <Navigation className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateString);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Requests</h1>
            <p className="text-gray-600">Manage your tour bookings and requests</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Pending', value: trips.filter(t => t.status === 'pending').length, color: 'yellow' },
            { label: 'Accepted', value: trips.filter(t => t.status === 'accepted').length, color: 'blue' },
            { label: 'In Progress', value: trips.filter(t => t.status === 'in_progress').length, color: 'purple' },
            { label: 'Completed', value: trips.filter(t => t.status === 'completed').length, color: 'green' },
            { label: 'Total Earnings', value: `$${trips.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.totalAmount, 0)}`, color: 'indigo' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {sortedTrips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {/* Priority Indicator */}
                  <div className={`w-1 h-16 rounded-full ${priorityColors[trip.priority]}`}></div>
                  
                  {/* Tourist Info */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={trip.tourist.profile}
                      alt={trip.tourist.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{trip.tourist.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{trip.tourist.rating}</span>
                        <span>•</span>
                        <span>Member since {new Date(trip.tourist.joinedDate).getFullYear()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trip Info */}
                  <div className="ml-6">
                    <h4 className="font-medium text-gray-900 mb-1">{trip.package}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2" />
                        <span>{formatDate(trip.requestedDate)} at {trip.requestedTime}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2" />
                        <span>{trip.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-2" />
                        <span>{trip.groupSize} people</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2" />
                        <span>{trip.location.pickup} → {trip.location.destination}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-start space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      ${trip.totalAmount} {trip.currency}
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[trip.status]}`}>
                      {getStatusIcon(trip.status)}
                      <span className="ml-1 capitalize">{trip.status.replace('_', ' ')}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Submitted {getTimeAgo(trip.submittedAt)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    {trip.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAcceptTrip(trip.id)}
                          className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectTrip(trip.id)}
                          className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </button>
                      </>
                    )}

                    {trip.status === 'accepted' && (
                      <button
                        onClick={() => handleStartTrip(trip.id)}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Start Trip
                      </button>
                    )}

                    {trip.status === 'in_progress' && (
                      <button
                        onClick={() => handleCompleteTrip(trip.id)}
                        className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Complete
                      </button>
                    )}

                    {/* Universal Actions */}
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                        <Route className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {trip.specialRequests && (
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Special Requests: </span>
                      <span className="text-sm text-gray-600">{trip.specialRequests}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Completion Info */}
              {trip.status === 'completed' && trip.touristRating && (
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Tourist Rating: </span>
                      <div className="flex items-center ml-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < trip.touristRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium">{trip.touristRating}/5</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      Completed {getTimeAgo(trip.completedAt)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedTrips.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'No trips match your search criteria.' : 'You have no trip requests at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GuideTrips;

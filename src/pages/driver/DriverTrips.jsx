import React, { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Users, 
  Navigation,
  Phone,
  MessageCircle,
  Check,
  X,
  Filter,
  Calendar,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

const DriverTrips = () => {
  const [filter, setFilter] = useState('all'); // all, pending, active, completed, cancelled
  const [trips, setTrips] = useState([
    {
      id: 'TR001',
      passenger: 'Sarah Johnson',
      passengerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d9e3?w=150&h=150&fit=crop&crop=face',
      pickupLocation: 'Colombo Airport',
      destination: 'Galle Fort',
      distance: '120 km',
      estimatedTime: '2h 30m',
      fare: 89.50,
      status: 'active',
      startTime: '2:30 PM',
      passengerRating: 4.9,
      passengerPhone: '+94 77 123 4567',
      tripType: 'full_trip',
      requestTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      progress: 65
    },
    {
      id: 'TR002',
      passenger: 'Michael Chen',
      passengerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      pickupLocation: 'Kandy Central',
      destination: 'Nuwara Eliya',
      distance: '75 km',
      estimatedTime: '1h 45m',
      fare: 95.00,
      status: 'pending',
      passengerRating: 4.7,
      tripType: 'full_trip',
      requestTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      note: 'Please pick up from main entrance'
    },
    {
      id: 'TR003',
      passenger: 'Emma Wilson',
      passengerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      pickupLocation: 'Ella Railway Station',
      destination: 'Colombo',
      distance: '200 km',
      estimatedTime: '4h 30m',
      fare: 180.00,
      status: 'pending',
      passengerRating: 4.9,
      tripType: 'partial_trip',
      requestTime: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      note: 'Leg 2 of 3 - Ella to Colombo. Other drivers will handle other segments.'
    },
    {
      id: 'TR004',
      passenger: 'David Kumar',
      passengerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      pickupLocation: 'Sigiriya Rock',
      destination: 'Dambulla Cave Temple',
      distance: '22 km',
      estimatedTime: '45m',
      fare: 35.00,
      status: 'completed',
      completedTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      passengerRating: 4.8,
      tripType: 'full_trip',
      driverRating: 5,
      tip: 5.00
    },
    {
      id: 'TR005',
      passenger: 'Lisa Anderson',
      passengerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      pickupLocation: 'Bentota Beach',
      destination: 'Colombo Airport',
      distance: '85 km',
      estimatedTime: '1h 30m',
      fare: 75.00,
      status: 'completed',
      completedTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      passengerRating: 4.6,
      tripType: 'full_trip',
      driverRating: 4,
      tip: 0
    }
  ]);

  const [stats, setStats] = useState({
    totalTrips: trips.length,
    activeTrips: trips.filter(t => t.status === 'active').length,
    pendingTrips: trips.filter(t => t.status === 'pending').length,
    completedTrips: trips.filter(t => t.status === 'completed').length
  });

  const handleTripAction = (tripId, action) => {
    setTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id === tripId) {
          if (action === 'accept') {
            return { ...trip, status: 'active', acceptedTime: new Date() };
          } else if (action === 'decline') {
            return { ...trip, status: 'declined' };
          } else if (action === 'complete') {
            return { ...trip, status: 'completed', completedTime: new Date() };
          }
        }
        return trip;
      });
    });
  };

  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return trip.status !== 'declined';
    return trip.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date - new Date()) / (1000 * 60)),
      'minute'
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trips</h1>
        <p className="text-gray-600">Manage your trip requests and active rides</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTrips}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Navigation className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeTrips}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingTrips}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Check className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTrips}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Trips' },
                { key: 'pending', label: 'Pending' },
                { key: 'active', label: 'Active' },
                { key: 'completed', label: 'Completed' }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {filteredTrips.map(trip => (
          <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <img
                  src={trip.passengerAvatar}
                  alt={trip.passenger}
                  className="w-12 h-12 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{trip.passenger}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span>{trip.passengerRating}</span>
                        <span>•</span>
                        <span>Trip #{trip.id}</span>
                        {trip.tripType === 'partial_trip' && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                              Partial Trip
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </span>
                      {trip.status === 'pending' && (
                        <span className="text-sm text-gray-500">
                          {formatTime(trip.requestTime)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-600">From: {trip.pickupLocation}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm text-gray-600">To: {trip.destination}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Distance</p>
                        <p className="font-semibold text-sm">{trip.distance}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-semibold text-sm">{trip.estimatedTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fare</p>
                        <p className="font-semibold text-sm">${trip.fare}</p>
                        {trip.tip && trip.tip > 0 && (
                          <p className="text-xs text-green-600">+${trip.tip} tip</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {trip.note && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span className="text-sm text-blue-700">{trip.note}</span>
                      </div>
                    </div>
                  )}

                  {trip.status === 'active' && trip.progress && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Trip Progress</span>
                        <span className="text-sm text-gray-500">{trip.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${trip.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {trip.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleTripAction(trip.id, 'decline')}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </button>
                          <button
                            onClick={() => handleTripAction(trip.id, 'accept')}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </button>
                        </>
                      )}
                      
                      {trip.status === 'active' && (
                        <>
                          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center">
                            <Navigation className="h-4 w-4 mr-1" />
                            Navigate
                          </button>
                          <button
                            onClick={() => handleTripAction(trip.id, 'complete')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Complete Trip
                          </button>
                        </>
                      )}
                      
                      {trip.status === 'completed' && (
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center">
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      )}
                    </div>

                    {(trip.status === 'active' || trip.status === 'completed') && (
                      <div className="flex space-x-2">
                        <button className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors">
                          <Phone className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {trip.status === 'completed' && trip.driverRating && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Passenger rated you:</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="font-medium">{trip.driverRating}/5</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "You don't have any trips yet. When passengers request rides, they'll appear here."
              : `No ${filter} trips found. Try changing the filter.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default DriverTrips;

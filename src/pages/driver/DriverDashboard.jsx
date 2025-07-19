import React, { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Users, 
  TrendingUp, 
  Navigation,
  Phone,
  MessageCircle,
  Settings,
  AlertCircle
} from 'lucide-react';
import DriverTripModal from '../../components/driver/DriverTripModal';
import MapPopupModal from '../../components/driver/MapPopupModal';
import TripDetailsModal from '../../components/TripDetailsModal';
import { useToast } from '../../components/ToastProvider';
import { getUserData } from '../../utils/userStorage';
import { Link } from 'react-router-dom';

const DriverDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [driverStats, setDriverStats] = useState({
    todayEarnings: 245.50,
    weeklyEarnings: 1240.75,
    monthlyEarnings: 4820.25,
    completedTrips: 127,
    rating: 4.8,
    totalReviews: 89,
    activeTrips: 1,
    pendingRequests: 3
  });

  const [activeTrip, setActiveTrip] = useState({
    id: 'TR001',
    passenger: 'Sarah Johnson',
    pickupLocation: 'Colombo Airport',
    destination: 'Kandy City',
    distance: '120 km',
    estimatedTime: '2h 30m',
    fare: 8900.50,
    status: 'in_progress',
    startTime: '2:30 PM',
    passengerRating: 4.9,
    passengerPhone: '+94 77 123 4567',
    passengerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  });

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'TR002',
      passenger: 'Michael Chen',
      pickup: 'Kandy Central',
      destination: 'Nuwara Eliya',
      distance: '75 km',
      estimatedFare: 95.00,
      requestTime: '5 mins ago',
      passengerRating: 4.7,
     
    },
    {
      id: 'TR003',
      passenger: 'Emma Wilson',
      pickup: 'Ella Railway Station',
      destination: 'Colombo',
      distance: '200 km',
      estimatedFare: 180.00,
      requestTime: '8 mins ago',
      passengerRating: 4.9,
      
    }
  ]);

  useEffect(() => {
    const user = getUserData();
    if (user && user.profileComplete === false) {
      toast.info(
        <span>
          Please complete your profile to enjoy all features!{' '}
          <Link to="/profile" className="underline text-primary-600 hover:text-primary-800 font-semibold">Go to Profile</Link>
        </span>,
        { duration: 6000 }
      );
    }
  }, [toast]);

  const handleTripAction = (tripId, action) => {
    if (action === 'accept') {
      const mockTripDetails = {
        passenger: 'John Doe',
        pickup: '123 Main St',
        destination: '456 Elm St',
        estimatedFare: '25.00',
        distance: '10 miles',
      };
      setSelectedTrip(mockTripDetails);
      setIsModalOpen(true);
    } else if (action === 'decline') {
      // Handle trip decline
      setPendingRequests(prev => prev.filter(req => req.id !== tripId));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {/* Loading Screen */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, Rajesh! Ready for another great day?</p>
          </div>
        </div>
      </div>

     

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month's Earnings</p>
              <p className="text-2xl font-bold text-gray-900">LKR{driverStats.monthlyEarnings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Trips</p>
              <p className="text-2xl font-bold text-gray-900">{driverStats.completedTrips}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900">{driverStats.rating}/5</p>
              <p className="text-xs text-gray-500">({driverStats.totalReviews} reviews)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Active Trip */}
      {activeTrip && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Active Trip</h2>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              In Progress
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-medium">{activeTrip.passenger}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">From: {activeTrip.pickupLocation}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-sm text-gray-600">To: {activeTrip.destination}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-sm text-gray-500">Distance</p>
                <p className="font-semibold">{activeTrip.distance}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-semibold">{activeTrip.estimatedTime}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Fare</p>
                <p className="font-semibold">LKR{activeTrip.fare}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                onClick={() => setMapModalOpen(true)}
              >
                <Navigation className="h-4 w-4 inline mr-2" />
                Navigate
              </button>
              <button 
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                onClick={() => setModalOpen(true)}
              >
                Trip Details
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Pending Trip Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Trip Requests</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {pendingRequests.length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{request.passenger}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{request.requestTime}</span>
                    </div>
                  </div>
                 
                </div>

                <div className="space-y-1 mb-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 text-green-500 mr-2" />
                    <span>{request.pickup}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 text-red-500 mr-2" />
                    <span>{request.destination}</span>
                  </div>
                </div>

                {request.note && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-3">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm text-orange-700">{request.note}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span>{request.distance}</span>
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-gray-900">LKR{request.estimatedFare}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleTripAction(request.id, 'decline')}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleTripAction(request.id, 'accept')}
                      className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Trip Details Modal for Active Trip */}
      <DriverTripModal open={modalOpen} onClose={() => setModalOpen(false)} trip={activeTrip} />
      {/* Map Popup Modal for Navigate */}
      <MapPopupModal 
        open={mapModalOpen} 
        onClose={() => setMapModalOpen(false)} 
        pickup={activeTrip?.pickupLocation} 
        destination={activeTrip?.destination} 
      />
      {/* Trip Details Modal for Pending Requests */}
      <TripDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tripDetails={selectedTrip}
      />
        <h2 className="text-xl font-bold text-gray-900 mb-4">Earnings Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">This Week</p>
            <p className="text-2xl font-bold text-gray-900">LKR{driverStats.weeklyEarnings}</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12.5%</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">This Month</p>
            <p className="text-2xl font-bold text-gray-900">LKR{driverStats.monthlyEarnings}</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+8.3%</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Average per Trip</p>
            <p className="text-2xl font-bold text-gray-900">LKR{(driverStats.monthlyEarnings / driverStats.completedTrips).toFixed(2)}</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+5.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
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
  AlertCircle,
  Globe,
  Languages
} from 'lucide-react';
import { useToast } from '../../components/ToastProvider';
import { getUserData } from '../../utils/userStorage';
import { Link } from 'react-router-dom';

const GuideDashboard = () => {
  const toast = useToast();

  const [guideStats, setGuideStats] = useState({
    todayEarnings: 3200.75,
    weeklyEarnings: 1890.50,
    monthlyEarnings: 7240.25,
    completedTours: 89,
    rating: 4.9,
    totalReviews: 156,
    activeTours: 2,
    pendingRequests: 4
  });

  const [activeTour, setActiveTour] = useState({
    id: 'TR001',
    tourist: 'Emily Johnson',
    tourType: 'Cultural Heritage Tour',
    location: 'Kandy Temple Complex',
    destination: 'Dambulla Cave Temple',
    duration: '6 hours',
    fee: 150.00,
    status: 'in_progress',
    startTime: '9:00 AM',
    touristRating: 4.8,
    touristPhone: '+1 555 123 4567',
    progress: 40
  });

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'TR002',
      tourist: 'Marco Rodriguez',
      tourType: 'Adventure Tour',
      location: 'Ella Rock',
      duration: '8 hours',
      estimatedFee: 1800.00,
      requestTime: '3 mins ago',
      touristRating: 4.7,
      specialRequests: 'Photography focused'
    },
    {
      id: 'TR003',
      tourist: 'Sarah Chen',
      tourType: 'Food & Culture',
      location: 'Colombo Food Trail',
      duration: '4 hours',
      estimatedFee: 950.00,
      requestTime: '7 mins ago',
      touristRating: 4.9,
      specialRequests: 'Vegetarian preferences'
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

  const handleTourAction = (tourId, action) => {
    if (action === 'accept') {
      console.log(`Accepting tour ${tourId}`);
    } else if (action === 'decline') {
      setPendingRequests(prev => prev.filter(req => req.id !== tourId));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Guide Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, Priya! Ready to share Sri Lanka's beauty?</p>
          </div>
        </div>
      </div>

     

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
              <p className="text-2xl font-bold text-gray-900">LKR{guideStats.todayEarnings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Tours</p>
              <p className="text-2xl font-bold text-gray-900">{guideStats.completedTours}</p>
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
              <p className="text-2xl font-bold text-gray-900">{guideStats.rating}/5</p>
              <p className="text-xs text-gray-500">({guideStats.totalReviews} reviews)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Tours</p>
              <p className="text-2xl font-bold text-gray-900">{guideStats.activeTours}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Tour */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Tour</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                In Progress
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {activeTour.tourist.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{activeTour.tourist}</h3>
                  <p className="text-gray-600 text-sm">{activeTour.tourType}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${activeTour.fee}</p>
                  <p className="text-gray-600 text-sm">{activeTour.duration}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">                  <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Route</span>
                  </div>
                  <span className="text-sm text-gray-600">{activeTour.progress}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${activeTour.progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{activeTour.location}</span> → <span className="font-medium">{activeTour.destination}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Tourist
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Navigation className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Pending Requests</h2>
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                {pendingRequests.length}
              </span>
            </div>

            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.tourist}</h3>
                      <p className="text-gray-600 text-sm">{request.tourType}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">LKR{request.estimatedFee}</p>
                      <p className="text-gray-600 text-xs">{request.duration}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="text-sm text-gray-600">{request.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">{request.touristRating} rating</span>
                      <span className="text-xs text-gray-500">• {request.requestTime}</span>
                    </div>
                  </div>

                  {request.specialRequests && (
                    <div className="mb-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                      <strong>Special:</strong> {request.specialRequests}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleTourAction(request.id, 'accept')}
                      className="flex-1 px-3 py-2 bg-primary-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleTourAction(request.id, 'decline')}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;

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
import GuideTourModal from '../../components/guide/GuideTourModal';
import { useToast } from '../../components/ToastProvider';
import { getUserData } from '../../utils/userStorage';
import { Link } from 'react-router-dom';

const GuideDashboard = () => {
  const toast = useToast();
  const [tourModalOpen, setTourModalOpen] = useState(false);

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Tour */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Active Tour</h2>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              In Progress
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-medium">{activeTour.tourist}</span>
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
                <span className="text-sm text-gray-600">From: {activeTour.location}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-sm text-gray-600">To: {activeTour.destination}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold">{activeTour.duration}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Progress</p>
                <p className="font-semibold">{activeTour.progress}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Fee</p>
                <p className="font-semibold">LKR{activeTour.fee}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                <Navigation className="h-4 w-4 inline mr-2" />
                Navigate
              </button>
              <button 
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                onClick={() => setTourModalOpen(true)}
              >
                Tour Details
              </button>
            </div>
          </div>
        </div>

        {/* Pending Tour Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Tour Requests</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {pendingRequests.length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{request.tourist}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{request.requestTime}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 text-blue-500 mr-2" />
                    <span>{request.tourType}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 text-green-500 mr-2" />
                    <span>Location: {request.location}</span>
                  </div>
                </div>

                {/* {request.specialRequests && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-3">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm text-orange-700">{request.specialRequests}</span>
                    </div>
                  </div>
                )} */}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span>{request.duration}</span>
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-gray-900">LKR{request.estimatedFee}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleTourAction(request.id, 'decline')}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleTourAction(request.id, 'accept')}
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Earnings Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">This Week</p>
            <p className="text-2xl font-bold text-gray-900">LKR{guideStats.weeklyEarnings}</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+15.2%</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">This Month</p>
            <p className="text-2xl font-bold text-gray-900">LKR{guideStats.monthlyEarnings}</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12.8%</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Average per Tour</p>
            <p className="text-2xl font-bold text-gray-900">LKR{(guideStats.monthlyEarnings / guideStats.completedTours).toFixed(2)}</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+8.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Details Modal */}
      <GuideTourModal 
        open={tourModalOpen} 
        onClose={() => setTourModalOpen(false)} 
        tour={activeTour} 
      />
    </div>
  );
};

export default GuideDashboard;

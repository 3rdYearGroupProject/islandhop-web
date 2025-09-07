import React, { useState, useEffect, useMemo } from 'react';
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
import { getUserData, getUserUID } from '../../utils/userStorage';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GuideDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tours, setTours] = useState([]);
  const [error, setError] = useState(null);
  const [activeTour, setActiveTour] = useState(null);
  const [activeToursLoading, setActiveToursLoading] = useState(false);
  const toast = useToast();

  // Debug: Log when modal state changes
  useEffect(() => {
    console.log('GuideTourModal state changed - modalOpen:', modalOpen, 'activeTour:', !!activeTour);
  }, [modalOpen, activeTour]);

  // Get user data from storage - memoize to prevent repeated calls
  const userData = useMemo(() => getUserData(), []);
  const guideEmail = userData?.email;
  const guideUID = useMemo(() => getUserUID(), []);

  const [guideStats, setGuideStats] = useState({
    todayEarnings: 3200.75,
    weeklyEarnings: 1890.50,
    monthlyEarnings: 7240.25,
    completedTours: 0,
    rating: 4.9,
    totalReviews: 156,
    activeTours: 0,
    pendingRequests: 0
  });

  // Calculate pending tours from real data (for the pending requests section)
  const pendingRequests = tours.filter(tour => tour.status === 'pending');

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
  }, []); // Remove toast dependency to prevent re-renders

  // Fetch tours from API (same logic as GuideTrips page)
  useEffect(() => {
    const fetchTours = async () => {
      if (!guideEmail) {
        setError('Guide email not found in storage');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching tours for guide dashboard:', guideEmail);
        const response = await axios.get(`http://localhost:5006/api/trips/guide/${guideEmail}`);
        console.log('Guide Dashboard API Response:', response);
        
        if (response.data.success) {
          const apiTours = response.data.data.trips;
          
          // Transform API data to match component structure
          const transformedTours = apiTours.map(tour => {
            // Add null checking for critical fields
            if (!tour) {
              console.warn('Received null/undefined tour in API response');
              return null;
            }

            // Determine status based on guide_status
            let status = 'pending';
            if (tour.guide_status === 1) {
              status = 'active';
            } else if (tour.guide_status === '' || tour.guide_status === 0 || tour.guide_status === null) {
              status = 'pending';
            }

            // Get first and last cities for pickup and destination
            const firstDay = tour.dailyPlans?.[0];
            const lastDay = tour.dailyPlans?.[tour.dailyPlans.length - 1];

            return {
              id: tour._id,
              userId: tour.userId,
              tripName: tour.tripName,
              tourist: tour.userId ? `Tourist ${tour.userId.substring(0, 8)}...` : 'Unknown Tourist',
              touristAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d9e3?w=150&h=150&fit=crop&crop=face',
              location: firstDay?.city || tour.baseCity || 'Not specified',
              destination: lastDay?.city || 'Multiple destinations',
              distance: `${Math.round(tour.averageTripDistance || 0)} km`,
              estimatedTime: `${Math.ceil((tour.averageTripDistance || 0) / 60)} hours`,
              fee: tour.averageGuideCost || 0,
              status: status,
              touristRating: 4.5,
              tourType: 'full_tour',
              requestTime: new Date(tour.lastUpdated),
              startDate: tour.startDate,
              endDate: tour.endDate,
              arrivalTime: tour.arrivalTime,
              baseCity: tour.baseCity,
              dailyPlans: tour.dailyPlans,
              vehicleType: tour.vehicleType,
              paidAmount: tour.payedAmount,
              guideNeeded: tour.guideNeeded,
              driverNeeded: tour.driverNeeded,
              driverEmail: tour.driver_email,
              driverStatus: tour.driver_status
            };
          }).filter(tour => tour !== null);

          setTours(transformedTours);

          // Update stats based on real data
          const completedTours = transformedTours.filter(t => t.status === 'completed').length;
          const activeToursCount = transformedTours.filter(t => t.status === 'active').length;
          const pendingRequestsCount = transformedTours.filter(t => t.status === 'pending').length;
          
          setGuideStats(prevStats => ({
            ...prevStats,
            completedTours: completedTours,
            activeTours: activeToursCount,
            pendingRequests: pendingRequestsCount
          }));
        } else {
          setError('Failed to fetch tours');
        }
      } catch (err) {
        console.error('Error fetching tours for guide dashboard:', err);
        setError('Failed to fetch tours. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [guideEmail]);

  // Fetch active tours from the new endpoint
  useEffect(() => {
    const fetchActiveTours = async () => {
      if (!guideEmail) {
        setActiveTour(null);
        return;
      }

      try {
        setActiveToursLoading(true);
        console.log('Fetching active tours for guide dashboard:', guideEmail);
        const response = await axios.get(`http://localhost:5007/api/trips/guide/${guideEmail}`);
        console.log('Active tours API Response:', response);
        
        if (response.data.success && response.data.data.trips.length > 0) {
          const apiTour = response.data.data.trips[0]; // There should be only 1 active tour
          
          // Transform API data to match component structure
          const firstDay = apiTour.dailyPlans?.[0];
          const lastDay = apiTour.dailyPlans?.[apiTour.dailyPlans.length - 1];

          const transformedTour = {
            id: apiTour._id,
            userId: apiTour.userId,
            tripName: apiTour.tripName,
            tourist: apiTour.userId ? `Tourist ${apiTour.userId.substring(0, 8)}...` : 'Unknown Tourist',
            touristAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d9e3?w=150&h=150&fit=crop&crop=face',
            location: firstDay?.city || apiTour.baseCity || 'Not specified',
            destination: lastDay?.city || 'Multiple destinations',
            distance: `${Math.round(apiTour.averageTripDistance || 0)} km`,
            estimatedTime: `${Math.ceil((apiTour.averageTripDistance || 0) / 60)} hours`,
            fee: apiTour.payedAmount || 0,
            touristRating: 4.9,
            startDate: apiTour.startDate,
            endDate: apiTour.endDate,
            arrivalTime: apiTour.arrivalTime,
            baseCity: apiTour.baseCity,
            dailyPlans: apiTour.dailyPlans,
            vehicleType: apiTour.vehicleType,
            guideNeeded: apiTour.guideNeeded,
            driverNeeded: apiTour.driverNeeded,
            driverEmail: apiTour.driver_email,
            // Important fields from the new API
            started: apiTour.started,
            startconfirmed: apiTour.startconfirmed,
            ended: apiTour.ended,
            endconfirmed: apiTour.endconfirmed
          };

          setActiveTour(transformedTour);
          
          // Update stats to reflect active tour
          setGuideStats(prevStats => ({
            ...prevStats,
            activeTours: 1
          }));
        } else {
          setActiveTour(null);
          setGuideStats(prevStats => ({
            ...prevStats,
            activeTours: 0
          }));
        }
      } catch (err) {
        console.error('Error fetching active tours:', err);
        setActiveTour(null);
        setGuideStats(prevStats => ({
          ...prevStats,
          activeTours: 0
        }));
      } finally {
        setActiveToursLoading(false);
      }
    };

    fetchActiveTours();
  }, [guideEmail]);

  const handleTourAction = async (tourId, action) => {
    try {
      setLoading(true);
      
      if (action === 'accept') {
        // Find the tour to get the userId
        const currentTour = tours.find(tour => tour.id === tourId);
        const adminID = currentTour?.userId;

        if (!currentTour) {
          throw new Error('Tour not found');
        }

        if (!adminID) {
          console.warn('No adminID (userId) found for tour:', tourId);
          // Still proceed but log the warning
        }

        console.log('Accepting tour:', tourId, 'for guide:', guideEmail, 'UID:', guideUID, 'AdminID:', adminID);
        // Make API call to accept guide assignment
        const acceptResponse = await axios.post('http://localhost:5006/api/accept_guide', {
          tripId: tourId,
          email: guideEmail,
          guideUID: guideUID,
          adminID: adminID || null // Send null if adminID is not available
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (acceptResponse.data.success) {
          console.log('Guide accepted successfully:', acceptResponse.data);
          
          // Update local state to reflect the acceptance
          setTours(prevTours => {
            return prevTours.map(tour => {
              if (tour.id === tourId) {
                return { ...tour, status: 'active', acceptedTime: new Date() };
              }
              return tour;
            });
          });

          // Update stats
          setGuideStats(prevStats => ({
            ...prevStats,
            activeTours: prevStats.activeTours + 1,
            pendingRequests: prevStats.pendingRequests - 1
          }));

          toast.success('Tour accepted successfully!');
        } else {
          throw new Error(acceptResponse.data.message || 'Failed to accept tour');
        }
      } else if (action === 'decline') {
        console.log('Declining tour:', tourId, 'for guide:', guideEmail);
        // Make API call to remove guide from tour
        const removeResponse = await axios.post('http://localhost:5006/api/remove_guide', {
          tripId: tourId,
          email: guideEmail
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (removeResponse.data.success) {
          console.log('Guide removed successfully:', removeResponse.data);
          
          // Update local state to reflect the decline
          setTours(prevTours => {
            return prevTours.map(tour => {
              if (tour.id === tourId) {
                return { ...tour, status: 'declined' };
              }
              return tour;
            });
          });

          // Update stats
          setGuideStats(prevStats => ({
            ...prevStats,
            pendingRequests: prevStats.pendingRequests - 1
          }));

          toast.success('Tour declined successfully!');
        } else {
          throw new Error(removeResponse.data.message || 'Failed to decline tour');
        }
      }

    } catch (err) {
      console.error('Error updating tour:', err);
      setError(`Failed to ${action} tour: ${err.response?.data?.message || err.message}`);
      toast.error(`Failed to ${action} tour. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {/* Loading Screen */}
      {(loading || activeToursLoading) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => window.location.reload()} 
              className="ml-auto text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Guide Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back{guideEmail ? `, ${guideEmail.split('@')[0]}` : ''}! Ready to share Sri Lanka's beauty?
            </p>
            {guideEmail && (
              <p className="text-sm text-gray-500">Guide: {guideEmail}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month's Earnings</p>
              <p className="text-2xl font-bold text-gray-900">LKR{guideStats.monthlyEarnings}</p>
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
        {activeTour && (
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
                  <p className="text-sm text-gray-500">Distance</p>
                  <p className="font-semibold">{activeTour.distance}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-semibold">{activeTour.estimatedTime}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Fee</p>
                  <p className="font-semibold">LKR{activeTour.fee}</p>
                </div>
              </div>
              
              {/* Conditional message based on startconfirmed */}
              {activeTour.startconfirmed === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-yellow-700">
                      Waiting for the tourist to start the tour
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button 
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors font-medium ${
                    activeTour.startconfirmed === 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                  onClick={() => activeTour.startconfirmed === 1 && setMapModalOpen(true)}
                  disabled={activeTour.startconfirmed === 0}
                >
                  <Navigation className="h-4 w-4 inline mr-2" />
                  Navigate
                </button>
                <button 
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  onClick={() => setModalOpen(true)}
                >
                  Tour Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Active Tour Message */}
        {!activeTour && !activeToursLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center py-8">
              <Navigation className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Tour</h3>
              <p className="text-gray-600">
                You don't have any active tours at the moment. Accept a tour request to get started!
              </p>
            </div>
          </div>
        )}

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
                    <h3 className="font-semibold text-gray-900">{request.tripName || request.tourist}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                        Math.round((request.requestTime - new Date()) / (1000 * 60)),
                        'minute'
                      )}</span>
                      {request.vehicleType && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {request.vehicleType}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 text-green-500 mr-2" />
                    <span>From: {request.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 text-red-500 mr-2" />
                    <span>To: {request.destination}</span>
                  </div>
                  {request.startDate && (
                    <div className="flex items-center text-sm">
                      <Clock className="h-3 w-3 text-blue-500 mr-2" />
                      <span>
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
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
                    <span className="font-semibold text-gray-900">LKR {request.fee ? request.fee.toLocaleString() : '0'}</span>
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
            {pendingRequests.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                <p className="text-gray-600">
                  New tour requests will appear here when tourists request guides.
                </p>
              </div>
            )}
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
            <p className="text-2xl font-bold text-gray-900">LKR{(guideStats.monthlyEarnings / (guideStats.completedTours || 1)).toFixed(2)}</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+8.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Details Modal */}
      <GuideTourModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        tour={activeTour} 
      />
    </div>
  );
};

export default GuideDashboard;

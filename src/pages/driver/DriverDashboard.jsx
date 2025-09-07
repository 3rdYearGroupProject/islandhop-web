import React, { useState, useEffect, useMemo } from 'react';
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
import { getUserData, getUserUID } from '../../utils/userStorage';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DriverDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);
  const [activeTripsLoading, setActiveTripsLoading] = useState(false);
  const toast = useToast();

  // Debug: Log when modalOpen state changes
  useEffect(() => {
    console.log('DriverTripModal state changed - modalOpen:', modalOpen, 'activeTrip:', !!activeTrip);
  }, [modalOpen, activeTrip]);

  // Get user data from storage - memoize to prevent repeated calls
  const userData = useMemo(() => getUserData(), []);
  const driverEmail = userData?.email;
  const driverUID = useMemo(() => getUserUID(), []);

  const [driverStats, setDriverStats] = useState({
    todayEarnings: 245.50,
    weeklyEarnings: 1240.75,
    monthlyEarnings: 4820.25,
    completedTrips: 0,
    rating: 4.8,
    totalReviews: 89,
    activeTrips: 0,
    pendingRequests: 0
  });

  // Calculate pending trips from real data (for the pending requests section)
  const pendingRequests = trips.filter(trip => trip.status === 'pending');

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

  // Fetch trips from API (same logic as DriverTrips page)
  useEffect(() => {
    const fetchTrips = async () => {
      if (!driverEmail) {
        setError('Driver email not found in storage');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching trips for driver dashboard:', driverEmail);
        const response = await axios.get(`http://localhost:5006/api/trips/driver/${driverEmail}`);
        console.log('Dashboard API Response:', response);
        
        if (response.data.success) {
          const apiTrips = response.data.data.trips;
          
          // Transform API data to match component structure (same as DriverTrips)
          const transformedTrips = apiTrips.map(trip => {
            // Add null checking for critical fields
            if (!trip) {
              console.warn('Received null/undefined trip in API response');
              return null;
            }

            // Determine status based on driver_status
            let status = 'pending';
            if (trip.driver_status === 1) {
              status = 'active';
            } else if (trip.driver_status === '' || trip.driver_status === 0 || trip.driver_status === null) {
              status = 'pending';
            }

            // Get first and last cities for pickup and destination
            const firstDay = trip.dailyPlans?.[0];
            const lastDay = trip.dailyPlans?.[trip.dailyPlans.length - 1];

            return {
              id: trip._id,
              userId: trip.userId,
              tripName: trip.tripName,
              passenger: trip.userId ? `User ${trip.userId.substring(0, 8)}...` : 'Unknown User',
              passengerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d9e3?w=150&h=150&fit=crop&crop=face',
              pickupLocation: firstDay?.city || trip.baseCity || 'Not specified',
              destination: lastDay?.city || 'Multiple destinations',
              distance: `${Math.round(trip.averageTripDistance || 0)} km`,
              estimatedTime: `${Math.ceil((trip.averageTripDistance || 0) / 60)} hours`,
              fare: trip.averageDriverCost || 0,
              status: status,
              passengerRating: 4.5,
              tripType: 'full_trip',
              requestTime: new Date(trip.lastUpdated),
              startDate: trip.startDate,
              endDate: trip.endDate,
              arrivalTime: trip.arrivalTime,
              baseCity: trip.baseCity,
              dailyPlans: trip.dailyPlans,
              vehicleType: trip.vehicleType,
              paidAmount: trip.payedAmount,
              driverNeeded: trip.driverNeeded,
              guideNeeded: trip.guideNeeded,
              guideEmail: trip.guide_email,
              guideStatus: trip.guide_status
            };
          }).filter(trip => trip !== null);

          setTrips(transformedTrips);

          // Update stats based on real data
          const completedTrips = transformedTrips.filter(t => t.status === 'completed').length;
          const activeTripsCount = transformedTrips.filter(t => t.status === 'active').length;
          const pendingRequestsCount = transformedTrips.filter(t => t.status === 'pending').length;
          
          setDriverStats(prevStats => ({
            ...prevStats,
            completedTrips: completedTrips,
            activeTrips: activeTripsCount,
            pendingRequests: pendingRequestsCount
          }));
        } else {
          setError('Failed to fetch trips');
        }
      } catch (err) {
        console.error('Error fetching trips for dashboard:', err);
        setError('Failed to fetch trips. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [driverEmail]);

  // Fetch active trips from the new endpoint
  useEffect(() => {
    const fetchActiveTrips = async () => {
      if (!driverEmail) {
        setActiveTrip(null);
        return;
      }

      try {
        setActiveTripsLoading(true);
        console.log('Fetching active trips for driver dashboard:', driverEmail);
        const response = await axios.get(`http://localhost:5007/api/trips/driver/${driverEmail}`);
        console.log('Active trips API Response:', response);
        
        if (response.data.success && response.data.data.trips.length > 0) {
          const apiTrip = response.data.data.trips[0]; // There should be only 1 active trip
          
          // Transform API data to match component structure
          const firstDay = apiTrip.dailyPlans?.[0];
          const lastDay = apiTrip.dailyPlans?.[apiTrip.dailyPlans.length - 1];

          const transformedTrip = {
            id: apiTrip._id,
            userId: apiTrip.userId,
            tripName: apiTrip.tripName,
            passenger: apiTrip.userId ? `User ${apiTrip.userId.substring(0, 8)}...` : 'Unknown User',
            passengerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d9e3?w=150&h=150&fit=crop&crop=face',
            pickupLocation: firstDay?.city || apiTrip.baseCity || 'Not specified',
            destination: lastDay?.city || 'Multiple destinations',
            distance: `${Math.round(apiTrip.averageTripDistance || 0)} km`,
            estimatedTime: `${Math.ceil((apiTrip.averageTripDistance || 0) / 60)} hours`,
            fare: apiTrip.payedAmount || 0,
            passengerRating: 4.9,
            startDate: apiTrip.startDate,
            endDate: apiTrip.endDate,
            arrivalTime: apiTrip.arrivalTime,
            baseCity: apiTrip.baseCity,
            dailyPlans: apiTrip.dailyPlans,
            vehicleType: apiTrip.vehicleType,
            driverNeeded: apiTrip.driverNeeded,
            guideNeeded: apiTrip.guideNeeded,
            guideEmail: apiTrip.guide_email,
            // Important fields from the new API
            started: apiTrip.started,
            startconfirmed: apiTrip.startconfirmed,
            ended: apiTrip.ended,
            endconfirmed: apiTrip.endconfirmed
          };

          setActiveTrip(transformedTrip);
          
          // Update stats to reflect active trip
          setDriverStats(prevStats => ({
            ...prevStats,
            activeTrips: 1
          }));
        } else {
          setActiveTrip(null);
          setDriverStats(prevStats => ({
            ...prevStats,
            activeTrips: 0
          }));
        }
      } catch (err) {
        console.error('Error fetching active trips:', err);
        setActiveTrip(null);
        setDriverStats(prevStats => ({
          ...prevStats,
          activeTrips: 0
        }));
      } finally {
        setActiveTripsLoading(false);
      }
    };

    fetchActiveTrips();
  }, [driverEmail]);

  const handleTripAction = async (tripId, action) => {
    try {
      setLoading(true);
      
      if (action === 'accept') {
        // Find the trip to get the userId
        const currentTrip = trips.find(trip => trip.id === tripId);
        const adminID = currentTrip?.userId;

        if (!currentTrip) {
          throw new Error('Trip not found');
        }

        if (!adminID) {
          console.warn('No adminID (userId) found for trip:', tripId);
          // Still proceed but log the warning
        }

        console.log('Accepting trip:', tripId, 'for driver:', driverEmail, 'UID:', driverUID, 'AdminID:', adminID);
        // Make API call to accept driver assignment
        const acceptResponse = await axios.post('http://localhost:5006/api/accept_driver', {
          tripId: tripId,
          email: driverEmail,
          driverUID: driverUID,
          adminID: adminID || null // Send null if adminID is not available
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (acceptResponse.data.success) {
          console.log('Driver accepted successfully:', acceptResponse.data);
          
          // Update local state to reflect the acceptance
          setTrips(prevTrips => {
            return prevTrips.map(trip => {
              if (trip.id === tripId) {
                return { ...trip, status: 'active', acceptedTime: new Date() };
              }
              return trip;
            });
          });

          // Update stats
          setDriverStats(prevStats => ({
            ...prevStats,
            activeTrips: prevStats.activeTrips + 1,
            pendingRequests: prevStats.pendingRequests - 1
          }));

          toast.success('Trip accepted successfully!');
        } else {
          throw new Error(acceptResponse.data.message || 'Failed to accept trip');
        }
      } else if (action === 'decline') {
        console.log('Declining trip:', tripId, 'for driver:', driverEmail);
        // Make API call to remove driver from trip
        const removeResponse = await axios.post('http://localhost:5006/api/remove_driver', {
          tripId: tripId,
          email: driverEmail
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (removeResponse.data.success) {
          console.log('Driver removed successfully:', removeResponse.data);
          
          // Update local state to reflect the decline
          setTrips(prevTrips => {
            return prevTrips.map(trip => {
              if (trip.id === tripId) {
                return { ...trip, status: 'declined' };
              }
              return trip;
            });
          });

          // Update stats
          setDriverStats(prevStats => ({
            ...prevStats,
            pendingRequests: prevStats.pendingRequests - 1
          }));

          toast.success('Trip declined successfully!');
        } else {
          throw new Error(removeResponse.data.message || 'Failed to decline trip');
        }
      }

    } catch (err) {
      console.error('Error updating trip:', err);
      setError(`Failed to ${action} trip: ${err.response?.data?.message || err.message}`);
      toast.error(`Failed to ${action} trip. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {/* Loading Screen */}
      {(loading || activeTripsLoading) && (
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
            <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back{driverEmail ? `, ${driverEmail.split('@')[0]}` : ''}! Ready for another great day?
            </p>
            {driverEmail && (
              <p className="text-sm text-gray-500">Driver: {driverEmail}</p>
            )}
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
            
            {/* Conditional message based on startconfirmed */}
            {activeTrip.startconfirmed === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-sm text-yellow-700">
                    Waiting for the tourist to start the trip
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button 
                className={`flex-1 py-2 px-4 rounded-lg transition-colors font-medium ${
                  activeTrip.startconfirmed === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
                onClick={() => activeTrip.startconfirmed === 1 && setMapModalOpen(true)}
                disabled={activeTrip.startconfirmed === 0}
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

      {/* No Active Trip Message */}
      {!activeTrip && !activeTripsLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <Navigation className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Trip</h3>
            <p className="text-gray-600">
              You don't have any active trips at the moment. Accept a trip request to get started!
            </p>
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
                    <h3 className="font-semibold text-gray-900">{request.tripName || request.passenger}</h3>
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
                    <span>From: {request.pickupLocation}</span>
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
                    <span className="font-semibold text-gray-900">LKR {request.fare ? request.fare.toLocaleString() : '0'}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleTripAction(request.id, 'decline')}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Decline
                    </button>
                    <Link
                      to="/driver/trips"
                      className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium inline-block text-center"
                    >
                      View Requests
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {pendingRequests.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                <p className="text-gray-600">
                  New trip requests will appear here when passengers request rides.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Trip Details Modal for Active Trip - Pass full active trip data */}
      <DriverTripModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        trip={activeTrip} 
      />
      
      {/* Map Popup Modal for Navigate - Pass trip ID and full trip data */}
      <MapPopupModal 
        open={mapModalOpen} 
        onClose={() => setMapModalOpen(false)} 
        tripId={activeTrip?.id}
        tripData={activeTrip} // Pass the full active trip data
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

import React, { useState, useEffect } from 'react';
import DriverTripModal from '../../components/driver/DriverTripModal';
import axios from 'axios';
import { getUserData, getUserUID } from '../../utils/userStorage';
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
  AlertTriangle,
  Play
} from 'lucide-react';

const DriverTrips = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, active, completed, cancelled
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);

  // Get user data from storage
  const userData = getUserData();
  const driverEmail = userData?.email;
  const driverUID = getUserUID();

  const [stats, setStats] = useState({
    totalTrips: 0,
    activeTrips: 0,
    pendingTrips: 0,
    completedTrips: 0
  });

  // Fetch trips from API
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
        console.log('Fetching trips for driver:', driverEmail);
        const response = await axios.get(`http://localhost:5006/api/trips/driver/${driverEmail}`);
        console.log('API Response:', response);
        
        if (response.data.success) {
          const apiTrips = response.data.data.trips;
          
          // Transform API data to match component structure
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
              userId: trip.userId, // Preserve the original userId
              tripName: trip.tripName,
              passenger: trip.userId ? `User ${trip.userId.substring(0, 8)}...` : 'Unknown User', // Safe substring with fallback
              passengerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d9e3?w=150&h=150&fit=crop&crop=face',
              pickupLocation: firstDay?.city || trip.baseCity || 'Not specified',
              destination: lastDay?.city || 'Multiple destinations',
              distance: `${Math.round(trip.averageTripDistance || 0)} km`,
              estimatedTime: `${Math.ceil((trip.averageTripDistance || 0) / 60)} hours`, // Rough estimate
              fare: trip.averageDriverCost || 0,
              status: status,
              passengerRating: 4.5, // Default rating
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
          }).filter(trip => trip !== null); // Remove any null entries from failed transformations

          setTrips(transformedTrips);

          // Update stats
          const newStats = {
            totalTrips: transformedTrips.length,
            activeTrips: transformedTrips.filter(t => t.status === 'active').length,
            pendingTrips: transformedTrips.filter(t => t.status === 'pending').length,
            completedTrips: transformedTrips.filter(t => t.status === 'completed').length
          };
          setStats(newStats);
        } else {
          setError('Failed to fetch trips');
        }
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Failed to fetch trips. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [driverEmail]);

  // Helper function to generate date range for trip duration
  const generateDateRange = (startDate, endDate) => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Ensure we have valid dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.warn('Invalid date range provided:', startDate, endDate);
      return [];
    }
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

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
          
          // Update driver schedule to lock dates for the trip
          try {
            const tripDates = generateDateRange(currentTrip.startDate, currentTrip.endDate);
            
            if (tripDates.length > 0) {
              // Create a combined trip identifier with name and ID for later separation
              const tripIdentifier = `${currentTrip.tripName || 'Trip'}_${tripId}`;
              
              console.log('Locking driver schedule for dates:', tripDates, 'Driver email:', driverEmail, 'Trip ID:', tripIdentifier);
              
              const scheduleResponse = await axios.post('http://localhost:5005/schedule/driver/lock', {
                email: driverEmail,
                dates: tripDates,
                tripId: tripIdentifier
              }, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              
              if (scheduleResponse.data.success) {
                console.log('Driver schedule locked successfully for dates:', tripDates, 'Trip ID:', tripIdentifier);
              } else {
                console.warn('Failed to lock driver schedule:', scheduleResponse.data.message || 'Unknown error');
                // Don't fail the whole operation, just log the warning
              }
            } else {
              console.warn('No valid dates found for trip. Start date:', currentTrip.startDate, 'End date:', currentTrip.endDate);
            }
          } catch (scheduleError) {
            console.error('Error locking driver schedule:', scheduleError.response?.data || scheduleError.message);
            // Don't fail the whole operation, just log the error
          }
          
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
          setStats(prevStats => ({
            ...prevStats,
            activeTrips: prevStats.activeTrips + 1,
            pendingTrips: prevStats.pendingTrips - 1
          }));

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
          setStats(prevStats => ({
            ...prevStats,
            pendingTrips: prevStats.pendingTrips - 1
          }));

        } else {
          throw new Error(removeResponse.data.message || 'Failed to decline trip');
        }

      }

    } catch (err) {
      console.error('Error updating trip:', err);
      setError(`Failed to ${action} trip: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = async (tripId) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Starting trip:', tripId);
      
      const startTripResponse = await axios.post('http://localhost:5007/api/trips/start-trip', {
        tripId: tripId
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (startTripResponse.data.success) {
        console.log('Trip started successfully:', startTripResponse.data);
        
        // You might want to update local state or show a success message
        // For now, we'll just log the success
        
      } else {
        throw new Error(startTripResponse.data.message || 'Failed to start trip');
      }

    } catch (err) {
      console.error('Error starting trip:', err);
      setError(`Failed to start trip: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
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
    <div className="p-6 max-w-7xl mx-auto relative">
      {/* Loading Screen */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trips</h1>
        <p className="text-gray-600">Manage your trip requests and active rides</p>
        {driverEmail && (
          <p className="text-sm text-gray-500">Driver: {driverEmail}</p>
        )}
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
          <div 
            key={trip.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={() => { setSelectedTrip(trip); setModalOpen(true); }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{trip.tripName || trip.passenger}</h3>
                      {trip.vehicleType && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {trip.vehicleType}
                          </span>
                        </div>
                      )}
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
                      {trip.startDate && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm text-gray-600">
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Distance</p>
                        <p className="font-semibold text-sm">{trip.distance}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-semibold text-sm">{trip.estimatedTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fare</p>
                        <p className="font-semibold text-sm">LKR {trip.fare ? trip.fare.toLocaleString() : '0'}</p>
                        {trip.paidAmount && (
                          <p className="text-xs text-green-600">Paid: LKR {parseFloat(trip.paidAmount).toLocaleString()}</p>
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

                  {/* Guide Information */}
                  {trip.guideNeeded === 1 && trip.guideEmail && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-purple-500 mr-2" />
                        <span className="text-sm text-purple-700">
                          Guide assigned: {trip.guideEmail}
                          {trip.guideStatus === 1 && (
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">Confirmed</span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Daily Plans Summary */}
                  {trip.dailyPlans && trip.dailyPlans.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Itinerary ({trip.dailyPlans.length} days)</span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        {trip.dailyPlans.slice(0, 3).map((plan, index) => (
                          <div key={index}>
                            Day {plan.day}: {plan.city} ({plan.attractions?.length || 0} attractions)
                          </div>
                        ))}
                        {trip.dailyPlans.length > 3 && (
                          <div className="text-gray-500">... and {trip.dailyPlans.length - 3} more days</div>
                        )}
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
                  <div className="flex items-center">
                    <div className="flex space-x-2">
                      {trip.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTripAction(trip.id, 'decline');
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTripAction(trip.id, 'accept');
                            }}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </button>
                        </>
                      )}
                      
                      {trip.status === 'completed' && (
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      )}
                    </div>
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
      <DriverTripModal open={modalOpen} onClose={() => setModalOpen(false)} trip={selectedTrip} />
    </div>
  );
};

export default DriverTrips;

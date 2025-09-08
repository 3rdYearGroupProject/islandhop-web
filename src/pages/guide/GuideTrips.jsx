import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserData, getUserUID } from '../../utils/userStorage';
import { 
  Globe, 
  MapPin, 
  Clock, 
  Star, 
  Users, 
  Navigation,
  Phone,
  MessageCircle,
  Check,
  X,
  Filter,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const GuideTrips = () => {
  const [filter, setFilter] = useState('all'); // all, pending, active, completed, cancelled
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);

  // Get user data from storage
  const userData = getUserData();
  const guideEmail = userData?.email;
  const guideUID = getUserUID();

  const [stats, setStats] = useState({
    totalTrips: 0,
    activeTrips: 0,
    pendingTrips: 0,
    completedTrips: 0
  });

  // Fetch trips from API
  useEffect(() => {
    const fetchTrips = async () => {
      if (!guideEmail) {
        setError('Guide email not found in storage');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching trips for guide:', guideEmail);
        const response = await axios.get(`http://localhost:5006/api/trips/guide/${guideEmail}`);
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

            // Determine status based on guide_status
            let status = 'pending';
            if (trip.guide_status === 1) {
              status = 'active';
            } else if (trip.guide_status === '' || trip.guide_status === 0 || trip.guide_status === null) {
              status = 'pending';
            }

            // Get first and last cities for pickup and destination
            const firstDay = trip.dailyPlans?.[0];
            const lastDay = trip.dailyPlans?.[trip.dailyPlans.length - 1];

            return {
              id: trip._id,
              userId: trip.userId, // Preserve the original userId
              tripName: trip.tripName,
              tourist: trip.userId ? `Tourist ${trip.userId.substring(0, 8)}...` : 'Unknown Tourist', // Safe substring with fallback
              touristAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d9e3?w=150&h=150&fit=crop&crop=face',
              pickupLocation: firstDay?.city || trip.baseCity || 'Not specified',
              destination: lastDay?.city || 'Multiple destinations',
              distance: `${Math.round(trip.averageTripDistance || 0)} km`,
              estimatedTime: `${Math.ceil((trip.averageTripDistance || 0) / 60)} hours`, // Rough estimate
              fare: trip.averageGuideCost || 0,
              status: status,
              touristRating: 4.5, // Default rating
              tripType: 'full_tour',
              requestTime: new Date(trip.lastUpdated),
              startDate: trip.startDate,
              endDate: trip.endDate,
              arrivalTime: trip.arrivalTime,
              baseCity: trip.baseCity,
              dailyPlans: trip.dailyPlans,
              vehicleType: trip.vehicleType,
              paidAmount: trip.payedAmount,
              guideNeeded: trip.guideNeeded,
              driverNeeded: trip.driverNeeded,
              driverEmail: trip.driver_email,
              driverStatus: trip.driver_status
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
  }, [guideEmail]);

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

        console.log('Accepting trip:', tripId, 'for guide:', guideEmail, 'UID:', guideUID, 'AdminID:', adminID);
        // Make API call to accept guide assignment
        const acceptResponse = await axios.post('http://localhost:5006/api/accept_guide', {
          tripId: tripId,
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
          
          // Update guide schedule to lock dates for the trip
          try {
            const tripDates = generateDateRange(currentTrip.startDate, currentTrip.endDate);
            
            if (tripDates.length > 0) {
              // Create a combined trip identifier with name and ID for later separation
              const tripIdentifier = `${currentTrip.tripName || 'Tour'}_${tripId}`;
              
              console.log('Locking guide schedule for dates:', tripDates, 'Guide email:', guideEmail, 'Trip ID:', tripIdentifier);
              
              const scheduleResponse = await axios.post('http://localhost:5005/schedule/guide/lock', {
                email: guideEmail,
                dates: tripDates,
                tripId: tripIdentifier
              }, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              
              if (scheduleResponse.data.success) {
                console.log('Guide schedule locked successfully for dates:', tripDates, 'Trip ID:', tripIdentifier);
              } else {
                console.warn('Failed to lock guide schedule:', scheduleResponse.data.message || 'Unknown error');
                // Don't fail the whole operation, just log the warning
              }
            } else {
              console.warn('No valid dates found for trip. Start date:', currentTrip.startDate, 'End date:', currentTrip.endDate);
            }
          } catch (scheduleError) {
            console.error('Error locking guide schedule:', scheduleError.response?.data || scheduleError.message);
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
        console.log('Declining trip:', tripId, 'for guide:', guideEmail);
        // Make API call to remove guide from trip
        const removeResponse = await axios.post('http://localhost:5006/api/remove_guide', {
          tripId: tripId,
          email: guideEmail
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (removeResponse.data.success) {
          console.log('Guide removed successfully:', removeResponse.data);
          
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tours</h1>
        <p className="text-gray-600">Manage your tour requests and active bookings</p>
        {guideEmail && (
          <p className="text-sm text-gray-500">Guide: {guideEmail}</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tours</p>
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
                { key: 'all', label: 'All Tours' },
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
      <div className="space-y-6">
        {filteredTrips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {trip.userName?.charAt(0) || 'T'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {trip.destination || 'Tour Destination'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tourist: {trip.userName || 'Tourist Name'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Guide: {guideEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  trip.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  trip.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  trip.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  trip.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1) || 'Unknown'}
                </span>
                <p className="text-lg font-bold text-gray-900">
                  LKR {(trip.fare || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'Date TBD'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Duration: {trip.duration || 'TBD'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {trip.numberOfPeople || 1} Tourist{(trip.numberOfPeople || 1) > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {trip.description && (
              <p className="text-gray-600 text-sm mb-4">{trip.description}</p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                {trip.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleTripAction(trip.id, 'accept')}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Accept Tour
                    </button>
                    <button
                      onClick={() => handleTripAction(trip.id, 'decline')}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </>
                )}
                
                {trip.status === 'accepted' && (
                  <button
                    onClick={() => handleStartTrip(trip.id)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Start Tour
                  </button>
                )}
                
                {trip.status === 'active' && (
                  <button
                    onClick={() => handleTripAction(trip.id, 'complete')}
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    Complete Tour
                  </button>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTrips.length === 0 && !loading && (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tours found</p>
            <p className="text-gray-400">Tours matching your filter will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideTrips;

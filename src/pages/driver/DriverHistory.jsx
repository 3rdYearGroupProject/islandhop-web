import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserData } from '../../utils/userStorage';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const DriverHistory = () => {
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripHistory, setTripHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user data from storage
  const userData = getUserData();
  const driverEmail = userData?.email;

  // Fetch trip history from API
  useEffect(() => {
    const fetchTripHistory = async () => {
      if (!driverEmail) {
        setError('Driver email not found in storage');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching trip history for driver:', driverEmail);
        
        const response = await axios.get(`http://localhost:5001/api/drivers/${driverEmail}/trips`);
        console.log('Trip History API Response:', response);
        
        if (response.data.success) {
          const apiTrips = response.data.data;
          
          // Transform API data to match history component structure
          const transformedTrips = apiTrips.map(trip => ({
            id: trip._id || trip.id,
            passenger: trip.passenger || `User ${trip.userId?.substring(0, 8)}...`,
            pickupLocation: trip.pickupLocation || 'Not specified',
            destination: trip.destination || 'Multiple destinations',
            date: trip.date || trip.startDate || new Date(trip.createdAt || Date.now()).toISOString().split('T')[0],
            startTime: trip.startTime || '00:00',
            endTime: trip.endTime || '00:00',
            duration: trip.duration || trip.estimatedTime || 'N/A',
            distance: trip.distance || `${Math.round(trip.totalDistance || 0)} km`,
            fare: trip.fare || trip.totalCost || 0,
            rating: trip.rating || trip.passengerRating || 5,
            status: trip.status || 'completed',
            paymentMethod: trip.paymentMethod || 'card',
            notes: trip.notes || 'No additional notes',
            tip: trip.tip || 0
          }));

          setTripHistory(transformedTrips);
        } else {
          setError('Failed to fetch trip history');
          setTripHistory([]);
        }
      } catch (err) {
        console.error('Error fetching trip history:', err);
        setError('Failed to fetch trip history. Please try again.');
        setTripHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTripHistory();
  }, [driverEmail]);

  const statusOptions = [
    { value: 'all', label: 'All Trips' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  const filteredTrips = tripHistory.filter(trip => {
    const matchesSearch = trip.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400">Not rated</span>;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">({rating})</span>
      </div>
    );
  };

  const calculateStats = () => {
    const completedTrips = tripHistory.filter(trip => trip.status === 'completed');
    const totalEarnings = completedTrips.reduce((sum, trip) => sum + trip.fare, 0);
    const totalDistance = completedTrips.reduce((sum, trip) => sum + parseFloat(trip.distance), 0);
    const averageRating = completedTrips.filter(trip => trip.rating).length > 0 
      ? completedTrips.filter(trip => trip.rating).reduce((sum, trip) => sum + trip.rating, 0) / completedTrips.filter(trip => trip.rating).length 
      : 0;

    return {
      totalTrips: completedTrips.length,
      totalEarnings: totalEarnings.toFixed(2),
      totalDistance: totalDistance.toFixed(0),
      averageRating: averageRating.toFixed(1)
    };
  };

  const stats = calculateStats();

  return (
    <div className="max-w-7xl mx-auto p-6 relative">
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

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Trip History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your complete trip history and performance metrics
          </p>
          {driverEmail && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Driver: {driverEmail}</p>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <MapPinIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTrips}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">LKR{stats.totalEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <ClockIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Distance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDistance} km</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by passenger, location, or trip ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
              >
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center">
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Trip List */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
              <thead className="bg-gray-50 dark:bg-secondary-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trip Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Duration & Distance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-800 divide-y divide-gray-200 dark:divide-secondary-700">
                {filteredTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-secondary-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {trip.id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {trip.passenger}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {trip.date} • {trip.startTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center mb-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {trip.pickupLocation}
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          {trip.destination}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {trip.duration}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {trip.distance}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        LKR{trip.fare.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {trip.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(trip.rating)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white dark:bg-secondary-800 px-4 py-3 border-t border-gray-200 dark:border-secondary-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing 1 to {filteredTrips.length} of {filteredTrips.length} results
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 dark:border-secondary-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 dark:border-secondary-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverHistory;

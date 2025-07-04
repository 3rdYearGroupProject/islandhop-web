import React, { useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedTrip, setSelectedTrip] = useState(null);

  const tripHistory = [
    {
      id: 'TR001',
      passenger: 'Sarah Johnson',
      pickupLocation: 'Colombo Airport',
      destination: 'Galle Fort',
      date: '2024-07-03',
      startTime: '14:30',
      endTime: '17:00',
      duration: '2h 30m',
      distance: '120 km',
      fare: 89.50,
      rating: 5,
      status: 'completed',
      paymentMethod: 'card',
      notes: 'Tourist pickup, requested scenic route'
    },
    {
      id: 'TR002',
      passenger: 'Michael Chen',
      pickupLocation: 'Kandy Central',
      destination: 'Nuwara Eliya',
      date: '2024-07-02',
      startTime: '09:00',
      endTime: '12:30',
      duration: '3h 30m',
      distance: '78 km',
      fare: 125.00,
      rating: 5,
      status: 'completed',
      paymentMethod: 'cash',
      notes: 'Multiple photo stops requested'
    },
    {
      id: 'TR003',
      passenger: 'Emily Davis',
      pickupLocation: 'Mount Lavinia',
      destination: 'Colombo City',
      date: '2024-07-01',
      startTime: '16:15',
      endTime: '17:45',
      duration: '1h 30m',
      distance: '25 km',
      fare: 45.00,
      rating: 4,
      status: 'completed',
      paymentMethod: 'digital',
      notes: 'Business trip, needed WiFi'
    },
    {
      id: 'TR004',
      passenger: 'James Wilson',
      pickupLocation: 'Negombo',
      destination: 'Sigiriya',
      date: '2024-06-30',
      startTime: '07:00',
      endTime: '11:30',
      duration: '4h 30m',
      distance: '145 km',
      fare: 180.00,
      rating: 5,
      status: 'completed',
      paymentMethod: 'card',
      notes: 'Early morning start, cultural tour'
    },
    {
      id: 'TR005',
      passenger: 'Lisa Thompson',
      pickupLocation: 'Ella',
      destination: 'Colombo',
      date: '2024-06-29',
      startTime: '13:00',
      endTime: '19:30',
      duration: '6h 30m',
      distance: '200 km',
      fare: 250.00,
      rating: 4,
      status: 'completed',
      paymentMethod: 'card',
      notes: 'Long distance, train station pickup'
    },
    {
      id: 'TR006',
      passenger: 'David Kumar',
      pickupLocation: 'Colombo Fort',
      destination: 'Bentota',
      date: '2024-06-28',
      startTime: '10:30',
      endTime: '12:00',
      duration: '1h 30m',
      distance: '65 km',
      fare: 75.00,
      rating: null,
      status: 'cancelled',
      paymentMethod: 'none',
      notes: 'Passenger cancelled last minute'
    }
  ];

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
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Trip History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your complete trip history and performance metrics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalEarnings}</p>
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

          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <StarIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating}</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
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
                        ${trip.fare.toFixed(2)}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedTrip(trip)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
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

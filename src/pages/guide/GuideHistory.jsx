import React, { useState, useEffect } from 'react';
import { getUserData } from '../../utils/userStorage';
import axios from 'axios';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const GuideHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedTour, setSelectedTour] = useState(null);
  const [tourHistory, setTourHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = getUserData();
  const guideEmail = userData?.email;

  useEffect(() => {
    if (guideEmail) {
      fetchTourHistory();
    }
  }, [guideEmail]);

  const fetchTourHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching tour history for guide:', guideEmail);
      
      const response = await axios.get(`http://localhost:5002/api/guides/${guideEmail}/tours`);
      console.log('Tour History API Response:', response);
      
      if (response.data.success) {
        const apiTours = response.data.data;
        
        // Transform API data to match history component structure
        const transformedTours = apiTours.map((tour, index) => ({
          id: tour.id || `TG${String(index + 1).padStart(3, '0')}`,
          tourist: tour.customerName || tour.tourist || `Customer ${index + 1}`,
          tourPackage: tour.tourName || tour.tourPackage || 'Unknown Tour',
          startLocation: tour.startLocation || 'Unknown Location',
          endLocation: tour.endLocation || 'Unknown Location',
          date: tour.date ? new Date(tour.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          startTime: tour.startTime || '09:00',
          endTime: tour.endTime || '17:00',
          duration: tour.duration || '8h 00m',
          groupSize: tour.groupSize || 1,
          earnings: tour.earnings || 0,
          rating: tour.rating || null,
          status: tour.status || 'completed',
          paymentMethod: tour.paymentMethod || 'card',
          notes: tour.notes || ''
        }));

        setTourHistory(transformedTours);
      } else {
        console.warn('API returned success: false, using empty data');
        setTourHistory([]);
      }
    } catch (err) {
      console.error('Failed to fetch tour history:', err);
      setError('Failed to load tour history. Please try again later.');
      setTourHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Tours' },
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

  const filteredTours = tourHistory.filter(tour => {
    const matchesSearch = tour.tourist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.tourPackage.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.endLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tour.status === statusFilter;
    
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
    const completedTours = tourHistory.filter(tour => tour.status === 'completed');
    const totalEarnings = completedTours.reduce((sum, tour) => sum + tour.earnings, 0);
    const totalCustomers = completedTours.reduce((sum, tour) => sum + tour.groupSize, 0);
    const averageRating = completedTours.filter(tour => tour.rating).length > 0 
      ? completedTours.filter(tour => tour.rating).reduce((sum, tour) => sum + tour.rating, 0) / completedTours.filter(tour => tour.rating).length 
      : 0;

    return {
      totalTours: completedTours.length,
      totalEarnings: totalEarnings.toFixed(2),
      totalCustomers: totalCustomers,
      averageRating: averageRating.toFixed(1)
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={fetchTourHistory}
              className="ml-auto text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tour History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your complete tour history and performance metrics
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTours}</p>
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCustomers}</p>
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
                placeholder="Search by tourist, tour package, location, or tour ID..."
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

      {/* Tour List */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
            <thead className="bg-gray-50 dark:bg-secondary-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tour Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Package & Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration & Group
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
              {filteredTours.map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-50 dark:hover:bg-secondary-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {tour.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {tour.tourist}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {tour.date} • {tour.startTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="font-medium mb-1">
                        {tour.tourPackage}
                      </div>
                      <div className="flex items-center mb-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {tour.startLocation}
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {tour.endLocation}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {tour.duration}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {tour.groupSize} customer{tour.groupSize !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      LKR{tour.earnings.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {tour.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(tour.rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tour.status)}`}>
                      {tour.status}
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
              Showing 1 to {filteredTours.length} of {filteredTours.length} results
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
  );
};

export default GuideHistory;

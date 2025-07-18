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

const GuideHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedTour, setSelectedTour] = useState(null);

  const tourHistory = [
    {
      id: 'TG001',
      tourist: 'Emily Johnson',
      tourPackage: 'Kandy Cultural Heritage Tour',
      startLocation: 'Kandy Central',
      endLocation: 'Temple of the Tooth',
      date: '2024-07-03',
      startTime: '09:00',
      endTime: '15:00',
      duration: '6h 00m',
      groupSize: 4,
      earnings: 150.00,
      rating: 5,
      status: 'completed',
      paymentMethod: 'card',
      notes: 'Family group, children interested in history'
    },
    {
      id: 'TG002',
      tourist: 'Marco Rodriguez',
      tourPackage: 'Ella Adventure Trek',
      startLocation: 'Ella Town',
      endLocation: 'Little Adams Peak',
      date: '2024-07-02',
      startTime: '06:00',
      endTime: '14:00',
      duration: '8h 00m',
      groupSize: 2,
      earnings: 180.00,
      rating: 5,
      status: 'completed',
      paymentMethod: 'cash',
      notes: 'Early morning start, photography focused'
    },
    {
      id: 'TG003',
      tourist: 'Sarah Chen',
      tourPackage: 'Colombo Food Discovery',
      startLocation: 'Colombo Fort',
      endLocation: 'Pettah Market',
      date: '2024-07-01',
      startTime: '10:00',
      endTime: '16:00',
      duration: '6h 00m',
      groupSize: 3,
      earnings: 95.00,
      rating: 4,
      status: 'completed',
      paymentMethod: 'digital',
      notes: 'Vegetarian preferences, spice sensitivity'
    },
    {
      id: 'TG004',
      tourist: 'James Wilson',
      tourPackage: 'Sigiriya Historical Tour',
      startLocation: 'Sigiriya Village',
      endLocation: 'Sigiriya Rock Fortress',
      date: '2024-06-30',
      startTime: '07:30',
      endTime: '16:30',
      duration: '9h 00m',
      groupSize: 6,
      earnings: 200.00,
      rating: 5,
      status: 'completed',
      paymentMethod: 'card',
      notes: 'Large group, multiple language requirements'
    },
    {
      id: 'TG005',
      tourist: 'Lisa Thompson',
      tourPackage: 'Galle Fort Walking Tour',
      startLocation: 'Galle Railway Station',
      endLocation: 'Galle Lighthouse',
      date: '2024-06-29',
      startTime: '14:00',
      endTime: '18:00',
      duration: '4h 00m',
      groupSize: 2,
      earnings: 120.00,
      rating: 4,
      status: 'completed',
      paymentMethod: 'card',
      notes: 'Sunset tour, photography requests'
    },
    {
      id: 'TG006',
      tourist: 'David Kumar',
      tourPackage: 'Nuwara Eliya Tea Tour',
      startLocation: 'Nuwara Eliya Town',
      endLocation: 'Pedro Tea Estate',
      date: '2024-06-28',
      startTime: '09:00',
      endTime: '13:00',
      duration: '4h 00m',
      groupSize: 5,
      earnings: 0.00,
      rating: null,
      status: 'cancelled',
      paymentMethod: 'none',
      notes: 'Weather conditions, tour rescheduled'
    }
  ];

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

  return (
    <div className="max-w-7xl mx-auto p-6">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedTour(tour)}
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

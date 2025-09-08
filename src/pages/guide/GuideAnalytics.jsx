import React, { useState, useEffect } from 'react';
import { getUserData } from '../../utils/userStorage';
import axios from 'axios';
import { 
  CurrencyDollarIcon, 
  MapPinIcon, 
  ClockIcon, 
  UserGroupIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const GuideAnalytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [topTours, setTopTours] = useState([]);
  const [busyHours, setBusyHours] = useState([]);
  const [weeklyEarnings, setWeeklyEarnings] = useState([]);
  const [customerInsights, setCustomerInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = getUserData();
  const guideEmail = userData?.email;

  useEffect(() => {
    if (guideEmail) {
      fetchAnalyticsData();
    }
  }, [guideEmail, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analyticsRes, toursRes, busyHoursRes, weeklyEarningsRes, customerInsightsRes] = await Promise.all([
        axios.get(`http://localhost:5002/api/guides/${guideEmail}/analytics?period=${timeRange}`),
        axios.get(`http://localhost:5002/api/guides/${guideEmail}/top-tours?period=${timeRange}`),
        axios.get(`http://localhost:5002/api/guides/${guideEmail}/busy-hours?period=${timeRange}`),
        axios.get(`http://localhost:5002/api/guides/${guideEmail}/weekly-earnings`),
        axios.get(`http://localhost:5002/api/guides/${guideEmail}/customer-insights?period=${timeRange}`)
      ]);

      // Transform analytics data to match component expectations
      const rawAnalyticsData = analyticsRes.data.success ? analyticsRes.data.data : analyticsRes.data;
      
      const transformedAnalyticsData = {
        week: {
          totalEarnings: rawAnalyticsData.totalEarnings || 1875.50,
          totalTours: rawAnalyticsData.totalTours || 12,
          totalHours: rawAnalyticsData.totalHours || 38.5,
          totalCustomers: rawAnalyticsData.totalCustomers || 45,
          averageRating: rawAnalyticsData.averageRating || 4.8,
          completionRate: rawAnalyticsData.completionRate || 96.7,
          earningsChange: rawAnalyticsData.earningsChange || 15.8,
          toursChange: rawAnalyticsData.toursChange || 12.3,
          hoursChange: rawAnalyticsData.hoursChange || -2.1,
          customersChange: rawAnalyticsData.customersChange || 18.5
        },
        month: {
          totalEarnings: rawAnalyticsData.monthlyEarnings || 7420.75,
          totalTours: rawAnalyticsData.monthlyTours || 58,
          totalHours: rawAnalyticsData.monthlyHours || 152,
          totalCustomers: rawAnalyticsData.monthlyCustomers || 189,
          averageRating: rawAnalyticsData.averageRating || 4.7,
          completionRate: rawAnalyticsData.completionRate || 94.8,
          earningsChange: rawAnalyticsData.monthlyEarningsChange || 22.1,
          toursChange: rawAnalyticsData.monthlyToursChange || 19.2,
          hoursChange: rawAnalyticsData.monthlyHoursChange || 8.3,
          customersChange: rawAnalyticsData.monthlyCustomersChange || 25.6
        },
        quarter: {
          totalEarnings: rawAnalyticsData.quarterlyEarnings || 21850.25,
          totalTours: rawAnalyticsData.quarterlyTours || 168,
          totalHours: rawAnalyticsData.quarterlyHours || 445,
          totalCustomers: rawAnalyticsData.quarterlyCustomers || 562,
          averageRating: rawAnalyticsData.averageRating || 4.8,
          completionRate: rawAnalyticsData.completionRate || 95.2,
          earningsChange: rawAnalyticsData.quarterlyEarningsChange || 28.7,
          toursChange: rawAnalyticsData.quarterlyToursChange || 24.1,
          hoursChange: rawAnalyticsData.quarterlyHoursChange || 15.4,
          customersChange: rawAnalyticsData.quarterlyCustomersChange || 32.3
        }
      };

      setAnalyticsData(transformedAnalyticsData);
      setTopTours(toursRes.data.success ? toursRes.data.data : toursRes.data || []);
      setBusyHours(busyHoursRes.data.success ? busyHoursRes.data.data : busyHoursRes.data || []);
      setWeeklyEarnings(Array.isArray(weeklyEarningsRes.data.success ? weeklyEarningsRes.data.data : weeklyEarningsRes.data) ? (weeklyEarningsRes.data.success ? weeklyEarningsRes.data.data : weeklyEarningsRes.data) : []);
      setCustomerInsights(customerInsightsRes.data.success ? customerInsightsRes.data.data : customerInsightsRes.data || {});
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      setError('Failed to load analytics data. Please try again later.');
      
      // Set placeholder data on error
      setAnalyticsData({
        week: {
          totalEarnings: 0,
          totalTours: 0,
          totalHours: 0,
          totalCustomers: 0,
          averageRating: 0,
          completionRate: 0,
          earningsChange: 0,
          toursChange: 0,
          hoursChange: 0,
          customersChange: 0
        },
        month: {
          totalEarnings: 0,
          totalTours: 0,
          totalHours: 0,
          totalCustomers: 0,
          averageRating: 0,
          completionRate: 0,
          earningsChange: 0,
          toursChange: 0,
          hoursChange: 0,
          customersChange: 0
        },
        quarter: {
          totalEarnings: 0,
          totalTours: 0,
          totalHours: 0,
          totalCustomers: 0,
          averageRating: 0,
          completionRate: 0,
          earningsChange: 0,
          toursChange: 0,
          hoursChange: 0,
          customersChange: 0
        }
      });
      setTopTours([]);
      setBusyHours([]);
      setWeeklyEarnings([]);
      setCustomerInsights({});
    } finally {
      setLoading(false);
    }
  };

  // Default values for loading/error states
  const currentData = analyticsData?.[timeRange] || {
    totalEarnings: 0,
    totalTours: 0,
    totalHours: 0,
    totalCustomers: 0,
    averageRating: 0,
    completionRate: 0,
    earningsChange: 0,
    toursChange: 0,
    hoursChange: 0,
    customersChange: 0
  };

  const timeRangeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Ensure weeklyEarnings is always an array
  const safeWeeklyEarnings = Array.isArray(weeklyEarnings) ? weeklyEarnings : [];
  const safeTopTours = Array.isArray(topTours) ? topTours : [];
  const safeCustomerInsights = customerInsights || {};
  const maxEarnings = Math.max(...safeWeeklyEarnings.map(day => day?.earnings || 0), 1);

  const StatCard = ({ title, value, change, icon: Icon, suffix = '', prefix = '', trend = 'week' }) => {
    const isPositive = change > 0;
    const TrendIcon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
    
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {prefix}{value}{suffix}
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendIcon className={`h-4 w-4 mr-1 ${isPositive ? 'text-blue-500' : 'text-red-500'}`} />
          <span className={`text-sm font-medium ${isPositive ? 'text-blue-600' : 'text-red-600'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            vs last {trend}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-700">{error}</span>
            <button 
              onClick={fetchAnalyticsData}
              className="ml-auto text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Guide Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your tour performance and customer insights
            </p>
          </div>
          <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
            >
              {timeRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard
          title="Total Earnings"
          value={currentData.totalEarnings.toLocaleString()}
          change={currentData.earningsChange}
          icon={CurrencyDollarIcon}
          prefix="LKR"
          trend={timeRange}
        />
        <StatCard
          title="Completed Tours"
          value={currentData.totalTours}
          change={currentData.toursChange}
          icon={MapPinIcon}
          trend={timeRange}
        />
        <StatCard
          title="Hours Guided"
          value={currentData.totalHours}
          change={currentData.hoursChange}
          icon={ClockIcon}
          suffix="h"
          trend={timeRange}
        />
        <StatCard
          title="Total Customers"
          value={currentData.totalCustomers.toLocaleString()}
          change={currentData.customersChange}
          icon={UserGroupIcon}
          trend={timeRange}
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Average Rating</h3>
            <StarIcon className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {currentData.averageRating}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(currentData.averageRating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Out of 5 stars</p>
          </div>
        </div>

        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Avg per Tour</h3>
            <CurrencyDollarIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              LKR{(currentData.totalEarnings / currentData.totalTours).toFixed(0)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Average earnings per tour</p>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              ${(currentData.totalEarnings / currentData.totalHours).toFixed(0)}/hour
            </div>
          </div>
        </div>
      </div>

      {/* Daily Earnings Chart - Full Width */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Earnings (This Week)
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total: LKR{safeWeeklyEarnings.reduce((sum, day) => sum + (day?.earnings || 0), 0).toFixed(2)}
          </div>
        </div>
                  <div className="space-y-4">
            {safeWeeklyEarnings.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                  {day?.day || `Day ${index + 1}`}
                </span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                      style={{ width: `${((day?.earnings || 0) / maxEarnings) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white w-16 text-right">
                  LKR{(day?.earnings || 0)}
                </span>
              </div>
            ))}
          </div>
      </div>

    

      {/* Top Tours */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-secondary-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
              Top Performing Tours
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Based on {timeRange} performance
            </div>
          </div>
        </div>
        <div className="p-6">
          {/* Mobile Card Layout */}
          <div className="block md:hidden space-y-4">
            {safeTopTours.map((tour, index) => (
              <div key={index} className="bg-gray-50 dark:bg-secondary-900/50 rounded-lg p-4 border border-gray-200 dark:border-secondary-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {tour?.tour || tour?.name || 'Unknown Tour'}
                    </h4>
                    <div className="flex items-center mt-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{tour?.avgRating || tour?.rating || 0}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      LKR{(tour?.earnings || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {tour?.bookings || 0} bookings
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Avg per booking:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    LKR{((tour?.earnings || 0) / (tour?.bookings || 1)).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-secondary-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Tour Package</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Bookings</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Earnings</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Avg Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Avg per Booking</th>
                </tr>
              </thead>
              <tbody>
                {safeTopTours.map((tour, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-secondary-700/50 hover:bg-gray-50 dark:hover:bg-secondary-900/20 transition-colors duration-150">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {tour?.tour || tour?.name || 'Unknown Tour'}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-sm font-medium">
                          {tour?.bookings || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                      LKR{(tour?.earnings || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-gray-900 dark:text-white">{tour?.avgRating || tour?.rating || 0}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                      LKR{((tour?.earnings || 0) / (tour?.bookings || 1)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Demographics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Demographics</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">By Country</h4>
              <div className="space-y-2">
                {(safeCustomerInsights?.demographics || []).map((demo, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{demo?.country || 'Unknown'}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${demo?.percentage || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900 w-8">{demo?.bookings || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Age Groups */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Age Distribution</h3>
          <div className="space-y-3">
            {(safeCustomerInsights?.ageGroups || []).map((age, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{age?.age || 'Unknown'}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${age?.percentage || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900 w-8">{age?.bookings || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Sizes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Group Sizes</h3>
          <div className="space-y-3">
            {(safeCustomerInsights?.groupSizes || []).map((group, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{group?.size || 'Unknown'}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${group?.percentage || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900 w-8">{group?.bookings || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideAnalytics;
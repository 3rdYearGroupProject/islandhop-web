import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const GuideAnalytics = () => {
  const [timeRange, setTimeRange] = useState('week');

  const analyticsData = {
    week: {
      totalEarnings: 1875.50,
      totalTours: 12,
      totalHours: 38.5,
      totalCustomers: 45,
      averageRating: 4.8,
      completionRate: 96.7,
      earningsChange: 15.8,
      toursChange: 12.3,
      hoursChange: -2.1,
      customersChange: 18.5
    },
    month: {
      totalEarnings: 7420.75,
      totalTours: 58,
      totalHours: 152,
      totalCustomers: 189,
      averageRating: 4.7,
      completionRate: 94.8,
      earningsChange: 22.1,
      toursChange: 19.2,
      hoursChange: 8.3,
      customersChange: 25.6
    },
    quarter: {
      totalEarnings: 21850.25,
      totalTours: 168,
      totalHours: 445,
      totalCustomers: 562,
      averageRating: 4.8,
      completionRate: 95.2,
      earningsChange: 28.7,
      toursChange: 24.1,
      hoursChange: 15.4,
      customersChange: 32.3
    }
  };

  const currentData = analyticsData[timeRange];

  const topTours = [
    { tour: 'Kandy Cultural Heritage Tour', bookings: 32, earnings: 4800.00, avgRating: 4.9 },
    { tour: 'Ella Adventure Trek', bookings: 28, earnings: 5040.00, avgRating: 4.8 },
    { tour: 'Sigiriya Historical Tour', bookings: 22, earnings: 4400.00, avgRating: 4.9 },
    { tour: 'Colombo Food Discovery', bookings: 18, earnings: 1710.00, avgRating: 4.6 },
    { tour: 'Galle Fort Walking Tour', bookings: 15, earnings: 2250.00, avgRating: 4.7 }
  ];

  const busyHours = [
    { hour: '6-7 AM', tours: 3, percentage: 15 },
    { hour: '7-8 AM', tours: 5, percentage: 25 },
    { hour: '8-9 AM', tours: 8, percentage: 40 },
    { hour: '9-10 AM', tours: 6, percentage: 30 },
    { hour: '2-3 PM', tours: 4, percentage: 20 },
    { hour: '3-4 PM', tours: 7, percentage: 35 }
  ];

  const weeklyEarnings = [
    { day: 'Mon', earnings: 285.50 },
    { day: 'Tue', earnings: 320.25 },
    { day: 'Wed', earnings: 195.75 },
    { day: 'Thu', earnings: 455.50 },
    { day: 'Fri', earnings: 289.25 },
    { day: 'Sat', earnings: 202.50 },
    { day: 'Sun', earnings: 126.75 }
  ];

  const timeRangeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  const customerInsights = {
    demographics: [
      { country: 'United States', bookings: 28, percentage: 31 },
      { country: 'United Kingdom', bookings: 18, percentage: 20 },
      { country: 'Australia', bookings: 15, percentage: 17 },
      { country: 'Germany', bookings: 12, percentage: 13 },
      { country: 'Canada', bookings: 10, percentage: 11 },
      { country: 'Others', bookings: 6, percentage: 8 }
    ],
    ageGroups: [
      { age: '18-25', bookings: 15, percentage: 17 },
      { age: '26-35', bookings: 32, percentage: 36 },
      { age: '36-45', bookings: 24, percentage: 27 },
      { age: '46-55', bookings: 12, percentage: 13 },
      { age: '55+', bookings: 6, percentage: 7 }
    ],
    groupSizes: [
      { size: 'Solo (1)', bookings: 8, percentage: 9 },
      { size: 'Couple (2)', bookings: 45, percentage: 51 },
      { size: 'Small Group (3-4)', bookings: 28, percentage: 31 },
      { size: 'Large Group (5+)', bookings: 8, percentage: 9 }
    ]
  };

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

  const maxEarnings = Math.max(...weeklyEarnings.map(day => day.earnings));

  return (
    <div className="max-w-7xl mx-auto p-6">
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
          prefix="$"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completion Rate</h3>
            <ChartBarIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {currentData.completionRate}%
            </div>
            <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${currentData.completionRate}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tour completion rate</p>
          </div>
        </div>

        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Avg per Tour</h3>
            <CurrencyDollarIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              ${(currentData.totalEarnings / currentData.totalTours).toFixed(0)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Average earnings per tour</p>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              ${(currentData.totalEarnings / currentData.totalHours).toFixed(0)}/hour
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
        {/* Weekly Earnings Chart */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Daily Earnings (This Week)
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total: ${weeklyEarnings.reduce((sum, day) => sum + day.earnings, 0).toFixed(2)}
            </div>
          </div>
          <div className="space-y-4">
            {weeklyEarnings.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                  {day.day}
                </span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                      style={{ width: `${(day.earnings / maxEarnings) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white w-16 text-right">
                  ${day.earnings}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Peak Hours Analysis
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Best: {busyHours.reduce((max, hour) => hour.tours > max.tours ? hour : max).hour}
            </div>
          </div>
          <div className="space-y-4">
            {busyHours.map((hour, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">
                  {hour.hour}
                </span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${hour.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white w-12 text-right">
                  {hour.tours}
                </span>
              </div>
            ))}
          </div>
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
            {topTours.map((tour, index) => (
              <div key={index} className="bg-gray-50 dark:bg-secondary-900/50 rounded-lg p-4 border border-gray-200 dark:border-secondary-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {tour.tour}
                    </h4>
                    <div className="flex items-center mt-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{tour.avgRating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      ${tour.earnings.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {tour.bookings} bookings
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Avg per booking:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${(tour.earnings / tour.bookings).toFixed(2)}
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
                {topTours.map((tour, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-secondary-700/50 hover:bg-gray-50 dark:hover:bg-secondary-900/20 transition-colors duration-150">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {tour.tour}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-sm font-medium">
                          {tour.bookings}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                      ${tour.earnings.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-gray-900 dark:text-white">{tour.avgRating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                      ${(tour.earnings / tour.bookings).toFixed(2)}
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
                {customerInsights.demographics.map((demo, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{demo.country}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${demo.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900 w-8">{demo.bookings}</span>
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
            {customerInsights.ageGroups.map((age, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{age.age}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${age.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900 w-8">{age.bookings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Sizes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Group Sizes</h3>
          <div className="space-y-3">
            {customerInsights.groupSizes.map((group, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{group.size}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${group.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900 w-8">{group.bookings}</span>
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
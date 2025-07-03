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

const DriverAnalytics = () => {
  const [timeRange, setTimeRange] = useState('week');

  const analyticsData = {
    week: {
      totalEarnings: 1240.75,
      totalTrips: 28,
      totalHours: 45.5,
      totalDistance: 890,
      averageRating: 4.8,
      completionRate: 94.2,
      earningsChange: 12.5,
      tripsChange: 8.3,
      hoursChange: -5.2,
      distanceChange: 15.1
    },
    month: {
      totalEarnings: 4820.25,
      totalTrips: 127,
      totalHours: 180,
      totalDistance: 3560,
      averageRating: 4.7,
      completionRate: 92.8,
      earningsChange: 18.7,
      tripsChange: 15.2,
      hoursChange: 3.8,
      distanceChange: 22.3
    },
    quarter: {
      totalEarnings: 14250.50,
      totalTrips: 385,
      totalHours: 520,
      totalDistance: 10680,
      averageRating: 4.8,
      completionRate: 93.5,
      earningsChange: 22.1,
      tripsChange: 19.4,
      hoursChange: 8.7,
      distanceChange: 25.6
    }
  };

  const currentData = analyticsData[timeRange];

  const topRoutes = [
    { route: 'Colombo Airport → Galle', trips: 12, earnings: 1068.00, avgRating: 4.9 },
    { route: 'Kandy → Nuwara Eliya', trips: 8, earnings: 1000.00, avgRating: 4.8 },
    { route: 'Negombo → Sigiriya', trips: 6, earnings: 1080.00, avgRating: 4.7 },
    { route: 'Colombo City → Mount Lavinia', trips: 15, earnings: 675.00, avgRating: 4.6 },
    { route: 'Ella → Colombo', trips: 4, earnings: 1000.00, avgRating: 4.9 }
  ];

  const busyHours = [
    { hour: '6-7 AM', trips: 5, percentage: 18 },
    { hour: '7-8 AM', trips: 8, percentage: 29 },
    { hour: '8-9 AM', trips: 6, percentage: 21 },
    { hour: '12-1 PM', trips: 4, percentage: 14 },
    { hour: '5-6 PM', trips: 7, percentage: 25 },
    { hour: '6-7 PM', trips: 5, percentage: 18 }
  ];

  const weeklyEarnings = [
    { day: 'Mon', earnings: 185.50 },
    { day: 'Tue', earnings: 220.75 },
    { day: 'Wed', earnings: 165.25 },
    { day: 'Thu', earnings: 195.00 },
    { day: 'Fri', earnings: 245.50 },
    { day: 'Sat', earnings: 128.75 },
    { day: 'Sun', earnings: 100.00 }
  ];

  const timeRangeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  const StatCard = ({ title, value, change, icon: Icon, suffix = '', prefix = '' }) => {
    const isPositive = change > 0;
    const TrendIcon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
    
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {prefix}{value}{suffix}
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendIcon className={`h-4 w-4 mr-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            vs last {timeRange}
          </span>
        </div>
      </div>
    );
  };

  const maxEarnings = Math.max(...weeklyEarnings.map(day => day.earnings));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your performance and earnings trends
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Earnings"
            value={currentData.totalEarnings.toLocaleString()}
            change={currentData.earningsChange}
            icon={CurrencyDollarIcon}
            prefix="$"
          />
          <StatCard
            title="Completed Trips"
            value={currentData.totalTrips}
            change={currentData.tripsChange}
            icon={MapPinIcon}
          />
          <StatCard
            title="Hours Worked"
            value={currentData.totalHours}
            change={currentData.hoursChange}
            icon={ClockIcon}
            suffix="h"
          />
          <StatCard
            title="Distance Covered"
            value={currentData.totalDistance.toLocaleString()}
            change={currentData.distanceChange}
            icon={ChartBarIcon}
            suffix=" km"
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Average Rating</h3>
              <StarIcon className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {currentData.averageRating}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-6 w-6 ${
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

          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completion Rate</h3>
              <UserGroupIcon className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {currentData.completionRate}%
              </div>
              <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentData.completionRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Trip completion rate</p>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Avg per Trip</h3>
              <CurrencyDollarIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                ${(currentData.totalEarnings / currentData.totalTrips).toFixed(0)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average earnings per trip</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Earnings Chart */}
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Daily Earnings (This Week)
            </h3>
            <div className="space-y-4">
              {weeklyEarnings.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                    {day.day}
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.earnings / maxEarnings) * 100}%` }}
                      ></div>
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
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Peak Hours Analysis
            </h3>
            <div className="space-y-4">
              {busyHours.map((hour, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">
                    {hour.hour}
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${hour.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white w-12 text-right">
                    {hour.trips}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Routes */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-secondary-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Performing Routes
            </h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-secondary-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Route</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Trips</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Earnings</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Avg Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Avg per Trip</th>
                  </tr>
                </thead>
                <tbody>
                  {topRoutes.map((route, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-secondary-700/50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {route.route}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        {route.trips}
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                        ${route.earnings.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-gray-900 dark:text-white">{route.avgRating}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                        ${(route.earnings / route.trips).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAnalytics;

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Star,
  Calendar,
  Download,
  Filter,
  Eye,
  MapPin,
  Clock,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  PieChart
} from 'lucide-react';

const GuideAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('bookings');

  const analyticsData = {
    overview: {
      totalBookings: 89,
      totalEarnings: 14250.75,
      averageRating: 4.8,
      repeatCustomers: 23,
      bookingChange: 18.5,
      earningsChange: 25.3,
      ratingChange: 0.2,
      customerChange: 12.8
    },
    
    monthlyBookings: [
      { month: 'Jan', bookings: 12, earnings: 1890 },
      { month: 'Feb', bookings: 15, earnings: 2340 },
      { month: 'Mar', bookings: 18, earnings: 2850 },
      { month: 'Apr', bookings: 22, earnings: 3420 },
      { month: 'May', bookings: 20, earnings: 3150 },
      { month: 'Jun', bookings: 25, earnings: 3920 },
      { month: 'Jul', bookings: 28, earnings: 4380 },
      { month: 'Aug', bookings: 30, earnings: 4710 },
      { month: 'Sep', bookings: 26, earnings: 4080 },
      { month: 'Oct', bookings: 24, earnings: 3780 },
      { month: 'Nov', bookings: 27, earnings: 4230 },
      { month: 'Dec', bookings: 22, earnings: 3450 }
    ],

    tourPerformance: [
      {
        name: 'Kandy Cultural Heritage Tour',
        bookings: 32,
        revenue: 4800,
        avgRating: 4.9,
        conversionRate: 78,
        color: 'bg-blue-500'
      },
      {
        name: 'Ella Adventure Trek',
        bookings: 28,
        revenue: 5040,
        avgRating: 4.8,
        conversionRate: 82,
        color: 'bg-green-500'
      },
      {
        name: 'Colombo Food Discovery',
        bookings: 18,
        revenue: 1710,
        avgRating: 4.6,
        conversionRate: 65,
        color: 'bg-purple-500'
      },
      {
        name: 'Sigiriya Historical Tour',
        bookings: 11,
        revenue: 2200,
        avgRating: 4.9,
        conversionRate: 88,
        color: 'bg-orange-500'
      }
    ],

    customerInsights: {
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
    },

    ratingTrends: [
      { month: 'Jan', rating: 4.6 },
      { month: 'Feb', rating: 4.7 },
      { month: 'Mar', rating: 4.8 },
      { month: 'Apr', rating: 4.7 },
      { month: 'May', rating: 4.8 },
      { month: 'Jun', rating: 4.9 },
      { month: 'Jul', rating: 4.8 },
      { month: 'Aug', rating: 4.9 },
      { month: 'Sep', rating: 4.8 },
      { month: 'Oct', rating: 4.8 },
      { month: 'Nov', rating: 4.9 },
      { month: 'Dec', rating: 4.8 }
    ],

    peakHours: [
      { hour: '06:00', bookings: 5 },
      { hour: '07:00', bookings: 12 },
      { hour: '08:00', bookings: 18 },
      { hour: '09:00', bookings: 25 },
      { hour: '10:00', bookings: 15 },
      { hour: '11:00', bookings: 8 },
      { hour: '12:00', bookings: 6 },
      { hour: '13:00', bookings: 4 },
      { hour: '14:00', bookings: 8 },
      { hour: '15:00', bookings: 12 },
      { hour: '16:00', bookings: 10 },
      { hour: '17:00', bookings: 6 }
    ]
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />;
  };

  const maxBookings = Math.max(...analyticsData.monthlyBookings.map(m => m.bookings));
  const maxEarnings = Math.max(...analyticsData.monthlyBookings.map(m => m.earnings));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Track your performance and insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className={`flex items-center text-sm ${getChangeColor(analyticsData.overview.bookingChange)}`}>
                {getChangeIcon(analyticsData.overview.bookingChange)}
                <span className="ml-1">{Math.abs(analyticsData.overview.bookingChange)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalBookings}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className={`flex items-center text-sm ${getChangeColor(analyticsData.overview.earningsChange)}`}>
                {getChangeIcon(analyticsData.overview.earningsChange)}
                <span className="ml-1">{Math.abs(analyticsData.overview.earningsChange)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${analyticsData.overview.totalEarnings.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className={`flex items-center text-sm ${getChangeColor(analyticsData.overview.ratingChange)}`}>
                {getChangeIcon(analyticsData.overview.ratingChange)}
                <span className="ml-1">{Math.abs(analyticsData.overview.ratingChange)}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.averageRating}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className={`flex items-center text-sm ${getChangeColor(analyticsData.overview.customerChange)}`}>
                {getChangeIcon(analyticsData.overview.customerChange)}
                <span className="ml-1">{Math.abs(analyticsData.overview.customerChange)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Repeat Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.repeatCustomers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bookings & Earnings Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-gray-600">Bookings</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-gray-600">Earnings ($)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {analyticsData.monthlyBookings.map((month, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-600 w-8">{month.month}</span>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(month.bookings / maxBookings) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{month.bookings}</span>
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(month.earnings / maxEarnings) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">${month.earnings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Rating Trends</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span>Monthly Average</span>
            </div>
          </div>
          
          <div className="flex items-end justify-between h-48">
            {analyticsData.ratingTrends.map((month, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="flex items-end h-32 mb-2">
                  <div 
                    className="bg-yellow-500 rounded-t-lg w-6 min-h-4 transition-all duration-300 hover:bg-yellow-600"
                    style={{ height: `${(month.rating / 5) * 100}%` }}
                    title={`${month.rating} stars`}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{month.month}</span>
                <span className="text-xs font-medium text-gray-900">{month.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tour Performance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Tour Package Performance</h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">All Packages</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Package</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Bookings</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Revenue</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Avg Rating</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Conversion</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analyticsData.tourPerformance.map((tour, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 ${tour.color} rounded mr-3`}></div>
                      <span className="font-medium text-gray-900">{tour.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">{tour.bookings}</td>
                  <td className="py-4 text-gray-600">${tour.revenue.toLocaleString()}</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-gray-900">{tour.avgRating}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">{tour.conversionRate}%</td>
                  <td className="py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${tour.color}`}
                        style={{ width: `${tour.conversionRate}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Customer Demographics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Demographics</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">By Country</h4>
              <div className="space-y-2">
                {analyticsData.customerInsights.demographics.map((demo, index) => (
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
            {analyticsData.customerInsights.ageGroups.map((age, index) => (
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
            {analyticsData.customerInsights.groupSizes.map((group, index) => (
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

      {/* Peak Hours */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Peak Booking Hours</h3>
          <div className="text-sm text-gray-600">
            Optimal times for tour scheduling
          </div>
        </div>
        
        <div className="flex items-end justify-between h-40">
          {analyticsData.peakHours.map((hour, index) => {
            const maxHourBookings = Math.max(...analyticsData.peakHours.map(h => h.bookings));
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="flex items-end h-24 mb-2">
                  <div 
                    className="bg-indigo-500 rounded-t-lg w-4 min-h-2 transition-all duration-300 hover:bg-indigo-600"
                    style={{ height: `${(hour.bookings / maxHourBookings) * 100}%` }}
                    title={`${hour.bookings} bookings`}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 transform -rotate-45 mt-2">{hour.hour}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GuideAnalytics;
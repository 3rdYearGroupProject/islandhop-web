import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock,
  Car,
  MapPin,
  Download,
  Filter,
  BarChart3,
  PieChart,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const DriverEarnings = () => {
  const [timeFilter, setTimeFilter] = useState('week'); // week, month, year
  const [viewType, setViewType] = useState('overview'); // overview, detailed, analytics

  const earningsData = {
    week: {
      total: 1245.75,
      trips: 23,
      change: 12.5,
      daily: [
        { day: 'Mon', earnings: 185.50, trips: 4 },
        { day: 'Tue', earnings: 220.25, trips: 5 },
        { day: 'Wed', earnings: 195.75, trips: 3 },
        { day: 'Thu', earnings: 255.50, trips: 6 },
        { day: 'Fri', earnings: 189.25, trips: 3 },
        { day: 'Sat', earnings: 102.50, trips: 1 },
        { day: 'Sun', earnings: 97.00, trips: 1 }
      ]
    },
    month: {
      total: 4820.25,
      trips: 127,
      change: 8.3,
      weekly: [
        { week: 'Week 1', earnings: 1245.75, trips: 23 },
        { week: 'Week 2', earnings: 1320.50, trips: 28 },
        { week: 'Week 3', earnings: 1180.25, trips: 31 },
        { week: 'Week 4', earnings: 1073.75, trips: 45 }
      ]
    }
  };

  const recentTransactions = [
    {
      id: 'TR001',
      tripName: 'Airport Express',
      passenger: 'Sarah Johnson',
      route: 'Colombo → Galle',
      amount: 89.50,
      tip: 5.00,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
      paymentMethod: 'card'
    },
    {
      id: 'TR002',
      tripName: 'Hill Country Tour',
      passenger: 'Michael Chen',
      route: 'Kandy → Nuwara Eliya',
      amount: 95.00,
      tip: 0,
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'completed',
      paymentMethod: 'cash'
    },
    {
      id: 'TR003',
      tripName: 'City Return',
      passenger: 'Emma Wilson',
      route: 'Ella → Colombo',
      amount: 180.00,
      tip: 15.00,
      date: new Date(Date.now() - 8 * 60 * 60 * 1000),
      status: 'completed',
      paymentMethod: 'card'
    },
    {
      id: 'TR004',
      tripName: 'Heritage Sites',
      passenger: 'David Kumar',
      route: 'Sigiriya → Dambulla',
      amount: 35.00,
      tip: 5.00,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed',
      paymentMethod: 'cash'
    }
  ];

  const currentData = earningsData[timeFilter];
  const averagePerTrip = currentData.total / currentData.trips;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-600 mt-1">Track your income and financial performance</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { key: 'week', label: 'Week' },
                { key: 'month', label: 'Month' },
              ].map(option => (
                <button
                  key={option.key}
                  onClick={() => setTimeFilter(option.key)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    timeFilter === option.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentData.total)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {currentData.change > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              currentData.change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentData.change > 0 ? '+' : ''}{currentData.change}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last {timeFilter}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Trips</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.trips}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-500">
              {timeFilter === 'week' ? 'trips this week' : timeFilter === 'month' ? 'trips this month' : 'trips this year'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg per Trip</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averagePerTrip)}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">+5.2%</span>
            <span className="text-sm text-gray-500 ml-1">vs last {timeFilter}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(823.45)}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Wallet className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Withdraw funds →
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earnings Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {timeFilter === 'week' ? 'Daily' : 'Weekly'} Earnings
            </h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <BarChart3 className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <PieChart className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {(timeFilter === 'week' ? currentData.daily : currentData.weekly).map((item, index) => {
              const maxEarnings = Math.max(...(timeFilter === 'week' ? currentData.daily : currentData.weekly).map(d => d.earnings));
              const widthPercentage = (item.earnings / maxEarnings) * 100;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 w-20">
                    <span className="text-sm font-medium text-gray-700">
                      {timeFilter === 'week' ? item.day : item.week}
                    </span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-100 rounded-full h-3 relative">
                      <div 
                        className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${widthPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right w-20">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.earnings)}
                    </span>
                    <div className="text-xs text-gray-500">
                      {item.trips} trip{item.trips !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Banking Details & Payouts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Banking Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name
              </label>
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="">Select Bank</option>
                <option value="BOC">Bank of Ceylon</option>
                <option value="PB">People's Bank</option>
                <option value="COM">Commercial Bank</option>
                <option value="HNB">Hatton National Bank</option>
                <option value="SDB">Sanasa Development Bank</option>
                <option value="NSB">National Savings Bank</option>
                <option value="DFCC">DFCC Bank</option>
                <option value="NDB">National Development Bank</option>
                <option value="UBL">Union Bank</option>
                <option value="SLB">Seylan Bank</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <input 
                type="text" 
                placeholder="1234567890"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Code
              </label>
              <input 
                type="text" 
                placeholder="123"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name
              </label>
              <input 
                type="text" 
                placeholder="Colombo Main Branch"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="pt-4">
              <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Save Banking Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverEarnings;

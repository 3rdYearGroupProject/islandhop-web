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
      currency: 'USD'
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
                { key: 'year', label: 'Year' }
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

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </button>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Car className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{transaction.passenger}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {transaction.route}
                    </div>
                    <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </span>
                    {transaction.tip > 0 && (
                      <span className="ml-1 text-sm text-green-600">
                        +{formatCurrency(transaction.tip)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    {transaction.paymentMethod === 'card' ? (
                      <CreditCard className="h-3 w-3 mr-1" />
                    ) : (
                      <DollarSign className="h-3 w-3 mr-1" />
                    )}
                    {transaction.paymentMethod}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods & Payouts */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Bank Account</h3>
                  <p className="text-sm text-gray-500">****1234 • Primary</p>
                </div>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Edit
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg border-dashed">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Add Payment Method</h3>
                  <p className="text-sm text-gray-500">Bank account or mobile wallet</p>
                </div>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payout Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Automatic Payout
              </label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Automatically transfer earnings to your bank account
                </span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payout Frequency
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Balance
              </label>
              <input 
                type="number" 
                placeholder="50.00"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum balance before automatic payout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverEarnings;

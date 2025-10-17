
import React, { useState, useEffect } from 'react';
import { getUserData } from '../../utils/userStorage';
import axios from 'axios';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock,
  Users,
  MapPin,
  Download,
  Filter,
  BarChart3,
  PieChart,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  GraduationCap,
  AlertTriangle
} from 'lucide-react';

const GuideEarnings = () => {
  const [timeFilter, setTimeFilter] = useState('week'); // week, month, year
  const [viewType, setViewType] = useState('overview'); // overview, detailed, analytics
  const [earningsData, setEarningsData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = getUserData();
  const guideEmail = userData?.email;

  useEffect(() => {
    if (guideEmail) {
      fetchEarningsData();
    }
  }, [guideEmail, timeFilter]);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [earningsRes, transactionsRes] = await Promise.all([
        axios.get(`http://localhost:5002/api/guides/${guideEmail}/earnings?period=${timeFilter}`),
        axios.get(`http://localhost:5002/api/guides/${guideEmail}/transactions?limit=10`)
      ]);

      // Transform earnings data to match component expectations
      const rawEarningsData = earningsRes.data.success ? earningsRes.data.data : earningsRes.data;
      
      // Create mock daily/weekly data since API doesn't provide breakdown
      const mockDailyData = [
        { day: 'Mon', earnings: rawEarningsData.todayEarnings || 285, tours: 2 },
        { day: 'Tue', earnings: (rawEarningsData.weeklyEarnings || 1875) * 0.17, tours: 2 },
        { day: 'Wed', earnings: (rawEarningsData.weeklyEarnings || 1875) * 0.10, tours: 1 },
        { day: 'Thu', earnings: (rawEarningsData.weeklyEarnings || 1875) * 0.24, tours: 3 },
        { day: 'Fri', earnings: (rawEarningsData.weeklyEarnings || 1875) * 0.15, tours: 2 },
        { day: 'Sat', earnings: (rawEarningsData.weeklyEarnings || 1875) * 0.11, tours: 1 },
        { day: 'Sun', earnings: (rawEarningsData.weeklyEarnings || 1875) * 0.07, tours: 1 }
      ];

      const mockWeeklyData = [
        { week: 'Week 1', earnings: (rawEarningsData.monthlyEarnings || 7420) * 0.25, tours: 12 },
        { week: 'Week 2', earnings: (rawEarningsData.monthlyEarnings || 7420) * 0.29, tours: 16 },
        { week: 'Week 3', earnings: (rawEarningsData.monthlyEarnings || 7420) * 0.23, tours: 14 },
        { week: 'Week 4', earnings: (rawEarningsData.monthlyEarnings || 7420) * 0.23, tours: 16 }
      ];

      const transformedEarningsData = {
        week: {
          total: rawEarningsData.totalEarnings || rawEarningsData.weeklyEarnings || 18750.50,
          tours: 12, // Mock data since API doesn't provide
          change: rawEarningsData.weeklyChange || 15.8,
          daily: mockDailyData
        },
        month: {
          total: rawEarningsData.monthlyEarnings || 74200.75,
          tours: 58, // Mock data since API doesn't provide
          change: rawEarningsData.monthlyChange || 12.7,
          weekly: mockWeeklyData
        }
      };

      setEarningsData(transformedEarningsData);
      setRecentTransactions(transactionsRes.data.success ? transactionsRes.data.data : transactionsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch earnings data:', err);
      setError('Failed to load earnings data. Please try again later.');
      
      // Set placeholder data
      setEarningsData({
        week: {
          total: 0,
          tours: 0,
          change: 0,
          daily: []
        },
        month: {
          total: 0,
          tours: 0,
          change: 0,
          weekly: []
        }
      });
      setRecentTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const currentData = earningsData?.[timeFilter] || {
    total: 0,
    tours: 0,
    change: 0,
    daily: [],
    weekly: []
  };
  const averagePerTour = currentData.total / currentData.tours;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
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

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={fetchEarningsData}
              className="ml-auto text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

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
                { key: 'month', label: 'Month' }
                
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
              <p className="text-sm font-medium text-gray-600">Completed Tours</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.tours}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-500">
              {timeFilter === 'week' ? 'tours this week' : timeFilter === 'month' ? 'tours this month' : 'tours this year'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg per Tour</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averagePerTour)}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">+7.8%</span>
            <span className="text-sm text-gray-500 ml-1">vs last {timeFilter}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(1245.80)}</p>
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
            {(timeFilter === 'week' ? (currentData.daily || []) : (currentData.weekly || [])).map((item, index) => {
              const maxEarnings = Math.max(...(timeFilter === 'week' ? (currentData.daily || []) : (currentData.weekly || [])).map(d => d.earnings || 0), 1);
              const widthPercentage = ((item.earnings || 0) / maxEarnings) * 100;
              
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
                      {formatCurrency(item.earnings || 0)}
                    </span>
                    <div className="text-xs text-gray-500">
                      {item.tours || 0} tour{(item.tours || 0) !== 1 ? 's' : ''}
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

export default GuideEarnings;

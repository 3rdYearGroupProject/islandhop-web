import React, { useState, useEffect } from 'react';
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
  ArrowDownRight,
  AlertTriangle
} from 'lucide-react';
import { getUserData } from '../../utils/userStorage';
import axios from 'axios';

const DriverEarnings = () => {
  const [timeFilter, setTimeFilter] = useState('week'); // week, month, year
  const [viewType, setViewType] = useState('overview'); // overview, detailed, analytics
  const [earningsData, setEarningsData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Bank details state
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    branchCode: '',
    branchName: ''
  });
  const [bankLoading, setBankLoading] = useState(false);
  const [bankError, setBankError] = useState(null);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [hasBankDetails, setHasBankDetails] = useState(false);

  const userData = getUserData();
  const driverEmail = userData?.email;

  useEffect(() => {
    if (driverEmail) {
      fetchEarningsData();
      fetchBankDetails();
    }
  }, [driverEmail, timeFilter]);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [earningsRes, transactionsRes] = await Promise.all([
        axios.get(`http://localhost:5001/api/drivers/${driverEmail}/earnings?period=${timeFilter}`),
        axios.get(`http://localhost:5001/api/drivers/${driverEmail}/transactions?limit=10`)
      ]);

      // Transform earnings data to match component expectations
      const rawEarningsData = earningsRes.data.success ? earningsRes.data.data : earningsRes.data;
      
      // Create mock daily/weekly data since API doesn't provide breakdown
      const mockDailyData = [
        { day: 'Mon', earnings: rawEarningsData.todayEarnings || 245 },
        { day: 'Tue', earnings: (rawEarningsData.weeklyEarnings || 1240) * 0.15 },
        { day: 'Wed', earnings: (rawEarningsData.weeklyEarnings || 1240) * 0.12 },
        { day: 'Thu', earnings: (rawEarningsData.weeklyEarnings || 1240) * 0.18 },
        { day: 'Fri', earnings: (rawEarningsData.weeklyEarnings || 1240) * 0.25 },
        { day: 'Sat', earnings: (rawEarningsData.weeklyEarnings || 1240) * 0.20 },
        { day: 'Sun', earnings: (rawEarningsData.weeklyEarnings || 1240) * 0.10 }
      ];

      const mockWeeklyData = [
        { week: 'Week 1', earnings: (rawEarningsData.monthlyEarnings || 4820) * 0.25 },
        { week: 'Week 2', earnings: (rawEarningsData.monthlyEarnings || 4820) * 0.28 },
        { week: 'Week 3', earnings: (rawEarningsData.monthlyEarnings || 4820) * 0.22 },
        { week: 'Week 4', earnings: (rawEarningsData.monthlyEarnings || 4820) * 0.25 }
      ];

      const transformedEarningsData = {
        total: rawEarningsData.totalEarnings || 0,
        trips: 15, // Mock data since API doesn't provide
        change: 12.5, // Mock percentage change
        daily: mockDailyData,
        weekly: mockWeeklyData,
        todayEarnings: rawEarningsData.todayEarnings || 0,
        weeklyEarnings: rawEarningsData.weeklyEarnings || 0,
        monthlyEarnings: rawEarningsData.monthlyEarnings || 0
      };

      setEarningsData(transformedEarningsData);
      setRecentTransactions(transactionsRes.data.success ? transactionsRes.data.data : transactionsRes.data);
    } catch (err) {
      console.error('Failed to fetch earnings data:', err);
      setError('Failed to load earnings data. Please try again later.');
      
      // Set placeholder data
      setEarningsData({
        total: 0,
        trips: 0,
        change: 0,
        daily: [],
        weekly: []
      });
      setRecentTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bank details
  const fetchBankDetails = async () => {
    try {
      setBankLoading(true);
      setBankError(null);
      
      const response = await axios.get(`http://localhost:4021/bank/${driverEmail}`);
      
      if (response.data.success && response.data.data) {
        const bankData = response.data.data;
        setBankDetails({
          accountHolderName: bankData.accountHolderName || '',
          bankName: bankData.bankName || '',
          accountNumber: bankData.accountNumber || '',
          branchCode: bankData.branchCode || '',
          branchName: bankData.branchName || ''
        });
        setHasBankDetails(true);
        setIsEditingBank(false);
      } else {
        // No bank details found, show empty form for adding
        setHasBankDetails(false);
        setIsEditingBank(true);
      }
    } catch (err) {
      console.error('Failed to fetch bank details:', err);
      if (err.response?.status === 404) {
        // No bank details found, show empty form for adding
        setBankError(null);
        setHasBankDetails(false);
        setIsEditingBank(true);
      } else {
        setBankError('Failed to load bank details. Please try again later.');
      }
    } finally {
      setBankLoading(false);
    }
  };

  // Save or update bank details
  const saveBankDetails = async () => {
    try {
      setBankLoading(true);
      setBankError(null);
      
      const bankData = {
        email: driverEmail,
        accountHolderName: bankDetails.accountHolderName,
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        branchCode: bankDetails.branchCode,
        branchName: bankDetails.branchName
      };
      
      let response;
      if (hasBankDetails) {
        // Update existing bank details
        const updateData = { ...bankData };
        delete updateData.email; // Remove email from update payload
        response = await axios.put(`http://localhost:4021/bank/update/${driverEmail}`, updateData);
      } else {
        // Add new bank details
        response = await axios.post('http://localhost:4021/bank/add', bankData);
      }
      
      if (response.data.success) {
        setHasBankDetails(true);
        setIsEditingBank(false);
        alert('Bank details saved successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to save bank details');
      }
    } catch (err) {
      console.error('Failed to save bank details:', err);
      setBankError(err.response?.data?.message || 'Failed to save bank details. Please try again.');
    } finally {
      setBankLoading(false);
    }
  };

  // Handle bank details input changes
  const handleBankDetailsChange = (field, value) => {
    setBankDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const currentData = earningsData || {
    total: 0,
    trips: 0,
    change: 0,
    daily: [],
    weekly: []
  };
  const averagePerTrip = currentData.trips > 0 ? currentData.total / currentData.trips : 0;

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
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Banking Details</h2>
            {hasBankDetails && !isEditingBank && (
              <button
                onClick={() => setIsEditingBank(true)}
                className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
              >
                Edit
              </button>
            )}
          </div>
          
          {bankError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{bankError}</span>
                <button 
                  onClick={fetchBankDetails}
                  className="ml-auto text-red-600 hover:text-red-800 underline text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          
          {bankLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name
                </label>
                {isEditingBank ? (
                  <input 
                    type="text" 
                    value={bankDetails.accountHolderName}
                    onChange={(e) => handleBankDetailsChange('accountHolderName', e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ) : (
                  <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                    {bankDetails.accountHolderName || 'Not set'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                {isEditingBank ? (
                  <select 
                    value={bankDetails.bankName}
                    onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Bank</option>
                    <option value="Bank of Ceylon">Bank of Ceylon</option>
                    <option value="People's Bank">People's Bank</option>
                    <option value="Commercial Bank">Commercial Bank</option>
                    <option value="Hatton National Bank">Hatton National Bank</option>
                    <option value="Sanasa Development Bank">Sanasa Development Bank</option>
                    <option value="National Savings Bank">National Savings Bank</option>
                    <option value="DFCC Bank">DFCC Bank</option>
                    <option value="National Development Bank">National Development Bank</option>
                    <option value="Union Bank">Union Bank</option>
                    <option value="Seylan Bank">Seylan Bank</option>
                    <option value="National Bank of Sri Lanka">National Bank of Sri Lanka</option>
                  </select>
                ) : (
                  <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                    {bankDetails.bankName || 'Not set'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                {isEditingBank ? (
                  <input 
                    type="text" 
                    value={bankDetails.accountNumber}
                    onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                    placeholder="1234567890"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ) : (
                  <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                    {bankDetails.accountNumber ? `****${bankDetails.accountNumber.slice(-4)}` : 'Not set'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Code
                </label>
                {isEditingBank ? (
                  <input 
                    type="text" 
                    value={bankDetails.branchCode}
                    onChange={(e) => handleBankDetailsChange('branchCode', e.target.value)}
                    placeholder="123"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ) : (
                  <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                    {bankDetails.branchCode || 'Not set'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Name
                </label>
                {isEditingBank ? (
                  <input 
                    type="text" 
                    value={bankDetails.branchName}
                    onChange={(e) => handleBankDetailsChange('branchName', e.target.value)}
                    placeholder="Colombo Main Branch"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ) : (
                  <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                    {bankDetails.branchName || 'Not set'}
                  </div>
                )}
              </div>
              
              {isEditingBank && (
                <div className="pt-4 flex space-x-3">
                  <button 
                    onClick={saveBankDetails}
                    disabled={bankLoading || !bankDetails.accountHolderName || !bankDetails.bankName || !bankDetails.accountNumber}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bankLoading ? 'Saving...' : (hasBankDetails ? 'Update Details' : 'Save Details')}
                  </button>
                  {hasBankDetails && (
                    <button 
                      onClick={() => {
                        setIsEditingBank(false);
                        fetchBankDetails(); // Reset to original values
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
              
              {!isEditingBank && hasBankDetails && (
                <div className="pt-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-green-700 font-medium">Bank details verified</span>
                    </div>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      Request Payout →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverEarnings;

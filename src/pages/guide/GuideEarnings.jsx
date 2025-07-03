
import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  CreditCard, 
  Wallet,
  BarChart3,
  PieChart,
  Filter,
  ChevronDown,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const GuideEarnings = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showDetails, setShowDetails] = useState(false);

  const earningsData = {
    today: { amount: 320.75, trips: 2, change: 12.5 },
    week: { amount: 1890.50, trips: 8, change: 18.3 },
    month: { amount: 7240.25, trips: 32, change: -5.2 },
    year: { amount: 86483.00, trips: 384, change: 25.7 }
  };

  const transactions = [
    {
      id: 'TXN001',
      date: '2024-12-14',
      time: '15:30',
      tourist: 'Emily Johnson',
      package: 'Kandy Cultural Heritage Tour',
      amount: 150.00,
      commission: 22.50,
      netAmount: 127.50,
      status: 'completed',
      payoutStatus: 'pending'
    },
    {
      id: 'TXN002',
      date: '2024-12-14',
      time: '09:15',
      tourist: 'Marco Rodriguez',
      package: 'Ella Adventure Trek',
      amount: 180.00,
      commission: 27.00,
      netAmount: 153.00,
      status: 'completed',
      payoutStatus: 'paid'
    },
    {
      id: 'TXN003',
      date: '2024-12-13',
      time: '16:45',
      tourist: 'Sarah Chen',
      package: 'Colombo Food Discovery',
      amount: 95.00,
      commission: 14.25,
      netAmount: 80.75,
      status: 'completed',
      payoutStatus: 'paid'
    },
    {
      id: 'TXN004',
      date: '2024-12-12',
      time: '11:20',
      tourist: 'James Wilson',
      package: 'Sigiriya Historical Tour',
      amount: 200.00,
      commission: 30.00,
      netAmount: 170.00,
      status: 'completed',
      payoutStatus: 'paid'
    },
    {
      id: 'TXN005',
      date: '2024-12-11',
      time: '14:10',
      tourist: 'Lisa Anderson',
      package: 'Kandy Cultural Heritage Tour',
      amount: 150.00,
      commission: 22.50,
      netAmount: 127.50,
      status: 'refunded',
      payoutStatus: 'reversed'
    }
  ];

  const weeklyData = [
    { day: 'Mon', earnings: 240 },
    { day: 'Tue', earnings: 320 },
    { day: 'Wed', earnings: 180 },
    { day: 'Thu', earnings: 420 },
    { day: 'Fri', earnings: 380 },
    { day: 'Sat', earnings: 520 },
    { day: 'Sun', earnings: 290 }
  ];

  const payoutSchedule = [
    {
      id: 'PO001',
      period: 'Dec 1-7, 2024',
      amount: 1245.30,
      status: 'processing',
      expectedDate: '2024-12-16',
      trips: 6
    },
    {
      id: 'PO002',
      period: 'Nov 24-30, 2024',
      amount: 1876.50,
      status: 'paid',
      paidDate: '2024-12-09',
      trips: 9
    },
    {
      id: 'PO003',
      period: 'Nov 17-23, 2024',
      amount: 2134.75,
      status: 'paid',
      paidDate: '2024-12-02',
      trips: 11
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'reversed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPayoutStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const currentEarnings = earningsData[selectedPeriod];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings</h1>
            <p className="text-gray-600">Track your income and payouts</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
          {[
            { key: 'today', label: 'Today' },
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'This Month' },
            { key: 'year', label: 'This Year' }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                selectedPeriod === period.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className={`flex items-center text-sm ${
                currentEarnings.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {currentEarnings.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(currentEarnings.change)}%
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${currentEarnings.amount.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completed Trips</p>
              <p className="text-2xl font-bold text-gray-900">{currentEarnings.trips}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average per Trip</p>
              <p className="text-2xl font-bold text-gray-900">
                ${currentEarnings.trips > 0 ? (currentEarnings.amount / currentEarnings.trips).toFixed(0) : '0'}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending Payout</p>
              <p className="text-2xl font-bold text-gray-900">
                ${transactions.filter(t => t.payoutStatus === 'pending').reduce((sum, t) => sum + t.netAmount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Earnings</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-gray-600">Daily Earnings</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-end justify-between h-64">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="flex items-end h-48 mb-2">
                  <div 
                    className="bg-blue-500 rounded-t-lg w-8 min-h-4 transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${(day.earnings / 600) * 100}%` }}
                    title={`$${day.earnings}`}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{day.day}</span>
                <span className="text-xs font-medium text-gray-900">${day.earnings}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      {showDetails && (
        <div className="space-y-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <button className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tourist
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Earnings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                          <div className="text-sm text-gray-500">{transaction.date} at {transaction.time}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.tourist}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{transaction.package}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${transaction.amount.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">Commission: ${transaction.commission.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${transaction.netAmount.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.payoutStatus)}`}>
                            {getPayoutStatusIcon(transaction.payoutStatus)}
                            <span className="ml-1">{transaction.payoutStatus}</span>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payout Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Payout Schedule</h3>
              <p className="text-sm text-gray-600 mt-1">Weekly payouts are processed every Monday</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {payoutSchedule.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        payout.status === 'paid' ? 'bg-green-100' : 
                        payout.status === 'processing' ? 'bg-purple-100' : 'bg-yellow-100'
                      }`}>
                        {getPayoutStatusIcon(payout.status)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{payout.period}</div>
                        <div className="text-sm text-gray-600">{payout.trips} trips completed</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-gray-900">${payout.amount.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">
                        {payout.status === 'paid' 
                          ? `Paid on ${payout.paidDate}`
                          : `Expected ${payout.expectedDate}`
                        }
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                      {payout.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings by Package Type</h3>
              <div className="space-y-4">
                {[
                  { type: 'Cultural Tours', amount: 3240, percentage: 45, color: 'bg-blue-500' },
                  { type: 'Adventure Tours', amount: 2880, percentage: 40, color: 'bg-green-500' },
                  { type: 'Food Tours', amount: 1120, percentage: 15, color: 'bg-purple-500' }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.type}</span>
                      <span className="font-medium">${item.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Bank Account</div>
                      <div className="text-sm text-gray-600">****1234</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    Active
                  </span>
                </div>
                <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  Update Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideEarnings;

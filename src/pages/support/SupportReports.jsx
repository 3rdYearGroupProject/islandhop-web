import React, { useState } from 'react';
import {
  ChartBarIcon,
  TicketIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const SupportReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for reports
  const reportData = {
    overview: {
      totalTickets: 1247,
      resolvedTickets: 1089,
      pendingTickets: 98,
      escalatedTickets: 60,
      avgResponseTime: '2.3 hours',
      avgResolutionTime: '18.5 hours',
      customerSatisfaction: 4.7,
      agentPerformance: 92
    },
    trends: {
      week: {
        ticketsCreated: [15, 23, 19, 31, 28, 22, 18],
        ticketsResolved: [12, 20, 17, 29, 25, 20, 16],
        responseTime: [2.1, 2.3, 1.9, 2.8, 2.5, 2.2, 2.0]
      },
      month: {
        ticketsCreated: [245, 289, 312, 276],
        ticketsResolved: [230, 275, 298, 265],
        responseTime: [2.2, 2.4, 2.1, 2.3]
      },
      year: {
        ticketsCreated: [2890, 3124, 3456, 3201, 2987, 3334, 3567, 3123, 2945, 3245, 3432, 3156],
        ticketsResolved: [2756, 2987, 3234, 3045, 2834, 3189, 3401, 2987, 2798, 3098, 3289, 3012],
        responseTime: [2.3, 2.1, 2.4, 2.2, 2.5, 2.3, 2.1, 2.4, 2.6, 2.2, 2.3, 2.4]
      }
    },
    categories: {
      'booking-issues': { name: 'Booking Issues', count: 342, resolved: 298, percentage: 27.4 },
      'payment-problems': { name: 'Payment Problems', count: 198, resolved: 175, percentage: 15.9 },
      'technical-support': { name: 'Technical Support', count: 156, resolved: 142, percentage: 12.5 },
      'cancellations': { name: 'Cancellations', count: 234, resolved: 221, percentage: 18.8 },
      'general-inquiry': { name: 'General Inquiry', count: 189, resolved: 178, percentage: 15.2 },
      'complaints': { name: 'Complaints', count: 128, resolved: 75, percentage: 10.3 }
    },
    agentPerformance: [
      { name: 'Sarah Johnson', tickets: 89, resolved: 85, avgTime: '1.8 hours', rating: 4.9 },
      { name: 'Mike Chen', tickets: 76, resolved: 72, avgTime: '2.1 hours', rating: 4.7 },
      { name: 'Emma Wilson', tickets: 94, resolved: 88, avgTime: '2.3 hours', rating: 4.8 },
      { name: 'David Brown', tickets: 67, resolved: 63, avgTime: '2.5 hours', rating: 4.6 },
      { name: 'Lisa Garcia', tickets: 82, resolved: 79, avgTime: '1.9 hours', rating: 4.8 }
    ]
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'primary' }) => {
    const colorClasses = {
      primary: 'from-primary-500 to-primary-600',
      success: 'from-success-500 to-success-600',
      warning: 'from-warning-500 to-warning-600',
      danger: 'from-danger-500 to-danger-600'
    };

    return (
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-gradient-to-r ${colorClasses[color]} rounded-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            {trend && (
              <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
                {trend === 'up' ? (
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{trendValue}</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CategoryCard = ({ category, data }) => {
    const resolutionRate = ((data.resolved / data.count) * 100).toFixed(1);
    
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">{data.name}</h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">{data.percentage}%</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total: {data.count}</span>
            <span className="text-gray-600 dark:text-gray-400">Resolved: {data.resolved}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
              style={{ width: `${resolutionRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Resolution Rate</span>
            <span>{resolutionRate}%</span>
          </div>
        </div>
      </div>
    );
  };

  const AgentPerformanceCard = ({ agent }) => (
    <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {agent.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Support Agent</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Tickets:</span>
          <span className="ml-2 font-semibold text-gray-900 dark:text-white">{agent.tickets}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Resolved:</span>
          <span className="ml-2 font-semibold text-gray-900 dark:text-white">{agent.resolved}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Avg Time:</span>
          <span className="ml-2 font-semibold text-gray-900 dark:text-white">{agent.avgTime}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Rating:</span>
          <span className="ml-2 font-semibold text-warning-600">{agent.rating} ⭐</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 ">
      <div className="max-w-7xl ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Support Reports & Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive insights into support team performance and customer satisfaction
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors duration-200">
                <DocumentArrowDownIcon className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                <FunnelIcon className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
          
          {/* Period Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Period:</label>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Tickets"
            value={reportData.overview.totalTickets.toLocaleString()}
            subtitle="All time tickets created"
            icon={TicketIcon}
            trend="up"
            trendValue="12.5%"
            color="primary"
          />
          <StatCard
            title="Resolved Tickets"
            value={reportData.overview.resolvedTickets.toLocaleString()}
            subtitle={`${((reportData.overview.resolvedTickets / reportData.overview.totalTickets) * 100).toFixed(1)}% resolution rate`}
            icon={CheckCircleIcon}
            trend="up"
            trendValue="8.3%"
            color="success"
          />
          <StatCard
            title="Avg Response Time"
            value={reportData.overview.avgResponseTime}
            subtitle="First response to customer"
            icon={ClockIcon}
            trend="down"
            trendValue="15.2%"
            color="warning"
          />
          <StatCard
            title="Customer Satisfaction"
            value={`${reportData.overview.customerSatisfaction}/5.0`}
            subtitle="Based on 847 ratings"
            icon={UserGroupIcon}
            trend="up"
            trendValue="3.1%"
            color="success"
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ticket Trends */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ticket Trends</h3>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-primary-500 rounded-full"></span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
                <span className="w-3 h-3 bg-success-500 rounded-full ml-4"></span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Resolved</span>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <ChartBarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Chart visualization would be implemented here</p>
                <p className="text-sm">Using Chart.js or similar library</p>
              </div>
            </div>
          </div>

          {/* Response Time Distribution */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Response Time Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Under 1 hour</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-secondary-700 rounded-full h-2">
                    <div className="w-20 bg-success-500 h-2 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">62%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">1-4 hours</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-secondary-700 rounded-full h-2">
                    <div className="w-16 bg-warning-500 h-2 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">28%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">4-24 hours</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-secondary-700 rounded-full h-2">
                    <div className="w-8 bg-danger-500 h-2 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">8%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Over 24 hours</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-secondary-700 rounded-full h-2">
                    <div className="w-2 bg-danger-600 h-2 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Ticket Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(reportData.categories).map(([key, data]) => (
              <CategoryCard key={key} category={key} data={data} />
            ))}
          </div>
        </div>

        {/* Agent Performance */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Agent Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportData.agentPerformance.map((agent, index) => (
              <AgentPerformanceCard key={index} agent={agent} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportReports;
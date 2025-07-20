import React, { useState } from 'react';
import {
  GlobeAltIcon,
  CloudIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  ClockIcon,
  SignalIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const APIs = () => {
  const [apiData, setApiData] = useState({
    googleMaps: {
      name: 'Google Maps API',
      status: 'active',
      cost: 'LKR 127.45',
      monthlyCost: 'LKR 1,480.00',
      requests: '45,230',
      monthlyRequests: '523,400',
      latency: '187ms',
      uptime: '99.9%',
      lastUpdated: '2 minutes ago',
      description: 'Location services, routing, and geocoding',
      keyStatus: 'Valid',
      rateLimit: '1,000 requests/hour',
      nextBilling: 'Jan 15, 2025',
      icon: GlobeAltIcon,
      color: 'primary'
    },
    weather: {
      name: 'OpenWeather API',
      status: 'active',
      cost: 'LKR 23.80',
      monthlyCost: 'LKR 89.50',
      requests: '12,450',
      monthlyRequests: '156,780',
      latency: '120ms',
      uptime: '99.7%',
      lastUpdated: '5 minutes ago',
      description: 'Real-time weather data and forecasts',
      keyStatus: 'Valid',
      rateLimit: '500 requests/hour',
      nextBilling: 'Jan 12, 2025',
      icon: CloudIcon,
      color: 'info'
    },
    messaging: {
      name: 'Twilio SMS API',
      status: 'active',
      cost: 'LKR 45.20',
      monthlyCost: 'LKR 198.75',
      requests: '3,240',
      monthlyRequests: '38,920',
      latency: '95ms',
      uptime: '99.8%',
      lastUpdated: '1 minute ago',
      description: 'SMS notifications and messaging services',
      keyStatus: 'Valid',
      rateLimit: '100 requests/hour',
      nextBilling: 'Jan 18, 2025',
      icon: ChatBubbleLeftRightIcon,
      color: 'success'
    },
    payment: {
      name: 'Stripe Payment API',
      status: 'warning',
      cost: 'LKR 89.30',
      monthlyCost: 'LKR 1,200.40',
      requests: '8,920',
      monthlyRequests: '95,430',
      latency: '210ms',
      uptime: '99.5%',
      lastUpdated: '8 minutes ago',
      description: 'Payment processing and transactions',
      keyStatus: 'Valid',
      rateLimit: '200 requests/hour',
      nextBilling: 'Jan 20, 2025',
      icon: CurrencyDollarIcon,
      color: 'warning'
    }
  });

  const getStatusColor = (status) => {
    const colors = {
      'active': 'text-success-600 dark:text-success-400',
      'warning': 'text-warning-600 dark:text-warning-400',
      'error': 'text-danger-600 dark:text-danger-400',
      'inactive': 'text-neutral-600 dark:text-neutral-400'
    };
    return colors[status] || colors.inactive;
  };

  const getStatusIcon = (status) => {
    if (status === 'active') {
      return <CheckCircleIcon className="h-5 w-5 text-success-600 dark:text-success-400" />;
    } else if (status === 'warning') {
      return <ExclamationTriangleIcon className="h-5 w-5 text-warning-600 dark:text-warning-400" />;
    } else {
      return <ExclamationTriangleIcon className="h-5 w-5 text-danger-600 dark:text-danger-400" />;
    }
  };

  const getCardColor = (color) => {
    const colors = {
      primary: 'border-primary-200 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700',
      success: 'border-success-200 bg-success-50 dark:bg-success-900/20 dark:border-success-700',
      warning: 'border-warning-200 bg-warning-50 dark:bg-warning-900/20 dark:border-warning-700',
      info: 'border-info-200 bg-info-50 dark:bg-info-900/20 dark:border-info-700',
      danger: 'border-danger-200 bg-danger-50 dark:bg-danger-900/20 dark:border-danger-700'
    };
    return colors[color] || colors.primary;
  };

  const getIconColor = (color) => {
    const colors = {
      primary: 'text-primary-600 dark:text-primary-400',
      success: 'text-success-600 dark:text-success-400',
      warning: 'text-warning-600 dark:text-warning-400',
      info: 'text-info-600 dark:text-info-400',
      danger: 'text-danger-600 dark:text-danger-400'
    };
    return colors[color] || colors.primary;
  };

  // Calculate overview stats
  const totalCost = Object.values(apiData).reduce((sum, api) => {
    return sum + parseFloat(api.monthlyCost.replace('$', '').replace(',', ''));
  }, 0);

  const totalRequests = Object.values(apiData).reduce((sum, api) => {
    return sum + parseInt(api.monthlyRequests.replace(',', ''));
  }, 0);

  const activeApis = Object.values(apiData).filter(api => api.status === 'active').length;

  const averageUptime = Object.values(apiData).reduce((sum, api) => {
    return sum + parseFloat(api.uptime.replace('%', ''));
  }, 0) / Object.values(apiData).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            API Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor API usage, costs, and performance across all integrated services
          </p>
        </div>

        {/* Overview Stats - Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6 transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total Monthly Cost
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {/* ${totalCost.toLocaleString()} */}LKR 234,788.78
                </p>
                <p className="text-sm text-success-600 dark:text-success-400 mt-1">
                  +8.2% from last month
                </p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-full">
                <CurrencyDollarIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6 transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Monthly Requests
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(totalRequests / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-success-600 dark:text-success-400 mt-1">
                  +12.5% from last month
                </p>
              </div>
              <div className="p-3 bg-success-100 dark:bg-success-900/20 rounded-full">
                <SignalIcon className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6 transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Active APIs
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeApis}/{Object.keys(apiData).length}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  All systems operational
                </p>
              </div>
              <div className="p-3 bg-info-100 dark:bg-info-900/20 rounded-full">
                <CheckCircleIcon className="h-6 w-6 text-info-600 dark:text-info-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6 transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Average Uptime
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {averageUptime.toFixed(1)}%
                </p>
                <p className="text-sm text-success-600 dark:text-success-400 mt-1">
                  +0.1% from last month
                </p>
              </div>
              <div className="p-3 bg-warning-100 dark:bg-warning-900/20 rounded-full">
                <ClockIcon className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
            </div>
          </div>
        </div>

        {/* API Cards Grid - Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(apiData).map(([key, api]) => {
            const IconComponent = api.icon;
            return (
              <div 
                key={key}
                className={`bg-white dark:bg-secondary-800 rounded-xl border p-6 transition-all hover:scale-105 ${getCardColor(api.color)}`}
              >
                {/* API Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-white dark:bg-secondary-700 rounded-lg">
                      <IconComponent className={`h-6 w-6 ${getIconColor(api.color)}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {api.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {api.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(api.status)}
                    <span className={`text-sm font-medium ${getStatusColor(api.status)}`}>
                      {api.status}
                    </span>
                  </div>
                </div>

                {/* API Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white dark:bg-secondary-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Today's Cost
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {api.cost}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Monthly
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {api.monthlyCost}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-secondary-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Today's Requests
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {api.requests}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Monthly
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {api.monthlyRequests}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-secondary-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Latency
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {api.latency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Uptime
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {api.uptime}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-secondary-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Rate Limit
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {api.rateLimit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Key Status
                      </span>
                      <span className="text-sm font-bold text-success-600 dark:text-success-400">
                        {api.keyStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* API Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-secondary-600">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Updated
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {api.lastUpdated}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-secondary-600">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Next Billing
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {api.nextBilling}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Additional Actions */}
        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleString()}
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-secondary-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors">
              Export Report
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Add New API
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIs;

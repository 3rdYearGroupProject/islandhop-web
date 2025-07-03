import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  DocumentReportIcon,
  ServerIcon,
  ShieldCheckIcon,
  BellIcon,
  UserGroupIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = ({ onPageChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleViewProfile = () => {
    setIsDropdownOpen(false);
    if (onPageChange) {
      onPageChange('ProfileDetails');
    }
  };

  const handleSignOut = async () => {
    try {
      // Add sign out logic here
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Dashboard stats data
  const dashboardStats = [
    {
      title: 'Total Users',
      value: '15,234',
      change: '+12%',
      changeType: 'positive',
      icon: UsersIcon,
      color: 'primary'
    },
    {
      title: 'Active Bookings',
      value: '2,847',
      change: '+8%',
      changeType: 'positive',
      icon: DocumentReportIcon,
      color: 'success'
    },
    {
      title: 'Revenue',
      value: '$324,567',
      change: '+15%',
      changeType: 'positive',
      icon: ChartBarIcon,
      color: 'warning'
    },
    {
      title: 'System Health',
      value: '99.8%',
      change: '+0.1%',
      changeType: 'positive',
      icon: ServerIcon,
      color: 'info'
    }
  ];

  const quickActions = [
    {
      title: 'User Accounts',
      description: 'Manage user accounts and permissions',
      icon: UserGroupIcon,
      color: 'primary',
      action: () => onPageChange && onPageChange('UserAccounts')
    },
    {
      title: 'Analytics',
      description: 'View detailed system analytics',
      icon: ChartBarIcon,
      color: 'success',
      action: () => onPageChange && onPageChange('Analytics')
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: CogIcon,
      color: 'warning',
      action: () => onPageChange && onPageChange('SystemSettings')
    },
    {
      title: 'Reviews',
      description: 'Manage user reviews and feedback',
      icon: ShieldCheckIcon,
      color: 'info',
      action: () => onPageChange && onPageChange('Reviews')
    },
    {
      title: 'Notifications',
      description: 'System notifications and alerts',
      icon: BellIcon,
      color: 'danger',
      action: () => onPageChange && onPageChange('Notifications')
    },
    {
      title: 'System History',
      description: 'View audit logs and history',
      icon: ClockIcon,
      color: 'neutral',
      action: () => onPageChange && onPageChange('SystemHistory')
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High server load detected',
      time: '5 minutes ago'
    },
    {
      id: 2,
      type: 'info',
      message: 'New user registration spike',
      time: '15 minutes ago'
    },
    {
      id: 3,
      type: 'success',
      message: 'Database backup completed',
      time: '1 hour ago'
    }
  ];

  const getStatColor = (color) => {
    const colors = {
      primary: 'border-primary-200 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700',
      success: 'border-success-200 bg-success-50 dark:bg-success-900/20 dark:border-success-700',
      warning: 'border-warning-200 bg-warning-50 dark:bg-warning-900/20 dark:border-warning-700',
      info: 'border-info-200 bg-info-50 dark:bg-info-900/20 dark:border-info-700',
      danger: 'border-danger-200 bg-danger-50 dark:bg-danger-900/20 dark:border-danger-700',
      neutral: 'border-neutral-200 bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700'
    };
    return colors[color] || colors.neutral;
  };

  const getIconColor = (color) => {
    const colors = {
      primary: 'text-primary-600 dark:text-primary-400',
      success: 'text-success-600 dark:text-success-400',
      warning: 'text-warning-600 dark:text-warning-400',
      info: 'text-info-600 dark:text-info-400',
      danger: 'text-danger-600 dark:text-danger-400',
      neutral: 'text-neutral-600 dark:text-neutral-400'
    };
    return colors[color] || colors.neutral;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back! Here's what's happening with IslandHop today.
              </p>
            </div>
            
            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors"
              >
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">A</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">System Administrator</p>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-md shadow-lg border border-gray-200 dark:border-secondary-700 z-10">
                  <div className="py-1">
                    <button
                      onClick={handleViewProfile}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-gray-100 dark:hover:bg-secondary-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-xl border ${getStatColor(stat.color)} transition-all hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className={`text-sm font-medium mt-1 ${
                      stat.changeType === 'positive' 
                        ? 'text-success-600 dark:text-success-400' 
                        : 'text-danger-600 dark:text-danger-400'
                    }`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-white dark:bg-secondary-700`}>
                    <IconComponent className={`h-6 w-6 ${getIconColor(stat.color)}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`p-4 rounded-lg border-2 border-dashed border-gray-200 dark:border-secondary-600 hover:border-${action.color}-300 dark:hover:border-${action.color}-600 transition-all group hover:scale-105`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/20 group-hover:bg-${action.color}-200 dark:group-hover:bg-${action.color}-800/30 transition-colors`}>
                          <IconComponent className={`h-6 w-6 ${getIconColor(action.color)}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Recent Alerts
              </h2>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors">
                    <div className={`p-1 rounded-full ${
                      alert.type === 'warning' ? 'bg-warning-100 dark:bg-warning-900/20' :
                      alert.type === 'info' ? 'bg-info-100 dark:bg-info-900/20' :
                      'bg-success-100 dark:bg-success-900/20'
                    }`}>
                      <ExclamationTriangleIcon className={`h-4 w-4 ${
                        alert.type === 'warning' ? 'text-warning-600 dark:text-warning-400' :
                        alert.type === 'info' ? 'text-info-600 dark:text-info-400' :
                        'text-success-600 dark:text-success-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {alert.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

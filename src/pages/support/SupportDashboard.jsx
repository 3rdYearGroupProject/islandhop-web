import React, { useEffect, useState } from 'react';
import {
  TicketIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ShieldExclamationIcon,
  ChatBubbleLeftRightIcon,
  ArchiveBoxXMarkIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '../../components/ToastProvider';
import { getUserData } from '../../utils/userStorage';
import { Link } from 'react-router-dom';
import Modal from '../../components/Modal';

const SupportDashboard = ({ onPageChange }) => {
  const toast = useToast();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const user = getUserData();
    if (user && user.profileComplete === false) {
      setShowProfileModal(true);
    }
  }, []);

  // Dashboard stats data
  const dashboardStats = [
    {
      title: 'New Tickets',
      value: '8',
      change: '+3 today',
      changeType: 'positive',
      icon: TicketIcon,
      color: 'secondary'
    },
    {
      title: 'In Progress',
      value: '5',
      change: '-2 from yesterday',
      changeType: 'negative',
      icon: ExclamationTriangleIcon,
      color: 'secondary'
    },
    {
      title: 'Escalated',
      value: '2',
      change: '+1 today',
      changeType: 'positive',
      icon: ShieldExclamationIcon,
      color: 'secondary'
    },
    {
      title: 'Refunds',
      value: '3',
      change: 'No change',
      changeType: 'neutral',
      icon: CurrencyDollarIcon,
      color: 'secondary'
    },
    {
      title: 'Lost Items',
      value: '4',
      change: '+1 today',
      changeType: 'positive',
      icon: ArchiveBoxXMarkIcon,
      color: 'secondary'
    },
    {
      title: 'Panic Alerts',
      value: '1',
      change: 'Active',
      changeType: 'warning',
      icon: ShieldExclamationIcon,
      color: 'secondary'
    }
  ];

  // Quick actions data
  const quickActions = [
    {
      title: 'View All Tickets',
      description: 'See and manage all support tickets',
      icon: TicketIcon,
      color: 'secondary',
      action: () => onPageChange && onPageChange('ViewTickets')
    },
    {
      title: 'Handle Chat & Email',
      description: 'Respond to chat and email support',
      icon: ChatBubbleLeftRightIcon,
      color: 'secondary',
      action: () => onPageChange && onPageChange('ChatEmailSupport')
    },
    {
      title: 'Resolve Complaints',
      description: 'Address customer complaints',
      icon: ExclamationTriangleIcon,
      color: 'secondary',
      action: () => onPageChange && onPageChange('ResolveComplaint')
    },
    {
      title: 'Process Refunds',
      description: 'Handle refund and compensation requests',
      icon: CurrencyDollarIcon,
      color: 'secondary',
      action: () => onPageChange && onPageChange('RefundCompensation')
    },
    {
      title: 'Track Lost Items',
      description: 'Monitor lost item reports',
      icon: ArchiveBoxXMarkIcon,
      color: 'secondary',
      action: () => onPageChange && onPageChange('LostItemTracker')
    },
    {
      title: 'Panic Alerts',
      description: 'Handle emergency situations',
      icon: ShieldExclamationIcon,
      color: 'secondary',
      action: () => onPageChange && onPageChange('PanicAlerts')
    }
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      action: 'New ticket created',
      user: 'Ayesha Fernando',
      time: '5 min ago',
      type: 'ticket'
    },
    {
      id: 2,
      action: 'Ticket resolved',
      user: 'Ruwan Silva',
      time: '12 min ago',
      type: 'ticket'
    },
    {
      id: 3,
      action: 'Escalated to manager',
      user: 'Ishara Perera',
      time: '20 min ago',
      type: 'ticket'
    },
    {
      id: 4,
      action: 'Refund processed',
      user: 'Nuwan Perera',
      time: '35 min ago',
      type: 'ticket'
    },
    {
      id: 5,
      action: 'Lost item reported',
      user: 'Dilani Fernando',
      time: '1 hour ago',
      type: 'ticket'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-800',
      secondary: 'bg-secondary-50 text-secondary-700 border-secondary-200 dark:bg-secondary-900/20 dark:text-secondary-300 dark:border-secondary-800',
      success: 'bg-success-50 text-success-700 border-success-200 dark:bg-success-900/20 dark:text-success-300 dark:border-success-800',
      warning: 'bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-900/20 dark:text-warning-300 dark:border-warning-800',
      danger: 'bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-900/20 dark:text-danger-300 dark:border-danger-800',
      info: 'bg-info-50 text-info-700 border-info-200 dark:bg-info-900/20 dark:text-info-300 dark:border-info-800'
    };
    return colorMap[color] || colorMap.primary;
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive': return 'text-success-600 dark:text-success-400';
      case 'negative': return 'text-danger-600 dark:text-danger-400';
      case 'warning': return 'text-warning-600 dark:text-warning-400';
      default: return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Complete Your Profile"
        size="sm"
      >
        <div className="text-gray-700 dark:text-gray-200">
          <p className="mb-4">Please complete your profile to enjoy all features of the support dashboard.</p>
          <Link
            to="/support/profile"
            className="inline-block px-4 py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
            onClick={() => setShowProfileModal(false)}
          >
            Go to Profile
          </Link>
        </div>
      </Modal>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Support Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage customer support tickets and requests
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${getColorClasses(stat.color)} p-6 rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-105`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8" />
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {stat.value}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <span className={`text-xs ${getChangeColor(stat.changeType)}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`${getColorClasses(action.color)} p-4 rounded-lg border text-left transition-all duration-200 hover:shadow-md hover:scale-105 group`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="h-6 w-6 mt-1 group-hover:scale-110 transition-transform duration-200" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold group-hover:underline">
                          {action.title}
                        </p>
                        <p className="text-xs opacity-75 mt-1">
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

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors duration-200">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'ticket' ? 'bg-primary-500' :
                    activity.type === 'resolved' ? 'bg-success-500' :
                    activity.type === 'escalated' ? 'bg-danger-500' :
                    activity.type === 'refund' ? 'bg-info-500' :
                    'bg-warning-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-secondary-700">
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                View all activity →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Today's Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tickets Resolved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">12m</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Response Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">95%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customer Satisfaction</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">23</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Chat Sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;

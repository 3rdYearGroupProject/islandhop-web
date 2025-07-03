import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  TicketIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ArchiveBoxXMarkIcon,
  ShieldExclamationIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const SupportSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const supportMenuItems = [
    { 
      name: 'Dashboard', 
      path: '/support/dashboard', 
      icon: HomeIcon,
      description: 'Overview & Stats'
    },
    { 
      name: 'View Tickets', 
      path: '/support/tickets', 
      icon: TicketIcon,
      description: 'Manage Support Tickets'
    },
    { 
      name: 'Chat & Email', 
      path: '/support/chat-email', 
      icon: ChatBubbleLeftRightIcon,
      description: 'Live Support'
    },
    { 
      name: 'Resolve Complaints', 
      path: '/support/resolve-complaint', 
      icon: ExclamationTriangleIcon,
      description: 'Handle Complaints'
    },
    { 
      name: 'Escalate Issues', 
      path: '/support/escalate-issue', 
      icon: ShieldExclamationIcon,
      description: 'Priority Escalation'
    },
    { 
      name: 'Refunds', 
      path: '/support/refund-compensation', 
      icon: CurrencyDollarIcon,
      description: 'Process Refunds'
    },
    { 
      name: 'Lost Items', 
      path: '/support/lost-item-tracker', 
      icon: ArchiveBoxXMarkIcon,
      description: 'Track Lost Items'
    },
    { 
      name: 'Panic Alerts', 
      path: '/support/panic-alerts', 
      icon: ShieldExclamationIcon,
      description: 'Emergency Response'
    },
    { 
      name: 'Reports', 
      path: '/support/reports', 
      icon: ChartBarIcon,
      description: 'Support Analytics'
    },
    { 
      name: 'Profile', 
      path: '/support/profile', 
      icon: UserIcon,
      description: 'Agent Profile'
    },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-secondary-900 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 border-r border-gray-200 dark:border-secondary-700`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-secondary-700 lg:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <HeartIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Support Center
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Customer Care
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors duration-200"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Support Panel Header (Desktop) */}
        <div className="hidden lg:flex items-center px-6 py-4 border-b border-gray-200 dark:border-secondary-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg">
              <HeartIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Support Center
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Customer Care Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {supportMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 border-l-4 border-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-800 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-md'
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-colors duration-200 ${
                  isActive 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 dark:bg-secondary-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/20'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold ${isActive ? 'text-white' : ''}`}>
                    {item.name}
                  </div>
                  <div className={`text-xs mt-0.5 ${
                    isActive 
                      ? 'text-white/80' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400'
                  }`}>
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Support Status */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-secondary-700">
          <div className="bg-gray-50 dark:bg-secondary-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Support Status
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-success-600 dark:text-success-400 font-medium">
                  Available
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-600 dark:text-gray-400">
                <span className="block font-medium">Active Tickets</span>
                <span className="text-warning-600 dark:text-warning-400">24</span>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                <span className="block font-medium">Response Time</span>
                <span className="text-success-600 dark:text-success-400">&lt; 5min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-secondary-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            © 2024 IslandHop Support
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportSidebar;

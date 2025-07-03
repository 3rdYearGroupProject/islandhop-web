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
} from '@heroicons/react/24/outline';

const SupportSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/support/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'View Tickets',
      path: '/support/tickets',
      icon: TicketIcon,
    },
    {
      name: 'Chat & Email Support',
      path: '/support/chat-email',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: 'Resolve Complaints',
      path: '/support/resolve-complaints',
      icon: ExclamationTriangleIcon,
    },
    {
      name: 'Escalate Issues',
      path: '/support/escalate-issues',
      icon: ShieldExclamationIcon,
    },
    {
      name: 'Refund & Compensation',
      path: '/support/refunds',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Lost Item Tracker',
      path: '/support/lost-items',
      icon: ArchiveBoxXMarkIcon,
    },
    {
      name: 'Panic Alerts',
      path: '/support/panic-alerts',
      icon: ShieldExclamationIcon,
    },
    {
      name: 'Complaint Reports',
      path: '/support/reports',
      icon: ChartBarIcon,
    },
    {
      name: 'Profile',
      path: '/support/profile',
      icon: UserIcon,
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-secondary-800 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-secondary-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IH</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">IslandHop</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Support Portal</p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-secondary-700 lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  <Icon 
                    className={`h-5 w-5 mr-3 transition-colors duration-200 ${
                      isActive 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-500'
                    }`} 
                  />
                  <span className="truncate">{item.name}</span>
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-secondary-700">
            <div className="flex items-center space-x-3 px-3 py-2">
              <div className="w-8 h-8 bg-success-100 dark:bg-success-900/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Support Agent
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Online
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportSidebar;

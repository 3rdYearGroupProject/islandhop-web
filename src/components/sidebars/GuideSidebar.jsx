import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  MapIcon,
  CalendarIcon,
  CurrencyDollarIcon,              
  UserIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  StarIcon,
  ClockIcon,
  ChartBarIcon,
  BellIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import GuideStatusCard from '../guide/GuideStatusCard';
import OnlineToggle from '../shared/OnlineToggle';

const GuideSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const guideMenuItems = [
    { 
      name: 'Dashboard', 
      path: '/guide/dashboard', 
      icon: HomeIcon,
      description: 'Overview & Stats'
    },
    { 
      name: 'Trip Requests', 
      path: '/guide/trips', 
      icon: MapIcon,
      description: 'Manage Tours',
      badge: '2'
    },
    { 
      name: 'Schedule', 
      path: '/guide/schedule', 
      icon: CalendarIcon,
      description: 'Availability'
    },
    { 
      name: 'Earnings', 
      path: '/guide/earnings', 
      icon: CurrencyDollarIcon,
      description: 'Income & Payouts'
    },
    { 
      name: 'Messages', 
      path: '/guide/chat', 
      icon: ChatBubbleLeftRightIcon,
      description: 'Chat with Tourists',
      badge: '1'
    },
    { 
      name: 'Tour Packages', 
      path: '/guide/packages', 
      icon: GlobeAltIcon,
      description: 'Your Tour Offerings'
    },
    { 
      name: 'Reviews', 
      path: '/guide/reviews', 
      icon: StarIcon,
      description: 'Ratings & Feedback'
    },
    { 
      name: 'History', 
      path: '/guide/history', 
      icon: ClockIcon,
      description: 'Tour History'
    },
    { 
      name: 'Analytics', 
      path: '/guide/analytics', 
      icon: ChartBarIcon,
      description: 'Performance Data'
    },
    { 
      name: 'Profile', 
      path: '/guide/profile', 
      icon: UserIcon,
      description: 'Guide Profile'
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-secondary-900 shadow-2xl transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-72 border-r border-gray-200 dark:border-secondary-700`}>
        <div className="flex flex-col h-full pt-16">
          {/* Sidebar Header - Mobile */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-secondary-700 lg:hidden">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Guide Portal
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Mobile Menu
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

          {/* Guide Portal Header - Desktop */}
          <div className="hidden lg:flex items-center px-6 py-4 border-b border-gray-200 dark:border-secondary-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Guide Portal
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your Guide Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Guide Status Card - Only on Desktop */}
          <div className="hidden lg:block px-4 py-4 border-b border-gray-200 dark:border-secondary-700">
            <GuideStatusCard compact={true} showToggle={false} />
          </div>

          {/* Mobile Quick Actions */}
          <div className="lg:hidden px-4 py-4 border-b border-gray-200 dark:border-secondary-700">
            <div className="grid grid-cols-2 gap-3">
              <OnlineToggle userType="guide" />
              <button className="flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg font-medium text-sm">
                <MapIcon className="h-4 w-4 mr-2" />
                View Tours
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {guideMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 border-l-4 border-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-800 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md'
                  }`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-colors duration-200 ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 dark:bg-secondary-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold ${isActive ? 'text-white' : ''}`}>
                      {item.name}
                    </div>
                    <div className={`text-xs mt-0.5 lg:block hidden ${
                      isActive 
                        ? 'text-white/80' 
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  {item.badge && (
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {item.badge}
                    </div>
                  )}
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-secondary-700">
            <div className="space-y-2">
              <OnlineToggle userType="guide" size="large" className="w-full" />
              <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-secondary-800 hover:bg-gray-200 dark:hover:bg-secondary-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors duration-200">
                <BellIcon className="h-4 w-4 mr-2" />
                Notifications
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-secondary-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              © 2024 IslandHop Guide
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuideSidebar;

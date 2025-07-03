import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, userRole }) => {
  const location = useLocation();

  const menuItems = {
    tourist: [
      { name: 'Dashboard', path: '/tourist/dashboard', icon: '🏠' },
      { name: 'Explore', path: '/tourist/explore', icon: '🗺️' },
      { name: 'My Trips', path: '/tourist/trips', icon: '🎒' },
      { name: 'Find Pools', path: '/tourist/pools', icon: '🚗' },
      { name: 'Messages', path: '/tourist/messages', icon: '💬' },
      { name: 'Profile', path: '/tourist/profile', icon: '👤' },
    ],
    driver: [
      { name: 'Dashboard', path: '/driver/dashboard', icon: '🏠' },
      { name: 'Active Rides', path: '/driver/rides', icon: '🚗' },
      { name: 'Schedule', path: '/driver/schedule', icon: '📅' },
      { name: 'Earnings', path: '/driver/earnings', icon: '💰' },
      { name: 'Profile', path: '/driver/profile', icon: '👤' },
    ],
    guide: [
      { name: 'Dashboard', path: '/guide/dashboard', icon: '🏠' },
      { name: 'Tours', path: '/guide/tours', icon: '🎯' },
      { name: 'Bookings', path: '/guide/bookings', icon: '📋' },
      { name: 'Reviews', path: '/guide/reviews', icon: '⭐' },
      { name: 'Profile', path: '/guide/profile', icon: '👤' },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
      { name: 'Users', path: '/admin/users', icon: '👥' },
      { name: 'Analytics', path: '/admin/analytics', icon: '📊' },
      { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
      { name: 'Reports', path: '/admin/reports', icon: '📈' },
    ],
    support: [
      { name: 'Dashboard', path: '/support/dashboard', icon: '🏠' },
      { name: 'Tickets', path: '/support/tickets', icon: '🎫' },
      { name: 'Knowledge Base', path: '/support/kb', icon: '📚' },
      { name: 'Users', path: '/support/users', icon: '👥' },
    ],
  };

  const items = menuItems[userRole] || [];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-secondary-800 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="flex flex-col h-full pt-16">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-secondary-700 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-secondary-700"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-2 border-primary-600'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-secondary-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 IslandHop. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

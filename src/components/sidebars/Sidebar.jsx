import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  MapIcon,
  BriefcaseIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  ClipboardDocumentListIcon,
  TicketIcon,
  BookOpenIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { auth } from '../../firebase';
import { clearUserData } from '../../utils/userStorage';

const Sidebar = ({ isOpen, onClose, userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = {
    tourist: [
      { name: 'Dashboard', path: '/tourist/dashboard', icon: HomeIcon },
      { name: 'Explore', path: '/tourist/explore', icon: MapIcon },
      { name: 'My Trips', path: '/tourist/trips', icon: BriefcaseIcon },
      { name: 'Find Pools', path: '/tourist/pools', icon: TruckIcon },
      { name: 'Messages', path: '/tourist/messages', icon: ChatBubbleLeftRightIcon },
      { name: 'Profile', path: '/tourist/profile', icon: UserIcon },
    ],
    driver: [
      { name: 'Dashboard', path: '/driver/dashboard', icon: HomeIcon },
      { name: 'Active Rides', path: '/driver/rides', icon: TruckIcon },
      { name: 'Schedule', path: '/driver/schedule', icon: CalendarIcon },
      { name: 'Earnings', path: '/driver/earnings', icon: CurrencyDollarIcon },
      { name: 'Profile', path: '/driver/profile', icon: UserIcon },
    ],
    guide: [
      { name: 'Dashboard', path: '/guide/dashboard', icon: HomeIcon },
      { name: 'Tours', path: '/guide/tours', icon: MapIcon },
      { name: 'Bookings', path: '/guide/bookings', icon: ClipboardDocumentListIcon },
      { name: 'Reviews', path: '/guide/reviews', icon: StarIcon },
      { name: 'Profile', path: '/guide/profile', icon: UserIcon },
    ],
    support: [
      { name: 'Dashboard', path: '/support/dashboard', icon: HomeIcon },
      { name: 'Tickets', path: '/support/tickets', icon: TicketIcon },
      { name: 'Knowledge Base', path: '/support/kb', icon: BookOpenIcon },
      { name: 'Users', path: '/support/users', icon: UsersIcon },
    ],
  };

  const items = menuItems[userRole] || [];

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      clearUserData();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

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
            const Icon = item.icon;
            
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
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-secondary-700">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center px-4 py-2 mb-2 bg-danger-100 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 rounded-lg font-semibold text-sm hover:bg-danger-200 dark:hover:bg-danger-800 transition-colors duration-200"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
            Sign Out
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 IslandHop. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

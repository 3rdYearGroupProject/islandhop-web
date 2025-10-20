import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  GlobeAltIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import GuideStatusCard from '../guide/GuideStatusCard';
import OnlineToggle from '../shared/OnlineToggle';
import { auth } from '../../firebase';
import { clearUserData } from '../../utils/userStorage';
import islandHopIcon from '../../assets/islandHopIcon.png';
import islandHopLogo from '../../assets/IslandHop.png';
import axios from 'axios';

const GuideSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const notificationRef = useRef(null);

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
  ];

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

  // Notification API functions
  const fetchNotifications = async () => {
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) return;

      setNotificationLoading(true);
      const response = await axios.get(`http://localhost:8090/api/v1/notifications/user/${userEmail}`);
      
      if (response.data) {
        setNotifications(response.data.slice(0, 10)); // Show latest 10 notifications
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setNotificationLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) return;

      const response = await axios.get(`http://localhost:8090/api/v1/notifications/user/${userEmail}/unread-count`);
      
      if (response.data && typeof response.data.count === 'number') {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:8090/api/v1/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true, readAt: new Date().toISOString() }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) return;

      await axios.put(`http://localhost:8090/api/v1/notifications/user/${userEmail}/read-all`);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:8090/api/v1/notifications/${notificationId}`);
      
      // Update local state
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      
      // Update unread count if notification was unread
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const formatNotificationTime = (createdAtArray) => {
    // Handle array format: [year, month, day, hour, minute, second, nanosecond]
    if (Array.isArray(createdAtArray) && createdAtArray.length >= 6) {
      const [year, month, day, hour, minute, second] = createdAtArray;
      // Month is 1-based in the array, but Date constructor expects 0-based
      const notificationTime = new Date(year, month - 1, day, hour, minute, second);
      
      const now = new Date();
      const diff = now - notificationTime;
      
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return notificationTime.toLocaleDateString();
    }
    
    // Fallback for timestamp format
    const now = new Date();
    const notificationTime = new Date(createdAtArray);
    const diff = now - notificationTime;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return notificationTime.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'CHAT': return '💬';
      case 'TRIP': return '🚗';
      case 'PAYMENT': return '💰';
      case 'BOOKING': return '📅';
      case 'REVIEW': return '⭐';
      case 'SYSTEM': return '🔔';
      default: return '📢';
    }
  };

  const getNotificationPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'border-l-red-500';
      case 'MEDIUM': return 'border-l-yellow-500';
      case 'LOW': return 'border-l-green-500';
      default: return 'border-l-blue-500';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (auth.currentUser?.email) {
      fetchUnreadCount();
      
      // Set up polling for unread count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications]);

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
        <div className="flex flex-col h-full">
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
          <div className="hidden lg:flex flex-col items-start px-6 py-4 border-b border-gray-200 dark:border-secondary-700">
            <div className="flex items-center mb-1 ml-3">
              <img 
                src={islandHopIcon} 
                alt="IslandHop Icon" 
                className="h-8 w-8 mr-2"
              />
              <img 
                src={islandHopLogo} 
                alt="IslandHop Logo" 
                className="h-6"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-[51px]">
              Guide Dashboard
            </p>
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
                  {/* {item.badge && (
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {item.badge}
                    </div>
                  )} */}
                 
                </Link>
              );
            })}
          </nav>

          

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-secondary-700">
            {/* Profile Link */}
            <Link
              to="/guide/profile"
              onClick={onClose}
              className={`group flex items-center px-3 py-3 mb-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === '/guide/profile'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 border-l-4 border-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-800 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-colors duration-200 ${
                location.pathname === '/guide/profile' 
                  ? 'bg-white/20' 
                  : 'bg-gray-100 dark:bg-secondary-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20'
              }`}>
                <UserIcon className={`h-5 w-5 ${
                  location.pathname === '/guide/profile' 
                    ? 'text-white' 
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold ${location.pathname === '/guide/profile' ? 'text-white' : ''}`}>
                  Profile
                </div>
                <div className={`text-xs mt-0.5 lg:block hidden ${
                  location.pathname === '/guide/profile' 
                    ? 'text-white/80' 
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                }`}>
                  Guide Profile
                </div>
              </div>
            </Link>

            {/* Quick Actions */}
            <div className="py-4 border-t border-gray-200 dark:border-secondary-700">
              <div className="space-y-2">
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-secondary-800 hover:bg-gray-200 dark:hover:bg-secondary-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors duration-200 relative"
                  >
                    <BellIcon className="h-4 w-4 mr-2" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-700 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-secondary-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      
                      {/* Notifications List */}
                      <div className="max-h-80 overflow-y-auto">
                        {notificationLoading ? (
                          <div className="p-4 text-center">
                            <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 mt-2">Loading notifications...</p>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-gray-100 dark:border-secondary-700 hover:bg-gray-50 dark:hover:bg-secondary-700 cursor-pointer border-l-4 ${
                                !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                              } ${getNotificationPriorityColor(notification.priority)}`}
                              onClick={() => !notification.read && markAsRead(notification.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <span className="text-lg flex-shrink-0 mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                      {notification.title}
                                    </p>
                                    {notification.priority && notification.priority.toUpperCase() === 'HIGH' && (
                                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                                        High
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                    {formatNotificationTime(notification.createdAt)}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                  aria-label="Delete notification"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center px-4 py-2 mb-2 bg-danger-100 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 rounded-lg font-semibold text-sm hover:bg-danger-200 dark:hover:bg-danger-800 transition-colors duration-200"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
              </svg>
              Sign Out
            </button>
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

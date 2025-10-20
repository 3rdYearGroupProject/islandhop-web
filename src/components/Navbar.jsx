import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { clearUserData } from '../utils/userStorage';
import { checkProfileCompletion, clearProfileCompletionStatus } from '../utils/profileStorage';
import logo from '../assets/islandHopIcon.png';
import logoText from '../assets/IslandHop.png';
import ProfileModal from './ProfileModal';
import SettingsModal from './SettingsModal';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import './GoogleTranslate.css';
import './Navbar.css';
import api from '../api/axios';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const Navbar = () => {
  const { user } = useAuth();
  const tempUser = user;
  const location = useLocation();
  const navigate = useNavigate();
  const [showLang, setShowLang] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userMenuAnimation, setUserMenuAnimation] = useState('');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [currentUnits, setCurrentUnits] = useState('Imperial');
  const [profileLoading, setProfileLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const translateRef = useRef(null);
  const userMenuRef = useRef(null);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const notificationRef = useRef(null);

  // User profile state
  const [userProfile, setUserProfile] = useState(() => {
    if (tempUser && tempUser.profile) {
      return {
        firstName: tempUser.profile.firstName || '',
        lastName: tempUser.profile.lastName || '',
        dob: tempUser.profile.dob || '',
        nationality: tempUser.profile.nationality || '',
        email: tempUser.email || '',
        languages: tempUser.profile.languages || [],
        avatar: tempUser.displayName?.[0]?.toUpperCase() || 'U',
      };
    } else if (tempUser) {
      return {
        firstName: tempUser.displayName?.split(' ')[0] || '',
        lastName: tempUser.displayName?.split(' ')[1] || '',
        dob: '',
        nationality: '',
        email: tempUser.email || '',
        languages: [],
        avatar: tempUser.displayName?.[0]?.toUpperCase() || 'U',
      };
    } else {
      return {
        firstName: '',
        lastName: '',
        dob: '',
        nationality: '',
        email: '',
        languages: [],
        avatar: 'U',
      };
    }
  });

  // Load Google Translate script and initialize
  useEffect(() => {
    // Add styles to hide Google Translate elements
    if (!document.querySelector('#google-translate-styles')) {
      const style = document.createElement('style');
      style.id = 'google-translate-styles';
      style.textContent = `
        .goog-te-gadget { display: none !important; }
        .goog-te-banner-frame { display: none !important; }
        .goog-te-menu-value { color: #374151 !important; }
        body { top: 0 !important; }
        .skiptranslate { display: none !important; }
        .goog-te-balloon-frame { display: none !important; }
        #google_translate_element { display: none !important; }
        .goog-te-spinner-pos { display: none !important; }
        iframe.goog-te-menu-frame { display: none !important; }
        .goog-logo-link { display: none !important; }
        .goog-te-gadget-icon { display: none !important; }
      `;
      document.head.appendChild(style);
    }

    // Create visible element for Google Translate widget (but hide with CSS)
    if (!document.querySelector('#google_translate_element')) {
      const translateDiv = document.createElement('div');
      translateDiv.id = 'google_translate_element';
      translateDiv.style.cssText = 'position: absolute; left: -9999px; top: -9999px;';
      document.body.appendChild(translateDiv);
    }

    // Initialize Google Translate
    window.googleTranslateElementInit = function () {
      try {
        if (window.google && window.google.translate && window.google.translate.TranslateElement) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,si,ta,hi,zh-CN,fr,de,es,ja,ko,ar',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          }, 'google_translate_element');
          
          console.log('Google Translate initialized successfully');
          
          // Restore previous language selection after a delay
          const savedLang = localStorage.getItem('selectedLanguage');
          if (savedLang && savedLang !== 'en') {
            setTimeout(() => {
              const langCode = savedLang === 'zh' ? 'zh-CN' : savedLang;
              triggerGoogleTranslate(langCode);
            }, 1500);
          }
        }
      } catch (error) {
        console.error('Error initializing Google Translate:', error);
      }
    };

    // Helper function to trigger Google Translate
    const triggerGoogleTranslate = (langCode) => {
      const translateSelect = document.querySelector('.goog-te-combo');
      if (translateSelect) {
        const hasOptions = translateSelect.options.length > 1;
        console.log('Google Translate dropdown found. Options available:', hasOptions);
        
        if (hasOptions) {
          translateSelect.value = langCode;
          translateSelect.dispatchEvent(new Event('change', { bubbles: true }));
          console.log('Translation triggered for language:', langCode);
          return true;
        }
      }
      return false;
    };

    // Load Google Translate script if not already loaded
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => {
        console.error('Failed to load Google Translate script');
      };
      script.onload = () => {
        console.log('Google Translate script loaded successfully');
      };
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      // Script already loaded, just initialize
      window.googleTranslateElementInit();
    }

    // Cleanup function
    return () => {
      const frame = document.querySelector('.goog-te-banner-frame');
      if (frame) {
        frame.style.display = 'none';
      }
    };
  }, []);

  // Language options
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  // Handle language change
  const handleLanguageChange = (langCode, langName) => {
    console.log('🌐 Language change requested:', langCode, langName);
    
    setCurrentLang(langName);
    setShowLang(false);
    
    // Save language preference
    localStorage.setItem('selectedLanguage', langCode);
    localStorage.setItem('selectedLanguageName', langName);
    
    if (langCode === 'en') {
      // Reset to English - clear cookies and reload
      console.log('↺ Resetting to English...');
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
      localStorage.removeItem('googtrans');
      setTimeout(() => window.location.reload(), 100);
      return;
    }
    
    // Set the cookie that Google Translate uses for automatic translation
    const googleTransValue = `/en/${langCode}`;
    
    // Clear old cookies first
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
    
    // Set new translation cookie
    document.cookie = `googtrans=${googleTransValue}; path=/;`;
    document.cookie = `googtrans=${googleTransValue}; path=/; domain=${window.location.hostname}`;
    
    console.log('✓ Set googtrans cookie:', googleTransValue);
    console.log('↺ Reloading page to apply translation...');
    
    // Reload page immediately - Google Translate will read the cookie and translate automatically
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Restore saved language preference
  useEffect(() => {
    const savedLangName = localStorage.getItem('selectedLanguageName');
    if (savedLangName) {
      setCurrentLang(savedLangName);
    }
  }, []);

  // Toggle language dropdown
  const toggleLanguageDropdown = () => {
    setShowLang(!showLang);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (translateRef.current && !translateRef.current.contains(event.target)) {
        setShowLang(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Notification API functions
  const fetchNotifications = async () => {
    try {
      const auth = getAuth();
      const userEmail = auth.currentUser?.email || tempUser?.email;
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
      const auth = getAuth();
      const userEmail = auth.currentUser?.email || tempUser?.email;
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
      const auth = getAuth();
      const userEmail = auth.currentUser?.email || tempUser?.email;
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
      case 'PAYMENT': return '�';
      case 'BOOKING': return '📅';
      case 'REVIEW': return '⭐';
      case 'SYSTEM': return '⚙️';
      case '🔧 DRIVER_ASSIGNED': return '�';
      case 'DRIVER_ASSIGNED': return '🔧';
      default: return '�';
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

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (tempUser) {
      fetchUnreadCount();
      
      // Set up polling for unread count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [tempUser]);

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (showNotifications && tempUser) {
      fetchNotifications();
    }
  }, [showNotifications, tempUser]);

  // Animate user menu open/close
  useEffect(() => {
    if (showUserMenu) {
      setUserMenuAnimation('animate-navbar-dropdown');
    } else if (userMenuAnimation === 'animate-navbar-dropdown') {
      setUserMenuAnimation('animate-navbar-dropdown-leave');
      const timeout = setTimeout(() => setUserMenuAnimation(''), 180);
      return () => clearTimeout(timeout);
    }
  }, [showUserMenu]);

  // Prevent background scroll when popup is open
  useEffect(() => {
    if (showProfilePopup || showSettingsPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showProfilePopup, showSettingsPopup]);

  // Logout handler
  const handleLogout = () => {
    clearUserData();
    clearProfileCompletionStatus(); // Clear profile completion status on logout
    // Navigate to home and refresh in one smooth action
    window.location.href = '/';
  };

  // Fetch profile from backend and check completion
  useEffect(() => {
    const fetchProfile = async () => {
      if (!tempUser) {
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);
      setImageLoaded(false);
      
      try {
        const auth = getAuth();
        const email = auth.currentUser?.email || tempUser?.email || '';
        if (!email) {
          setProfileLoading(false);
          return;
        }

        const res = await api.get('/tourist/profile', { params: { email } });
        const profileData = res.data;
        
        // Convert profilePic byte array to base64
        let profilePicture = '';
        if (profileData.profilePic) {
          if (typeof profileData.profilePic === 'string') {
            profilePicture = profileData.profilePic.startsWith('data:') ? profileData.profilePic : `data:image/jpeg;base64,${profileData.profilePic}`;
          } else if (Array.isArray(profileData.profilePic)) {
            const binaryString = String.fromCharCode(...profileData.profilePic);
            profilePicture = `data:image/jpeg;base64,${btoa(binaryString)}`;
          }
        }

        const updatedProfile = {
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          dob: profileData.dob || '',
          nationality: profileData.nationality || '',
          email: profileData.email || email,
          languages: profileData.languages || [],
          profilePicture,
          avatar: profileData.firstName?.[0]?.toUpperCase() || 'U',
        };

        setUserProfile(updatedProfile);
        
        // Check and save profile completion status
        checkProfileCompletion(updatedProfile);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        // Add a small delay to show loading animation
        setTimeout(() => {
          setProfileLoading(false);
        }, 500);
      }
    };

    fetchProfile();
  }, [tempUser]);

  // Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const auth = getAuth();
        const email = auth.currentUser?.email || tempUser?.email || '';
        if (!email) return;

        const res = await api.get('/tourist/settings', { params: { email } });
        const settingsData = res.data;
        if (settingsData) {
          setCurrentCurrency(settingsData.currency || 'USD');
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };

    if (tempUser) {
      fetchSettings();
    }
  }, [tempUser]);

  return (
    <>
      <nav className="fixed top-6 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-50 bg-white/95 shadow-lg rounded-full border border-gray-200">
        {/* Blur overlay when profile popup is open */}
        {showProfilePopup && (
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" style={{ pointerEvents: 'auto' }}></div>
        )}
        <div className="w-full flex items-center justify-between h-16 sm:h-20 px-3 sm:px-6 min-w-0">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center flex-shrink-0 min-w-0 ml-2 sm:ml-3">
            <img src={logo} alt="IslandHop Icon" className="h-6 w-6 sm:h-8 sm:w-8 mr-2 flex-shrink-0" />
            <img src={logoText} alt="IslandHop" className="h-4 sm:h-6 flex-shrink-0" />
          </Link>
          
          {/* Desktop Nav Links - Center */}
          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 space-x-8 xl:space-x-12">
            <Link to="/" className={`text-gray-700 hover:text-primary-600 text-base xl:text-lg ${location.pathname === '/' ? 'font-bold' : 'font-normal'} relative transition-colors`}>
              Home
              {location.pathname === '/' && <div className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-black"></div>}
            </Link>
            <Link to="/discover" className={`text-gray-700 hover:text-primary-600 text-base xl:text-lg ${location.pathname === '/discover' ? 'font-bold' : 'font-normal'} relative transition-colors`}>
              Discover
              {location.pathname === '/discover' && <div className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-black"></div>}
            </Link>
            <Link to="/trips" className={`text-gray-700 hover:text-primary-600 text-base xl:text-lg ${location.pathname === '/trips' ? 'font-bold' : 'font-normal'} relative transition-colors`}>
              Trips
              {location.pathname === '/trips' && <div className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-black"></div>}
            </Link>
            <Link to="/pools" className={`text-gray-700 hover:text-primary-600 text-base xl:text-lg ${location.pathname === '/pools' ? 'font-bold' : 'font-normal'} relative transition-colors`}>
              Pools
              {location.pathname === '/pools' && <div className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-black"></div>}
            </Link>
            <Link to="/about" className={`text-gray-700 hover:text-primary-600 text-base xl:text-lg ${location.pathname === '/about' ? 'font-bold' : 'font-normal'} relative transition-colors`}>
              About
              {location.pathname === '/about' && <div className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-black"></div>}
            </Link>
          </div>
          
          {/* Desktop User/Currency/Language - Right */}
          <div className="hidden lg:flex items-center space-x-2 lg:space-x-4 desktop-only">
            {/* Language Switcher */}
            <div className="relative" ref={translateRef}>
              <button
                onClick={toggleLanguageDropdown}
                className="text-gray-700 hover:bg-gray-100 font-medium flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-full transition-all duration-200 text-sm lg:text-base border border-gray-200 hover:border-gray-300"
                aria-label="Change language"
              >
                <span className="text-lg mr-2">🌐</span>
                <span className="hidden sm:inline">{currentLang}</span>
                <svg 
                  className={`ml-2 h-3 w-3 lg:h-4 lg:w-4 transition-transform duration-200 ${showLang ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showLang && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2 min-w-[180px] max-h-64 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code, lang.name)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center space-x-3 transition-colors ${
                        currentLang === lang.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className={currentLang === lang.name ? 'font-semibold' : ''}>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {user ? (
              <div className="relative flex items-center space-x-2" ref={userMenuRef}>
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Notifications"
                  >
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      
                      {/* Notifications List */}
                      <div className="max-h-80 overflow-y-auto">
                        {notificationLoading ? (
                          <div className="p-4 text-center">
                            <div className="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
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
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer border-l-4 ${
                                !notification.read ? 'bg-blue-50' : ''
                              } ${getNotificationPriorityColor(notification.priority)}`}
                              onClick={() => !notification.read && markAsRead(notification.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <span className="text-lg flex-shrink-0 mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                      {notification.title}
                                    </p>
                                    {notification.priority && notification.priority.toUpperCase() === 'HIGH' && (
                                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                                        High
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-2">
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
                      
                      {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 text-center">
                          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            View all notifications
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setShowUserMenu((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={showUserMenu}
                >
                  <span className="text-gray-700 font-medium text-sm lg:text-base hidden lg:block">{user.displayName || user.email || 'User'}</span>
                  
                  {profileLoading ? (
                    <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <div className="w-4 h-4 lg:w-6 lg:h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      {(user.photoURL || userProfile.profilePicture) && !imageLoaded && (
                        <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <div className="w-4 h-4 lg:w-6 lg:h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      {user.photoURL || userProfile.profilePicture ? (
                        <img 
                          src={userProfile.profilePicture || user.photoURL} 
                          alt="Profile" 
                          className={`w-8 h-8 lg:w-12 lg:h-12 rounded-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
                          onLoad={() => setImageLoaded(true)}
                          onError={() => setImageLoaded(true)}
                        />
                      ) : (
                        <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm lg:text-lg font-medium">
                            {(user.displayName?.[0] || user.email?.[0] || userProfile.firstName?.[0] || 'U').toUpperCase()}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </button>
                {(showUserMenu || userMenuAnimation === 'animate-navbar-dropdown-leave') && (
                  <div className={`absolute right-0 top-12 w-44 bg-white border rounded-lg shadow-lg z-50 py-2 transition-all duration-200 ease-out transform ${userMenuAnimation}`}>
                    <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={e => {e.preventDefault(); setShowProfilePopup(true); setShowUserMenu(false);}}>Profile</Link>
                    <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={e => {e.preventDefault(); setShowSettingsPopup(true); setShowUserMenu(false);}}>Settings</Link>
                    <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100" onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium text-sm lg:text-base transition-colors">Sign in</Link>
                <Link to="/signup" className="ml-2 px-3 lg:px-4 py-2 lg:py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition text-sm lg:text-base">Sign up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors mobile-menu-btn flex-shrink-0"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle mobile menu"
          >
            {showMobileMenu ? (
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <>
          {/* Mobile Menu Overlay */}
          <div 
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden mobile-overlay" 
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className="fixed top-24 left-2 right-2 z-50 bg-white rounded-2xl shadow-lg border border-gray-200 lg:hidden animate-slide-in mobile-menu-panel">
            <div className="p-4 space-y-4 overflow-hidden w-full">
              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <Link 
                  to="/" 
                  className={`block px-4 py-4 rounded-lg transition-colors text-base font-medium ${location.pathname === '/' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/discover" 
                  className={`block px-4 py-4 rounded-lg transition-colors text-base font-medium ${location.pathname === '/discover' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Discover
                </Link>
                <Link 
                  to="/trips" 
                  className={`block px-4 py-4 rounded-lg transition-colors text-base font-medium ${location.pathname === '/trips' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Trips
                </Link>
                <Link 
                  to="/pools" 
                  className={`block px-4 py-4 rounded-lg transition-colors text-base font-medium ${location.pathname === '/pools' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Pools
                </Link>
                <Link 
                  to="/about" 
                  className={`block px-4 py-4 rounded-lg transition-colors text-base font-medium ${location.pathname === '/about' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  About
                </Link>
              </div>

              {/* Mobile User Section */}
              {user ? (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex items-center px-4 py-2">
                    {profileLoading ? (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <>
                        {user.photoURL || userProfile.profilePicture ? (
                          <img 
                            src={userProfile.profilePicture || user.photoURL} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {(user.displayName?.[0] || user.email?.[0] || userProfile.firstName?.[0] || 'U').toUpperCase()}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-900">{user.displayName || 'User'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    {/* Mobile Notifications */}
                    <div className="relative">
                      <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Notifications"
                      >
                        <BellIcon className="h-6 w-6" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Mobile Notifications Dropdown */}
                  {showNotifications && (
                    <div className="mx-4 bg-white border rounded-lg shadow-lg max-h-60 overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between p-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      
                      {/* Notifications List */}
                      <div className="max-h-48 overflow-y-auto">
                        {notificationLoading ? (
                          <div className="p-3 text-center">
                            <div className="inline-block w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 mt-1 text-xs">Loading...</p>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-4 text-center">
                            <BellIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-xs">No notifications</p>
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer border-l-4 ${
                                !notification.read ? 'bg-blue-50' : ''
                              } ${getNotificationPriorityColor(notification.priority)}`}
                              onClick={() => !notification.read && markAsRead(notification.id)}
                            >
                              <div className="flex items-start space-x-2">
                                <span className="text-sm flex-shrink-0 mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className={`text-xs ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                      {notification.title}
                                    </p>
                                    {notification.priority && notification.priority.toUpperCase() === 'HIGH' && (
                                      <span className="px-1 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">
                                        High
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatNotificationTime(notification.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  
                  <button 
                    className="block w-full text-left px-4 py-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-base font-medium"
                    onClick={() => {setShowProfilePopup(true); setShowMobileMenu(false);}}
                  >
                    Profile
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-base font-medium"
                    onClick={() => {setShowSettingsPopup(true); setShowMobileMenu(false);}}
                  >
                    Settings
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-base font-medium"
                    onClick={() => {handleLogout(); setShowMobileMenu(false);}}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-1">
                  <Link 
                    to="/login" 
                    className="block px-4 py-4 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-base font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign in
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block px-4 py-4 bg-primary-600 text-white text-center rounded-lg font-semibold hover:bg-primary-700 transition-colors text-base"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Mobile Language */}
              <div className="border-t border-gray-200 pt-4">
                {/* Language Switcher for Mobile */}
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-gray-700 font-medium">Language</span>
                  <div className="relative" ref={translateRef}>
                    <button
                      onClick={toggleLanguageDropdown}
                      className="flex items-center px-3 py-2 border border-gray-200 rounded-full text-sm bg-white hover:bg-gray-50 transition-all duration-200"
                    >
                      <span className="text-base mr-1.5">🌐</span>
                      <span>{currentLang}</span>
                      <svg 
                        className={`ml-1.5 h-3 w-3 transition-transform duration-200 ${showLang ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showLang && (
                      <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2 min-w-[180px] max-w-[220px] max-h-64 overflow-y-auto">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code, lang.name)}
                            className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center space-x-3 transition-colors ${
                              currentLang === lang.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span className={`truncate ${currentLang === lang.name ? 'font-semibold' : ''}`}>{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Profile Popup Modal */}
      <ProfileModal
        show={showProfilePopup}
        onClose={() => setShowProfilePopup(false)}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
      />

      {/* Settings Popup Modal */}
      <SettingsModal
        show={showSettingsPopup}
        onClose={() => setShowSettingsPopup(false)}
        currentCurrency={currentCurrency}
        setCurrentCurrency={setCurrentCurrency}
        currentUnits={currentUnits}
        setCurrentUnits={setCurrentUnits}
      />
    </>
  );
};

export default Navbar;

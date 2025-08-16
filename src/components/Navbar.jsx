import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { clearUserData } from '../utils/userStorage';
import { checkProfileCompletion, clearProfileCompletionStatus } from '../utils/profileStorage';
import logo from '../assets/islandHopIcon.png';
import logoText from '../assets/IslandHop.png';
import ProfileModal from './ProfileModal';
import SettingsModal from './SettingsModal';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import './GoogleTranslate.css';
import './Navbar.css';
import api from '../api/axios';
import { getAuth } from 'firebase/auth';

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
    const initializeGoogleTranslate = () => {
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
        `;
        document.head.appendChild(style);
      }

      if (!window.googleTranslateElementInit && !document.querySelector('#google_translate_element_hidden')) {
        const hiddenDiv = document.createElement('div');
        hiddenDiv.id = 'google_translate_element_hidden';
        hiddenDiv.style.display = 'none';
        document.body.appendChild(hiddenDiv);

        window.googleTranslateElementInit = function () {
          if (window.google && window.google.translate) {
            new window.google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,si,ta,hi,zh,fr,de,es,ja,ko,ar',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
              multilanguagePage: true
            }, 'google_translate_element_hidden');
          }
        };

        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        script.onerror = () => {
          console.warn('Failed to load Google Translate script');
        };
        document.body.appendChild(script);
      }
    };

    initializeGoogleTranslate();
  }, []);

  // Language options
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  // Handle language change
  const handleLanguageChange = (langCode, langName) => {
    setCurrentLang(langName);
    setShowLang(false);
    
    const attemptTranslation = (attempts = 0) => {
      const translateSelect = document.querySelector('.goog-te-combo');
      
      if (translateSelect && translateSelect.options.length > 1) {
        for (let i = 0; i < translateSelect.options.length; i++) {
          if (translateSelect.options[i].value === langCode) {
            translateSelect.selectedIndex = i;
            translateSelect.dispatchEvent(new Event('change', { bubbles: true }));
            return;
          }
        }
      } else if (attempts < 10) {
        setTimeout(() => attemptTranslation(attempts + 1), 500);
      }
    };

    setTimeout(() => attemptTranslation(), 100);
  };

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
    navigate('/');
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
      <nav className="fixed top-2 left-1/2 transform -translate-x-1/2 w-[calc(100%-1rem)] sm:top-4 sm:w-[calc(100%-2rem)] z-50 bg-white/95 shadow-lg rounded-xl sm:rounded-full border border-gray-200 max-w-full overflow-hidden">
        {/* Blur overlay when profile popup is open */}
        {showProfilePopup && (
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" style={{ pointerEvents: 'auto' }}></div>
        )}
        <div className="w-full flex items-center justify-between h-16 sm:h-20 px-3 sm:px-6 min-w-0">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center flex-shrink-0 min-w-0">
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
            {/* Currency Display */}
            <button className="text-gray-700 hover:text-primary-600 font-medium flex items-center text-sm lg:text-base transition-colors">
              {currentCurrency}
            </button>
            
            {/* Language Switcher */}
            <div className="relative" ref={translateRef}>
              <button
                onClick={toggleLanguageDropdown}
                className="text-gray-700 hover:text-primary-600 font-medium flex items-center px-2 lg:px-3 py-2 border rounded-lg transition-colors text-sm lg:text-base"
                aria-label="Change language"
              >
                🌐 <span className="hidden sm:inline ml-1">{currentLang}</span>
                <svg 
                  className={`ml-1 h-3 w-3 lg:h-4 lg:w-4 transition-transform ${showLang ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showLang && (
                <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 py-2 min-w-[180px] max-h-64 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code, lang.name)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-gray-700">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {user ? (
              <div className="relative flex items-center space-x-2" ref={userMenuRef}>
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
          <div className="fixed top-20 left-2 right-2 z-50 bg-white rounded-xl shadow-lg border border-gray-200 lg:hidden animate-slide-in mobile-menu-panel">
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
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{user.displayName || 'User'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
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

              {/* Mobile Language & Currency */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                {/* Language Switcher for Mobile */}
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-gray-700 font-medium">Language</span>
                  <div className="relative" ref={translateRef}>
                    <button
                      onClick={toggleLanguageDropdown}
                      className="flex items-center px-3 py-2 border rounded-lg text-sm bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      🌐 <span className="ml-1">{currentLang}</span>
                      <svg 
                        className={`ml-1 h-3 w-3 transition-transform ${showLang ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showLang && (
                      <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 py-2 min-w-[180px] max-w-[220px] max-h-64 overflow-y-auto">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code, lang.name)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="text-gray-700 truncate">{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-gray-700 font-medium">Currency</span>
                  <span className="text-gray-600 font-medium">{currentCurrency}</span>
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

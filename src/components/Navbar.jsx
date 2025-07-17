import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { clearUserData } from '../utils/userStorage';
import { checkProfileCompletion, clearProfileCompletionStatus } from '../utils/profileStorage';
import logo from '../assets/islandHopIcon.png';
import logoText from '../assets/IslandHop.png';
import ProfileModal from './ProfileModal';
import SettingsModal from './SettingsModal';
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
  const [userMenuAnimation, setUserMenuAnimation] = useState('');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [currentUnits, setCurrentUnits] = useState('Imperial');
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
      try {
        const auth = getAuth();
        const email = auth.currentUser?.email || tempUser?.email || '';
        if (!email) return;

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
      }
    };

    if (tempUser) {
      fetchProfile();
    }
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
    <nav className="fixed top-4 left-4 right-4 z-50 bg-white/95 shadow-lg rounded-full h-18 flex items-center px-6 border border-gray-200">
      {/* Blur overlay when profile popup is open */}
      {showProfilePopup && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" style={{ pointerEvents: 'auto' }}></div>
      )}
      <div className="w-full flex items-center h-20 px-6">
        {/* Logo - Left Edge */}
        <Link to="/" className="flex items-center ml-2">
          <img src={logo} alt="IslandHop Icon" className="h-8 w-8 mr-2" />
          <img src={logoText} alt="IslandHop" className="h-6" />
        </Link>
        
        {/* Nav Links - Center */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-20">
          <Link to="/" className={`text-gray-700 hover:text-primary-600 text-lg ${location.pathname === '/' ? 'font-bold' : 'font-normal'} relative`}>
            Home
            {location.pathname === '/' && <div className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-black"></div>}
          </Link>
          <Link to="/discover" className={`text-gray-700 hover:text-primary-600 text-lg ${location.pathname === '/discover' ? 'font-bold' : 'font-normal'} relative`}>
            Discover
            {location.pathname === '/discover' && <div className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-black"></div>}
          </Link>
          <Link to="/trips" className={`text-gray-700 hover:text-primary-600 text-lg ${location.pathname === '/trips' ? 'font-bold' : 'font-normal'} relative`}>
            Trips
            {location.pathname === '/trips' && <div className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-black"></div>}
          </Link>
          <Link to="/pools" className={`text-gray-700 hover:text-primary-600 text-lg ${location.pathname === '/pools' ? 'font-bold' : 'font-normal'} relative`}>
            Pools
            {location.pathname === '/pools' && <div className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-black"></div>}
          </Link>
          <Link to="/about" className={`text-gray-700 hover:text-primary-600 text-lg ${location.pathname === '/about' ? 'font-bold' : 'font-normal'} relative`}>
            About
            {location.pathname === '/about' && <div className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-black"></div>}
          </Link>
        </div>
        
        {/* Spacer for layout balance */}
        <div className="flex-1"></div>
        
        {/* User/Currency/Language - Right Edge */}
        <div className="flex items-center space-x-4">
          {/* Display current currency */}
          <button className="text-gray-700 hover:text-primary-600 font-medium flex items-center">
            {currentCurrency}
          </button>
          
          {/* Language Switcher */}
          <div className="relative" ref={translateRef}>
            <button
              onClick={toggleLanguageDropdown}
              className="text-gray-700 hover:text-primary-600 font-medium flex items-center px-3 py-2 border rounded-lg transition-colors"
              aria-label="Change language"
            >
              🌐 {currentLang}
              <svg 
                className={`ml-1 h-4 w-4 transition-transform ${showLang ? 'rotate-180' : ''}`} 
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
                <span className="text-gray-700 font-medium">{user.displayName || user.email || 'User'}</span>
                {user.photoURL || userProfile.profilePicture ? (
                  <img src={userProfile.profilePicture || user.photoURL} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-medium">
                      {(user.displayName?.[0] || user.email?.[0] || userProfile.firstName?.[0] || 'U').toUpperCase()}
                    </span>
                  </div>
                )}
              </button>
              {(showUserMenu || userMenuAnimation === 'animate-navbar-dropdown-leave') && (
                <div className={`fixed right-8 top-20 w-44 bg-white border rounded-lg shadow-lg z-50 py-2 transition-all duration-200 ease-out transform ${userMenuAnimation}`}>
                  <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={e => {e.preventDefault(); setShowProfilePopup(true); setShowUserMenu(false);}}>Profile</Link>
                  <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={e => {e.preventDefault(); setShowSettingsPopup(true); setShowUserMenu(false);}}>Settings</Link>
                  <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">Sign in</Link>
              <Link to="/signup" className="ml-2 px-4 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition navbar-signup-btn">Sign up</Link>
            </>
          )}
        </div>
      </div>

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
    </nav>
  );
};

export default Navbar;

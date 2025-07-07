import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/islandHopIcon.png'; // Icon
import logoText from '../assets/IslandHop.png'; // Full logo text
import './GoogleTranslate.css'; // Import Google Translate styles
import './Navbar.css'; // Import Navbar styles for dropdown animations

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
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

  // Load Google Translate script and initialize
  useEffect(() => {
    const initializeGoogleTranslate = () => {
      // Add Google Translate styles to hide the default widget
      if (!document.querySelector('#google-translate-styles')) {
        const style = document.createElement('style');
        style.id = 'google-translate-styles';
        style.textContent = `
          .goog-te-gadget { 
            display: none !important; 
          }
          .goog-te-banner-frame { 
            display: none !important; 
          }
          .goog-te-menu-value { 
            color: #374151 !important; 
          }
          body { 
            top: 0 !important; 
          }
          .skiptranslate { 
            display: none !important; 
          }
          .goog-te-balloon-frame {
            display: none !important;
          }
        `;
        document.head.appendChild(style);
      }

      if (!window.googleTranslateElementInit && !document.querySelector('#google_translate_element_hidden')) {
        // Create hidden element for Google Translate
        const hiddenDiv = document.createElement('div');
        hiddenDiv.id = 'google_translate_element_hidden';
        hiddenDiv.style.display = 'none';
        document.body.appendChild(hiddenDiv);

        window.googleTranslateElementInit = function () {
          if (window.google && window.google.translate) {
            new window.google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,si,ta,hi,zh,fr,de,es,ja,ko,ar', // More languages
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
    console.log('Changing language to:', langCode, langName);
    setCurrentLang(langName);
    setShowLang(false);
    
    // Wait for Google Translate to be ready and trigger language change
    const attemptTranslation = (attempts = 0) => {
      const translateSelect = document.querySelector('.goog-te-combo');
      console.log('Found translate select:', !!translateSelect);
      
      if (translateSelect && translateSelect.options.length > 1) {
        console.log('Available options:', Array.from(translateSelect.options).map(opt => ({ value: opt.value, text: opt.text })));
        
        // Find the option with the matching value
        for (let i = 0; i < translateSelect.options.length; i++) {
          if (translateSelect.options[i].value === langCode) {
            console.log('Setting language to:', langCode);
            translateSelect.selectedIndex = i;
            translateSelect.dispatchEvent(new Event('change', { bubbles: true }));
            return;
          }
        }
        console.warn('Language code not found in options:', langCode);
      } else if (attempts < 10) {
        console.log('Retrying... attempt:', attempts + 1);
        // Retry if Google Translate isn't ready yet
        setTimeout(() => attemptTranslation(attempts + 1), 500);
      } else {
        console.warn('Google Translate not ready or language not found:', langCode);
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

  // Check current language from Google Translate
  useEffect(() => {
    const checkCurrentLanguage = () => {
      const translateSelect = document.querySelector('.goog-te-combo');
      if (translateSelect && translateSelect.value) {
        const selectedLang = languages.find(lang => lang.code === translateSelect.value);
        if (selectedLang) {
          setCurrentLang(selectedLang.name);
        }
      }
    };

    // Check periodically for language changes
    const interval = setInterval(checkCurrentLanguage, 1000);
    return () => clearInterval(interval);
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

  // Prevent background scroll when profile popup is open
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

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 px-2 py-4">
      <div className="max-w-[95%] mx-auto bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50 pr-4 sm:pr-4 lg:pr-4 pl-8 flex items-center h-20">
        {/* Logo - Left Edge */}
        <Link to="/" className="flex items-center ml-2">
          <img src={logo} alt="IslandHop Icon" className="h-8 w-8 mr-2" />
          <img src={logoText} alt="IslandHop" className="h-6" />
        </Link>
        
        {/* Nav Links - Center */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-20">
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
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-medium">
                      {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                    </span>
                  </div>
                )}
              </button>
              {(showUserMenu || userMenuAnimation === 'animate-navbar-dropdown-leave') && (
                <div className={`fixed right-8 top-20 w-44 bg-white border rounded-lg shadow-lg z-50 py-2 transition-all duration-200 ease-out transform ${userMenuAnimation}`}>
                  <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={e => {e.preventDefault(); setShowProfilePopup(true); setShowUserMenu(false);}}>Profile</Link>
                  <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={e => {e.preventDefault(); setShowSettingsPopup(true); setShowUserMenu(false);}}>Settings</Link>
                  <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">Sign in</Link>
              <Link to="/signup" className="ml-2 px-4 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition">Sign up</Link>
            </>
          )}
        </div>
      </div>

      {/* Profile Popup Modal - Business Card Style */}
      {showProfilePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-lg relative animate-navbar-dropdown overflow-hidden border border-gray-200">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl transition-colors z-10" onClick={() => setShowProfilePopup(false)} aria-label="Close profile">&times;</button>
            
            {/* Business Card Header with Company Branding */}
            <div className="bg-white h-20 w-full flex items-center justify-between px-6">
              <div className="flex items-center">
                <img src={logo} alt="IslandHop Icon" className="h-8 w-8 mr-3" />
                <img src={logoText} alt="IslandHop" className="h-6" />
              </div>
            </div>
            
            {/* Business Card Body */}
            <div className="p-6">
              {/* Profile Section - Centered */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-28 h-28 bg-primary-500 rounded-full flex items-center justify-center shadow-md mb-4">
                  <span className="text-white text-4xl font-bold">{userProfile.avatar}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{userProfile.firstName} {userProfile.lastName}</h2>
                  <p className="text-gray-600 text-sm mb-2">{userProfile.email}</p>
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    {userProfile.nationality}
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="pt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Date of Birth</div>
                    <div className="font-semibold text-gray-700 text-sm">{userProfile.dob}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Languages</div>
                    <div className="font-semibold text-gray-700 text-sm">{userProfile.languages.join(', ')}</div>
                  </div>
                </div>
                
                {/* Travel Stats */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-primary-600">12</div>
                      <div className="text-xs text-gray-500">Trips</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary-600">8</div>
                      <div className="text-xs text-gray-500">Cities</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Popup Modal */}
      {showSettingsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-lg relative animate-navbar-dropdown overflow-hidden border border-gray-200">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl transition-colors z-10" onClick={() => setShowSettingsPopup(false)} aria-label="Close settings">&times;</button>
            {/* Settings Header */}
            <div className="bg-white h-20 w-full flex items-center justify-center px-6 border-b border-gray-100">
              <div className="text-2xl font-bold text-gray-800 tracking-tight">Settings</div>
            </div>
            {/* Settings Body */}
            <div className="p-6">
              {/* Settings Options */}
              <div className="space-y-4">
                {/* Change Password */}
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-800">Change Password</div>
                      <div className="text-xs text-gray-500">Update your account password</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Change Currency */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-gray-800">Currency</div>
                      <div className="text-xs text-gray-500">Select your preferred currency</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['USD', 'EUR', 'GBP', 'LKR', 'INR', 'AUD'].map((currency) => (
                      <button
                        key={currency}
                        onClick={() => setCurrentCurrency(currency)}
                        className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                          currentCurrency === currency 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-white border text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {currency}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Change Units */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-gray-800">Units</div>
                      <div className="text-xs text-gray-500">Choose measurement system</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['Imperial', 'Metric'].map((unit) => (
                      <button
                        key={unit}
                        onClick={() => setCurrentUnits(unit)}
                        className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                          currentUnits === unit 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-white border text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deactivate Account */}
                <button className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 border-2 border-red-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-red-700">Deactivate Account</div>
                      <div className="text-xs text-red-500">Permanently disable your account</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

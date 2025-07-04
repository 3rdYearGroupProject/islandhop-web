import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/islandHopIcon.png'; // Icon
import logoText from '../assets/IslandHop.png'; // Full logo text
import './GoogleTranslate.css'; // Import Google Translate styles

const Navbar = () => {
  const { user } = useAuth();
  const [showLang, setShowLang] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const translateRef = useRef(null);

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

  return (
    <nav className="bg-white w-full border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="IslandHop Icon" className="h-8 w-8 mr-2" />
          <img src={logoText} alt="IslandHop" className="h-7" />
        </Link>
        {/* Nav Links */}
        <div className="hidden md:flex space-x-6 mx-auto">
          <Link to="/discover" className="text-gray-700 hover:text-primary-600 font-medium">Discover</Link>
          <Link to="/trips" className="text-gray-700 hover:text-primary-600 font-medium">Trips</Link>
          <Link to="/pools" className="text-gray-700 hover:text-primary-600 font-medium">Pools</Link>
          <Link to="/about" className="text-gray-700 hover:text-primary-600 font-medium">About</Link>
        </div>
        {/* User/Currency/Language */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-700 hover:text-primary-600 font-medium flex items-center">
            USD
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.displayName?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-gray-700 font-medium">{user.displayName}</span>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">Sign in</Link>
              <Link to="/signup" className="ml-2 px-4 py-2 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

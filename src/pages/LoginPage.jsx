import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useToast } from '../components/ToastProvider';
import sriLankaVideo from '../assets/sri-lanka-video.mp4';
import islandhopFooterLogo from '../assets/islandhop footer 1.png';
import api from '../api/axios';
import { encryptUserData } from '../utils/userStorage';
import errorLogger from '../utils/errorLogger';
import DebugConsole from '../components/DebugConsole';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  // Log component mount
  React.useEffect(() => {
    console.log('📄 LoginPage mounted');
    errorLogger.logInfo('login_page_mounted', { 
      timestamp: new Date().toISOString(),
      url: window.location.href 
    });
  }, []);

  // Function to securely store user data
  const storeUserData = (firebaseUser, role, profileComplete) => {
    console.log('🔐 Storing user data securely...');
    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
      role: role,
      loginTimestamp: Date.now(),
      tokenExpiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      lastLoginMethod: firebaseUser.providerData?.[0]?.providerId || 'password',
      profileComplete: profileComplete // <-- Save this
    };

    console.log('📝 User data to store:', {
      uid: userData.uid,
      email: userData.email,
      role: userData.role,
      loginMethod: userData.lastLoginMethod
    });

    // Store encrypted user data
    encryptUserData(userData);
    console.log('✅ User data stored securely');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('📧 Starting email login...');
      errorLogger.logInfo('email_login_attempt', { email: formData.email });
      
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const idToken = await userCredential.user.getIdToken();

      console.log('🔑 Got Firebase token, sending to backend...');
      // Send ID token to backend for session login
      const res = await api.post('/login', { idToken });
      console.log('📨 Login response:', res);

      if (res.status === 200 && res.data && res.data.role) {
        // Store user data
        storeUserData(userCredential.user, res.data.role, res.data.profileComplete
);
        
        errorLogger.logInfo('email_login_success', { 
          email: formData.email,
          role: res.data.role,
          profileComplete: res.data.profileComplete
        });
        
        toast.success('Welcome back!', { duration: 1000 });
        setTimeout(() => {
          toast.dismiss && toast.dismiss();
        }, 1000);
        
        // Navigate based on role
        const userRole = res.data.role;
        setTimeout(() => {
          switch (userRole) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'support':
              navigate('/support/dashboard');
              break;
            case 'guide':
              navigate('/guide/dashboard');
              break;
            case 'driver':
              navigate('/driver/dashboard');
              break;
            case 'tourist':
              navigate('/trips');
            default:
              navigate('/login');
              break;
          }
        }, 1000);
      } else {
        const errorMsg = 'Login failed. Please check your credentials.';
        toast.error(errorMsg);
        setError('Login failed');
        errorLogger.logWarning('email_login_invalid_response', { 
          email: formData.email,
          responseStatus: res.status,
          responseData: res.data 
        });
      }
    } catch (err) {
      const errorMsg = err.message || 'Login error';
      setError(errorMsg);
      toast.error(err.message || 'Login failed. Please check your credentials.');
      console.error('❌ Error during email login:', err);
      
      errorLogger.logAuthError('email_login', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('🔍 Starting Google login...');
    setError('');
    setLoading(true);
    
    errorLogger.logInfo('google_login_attempt');
    
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      console.log('🔑 Got Google Firebase token, sending to backend...');
      // Send ID token to backend for session login
      const res = await api.post('/login', { idToken });
      console.log('📨 Google login response:', res);

      if (res.status === 200 && res.data && res.data.role) {
        // Store user data
        storeUserData(userCredential.user, res.data.role, res.data.profileComplete
);
        
        errorLogger.logInfo('email_login_success', { 
          email: formData.email,
          role: res.data.role,
          profileComplete: res.data.profileComplete
        });
        
        toast.success('Welcome back!', { duration: 2000 });
        
        // Navigate based on role immediately for Google login
        const userRole = res.data.role;
        setTimeout(() => {
          switch (userRole) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'support':
              navigate('/support/dashboard');
              break;
            case 'guide':
              navigate('/guide/dashboard');
              break;
            case 'driver':
              navigate('/driver/dashboard');
              break;
            case 'tourist':
              navigate('/trips');
            default:
              navigate('/login');
              break;
          }
        }, 1000);
      } else {
        const errorMsg = 'Google login failed. Please try again.';
        toast.error(errorMsg);
        setError('Google login failed');
        errorLogger.logWarning('google_login_invalid_response', { 
          email: result.user.email,
          responseStatus: res.status,
          responseData: res.data 
        });
      }
    } catch (err) {
      const errorMsg = err.message || 'Google login error';
      setError(errorMsg);
      toast.error(err.message || 'Google login failed. Please try again.');
      console.error('❌ Error during Google login:', err);
      
      errorLogger.logAuthError('google_login', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Debug Console - only show in development */}
      {process.env.NODE_ENV === 'development' && <DebugConsole />}
      
      {/* Top left logo */}
      <div 
        className="absolute top-2 left-2 md:top-4 md:left-4 lg:top-6 lg:left-6 z-20 flex items-center cursor-pointer p-2 md:p-3 lg:p-4"
        onClick={handleLogoClick}
      >
        <img src={islandhopFooterLogo} alt="IslandHop" className="h-7 md:h-8 lg:h-9 xl:h-10" />
      </div>

      {/* Left side - Video section */}
      <div className="hidden md:flex md:w-1/2 relative p-4">
        <div className="w-full h-full relative overflow-hidden rounded-2xl">
          <video 
            className="w-full h-full object-cover rounded-2xl"
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src={sriLankaVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex items-end justify-end pb-8 pr-8">
            <div className="text-right text-white">
              <h3 className="text-5xl font-normal mb-4">
                Welcome Back<br />to IslandHop
              </h3>
              <p className="text-xl opacity-90">
                Continue your journey through the beauty of Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your IslandHop account</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              />
            </div>
            
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-black hover:text-gray-700"
              >
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-black focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="mr-3">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-black hover:text-gray-700"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

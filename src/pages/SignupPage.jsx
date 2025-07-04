import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, deleteUser } from 'firebase/auth';
import { useToast } from '../components/ToastProvider';
import sriLankaVideo from '../assets/sri-lanka-video.mp4';
import islandHopLogo from '../assets/IslandHopWhite.png';
import islandHopIcon from '../assets/islandHopIcon.png';
import api from '../api/axios';
import { encryptUserData } from '../utils/userStorage';

// Add GoogleAuthProvider instance
const provider = new GoogleAuthProvider();

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'tourist';
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function to securely store user data
  const storeUserData = (firebaseUser, role) => {
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
      lastLoginMethod: firebaseUser.providerData?.[0]?.providerId || 'password'
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

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    let userCredential = null;
    try {
      // Create user in Firebase but do not navigate until backend confirms
      userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const idToken = await userCredential.user.getIdToken();
      console.log('User created:', userCredential.user);
      console.log('ID Token:', idToken);

      // Send ID token and role to backend to start session
      const res = await api.post('/tourist/session-register', {
        idToken,
        role: formData.role,
      });

      // Log backend response
      console.log('Backend response (email signup):', res);

      if (res.status === 200) {
        toast.success('Account created successfully! Please sign in to continue.', {
          duration: 3000
        });
        
        // Wait a moment for the toast to be visible, then navigate
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        // If backend fails, delete Firebase user
        await deleteUser(userCredential.user);
        toast.error('Registration failed on server. Please try again.');
        setError('Registration failed on server');
      }
    } catch (err) {
      // If Firebase user was created but any error (including network) occurs, delete user
      if (userCredential && userCredential.user) {
        try { await deleteUser(userCredential.user); } catch (e) { /* ignore */ }
      }
      
      toast.error(err.message || 'Registration failed. Please try again.');
      
      setError(err.message || 'Registration error');
      console.log('Error during email signup:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    
    let result = null;
    try {
      result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      console.log('Google user:', result.user);
      console.log('Google ID Token:', idToken);

      // For Google signup, try to register first, if user exists, login instead
      let res;
      try {
        res = await api.post('/tourist/session-register', {
          idToken,
          role: formData.role,
        });
      } catch (registerError) {
        // If registration fails (user might already exist), try login
        console.log('Registration failed, trying login...');
        res = await api.post('/login', { idToken });
      }

      // Log backend response
      console.log('Backend response (Google signup/login):', res);

      if (res.status === 200 && res.data && res.data.role) {
        const role = res.data.role;
        console.log('👤 User role:', role);

        // Store user data securely
        storeUserData(result.user, role);

        toast.success('Successfully signed in with Google!', {
          position: 'top-right',
          autoClose: 2000,
        });

        // Redirect based on user role immediately (for Google users)
        setTimeout(() => {
          switch (role) {
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
              navigate('/tourist');
              break;
            default:
              navigate('/dashboard');
              break;
          }
        }, 1000);
      } else {
        // If backend fails, delete Firebase user
        // Use a promise instead of await inside setTimeout
        deleteUser(result.user).then(() => {
          toast.error('Google authentication failed on server. Please try again.', {
            position: 'top-right',
            autoClose: 4000,
          });
          setError('Google authentication failed on server');
        });
      }
    } catch (err) {
      // If Firebase user was created but any error (including network) occurs, delete user
      if (result && result.user) {
        // Use a promise instead of await inside catch
        deleteUser(result.user).catch(() => {});
      }
      
      toast.error(err.message || 'Google sign-up failed. Please try again.', {
        position: 'top-right',
        autoClose: 4000,
      });
      
      setError(err.message || 'Google sign-up error');
      console.log('Error during Google signup:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Top left logo */}
      <div 
        className="absolute top-8 left-8 z-20 flex items-center gap-3 cursor-pointer"
        onClick={handleLogoClick}
      >
        <img src={islandHopIcon} alt="IslandHop Icon" className="h-10 w-10" />
        <img src={islandHopLogo} alt="IslandHop" className="h-7" />
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
                Welcome<br />to IslandHop
              </h3>
              <p className="text-xl opacity-90">
                Discover the beauty of Sri Lanka with our curated travel experiences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">Create Account</h2>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleEmailSignup} className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              />
            </div>
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
            
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
            
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
                Forgot Password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
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
            onClick={handleGoogleSignup}
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
          
          <div className="space-y-2 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-black hover:text-gray-700"
              >
                Login
              </Link>
            </p>
            
            <div className="text-gray-600">
              Looking to earn with IslandHop?{' '}
              <Link
                to="/signup/professional"
                className="font-medium text-black hover:text-gray-700"
              >
                Join as a Professional
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import sriLankaVideo from '../assets/sri-lanka-video.mp4';
import islandHopLogo from '../assets/IslandHopWhite.png';
import islandHopIcon from '../assets/islandHopIcon.png';

const ProfessionalSignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.role) {
      setError('Please select your professional role');
      toast.error('Please select your professional role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signup(formData.email, formData.password, '', formData.role);
      toast.success('Professional account created successfully! Please sign in to continue.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setError(error.message || 'Registration failed');
      toast.error(error.message || 'Registration failed. Please try again.');
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
              <h3 className="text-5xl font-normal mb-4">Join Our Professional Network</h3>
              <p className="text-xl opacity-90">
                Become a part of Sri Lanka's premier travel service community
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">Professional Account</h2>
            <p className="text-gray-600">Join as a driver or guide and start earning with IslandHop</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Your Role</h3>
            <div className="space-y-3">
              <label className={`block border-2 rounded-lg p-4 cursor-pointer transition ${formData.role === 'driver' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  name="role"
                  value="driver"
                  checked={formData.role === 'driver'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Driver</h4>
                    <p className="text-sm text-gray-600">Provide transportation services to travelers</p>
                  </div>
                </div>
              </label>
              
              <label className={`block border-2 rounded-lg p-4 cursor-pointer transition ${formData.role === 'guide' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  name="role"
                  value="guide"
                  checked={formData.role === 'guide'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Tour Guide</h4>
                    <p className="text-sm text-gray-600">Share your local knowledge and expertise</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? 'Creating Account...' : 'Create Professional Account'}
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
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-black focus:ring-offset-2 transition"
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
              Looking for regular account?{' '}
              <Link
                to="/signup"
                className="font-medium text-black hover:text-gray-700"
              >
                Sign up as Traveler
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSignupPage;

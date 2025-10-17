import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import useGeolocation from '../hooks/useGeolocation';


const PanicAlertModal = ({ onClose }) => {
  const { user } = useAuth();
  const { location, loading: locationLoading, error: locationError, getCurrentPosition, isSupported } = useGeolocation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  console.log('User from panic alert modal:', user);

  // Get location when component mounts
  useEffect(() => {
    if (isSupported && !location.latitude) {
      setShowLocationPrompt(true);
      getCurrentPosition();
    }
  }, [isSupported, location.latitude, getCurrentPosition]);

  // Handle sending panic alert
  const handleSendAlert = async () => {
    if (!user) {
      setSubmitError('User not authenticated. Please login first.');
      return;
    }

    // Check if we have location data
    if (!location.latitude || !location.longitude) {
      setSubmitError('Location data is required for panic alerts. Please allow location access.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare the alert payload
      const payload = {
        userId: user?.uid || user?.id,
        userEmail: user?.email,
        userName: user?.displayName || user?.name,
        userPhone: user?.phoneNumber || user?.phone,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy || null,
          timestamp: location.timestamp || new Date().toISOString()
        },
        alertTimestamp: new Date().toISOString(),
        status: 'not_resolved',
        priority: 'high',
        type: 'panic_alert',
        message: 'Emergency panic alert triggered by user',
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language
        }
      };

      console.log('🚨 Sending panic alert:', payload);

      // Send panic alert using native fetch
      //const baseUrl = process.env.REACT_APP_API_BASE_URL_ADMIN_SERVICES || 'http://localhost:8091/api/v1';
      const response = await fetch(`http://localhost:8062/panic-alerts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //credentials: 'include', 
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Panic alert sent successfully:', result);
      setSubmitSuccess(true);
      
      // Auto-close after 2 seconds on success
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('❌ Failed to send panic alert:', error);
      setSubmitError(error.message || 'Failed to send panic alert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Retry getting location
  const retryLocation = () => {
    setSubmitError(null);
    getCurrentPosition();
  };

  // Render success state
  if (submitSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all">
        <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 w-full max-w-md border border-green-100 relative animate-fade-in-up">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-green-600 mb-4">Alert Sent Successfully!</h2>
            <p className="text-gray-700 mb-4">
              Your panic alert has been sent to our support team. They will respond immediately.
            </p>
            <p className="text-sm text-gray-500">
              This window will close automatically...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 w-full max-w-md border border-red-100 relative animate-fade-in-up">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-200 transition"
          onClick={onClose}
          aria-label="Close modal"
          disabled={isSubmitting}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-extrabold text-red-600 mb-6 flex items-center gap-3">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.168 8.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Send Panic Alert
        </h2>

        {/* Location Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-semibold text-gray-700">Location Status:</span>
          </div>
          
          {!isSupported && (
            <div className="text-red-600 text-sm">
              ❌ Geolocation not supported by your browser
            </div>
          )}
          
          {isSupported && locationLoading && (
            <div className="flex items-center gap-2 text-blue-600 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Getting your location...
            </div>
          )}
          
          {isSupported && locationError && (
            <div className="text-red-600 text-sm">
              ❌ {locationError.message}
              <button 
                onClick={retryLocation}
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
                disabled={locationLoading}
              >
                Retry
              </button>
            </div>
          )}
          
          {isSupported && location.latitude && location.longitude && (
            <div className="text-green-600 text-sm">
              ✅ Location captured successfully
              {location.accuracy && (
                <div className="text-xs text-gray-500 mt-1">
                  Accuracy: ±{Math.round(location.accuracy)}m
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800 text-sm">{submitError}</span>
            </div>
          </div>
        )}

        <p className="mb-8 text-gray-700 text-base text-center">
          Are you sure you want to send a panic alert? <br />
          Our support team will be notified immediately and will receive your current location.
        </p>
        
        <button
          className={`w-full py-3 rounded-full font-semibold text-lg shadow transition focus:outline-none focus:ring-2 focus:ring-red-200 ${
            isSubmitting || locationLoading || (!location.latitude && isSupported)
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          onClick={handleSendAlert}
          disabled={isSubmitting || locationLoading || (!location.latitude && isSupported)}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Sending Alert...
            </div>
          ) : locationLoading ? (
            'Getting Location...'
          ) : !location.latitude && isSupported ? (
            'Waiting for Location...'
          ) : (
            'Send Emergency Alert'
          )}
        </button>
        
        {/* Info text */}
        <p className="mt-4 text-xs text-gray-500 text-center">
          Your location and contact information will be shared with our emergency response team.
        </p>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.3s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PanicAlertModal;

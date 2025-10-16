import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for getting user's current location
 * @param {Object} options - Geolocation options
 * @returns {Object} - Location state object
 */
const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  // Default options for geolocation
  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000, // 10 seconds
    maximumAge: 60000, // 1 minute
    ...options
  };

  // Check if geolocation is supported
  useEffect(() => {
    if (!navigator.geolocation) {
      setIsSupported(false);
      setError(new Error('Geolocation is not supported by this browser'));
    }
  }, []);

  // Get current position
  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported'));
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const timestamp = new Date(position.timestamp);
        
        setLocation({
          latitude,
          longitude,
          accuracy,
          timestamp
        });
        setLoading(false);
        setError(null);
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred while retrieving location';
            break;
        }
        
        setError(new Error(errorMessage));
        setLoading(false);
      },
      defaultOptions
    );
  }, [defaultOptions]);

  // Watch position (for continuous tracking)
  const watchPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported'));
      return null;
    }

    setLoading(true);
    setError(null);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const timestamp = new Date(position.timestamp);
        
        setLocation({
          latitude,
          longitude,
          accuracy,
          timestamp
        });
        setLoading(false);
        setError(null);
      },
      (error) => {
        let errorMessage = 'Failed to watch location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred while watching location';
            break;
        }
        
        setError(new Error(errorMessage));
        setLoading(false);
      },
      defaultOptions
    );

    return watchId;
  }, [defaultOptions]);

  // Clear watch
  const clearWatch = useCallback((watchId) => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Reset location state
  const resetLocation = useCallback(() => {
    setLocation({
      latitude: null,
      longitude: null,
      accuracy: null,
      timestamp: null
    });
    setError(null);
    setLoading(false);
  }, []);

  return {
    location,
    loading,
    error,
    isSupported,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    resetLocation
  };
};

export default useGeolocation;
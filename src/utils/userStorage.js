// User storage utility for managing user data in localStorage
const USER_DATA_KEY = 'islandhop_user_data';

/**
 * Save user data to localStorage
 * @param {Object} userData - User data object
 */
export const setUserData = (userData) => {
  try {
    const dataToStore = {
      ...userData,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
};

/**
 * Get user data from localStorage
 * @returns {Object|null} - User data object or null if not found
 */
export const getUserData = () => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    if (data) {
      const userData = JSON.parse(data);
      // Check if data is older than 24 hours
      const timestamp = new Date(userData.timestamp);
      const now = new Date();
      const hoursDiff = (now - timestamp) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        // Data is stale, remove it
        clearUserData();
        return null;
      }
      
      return userData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data from localStorage:', error);
    return null;
  }
};

/**
 * Clear user data from localStorage
 */
export const clearUserData = () => {
  try {
    localStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Error clearing user data from localStorage:', error);
  }
};

/**
 * Update specific fields in user data
 * @param {Object} updates - Fields to update
 */
export const updateUserData = (updates) => {
  try {
    const currentData = getUserData();
    if (currentData) {
      const updatedData = {
        ...currentData,
        ...updates,
        timestamp: new Date().toISOString()
      };
      setUserData(updatedData);
    }
  } catch (error) {
    console.error('Error updating user data:', error);
  }
};

/**
 * Check if user is authenticated based on localStorage
 * @returns {boolean} - True if user is authenticated
 */
export const isUserAuthenticated = () => {
  const userData = getUserData();
  return userData && userData.uid;
};

/**
 * Get user role from localStorage
 * @returns {string|null} - User role or null
 */
export const getUserRole = () => {
  const userData = getUserData();
  return userData ? userData.role : null;
};

/**
 * Save user preferences to localStorage
 * @param {Object} preferences - User preferences object
 */
export const saveUserPreferences = (preferences) => {
  try {
    const key = 'islandhop_user_preferences';
    localStorage.setItem(key, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

/**
 * Get user preferences from localStorage
 * @returns {Object|null} - User preferences or null
 */
export const getUserPreferences = () => {
  try {
    const key = 'islandhop_user_preferences';
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return null;
  }
};

/**
 * Clear all user-related data from localStorage
 */
export const clearAllUserData = () => {
  try {
    const keys = [
      'islandhop_user_data',
      'islandhop_user_preferences',
      'islandhop_search_history',
      'islandhop_recent_locations'
    ];
    
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing all user data:', error);
  }
};

/**
 * Save search history
 * @param {Array} searchHistory - Array of search terms
 */
export const saveSearchHistory = (searchHistory) => {
  try {
    const key = 'islandhop_search_history';
    const limitedHistory = searchHistory.slice(0, 10); // Keep only last 10 searches
    localStorage.setItem(key, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
};

/**
 * Get search history
 * @returns {Array} - Array of search terms
 */
export const getSearchHistory = () => {
  try {
    const key = 'islandhop_search_history';
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
};

/**
 * Save recent locations
 * @param {Array} locations - Array of location objects
 */
export const saveRecentLocations = (locations) => {
  try {
    const key = 'islandhop_recent_locations';
    const limitedLocations = locations.slice(0, 5); // Keep only last 5 locations
    localStorage.setItem(key, JSON.stringify(limitedLocations));
  } catch (error) {
    console.error('Error saving recent locations:', error);
  }
};

/**
 * Get recent locations
 * @returns {Array} - Array of location objects
 */
export const getRecentLocations = () => {
  try {
    const key = 'islandhop_recent_locations';
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting recent locations:', error);
    return [];
  }
};

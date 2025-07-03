import { useState, useEffect, useContext, createContext } from 'react';

// Create mock auth context
const MockAuthContext = createContext();

// Mock users data
const MOCK_USERS = {
  'tourist@test.com': {
    uid: 'tourist-123',
    email: 'tourist@test.com',
    displayName: 'John Tourist',
    role: 'tourist',
    profile: {
      firstName: 'John',
      lastName: 'Tourist',
      profilePicture: 'https://via.placeholder.com/150',
      joinDate: '2024-01-15',
      location: 'Colombo, Sri Lanka',
      tripCount: 12,
      reviewCount: 28,
      isProfileComplete: true
    }
  },
  'guide@test.com': {
    uid: 'guide-456',
    email: 'guide@test.com',
    displayName: 'Sarah Guide',
    role: 'guide',
    profile: {
      firstName: 'Sarah',
      lastName: 'Guide',
      profilePicture: 'https://via.placeholder.com/150',
      joinDate: '2023-06-10',
      location: 'Kandy, Sri Lanka',
      rating: 4.8,
      guidedTours: 156,
      languages: ['English', 'Sinhala', 'Tamil'],
      isProfileComplete: true
    }
  },
  'driver@test.com': {
    uid: 'driver-789',
    email: 'driver@test.com',
    displayName: 'Mike Driver',
    role: 'driver',
    profile: {
      firstName: 'Mike',
      lastName: 'Driver',
      profilePicture: 'https://via.placeholder.com/150',
      joinDate: '2023-03-20',
      location: 'Galle, Sri Lanka',
      rating: 4.9,
      completedRides: 324,
      vehicleType: 'Car',
      isProfileComplete: true
    }
  },
  'admin@test.com': {
    uid: 'admin-000',
    email: 'admin@test.com',
    displayName: 'Admin User',
    role: 'admin',
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      profilePicture: 'https://via.placeholder.com/150',
      joinDate: '2023-01-01',
      location: 'Colombo, Sri Lanka',
      isProfileComplete: true
    }
  }
};

// Mock auth provider component
export function MockAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved auth state
    const savedUser = localStorage.getItem('mockAuth');
    const savedDarkMode = localStorage.getItem('isDarkMode');
    
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setUserRole(userData.role);
      setUserProfile(userData.profile);
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists
      const mockUser = MOCK_USERS[email];
      if (!mockUser) {
        throw new Error('User not found');
      }

      // For demo purposes, any password works
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Set user state
      setUser(mockUser);
      setUserRole(mockUser.role);
      setUserProfile(mockUser.profile);
      
      // Save to localStorage
      localStorage.setItem('mockAuth', JSON.stringify(mockUser));
      
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (email, password, userData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (MOCK_USERS[email]) {
        throw new Error('User already exists');
      }

      // Create new user
      const newUser = {
        uid: `user-${Date.now()}`,
        email,
        displayName: userData.displayName || email.split('@')[0],
        role: userData.role || 'tourist',
        profile: {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          profilePicture: 'https://via.placeholder.com/150',
          joinDate: new Date().toISOString().split('T')[0],
          location: userData.location || '',
          isProfileComplete: false,
          ...userData
        }
      };

      // Add to mock users (in a real app, this would be sent to server)
      MOCK_USERS[email] = newUser;

      // Set user state
      setUser(newUser);
      setUserRole(newUser.role);
      setUserProfile(newUser.profile);
      
      // Save to localStorage
      localStorage.setItem('mockAuth', JSON.stringify(newUser));
      
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setUserRole(null);
      setUserProfile(null);
      localStorage.removeItem('mockAuth');
      return { success: true };
    } catch (error) {
      throw new Error('Logout failed');
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedProfile = { ...userProfile, ...profileData };
      const updatedUser = { ...user, profile: updatedProfile };
      
      setUserProfile(updatedProfile);
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem('mockAuth', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      throw new Error('Profile update failed');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('isDarkMode', JSON.stringify(newDarkMode));
    
    // Update HTML class for Tailwind dark mode
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const resetPassword = async (email) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!MOCK_USERS[email]) {
        throw new Error('User not found');
      }
      
      // In a real app, this would send a reset email
      console.log(`Password reset email sent to ${email}`);
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Password reset failed');
    }
  };

  const value = {
    user,
    userRole,
    userProfile,
    loading,
    isDarkMode,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    toggleDarkMode
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
}

// Custom hook to use mock auth context
export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
};

// Export available mock users for development
export const AVAILABLE_MOCK_USERS = Object.keys(MOCK_USERS).map(email => ({
  email,
  role: MOCK_USERS[email].role,
  displayName: MOCK_USERS[email].displayName
}));

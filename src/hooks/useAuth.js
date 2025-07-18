import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserData, getUserRole, isLoggedIn, clearUserData, getUserDisplayInfo } from '../utils/userStorage';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('🔐 Setting up auth listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('🔄 Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      
      if (firebaseUser) {
        // User is logged in, check local storage
        const userData = getUserData();
        const userRole = getUserRole();
        
        if (userData && userRole) {
          console.log('✅ Valid session found');
          setUser(userData);
          setRole(userRole);
          setIsAuthenticated(true);
        } else {
          console.log('❌ No valid session, clearing auth');
          clearUserData();
          setUser(null);
          setRole(null);
          setIsAuthenticated(false);
        }
      } else {
        // User is logged out
        console.log('👋 User logged out, clearing data');
        clearUserData();
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserData = () => {
    console.log('🔄 Refreshing user data...');
    const userData = getUserData();
    const userRole = getUserRole();
    
    if (userData && userRole) {
      setUser(userData);
      setRole(userRole);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    console.log('👋 Logging out...');
    try {
      await auth.signOut();
      clearUserData();
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  return {
    user,
    role,
    loading,
    isAuthenticated,
    isLoggedIn: isLoggedIn(),
    displayInfo: getUserDisplayInfo(),
    refreshUserData,
    logout
  };
};
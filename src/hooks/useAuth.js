import { useState, useEffect, useContext, createContext } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { getUserData, setUserData, clearUserData } from '../utils/userStorage';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('isDarkMode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(firebaseUser);
            setUserRole(userData.role);
            setUserProfile(userData);
            
            // Cache user data
            setUserData({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: userData.role,
              profile: userData
            });
          } else {
            // User document doesn't exist, create one
            const newUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || '',
              role: 'tourist', // default role
              createdAt: new Date().toISOString(),
              isProfileComplete: false
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
            setUser(firebaseUser);
            setUserRole('tourist');
            setUserProfile(newUserData);
            
            // Cache user data
            setUserData({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: 'tourist',
              profile: newUserData
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Try to get cached data
          const cachedData = getUserData();
          if (cachedData) {
            setUser(firebaseUser);
            setUserRole(cachedData.role);
            setUserProfile(cachedData.profile);
          }
        }
      } else {
        setUser(null);
        setUserRole(null);
        setUserProfile(null);
        clearUserData();
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Signup function
  const signup = async (email, password, displayName, role = 'tourist') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile
      await updateProfile(user, {
        displayName: displayName
      });
      
      // Create user document in Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: role,
        createdAt: new Date().toISOString(),
        isProfileComplete: false
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Google sign in
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      clearUserData();
    } catch (error) {
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), updates);
        setUserProfile(prev => ({ ...prev, ...updates }));
        
        // Update cached data
        const cachedData = getUserData();
        if (cachedData) {
          setUserData({
            ...cachedData,
            profile: { ...cachedData.profile, ...updates }
          });
        }
      }
    } catch (error) {
      throw error;
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('isDarkMode', JSON.stringify(newDarkMode));
  };

  const value = {
    user,
    userRole,
    userProfile,
    loading,
    isDarkMode,
    login,
    signup,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    toggleDarkMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

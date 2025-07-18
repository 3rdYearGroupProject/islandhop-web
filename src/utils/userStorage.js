// Simple encryption/decryption using browser's built-in crypto
class UserDataManager {
  constructor() {
    this.storageKey = '__ih_session__';
    this.roleKey = '__ih_role__';
    this.secretKey = this.generateBrowserSecret();
  }

  // Generate a consistent secret based on browser characteristics
  generateBrowserSecret() {
    const browserInfo = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().toDateString() // Changes daily for auto-expiration
    ].join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < browserInfo.length; i++) {
      const char = browserInfo.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Simple encryption using XOR and base64
  encrypt(data) {
    const jsonString = JSON.stringify(data);
    const secret = this.secretKey;
    let encrypted = '';
    
    for (let i = 0; i < jsonString.length; i++) {
      const charCode = jsonString.charCodeAt(i) ^ secret.charCodeAt(i % secret.length);
      encrypted += String.fromCharCode(charCode);
    }
    
    return btoa(encrypted);
  }

  // Simple decryption
  decrypt(encryptedData) {
    try {
      const encrypted = atob(encryptedData);
      const secret = this.secretKey;
      let decrypted = '';
      
      for (let i = 0; i < encrypted.length; i++) {
        const charCode = encrypted.charCodeAt(i) ^ secret.charCodeAt(i % secret.length);
        decrypted += String.fromCharCode(charCode);
      }
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('🔓 Failed to decrypt user data:', error);
      return null;
    }
  }

  // Store user data with obfuscated keys
  storeUserData(userData) {
    try {
      console.log('💾 Storing encrypted user data...');
      
      // Store main user data encrypted
      const encryptedData = this.encrypt(userData);
      localStorage.setItem(this.storageKey, encryptedData);
      
      // Store role separately with additional obfuscation
      const roleData = {
        r: userData.role,
        t: Date.now(),
        uid: userData.uid.slice(-8) // Last 8 chars of UID
      };
      const encryptedRole = this.encrypt(roleData);
      sessionStorage.setItem(this.roleKey, encryptedRole);
      
      console.log('✅ User data stored successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to store user data:', error);
      return false;
    }
  }

  // Retrieve user data
  getUserData() {
    try {
      const encryptedData = localStorage.getItem(this.storageKey);
      if (!encryptedData) {
        console.log('📭 No user data found');
        return null;
      }

      const userData = this.decrypt(encryptedData);
      if (!userData) {
        console.log('🔓 Failed to decrypt user data');
        this.clearUserData();
        return null;
      }

      // Check if token is expired
      if (userData.tokenExpiresAt && userData.tokenExpiresAt < Date.now()) {
        console.log('⏰ User session expired');
        this.clearUserData();
        return null;
      }

      console.log('✅ Retrieved user data successfully');
      return userData;
    } catch (error) {
      console.error('❌ Error retrieving user data:', error);
      this.clearUserData();
      return null;
    }
  }

  // Get user role only
  getUserRole() {
    try {
      const encryptedRole = sessionStorage.getItem(this.roleKey);
      if (!encryptedRole) {
        console.log('📭 No role data found');
        return null;
      }

      const roleData = this.decrypt(encryptedRole);
      if (!roleData || !roleData.r) {
        console.log('🔓 Failed to decrypt role data');
        return null;
      }

      return roleData.r;
    } catch (error) {
      console.error('❌ Error retrieving user role:', error);
      return null;
    }
  }

  // Get user UID only
  getUserUID() {
    const userData = this.getUserData();
    return userData ? userData.uid : null;
  }

  // Check if user is logged in
  isLoggedIn() {
    const userData = this.getUserData();
    return userData !== null;
  }

  // Clear all user data
  clearUserData() {
    console.log('🗑️ Clearing user data...');
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.roleKey);
    
    // Clear any other related storage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('__ih_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('✅ User data cleared');
  }

  // Update user data (for profile updates)
  updateUserData(updates) {
    const currentData = this.getUserData();
    if (!currentData) {
      console.log('❌ No current user data to update');
      return false;
    }

    const updatedData = { ...currentData, ...updates };
    return this.storeUserData(updatedData);
  }

  // Check role authorization
  hasRole(requiredRole) {
    const userRole = this.getUserRole();
    if (!userRole) return false;

    // Define role hierarchy
    const roleHierarchy = {
      'admin': 5,
      'support': 4,
      'guide': 3,
      'driver': 2,
      'tourist': 1
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  }

  // Get user display info (safe for UI)
  getUserDisplayInfo() {
    const userData = this.getUserData();
    if (!userData) return null;

    return {
      displayName: userData.displayName || userData.email?.split('@')[0] || 'User',
      email: userData.email,
      photoURL: userData.photoURL,
      role: userData.role,
      emailVerified: userData.emailVerified
    };
  }
}

// Create singleton instance
const userDataManager = new UserDataManager();

// Export convenient functions
export const encryptUserData = (userData) => userDataManager.storeUserData(userData);
export const getUserData = () => userDataManager.getUserData();
export const getUserRole = () => userDataManager.getUserRole();
export const getUserUID = () => userDataManager.getUserUID();
export const isLoggedIn = () => userDataManager.isLoggedIn();
export const clearUserData = () => userDataManager.clearUserData();
export const updateUserData = (updates) => userDataManager.updateUserData(updates);
export const hasRole = (role) => userDataManager.hasRole(role);
export const getUserDisplayInfo = () => userDataManager.getUserDisplayInfo();
export const decryptUserData = (data) => userDataManager.decrypt(data);

// Export the manager for advanced usage
export default userDataManager;
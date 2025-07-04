import React, { useState, useEffect } from 'react';
import {
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '../../hooks/useAuth';
import { getUserData } from '../../utils/userStorage';
import islandHopIcon from '../../assets/islandHopIcon.png';

const ProfileDetails = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState({
    firstName: 'System',
    lastName: 'Administrator',
    email: '',
    role: 'System Admin',
    avatar: '',
    lastActive: 'Loading...'
  });
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Function to format the last active time
  const formatLastActive = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const lastActive = new Date(timestamp);
    const diff = now - lastActive;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // Get user data from Firebase and local storage
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      const names = userData.displayName ? userData.displayName.split(' ') : ['System', 'Administrator'];
      setUser({
        firstName: names[0] || 'System',
        lastName: names.slice(1).join(' ') || 'Administrator',
        email: userData.email || 'admin@islandhop.com',
        role: userData.role || 'System Admin',
        avatar: userData.photoURL || '',
        lastActive: userData.loginTimestamp ? formatLastActive(userData.loginTimestamp) : 'Unknown',
      });
    }
    // Check Firebase for current user metadata
    const currentUser = auth.currentUser;
    if (currentUser) {
      currentUser.reload().then(() => {
        if (currentUser.metadata) {
          const lastLoginTime = currentUser.metadata.lastSignInTime;
          setUser(prev => ({
            ...prev,
            email: currentUser.email || prev.email,
            lastActive: formatLastActive(new Date(lastLoginTime)) || prev.lastActive,
          }));
        }
      }).catch(err => {
        console.error('Error fetching user metadata:', err);
      });
    }
  }, [authUser]);

  const notify = (msg, type = 'success') => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Password reset handler with improved Firebase integration
  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      // Use Firebase Auth to send password reset email
      await sendPasswordResetEmail(auth, user.email);
      setShowPasswordReset(false);
      notify('Password reset email sent successfully!');
    } catch (error) {
      console.error('Password reset error:', error);
      notify('Failed to send password reset email: ' + error.message, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">

        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 overflow-hidden">
          {/* Cover Section */}
          <div className="h-12 bg-gradient-to-r from-primary-600 to-primary-800"></div>
          
          {/* Profile Info Section */}
          <div className="px-6 pb-6">
            <div className="flex items-start justify-between -mt-10 mb-6">
              <div className="flex items-end space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 bg-white dark:bg-secondary-700 rounded-xl border-4 border-white dark:border-secondary-700 flex items-center justify-center overflow-hidden">
                    <img src={islandHopIcon} alt="IslandHop Icon" className="w-20 h-20 object-contain" />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="pt-12">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300 px-2 py-1 rounded-full text-xs font-medium">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-secondary-700">
              <div className="flex justify-between items-center mb-4">
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  Last active: {user.lastActive}
                </div>
              </div>
              <button
                onClick={() => setShowPasswordReset(true)}
                className="px-4 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>

        {/* Password Reset Modal */}
        {showPasswordReset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Reset Password
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                A password reset email will be sent to:
              </p>
              <p className="text-primary-600 dark:text-primary-400 font-medium mb-6">
                {user.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                The email will contain a secure link to reset your password. The link will expire in 1 hour for security reasons.
              </p>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setShowPasswordReset(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordReset}
                  disabled={loading}
                  className="px-4 py-2 bg-warning-600 text-white hover:bg-warning-700 rounded transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-success-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;

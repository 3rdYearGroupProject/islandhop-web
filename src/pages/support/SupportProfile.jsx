import React, { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { auth } from '../../firebase';
import { sendPasswordResetEmail, onAuthStateChanged, deleteUser as firebaseDeleteUser } from 'firebase/auth';
import api from '../../api/axios';
import profilePic from '../../assets/islandHopIcon.png';

const SupportProfile = () => {
  const [user, setUser] = useState({
    firstName: 'Alex',
    lastName: 'Support',
    email: 'alex.support@islandhop.com',
    phone: '+94 77 234 5678',
    address: 'Kandy, Sri Lanka',
    role: 'Support Agent',
    avatar: profilePic,
    joinedDate: 'Loading...',
    lastActive: 'Loading...'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);

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

  // Function to format the joined date
  const formatJoinedDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const joinedDate = new Date(timestamp);
    return joinedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get user's last sign-in time from Firebase Auth and load profile from backend
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const lastSignInTime = currentUser.metadata.lastSignInTime;
        const creationTime = currentUser.metadata.creationTime;
        const formattedLastActive = formatLastActive(lastSignInTime);
        const formattedJoinedDate = formatJoinedDate(creationTime);
        
        try {
          const response = await api.get(`/support/profile?email=${currentUser.email}`);
          if (response.status === 200 && response.data) {
            const profileData = response.data;
            setUser(prevUser => ({
              ...prevUser,
              firstName: profileData.firstName || prevUser.firstName,
              lastName: profileData.lastName || prevUser.lastName,
              email: profileData.email || currentUser.email,
              phone: profileData.contactNo || prevUser.phone,
              address: profileData.address || prevUser.address,
              role: profileData.role || prevUser.role,
              avatar: profileData.profilePicture || prevUser.avatar,
              joinedDate: formattedJoinedDate,
              lastActive: formattedLastActive
            }));
            
            setEditedUser(prevUser => ({
              ...prevUser,
              firstName: profileData.firstName || prevUser.firstName,
              lastName: profileData.lastName || prevUser.lastName,
              phone: profileData.contactNo || prevUser.phone,
              address: profileData.address || prevUser.address
            }));
            
            setAvatarPreview(profileData.profilePicture || prevUser.avatar);
          } else {
            setUser(prevUser => ({
              ...prevUser,
              email: currentUser.email,
              joinedDate: formattedJoinedDate,
              lastActive: formattedLastActive
            }));
          }
        } catch (error) {
          console.warn('Failed to fetch profile from backend:', error);
          setUser(prevUser => ({
            ...prevUser,
            email: currentUser.email,
            joinedDate: formattedJoinedDate,
            lastActive: formattedLastActive
          }));
        }
      } else {
        setUser(prevUser => ({
          ...prevUser,
          joinedDate: 'Unknown',
          lastActive: 'Not signed in'
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const notify = (msg, type = 'success') => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleEdit = () => {
    setEditedUser(user);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', user.email);
      formData.append('firstName', editedUser.firstName);
      formData.append('lastName', editedUser.lastName);
      formData.append('contactNo', editedUser.phone);
      formData.append('address', editedUser.address);
      
      if (avatarPreview !== user.avatar) {
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput && fileInput.files[0]) {
          formData.append('profilePicture', fileInput.files[0]);
        }
      }
      
      const response = await api.put('/support/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.status === 200) {
        const updatedProfile = response.data;
        setUser(prev => ({
          ...prev,
          firstName: editedUser.firstName,
          lastName: editedUser.lastName,
          phone: editedUser.phone,
          address: editedUser.address,
          avatar: updatedProfile.profilePicture || prev.avatar
        }));
        
        if (updatedProfile.profilePicture) {
          setAvatarPreview(updatedProfile.profilePicture);
        }
        
        setIsEditing(false);
        notify('Profile updated successfully!');
      } else {
        notify('Failed to update profile. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      notify('Failed to update profile. Please try again.', 'error');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
    setAvatarPreview(user.avatar);
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setShowPasswordReset(false);
      notify('Password reset email sent successfully!');
    } catch (error) {
      notify('Failed to send password reset email', 'error');
    }
    setLoading(false);
  };

  const handleDeactivate = async () => {
    setShowDeactivate(false);
    setLoading(true);
    
    try {
      const response = await api.put('/support/account/status', {
        email: user.email,
        status: 'INACTIVE'
      });
      
      if (response.status === 200) {
        notify('Account deactivated successfully. You will be logged out.');
        
        setTimeout(() => {
          auth.signOut().then(() => {
            window.location.href = '/login';
          });
        }, 2000);
      } else {
        notify('Failed to deactivate account. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error deactivating account:', error);
      notify('Failed to deactivate account. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowDelete(false);
    setLoading(true);
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        notify('No user is currently signed in.', 'error');
        setLoading(false);
        return;
      }
      
      const response = await api.put('/support/account/status', {
        email: user.email,
        status: 'DELETED'
      });
      
      if (response.status === 200) {
        await firebaseDeleteUser(currentUser);
        notify('Account deleted successfully.');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        notify('Failed to delete account. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      if (error.code === 'auth/requires-recent-login') {
        notify('Please sign in again to delete your account for security reasons.', 'error');
      } else {
        notify('Failed to delete account. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'primary' }) => {
    const colorClasses = {
      primary: 'from-primary-500 to-primary-600',
      success: 'from-success-500 to-success-600',
      warning: 'from-warning-500 to-warning-600',
      danger: 'from-danger-500 to-danger-600'
    };

    return (
      <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 bg-gradient-to-r ${colorClasses[color]} rounded-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          {trend && (
            <span className={`text-xs font-medium ${trend > 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{value}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Support Agent Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your support agent profile information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 overflow-hidden mb-8">
          {/* Cover Section */}
          <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800"></div>
          
          {/* Profile Info Section */}
          <div className="px-6 pb-6">
            <div className="flex items-start justify-between -mt-16 mb-6">
              <div className="flex items-end space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 bg-white dark:bg-secondary-700 rounded-xl border-4 border-white dark:border-secondary-700 flex items-center justify-center overflow-hidden">
                    {(isEditing ? avatarPreview : user.avatar) ? (
                      <img src={isEditing ? avatarPreview : user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircleIcon className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 cursor-pointer">
                      <PencilIcon className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                        disabled={loading}
                      />
                    </label>
                  )}
                </div>

                {/* Basic Info */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {isEditing ? (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={editedUser.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-secondary-600 focus:border-primary-500 outline-none text-gray-900 dark:text-white"
                          placeholder="First Name"
                          disabled={loading}
                        />
                        <input
                          type="text"
                          value={editedUser.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-secondary-600 focus:border-primary-500 outline-none text-gray-900 dark:text-white"
                          placeholder="Last Name"
                          disabled={loading}
                        />
                      </div>
                    ) : (
                      `${user.firstName} ${user.lastName}`
                    )}
                  </h2>
                  <p className="text-primary-600 dark:text-primary-400 font-semibold mb-2">
                    {user.role}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span>Online</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>Last active {user.lastActive}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mt-16">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={() => setShowPasswordReset(true)}
                      className="px-4 py-2 border border-gray-200 dark:border-secondary-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors duration-200"
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={() => setShowDeactivate(true)}
                      className="px-4 py-2 border border-red-200 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      Deactivate
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 disabled:opacity-50 transition-colors duration-200"
                    >
                      <CheckIcon className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-200 dark:border-secondary-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors duration-200"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  <EnvelopeIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-100 dark:bg-success-900/20 rounded-lg">
                  <PhoneIcon className="h-5 w-5 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="text-sm font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-secondary-600 focus:border-primary-500 outline-none"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning-100 dark:bg-warning-900/20 rounded-lg">
                  <MapPinIcon className="h-5 w-5 text-warning-600 dark:text-warning-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="text-sm font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-secondary-600 focus:border-primary-500 outline-none"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.address}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Joined</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.joinedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Reset Modal */}
        {showPasswordReset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reset Password</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                A password reset email will be sent to <strong>{user.email}</strong>. Follow the instructions in the email to reset your password.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPasswordReset(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-secondary-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordReset}
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deactivate Modal */}
        {showDeactivate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deactivate Account</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to deactivate your account? You can reactivate it later by contacting support.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeactivate(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-secondary-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {loading ? 'Deactivating...' : 'Deactivate Account'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delete Account</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This action is <strong>permanent</strong>. Are you sure you want to delete your account?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDelete(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-secondary-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-success-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportProfile;
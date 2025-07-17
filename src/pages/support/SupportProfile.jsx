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
  ClockIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import { auth } from '../../firebase';
import { sendPasswordResetEmail, onAuthStateChanged, updateProfile } from 'firebase/auth';
import api from '../../api/axios';
import islandHopIcon from '../../assets/islandHopIcon.png';

const SupportProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(true);
  
  const [user, setUser] = useState({
    firstName: 'Alex',
    lastName: 'Support',
    email: 'alex.support@islandhop.com',
    phoneNumber: '+94 77 234 5678',
    address: 'Kandy, Sri Lanka',
    role: 'Support Agent',
    profilePicture: islandHopIcon,
    joinedDate: 'Loading...',
    lastActive: 'Loading...',
    // Support-specific stats
    ticketsResolved: 0,
    avgResponseTime: '5 min',
    satisfactionRating: 4.8,
    status: 'Available'
  });
  
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);

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

  // Get user's profile data from Firebase Auth and backend
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
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
              const profilePicture = profileData.profilePictureBase64 
                ? `data:image/jpeg;base64,${profileData.profilePictureBase64}`
                : profileData.profilePicture || islandHopIcon;
              
              setUser(prevUser => ({
                ...prevUser,
                firstName: profileData.firstName || prevUser.firstName,
                lastName: profileData.lastName || prevUser.lastName,
                email: profileData.email || currentUser.email,
                phoneNumber: profileData.contactNo || prevUser.phoneNumber,
                address: profileData.address || prevUser.address,
                role: profileData.role || prevUser.role,
                profilePicture: profilePicture,
                joinedDate: formattedJoinedDate,
                lastActive: formattedLastActive
              }));
              
              setEditedUser(prevUser => ({
                ...prevUser,
                firstName: profileData.firstName || prevUser.firstName,
                lastName: profileData.lastName || prevUser.lastName,
                phoneNumber: profileData.contactNo || prevUser.phoneNumber,
                address: profileData.address || prevUser.address
              }));
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
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    };

    fetchProfileData();
  }, []);

  const notify = (msg, type = 'success') => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleEditPersonal = () => {
    setEditedUser(user);
    setIsEditingPersonal(true);
  };

  const handleSavePersonal = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', user.email);
      formData.append('firstName', editedUser.firstName);
      formData.append('lastName', editedUser.lastName);
      formData.append('contactNo', editedUser.phoneNumber);
      formData.append('address', editedUser.address);

      if (profilePictureFile) {
        formData.append('profilePicture', profilePictureFile);
      }

      const response = await api.put('/support/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update Firebase displayName
      if (auth.currentUser) {
        const newDisplayName = `${editedUser.firstName} ${editedUser.lastName}`;
        if (auth.currentUser.displayName !== newDisplayName) {
          await updateProfile(auth.currentUser, { displayName: newDisplayName });
        }
      }

      if (response.status === 200) {
        const updatedProfile = response.data;
        const profilePicture = updatedProfile.profilePictureBase64 
          ? `data:image/jpeg;base64,${updatedProfile.profilePictureBase64}`
          : updatedProfile.profilePicture || user.profilePicture;

        setUser(prev => ({
          ...prev,
          firstName: editedUser.firstName,
          lastName: editedUser.lastName,
          phoneNumber: editedUser.phoneNumber,
          address: editedUser.address,
          profilePicture: profilePicture
        }));

        setIsEditingPersonal(false);
        setProfilePictureFile(null);
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

  const handleCancelEdit = () => {
    setEditedUser(user);
    setIsEditingPersonal(false);
    setProfilePictureFile(null);
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setUser(prev => ({
        ...prev,
        profilePicture: URL.createObjectURL(file)
      }));
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

  const tabs = [
    { key: 'personal', label: 'Personal Info', icon: UserCircleIcon }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Loading Screen */}
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Profile...</h2>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your information</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Profile</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your support agent information</p>
              </div>
              <div className="flex items-center space-x-3">
                {!isEditingPersonal && (
                  <button
                    onClick={handleEditPersonal}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 mr-2 inline" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Summary Card */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6 mb-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={user.profilePicture || islandHopIcon}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-secondary-700 shadow-lg"
                />
                {isEditingPersonal && (
                  <label className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors cursor-pointer">
                    <CameraIcon className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleProfilePictureChange}
                      disabled={loading}
                    />
                  </label>
                )}
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-success-600 dark:text-success-400">{user.status}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Last active {user.lastActive}
                  </div>
                </div>
                <div className="flex items-center space-x-6 mt-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{user.ticketsResolved}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Tickets Resolved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{user.avgResponseTime}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{user.satisfactionRating}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Satisfaction Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
              {isEditingPersonal && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSavePersonal}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 disabled:opacity-50 transition-colors"
                  >
                    <CheckIcon className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-200 dark:border-secondary-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Personal Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                {isEditingPersonal ? (
                  <input
                    type="text"
                    value={editedUser.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                    disabled={loading}
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                {isEditingPersonal ? (
                  <input
                    type="text"
                    value={editedUser.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                    disabled={loading}
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                  Email
                </label>
                <p className="text-gray-900 dark:text-white">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <PhoneIcon className="h-4 w-4 inline mr-1" />
                  Phone Number
                </label>
                {isEditingPersonal ? (
                  <input
                    type="tel"
                    value={editedUser.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                    disabled={loading}
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user.phoneNumber}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPinIcon className="h-4 w-4 inline mr-1" />
                  Address
                </label>
                {isEditingPersonal ? (
                  <input
                    type="text"
                    value={editedUser.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                    disabled={loading}
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <CalendarIcon className="h-4 w-4 inline mr-1" />
                  Joined Date
                </label>
                <p className="text-gray-900 dark:text-white">{user.joinedDate}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <p className="text-gray-900 dark:text-white">{user.role}</p>
              </div>
            </div>

            {/* Security Actions */}
            {!isEditingPersonal && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-secondary-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Security Actions</h4>
                <button
                  onClick={() => setShowPasswordReset(true)}
                  className="px-4 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors"
                >
                  Reset Password
                </button>
              </div>
            )}
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
                    className="px-4 py-2 border border-gray-200 dark:border-secondary-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordReset}
                    disabled={loading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Sending...' : 'Send Reset Email'}
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
        </>
      )}
    </div>
  );
};

export default SupportProfile;
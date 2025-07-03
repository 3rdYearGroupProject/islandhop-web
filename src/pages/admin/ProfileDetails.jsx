import React, { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ProfileDetails = () => {
  const [user, setUser] = useState({
    firstName: 'System',
    lastName: 'Administrator',
    email: 'admin@islandhop.com',
    role: 'System Admin',
    avatar: '',
    lastActive: 'Loading...',
    phone: '+94 77 123 4567',
    location: 'Colombo, Sri Lanka',
    joinedDate: '2024-01-01',
    permissions: ['full_access', 'user_management', 'system_settings']
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
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

  // Simulate getting user's last sign-in time
  useEffect(() => {
    setTimeout(() => {
      setUser(prev => ({
        ...prev,
        lastActive: formatLastActive(new Date(Date.now() - 1000 * 60 * 15)) // 15 minutes ago
      }));
    }, 1000);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(editedUser);
      setIsEditing(false);
      notify('Profile updated successfully!');
    } catch (error) {
      notify('Failed to update profile', 'error');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowPasswordReset(false);
      notify('Password reset email sent successfully!');
    } catch (error) {
      notify('Failed to send password reset email', 'error');
    }
    setLoading(false);
  };

  const getPermissionBadge = (permission) => {
    const badges = {
      'full_access': 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300',
      'user_management': 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300',
      'system_settings': 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300'
    };
    return badges[permission] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const formatPermissionName = (permission) => {
    return permission.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your administrator profile and account settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 overflow-hidden">
          {/* Cover Section */}
          <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800"></div>
          
          {/* Profile Info Section */}
          <div className="px-6 pb-6">
            <div className="flex items-start justify-between -mt-16 mb-6">
              <div className="flex items-end space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 bg-white dark:bg-secondary-700 rounded-xl border-4 border-white dark:border-secondary-700 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircleIcon className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="pt-12">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          value={editedUser.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                          placeholder="First Name"
                        />
                        <input
                          type="text"
                          value={editedUser.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                          placeholder="Last Name"
                        />
                      </div>
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                        placeholder="Email"
                      />
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {user.firstName} {user.lastName}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300 px-2 py-1 rounded-full text-xs font-medium">
                          {user.role}
                        </span>
                        <span>Last active: {user.lastActive}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      <CheckIcon className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user.location}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Joined Date
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Permissions
                </h3>
                <div className="space-y-2">
                  {user.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full mr-2 mb-2 ${getPermissionBadge(permission)}`}
                    >
                      {formatPermissionName(permission)}
                    </span>
                  ))}
                </div>

                {/* Security Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-secondary-700">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    Security
                  </h4>
                  <button
                    onClick={() => setShowPasswordReset(true)}
                    className="px-4 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors text-sm"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
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
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                A password reset email will be sent to {user.email}. Are you sure you want to proceed?
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

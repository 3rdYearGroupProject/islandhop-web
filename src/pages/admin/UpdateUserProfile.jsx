import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const UpdateUserProfile = ({ userId, onBack, users, setUsers }) => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "",
    status: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    emergencyContact: "",
    licenseNumber: "",
    vehicleInfo: "",
    languages: "",
    specializations: "",
    bio: "",
    profileComplete: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userId && users) {
      const foundUser = users.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        setFormData({
          name: foundUser.name || "",
          email: foundUser.email || "",
          userType: foundUser.userType || "",
          status: foundUser.status || "",
          phone: foundUser.phone || "",
          address: foundUser.location || "",
          dateOfBirth: foundUser.dateOfBirth || "",
          emergencyContact: foundUser.emergencyContact || "",
          licenseNumber: foundUser.licenseNumber || "",
          vehicleInfo: foundUser.vehicleInfo || "",
          languages: foundUser.languages || "",
          specializations: foundUser.specializations || "",
          bio: foundUser.bio || "",
          profileComplete: foundUser.profileComplete || false,
        });
      }
      setLoading(false);
    } else {
      // Mock user for demo
      const mockUser = {
        id: userId || 1,
        name: "John Doe",
        email: "john.doe@example.com",
        userType: "tourist",
        status: "active",
        phone: "+1-555-0123",
        location: "New York, USA",
        dateOfBirth: "1990-05-15",
        emergencyContact: "+1-555-0124",
        profileComplete: false,
      };
      setUser(mockUser);
      setFormData({
        name: mockUser.name,
        email: mockUser.email,
        userType: mockUser.userType,
        status: mockUser.status,
        phone: mockUser.phone,
        address: mockUser.location,
        dateOfBirth: mockUser.dateOfBirth,
        emergencyContact: mockUser.emergencyContact,
        licenseNumber: "",
        vehicleInfo: "",
        languages: "",
        specializations: "",
        bio: "",
        profileComplete: mockUser.profileComplete,
      });
      setLoading(false);
    }
  }, [userId, users]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.userType) {
      newErrors.userType = 'User type is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user data
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        userType: formData.userType,
        status: formData.status,
        phone: formData.phone,
        location: formData.address,
        dateOfBirth: formData.dateOfBirth,
        emergencyContact: formData.emergencyContact,
        licenseNumber: formData.licenseNumber,
        vehicleInfo: formData.vehicleInfo,
        languages: formData.languages,
        specializations: formData.specializations,
        bio: formData.bio,
        profileComplete: formData.profileComplete,
      };
      
      if (setUsers) {
        setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      }
      
      setUser(updatedUser);
      setShowConfirmation(true);
      
      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">User Not Found</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">The requested user could not be found.</p>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleCancel}
          className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Update User Profile</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Edit user information and account settings
          </p>
        </div>
        <div className="ml-auto flex gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-secondary-800 border border-neutral-300 dark:border-secondary-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-secondary-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 rounded-lg transition-colors flex items-center gap-2"
          >
            {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Confirmation Banner */}
      {showConfirmation && (
        <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="h-5 w-5 text-success-600 dark:text-success-400" />
            <p className="text-success-800 dark:text-success-200 font-medium">
              User profile updated successfully!
            </p>
            <button
              onClick={() => setShowConfirmation(false)}
              className="ml-auto text-success-600 dark:text-success-400 hover:text-success-800 dark:hover:text-success-200"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
            <UserIcon className="h-6 w-6 text-primary-600" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.name ? 'border-danger-300 dark:border-danger-600' : 'border-neutral-300 dark:border-secondary-600'
                }`}
              />
              {errors.name && <p className="text-danger-600 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.email ? 'border-danger-300 dark:border-danger-600' : 'border-neutral-300 dark:border-secondary-600'
                }`}
              />
              {errors.email && <p className="text-danger-600 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.phone ? 'border-danger-300 dark:border-danger-600' : 'border-neutral-300 dark:border-secondary-600'
                }`}
              />
              {errors.phone && <p className="text-danger-600 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Account Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                User Type *
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.userType ? 'border-danger-300 dark:border-danger-600' : 'border-neutral-300 dark:border-secondary-600'
                }`}
              >
                <option value="">Select user type</option>
                <option value="tourist">Tourist</option>
                <option value="guide">Guide</option>
                <option value="driver">Driver</option>
              </select>
              {errors.userType && <p className="text-danger-600 text-sm mt-1">{errors.userType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Account Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.status ? 'border-danger-300 dark:border-danger-600' : 'border-neutral-300 dark:border-secondary-600'
                }`}
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="restricted">Restricted</option>
              </select>
              {errors.status && <p className="text-status-600 text-sm mt-1">{errors.status}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Emergency Contact
              </label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        {(formData.userType === 'driver' || formData.userType === 'guide') && (
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
              Professional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.userType === 'driver' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      License Number
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Vehicle Information
                    </label>
                    <input
                      type="text"
                      name="vehicleInfo"
                      value={formData.vehicleInfo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
              {formData.userType === 'guide' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Languages
                    </label>
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleInputChange}
                      placeholder="e.g., English, Spanish, French"
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Specializations
                    </label>
                    <input
                      type="text"
                      name="specializations"
                      value={formData.specializations}
                      onChange={handleInputChange}
                      placeholder="e.g., Adventure tours, Cultural tours"
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Profile Status */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Profile Status</h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">Profile Complete</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Mark this profile as complete and verified
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="profileComplete"
                checked={formData.profileComplete}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 dark:bg-secondary-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserProfile;

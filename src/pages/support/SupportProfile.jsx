import React, { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  HeartIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const SupportProfile = () => {
  const [user, setUser] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@islandhop.com',
    role: 'Senior Support Agent',
    avatar: '',
    lastActive: 'Loading...',
    phone: '+94 77 234 5678',
    location: 'Kandy, Sri Lanka',
    joinedDate: '2023-06-15',
    department: 'Customer Support',
    employeeId: 'SUP-001',
    shift: 'Day Shift (9 AM - 6 PM)',
    languages: ['English', 'Sinhala', 'Tamil'],
    specializations: ['Booking Issues', 'Payment Problems', 'Technical Support'],
    certifications: ['Customer Service Excellence', 'Conflict Resolution', 'Product Knowledge']
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Performance metrics
  const [performanceData] = useState({
    thisMonth: {
      ticketsHandled: 124,
      avgResponseTime: '1.8 hours',
      resolutionRate: 96.8,
      customerRating: 4.9,
      escalationRate: 2.4
    },
    lastMonth: {
      ticketsHandled: 118,
      avgResponseTime: '2.1 hours',
      resolutionRate: 94.2,
      customerRating: 4.7,
      escalationRate: 3.1
    },
    achievements: [
      { title: 'Top Performer', date: '2024-03-01', description: 'Highest customer satisfaction score' },
      { title: 'Quick Resolver', date: '2024-02-15', description: 'Fastest average response time' },
      { title: 'Customer Champion', date: '2024-01-20', description: 'Excellence in customer service' }
    ]
  });

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
        lastActive: formatLastActive(new Date(Date.now() - 1000 * 60 * 5)) // 5 minutes ago
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
            Manage your support agent profile and performance metrics
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
                    {user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircleIcon className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Basic Info */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {user.firstName} {user.lastName}
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
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="text-sm font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-secondary-600 focus:border-primary-500 outline-none"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                  )}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="text-sm font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-secondary-600 focus:border-primary-500 outline-none"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.location}</p>
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
                    {new Date(user.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard
              title="Tickets Handled"
              value={performanceData.thisMonth.ticketsHandled}
              subtitle="This month"
              icon={ChartBarIcon}
              trend={5.1}
              color="primary"
            />
            <MetricCard
              title="Response Time"
              value={performanceData.thisMonth.avgResponseTime}
              subtitle="Average response"
              icon={ClockIcon}
              trend={-14.3}
              color="success"
            />
            <MetricCard
              title="Resolution Rate"
              value={`${performanceData.thisMonth.resolutionRate}%`}
              subtitle="Successful resolutions"
              icon={CheckIcon}
              trend={2.6}
              color="success"
            />
            <MetricCard
              title="Customer Rating"
              value={`${performanceData.thisMonth.customerRating}/5.0`}
              subtitle="Average rating"
              icon={StarIcon}
              trend={4.3}
              color="warning"
            />
            <MetricCard
              title="Escalation Rate"
              value={`${performanceData.thisMonth.escalationRate}%`}
              subtitle="Escalated tickets"
              icon={ShieldCheckIcon}
              trend={-22.6}
              color="success"
            />
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Work Information */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Work Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Employee ID</label>
                <p className="font-medium text-gray-900 dark:text-white">{user.employeeId}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Department</label>
                <p className="font-medium text-gray-900 dark:text-white">{user.department}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Work Shift</label>
                <p className="font-medium text-gray-900 dark:text-white">{user.shift}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Languages</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.languages.map((language, index) => (
                    <span key={index} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 rounded text-sm">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Certifications */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills & Certifications</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Specializations</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.specializations.map((spec, index) => (
                    <span key={index} className="px-2 py-1 bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-300 rounded text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Certifications</label>
                <div className="space-y-2 mt-1">
                  {user.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <ShieldCheckIcon className="h-4 w-4 text-success-600" />
                      <span className="text-sm text-gray-900 dark:text-white">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {performanceData.achievements.map((achievement, index) => (
              <div key={index} className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-gradient-to-r from-warning-500 to-warning-600 rounded-lg">
                    <StarIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Password Reset Modal */}
        {showPasswordReset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reset Password</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to reset your password? A reset link will be sent to your email.
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
                  {loading ? 'Sending...' : 'Send Reset Link'}
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
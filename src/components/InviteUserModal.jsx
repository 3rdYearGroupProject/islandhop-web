import React, { useState } from 'react';
import { FiX, FiSend, FiMail, FiCalendar } from 'react-icons/fi';
import { PoolsApi } from '../api/poolsApi';
import { useAuth } from '../hooks/useAuth';

const InviteUserModal = ({ isOpen, onClose, groupData, onSuccess }) => {
  const [invitedEmail, setInvitedEmail] = useState('');
  const [message, setMessage] = useState('');
  const [expirationDays, setExpirationDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  // Auto-generate default message with trip details
  React.useEffect(() => {
    if (isOpen && groupData) {
      const poolName = groupData?.name || groupData?.title || 'Travel Pool';
      const destination = Array.isArray(groupData?.destinations) 
        ? groupData.destinations.join(', ') 
        : groupData?.destination || groupData?.destinations || 'Sri Lanka';
      const duration = groupData?.totalDays || groupData?.duration || 'several days';
      
      const defaultMessage = `Hi! I'd love for you to join our travel pool "${poolName}".\n\nWe're planning an amazing trip to ${destination} for ${duration}. I think you'd be a great addition to our group!\n\nLooking forward to traveling together! 🌏✈️`;
      
      setMessage(defaultMessage);
    }
  }, [isOpen, groupData]);

  const handleReset = () => {
    setInvitedEmail('');
    setMessage('');
    setExpirationDays(7);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSendInvitation = async () => {
    if (!user) {
      setError('You must be logged in to send invitations');
      return;
    }

    if (!invitedEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(invitedEmail.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    if (!message.trim()) {
      setError('Please add a personal message');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Hardcoded to use email method
      const inviteData = {
        userId: user.uid,
        invitedEmail: invitedEmail.trim(),
        message: message.trim(),
        expirationDays: parseInt(expirationDays),
        method: 'email' // Explicitly set method as email
      };

      console.log('📧 Sending invitation with data:', inviteData);

      // Use the correct groupId from groupData structure
      const groupId = groupData?.groupInfo?.groupId || groupData?.id;
      if (!groupId) {
        throw new Error('Group ID not found in group data');
      }

      console.log('📧 Inviting to group:', groupId);

      const result = await PoolsApi.inviteUserToGroup(groupId, inviteData);
      
      setSuccess(true);
      if (onSuccess) {
        onSuccess(result);
      }
      
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0" style={{ zIndex: 1000 }}>
      <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-40">
        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6 relative max-h-[90vh] overflow-y-auto" style={{ zIndex: 1001 }}>
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={handleClose}
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <FiSend className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Invite User to Group</h2>
          </div>
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FiSend className="text-green-600" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Invitation Sent Successfully!
                </h4>
                <p className="text-gray-600">
                  The user will receive your invitation and can respond within {expirationDays} days.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Trip Details - Auto-populated */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 mb-6 border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                  <FiCalendar className="text-blue-600" size={18} />
                  Trip Details
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-start">
                    <span className="text-sm font-semibold text-gray-700 w-32">Trip Name:</span>
                    <span className="text-sm text-gray-900 font-medium flex-1">
                      {groupData?.title || groupData?.name || 'Untitled Trip'}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm font-semibold text-gray-700 w-32">Destination:</span>
                    <span className="text-sm text-gray-900 flex-1">
                      {Array.isArray(groupData?.destinations) 
                        ? groupData.destinations.join(', ') 
                        : groupData?.destination || groupData?.destinations || 'Sri Lanka'}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm font-semibold text-gray-700 w-32">Duration:</span>
                    <span className="text-sm text-gray-900">
                      {groupData?.totalDays 
                        ? `${groupData.totalDays} days` 
                        : groupData?.duration || 'N/A'}
                    </span>
                  </div>
                  {groupData?.dates && groupData.dates.length >= 2 && (
                    <div className="flex items-start">
                      <span className="text-sm font-semibold text-gray-700 w-32">Dates:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(groupData.dates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {' - '}
                        {new Date(groupData.dates[1]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start">
                    <span className="text-sm font-semibold text-gray-700 w-32">Participants:</span>
                    <span className="text-sm text-gray-900">
                      {groupData?.participants || groupData?.members?.length || 0}/{groupData?.maxParticipants || groupData?.maxMembers || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiMail className="text-gray-600" size={16} />
                  Recipient Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={invitedEmail}
                  onChange={(e) => setInvitedEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Enter the email address of the person you'd like to invite to this trip.
                </p>
              </div>

              {/* Personal Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiSend className="text-gray-600" size={16} />
                  Personal Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add your personal message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                  rows={5}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-1.5">
                  <p className="text-xs text-gray-500">
                    Customize the invitation message for your friend
                  </p>
                  <span className="text-xs text-gray-500">
                    {message.length}/500
                  </span>
                </div>
              </div>

              {/* Expiration Days */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiCalendar className="text-gray-600" size={16} />
                  Invitation Expires After <span className="text-red-500">*</span>
                </label>
                <select
                  value={expirationDays}
                  onChange={(e) => setExpirationDays(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                >
                  <option value={3}>3 days</option>
                  <option value={7}>7 days (Recommended)</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
                <p className="text-xs text-gray-500 mt-1.5">
                  The recipient must accept the invitation within this time period.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <FiX className="text-red-600 mt-0.5" size={16} />
                    <div className="text-sm text-red-800">{error}</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleClose}
                  className="flex-1 px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvitation}
                  disabled={loading || !message.trim() || !invitedEmail.trim()}
                  className="flex-1 px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-sm font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiSend size={16} />
                      <span>Send Invitation</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteUserModal;

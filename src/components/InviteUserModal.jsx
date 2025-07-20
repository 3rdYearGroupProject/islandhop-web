import React, { useState } from 'react';
import { FiX, FiSend, FiMail, FiUser, FiCalendar } from 'react-icons/fi';
import { PoolsApi } from '../api/poolsApi';
import { useAuth } from '../hooks/useAuth';

const InviteUserModal = ({ isOpen, onClose, groupData, onSuccess }) => {
  const [inviteMethod, setInviteMethod] = useState('email'); // 'email' or 'userId'
  const [invitedEmail, setInvitedEmail] = useState('');
  const [invitedUserId, setInvitedUserId] = useState('');
  const [message, setMessage] = useState('');
  const [expirationDays, setExpirationDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleReset = () => {
    setInviteMethod('email');
    setInvitedEmail('');
    setInvitedUserId('');
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

    if (inviteMethod === 'email' && !invitedEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    if (inviteMethod === 'userId' && !invitedUserId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    if (!message.trim()) {
      setError('Please add a personal message');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const inviteData = {
        userId: user.uid,
        message: message.trim(),
        expirationDays: parseInt(expirationDays)
      };

      if (inviteMethod === 'email') {
        inviteData.invitedEmail = invitedEmail.trim();
      } else {
        inviteData.invitedUserId = invitedUserId.trim();
      }

      const result = await PoolsApi.inviteUserToGroup(groupData.id, inviteData);
      
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FiSend className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">
              Invite User to Group
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
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
              {/* Group Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Inviting to: {groupData?.title || groupData?.name || 'Group'}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Destination:</strong> {groupData?.destination || 'N/A'}</p>
                  <p><strong>Duration:</strong> {groupData?.duration || 'N/A'}</p>
                  <p><strong>Current Members:</strong> {groupData?.members?.length || 0}/{groupData?.maxMembers || 'N/A'}</p>
                </div>
              </div>

              {/* Invite Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you like to invite them?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="inviteMethod"
                      value="email"
                      checked={inviteMethod === 'email'}
                      onChange={(e) => setInviteMethod(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <FiMail className="text-gray-600" size={16} />
                    <span className="text-sm text-gray-700">Email Address</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="inviteMethod"
                      value="userId"
                      checked={inviteMethod === 'userId'}
                      onChange={(e) => setInviteMethod(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <FiUser className="text-gray-600" size={16} />
                    <span className="text-sm text-gray-700">User ID</span>
                  </label>
                </div>
              </div>

              {/* Invite Input */}
              <div className="mb-6">
                {inviteMethod === 'email' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={invitedEmail}
                      onChange={(e) => setInvitedEmail(e.target.value)}
                      placeholder="friend@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={invitedUserId}
                      onChange={(e) => setInvitedUserId(e.target.value)}
                      placeholder="user_123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Personal Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hey! I'd love for you to join our travel group. We're planning an amazing trip and think you'd be a great addition to our adventure..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {message.length}/500 characters
                </div>
              </div>

              {/* Expiration Days */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline mr-1" size={14} />
                  Invitation Expires After
                </label>
                <select
                  value={expirationDays}
                  onChange={(e) => setExpirationDays(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
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
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvitation}
                  disabled={loading || !message.trim() || (!invitedEmail.trim() && !invitedUserId.trim())}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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

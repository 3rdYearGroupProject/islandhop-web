import React, { useState, useEffect } from 'react';
import { FiMail, FiCheck, FiX, FiClock, FiUsers, FiSend, FiRefreshCw } from 'react-icons/fi';
import { PoolsApi } from '../api/poolsApi';
import { useAuth } from '../hooks/useAuth';

const InvitationsManager = ({ isOpen, onClose, onInvitationUpdate }) => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState({});
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      fetchInvitations();
    }
  }, [isOpen, user]);

  const fetchInvitations = async () => {
    try {
      console.log('🔄 InvitationsManager: Starting fetchInvitations for user:', user.uid);
      setLoading(true);
      setError(null);
      
      console.log('📨 InvitationsManager: Calling PoolsApi.getUserInvitations');
      const response = await PoolsApi.getUserInvitations(user.uid);
      console.log('📨 InvitationsManager: Response received:', response);
      console.log('📨 InvitationsManager: Invitations data:', response.invitations);
      
      setInvitations(response.invitations || []);
      console.log('✅ InvitationsManager: Invitations set successfully, count:', (response.invitations || []).length);
    } catch (error) {
      console.error('❌ InvitationsManager: Error fetching invitations:', error);
      console.error('❌ InvitationsManager: Error details:', {
        message: error.message,
        stack: error.stack
      });
      setError('Failed to fetch invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (invitationId, action, message = null) => {
    try {
      console.log('📮 InvitationsManager: Starting handleRespond', { invitationId, action, message });
      setResponding(prev => ({ ...prev, [invitationId]: true }));
      
      const responseData = {
        userId: user.uid,
        invitationId,
        action,
        ...(message && { message })
      };

      console.log('📮 InvitationsManager: Calling PoolsApi.respondToInvitation with:', responseData);
      const result = await PoolsApi.respondToInvitation(responseData);
      console.log('📮 InvitationsManager: Response result:', result);
      
      // Remove the responded invitation from the list
      setInvitations(prev => prev.filter(inv => inv.invitationId !== invitationId));
      console.log('✅ InvitationsManager: Invitation removed from list');
      
      // Notify parent component
      if (onInvitationUpdate) {
        console.log('📢 InvitationsManager: Notifying parent component');
        onInvitationUpdate(result);
      }
      
    } catch (error) {
      console.error('❌ InvitationsManager: Error responding to invitation:', error);
      console.error('❌ InvitationsManager: Error details:', {
        message: error.message,
        stack: error.stack,
        invitationId,
        action
      });
      setError(`Failed to ${action} invitation: ${error.message}`);
    } finally {
      setResponding(prev => ({ ...prev, [invitationId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <FiMail className="text-blue-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Your Pool Invitations
              </h3>
              <p className="text-sm text-gray-600">
                {invitations.length} invitation{invitations.length !== 1 ? 's' : ''} waiting for response
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchInvitations}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Refresh invitations"
            >
              <FiRefreshCw size={18} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FiMail className="text-red-500 text-4xl mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchInvitations}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-12">
              <FiMail className="text-gray-400 text-4xl mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Invitations</h4>
              <p className="text-gray-600">You don't have any pending pool invitations at the moment.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {invitations.map((invitation) => {
                const expired = isExpired(invitation.expiresAt);
                
                return (
                  <div 
                    key={invitation.invitationId} 
                    className={`border rounded-lg p-6 transition-shadow ${
                      expired ? 'bg-gray-50 border-gray-300' : 'hover:shadow-md'
                    }`}
                  >
                    {/* Invitation Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiUsers className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {invitation.groupName}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">
                            Invited by <strong>{invitation.inviterName}</strong>
                          </p>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <FiClock size={12} />
                            <span>
                              Expires: {formatDate(invitation.expiresAt)}
                              {expired && <span className="text-red-600 font-medium"> (EXPIRED)</span>}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {expired && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          Expired
                        </span>
                      )}
                    </div>

                    {/* Invitation Message */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Message:</h5>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg italic">
                        "{invitation.message}"
                      </p>
                    </div>

                    {/* Action Buttons */}
                    {!expired ? (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleRespond(invitation.invitationId, 'accept')}
                          disabled={responding[invitation.invitationId]}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {responding[invitation.invitationId] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          ) : (
                            <>
                              <FiCheck size={16} />
                              <span>Accept Invitation</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            const message = prompt('Optional: Provide a reason for declining');
                            handleRespond(invitation.invitationId, 'reject', message);
                          }}
                          disabled={responding[invitation.invitationId]}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {responding[invitation.invitationId] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          ) : (
                            <>
                              <FiX size={16} />
                              <span>Decline</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-gray-500">This invitation has expired.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Respond to invitations to join exciting travel groups
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationsManager;

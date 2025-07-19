import React, { useState, useEffect } from 'react';
import { FiUsers, FiCheck, FiX, FiClock, FiUser, FiMail, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { PoolsApi } from '../api/poolsApi';
import { useAuth } from '../hooks/useAuth';

const JoinRequestsManager = ({ groupId, isOpen, onClose, onRequestUpdate }) => {
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState({});
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && groupId && user) {
      fetchJoinRequests();
    }
  }, [isOpen, groupId, user]);

  const fetchJoinRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await PoolsApi.getPendingJoinRequests(groupId, user.uid);
      setJoinRequests(response.pendingRequests || []);
    } catch (error) {
      console.error('Error fetching join requests:', error);
      setError('Failed to fetch join requests');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (joinRequestId, action, reason = null) => {
    try {
      setVoting(prev => ({ ...prev, [joinRequestId]: true }));
      
      const voteData = {
        userId: user.uid,
        joinRequestId,
        action,
        ...(reason && { reason })
      };

      const result = await PoolsApi.voteOnJoinRequest(groupId, voteData);
      
      // Refresh join requests after voting
      await fetchJoinRequests();
      
      // Notify parent component
      if (onRequestUpdate) {
        onRequestUpdate(result);
      }
      
    } catch (error) {
      console.error('Error voting on join request:', error);
      setError(`Failed to ${action} request: ${error.message}`);
    } finally {
      setVoting(prev => ({ ...prev, [joinRequestId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <FiUsers className="text-blue-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Pending Join Requests
              </h3>
              <p className="text-sm text-gray-600">
                {joinRequests.length} request{joinRequests.length !== 1 ? 's' : ''} waiting for approval
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchJoinRequests}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : joinRequests.length === 0 ? (
            <div className="text-center py-12">
              <FiUsers className="text-gray-400 text-4xl mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h4>
              <p className="text-gray-600">There are currently no join requests waiting for approval.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {joinRequests.map((request) => (
                <div key={request.joinRequestId} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Requestor Info */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{request.userName}</h4>
                        <span className="text-sm text-gray-500 flex items-center space-x-1">
                          <FiMail size={12} />
                          <span>{request.userEmail}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <FiCalendar size={12} />
                        <span>Requested on {formatDate(request.requestedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Request Message */}
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Message:</h5>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg italic">
                      "{request.message}"
                    </p>
                  </div>

                  {/* Voting Status */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FiClock className="text-blue-600" size={16} />
                        <span className="text-sm font-medium text-blue-800">
                          Approval Status: {request.totalVotesReceived}/{request.totalMembersRequired} votes received
                        </span>
                      </div>
                      {request.hasCurrentUserVoted && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          You have voted
                        </span>
                      )}
                    </div>
                    {request.pendingMembers.length > 0 && (
                      <div className="mt-2 text-sm text-blue-700">
                        Waiting for votes from: {request.pendingMembers.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Vote Actions */}
                  {!request.hasCurrentUserVoted ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleVote(request.joinRequestId, 'approve')}
                        disabled={voting[request.joinRequestId]}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {voting[request.joinRequestId] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <>
                            <FiCheck size={16} />
                            <span>Approve</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Optional: Provide a reason for rejection');
                          handleVote(request.joinRequestId, 'reject', reason);
                        }}
                        disabled={voting[request.joinRequestId]}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {voting[request.joinRequestId] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <>
                            <FiX size={16} />
                            <span>Reject</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-gray-600">You have already voted on this request.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              All members must approve for requests to be accepted
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

export default JoinRequestsManager;

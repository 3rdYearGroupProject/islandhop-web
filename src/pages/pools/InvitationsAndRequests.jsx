import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InvitationsManager from '../../components/InvitationsManager';
import JoinRequestsManager from '../../components/JoinRequestsManager';
import { PoolsApi } from '../../api/poolsApi';
import { useAuth } from '../../hooks/useAuth';
import { 
  EnvelopeIcon, 
  UserGroupIcon, 
  CalendarIcon,
  MapPinIcon,
  BellIcon,
  InboxIcon
} from '@heroicons/react/24/outline';

const InvitationsAndRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invitationsModalOpen, setInvitationsModalOpen] = useState(false);
  const [joinRequestsModalOpen, setJoinRequestsModalOpen] = useState(false);
  const [invitationsCount, setInvitationsCount] = useState(0);
  const [joinRequestsCount, setJoinRequestsCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for comprehensive data
  const [comprehensiveData, setComprehensiveData] = useState(null);
  const [totalPendingItems, setTotalPendingItems] = useState(0);

  useEffect(() => {
    if (user) {
      fetchCounts();
    }
  }, [user]);

  const fetchCounts = async () => {
    try {
      console.log('🔄 Starting fetchCounts for user:', user.uid);
      setLoading(true);
      
      // Real API call - use the new comprehensive endpoint
      console.log('�🔔 Calling PoolsApi.getAllPendingItems with userId:', user.uid);
      const comprehensiveResponse = await PoolsApi.getAllPendingItems(user.uid);
      console.log('�🔔 Comprehensive response received:', comprehensiveResponse);
      
      // Set comprehensive data
      setComprehensiveData(comprehensiveResponse);
      setTotalPendingItems(comprehensiveResponse.totalPendingItems || 0);
      setInvitationsCount(comprehensiveResponse.totalInvitations || 0);
      setJoinRequestsCount(comprehensiveResponse.totalVoteRequests || 0);
      
      // Set individual arrays for backward compatibility with existing components
      setInvitations(comprehensiveResponse.pendingInvitations || []);
      setPendingRequests(comprehensiveResponse.pendingVotes || []);
      
      console.log('✅ fetchCounts completed successfully');
      console.log('� Total invitations:', comprehensiveResponse.totalInvitations);
      console.log('🗳️ Total vote requests:', comprehensiveResponse.totalVoteRequests);
      console.log('📋 Total pending items:', comprehensiveResponse.totalPendingItems);
      
    } catch (error) {
      console.error('❌ Error fetching comprehensive pending items:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        userId: user.uid
      });
      
      // Set counts to 0 on error to prevent UI issues
      setComprehensiveData(null);
      setTotalPendingItems(0);
      setInvitationsCount(0);
      setJoinRequestsCount(0);
      setPendingRequests([]);
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvitationResponse = async (invitationId, groupId, action, message = '') => {
    try {
      console.log('📮 Responding to invitation:', { invitationId, groupId, action, message });
      
      // Real API call - you'll need to implement the respondToInvitation endpoint
      const responseData = {
        userId: user.uid,
        invitationId: invitationId,
        action: action, // 'accept' or 'reject'
        message: message
      };
      
      const result = await PoolsApi.respondToInvitation(responseData);
      console.log('📮 Invitation response result:', result);
      
      // Show success message
      alert(`✅ Invitation ${action}ed successfully!`);
      
      // Refresh the data
      fetchCounts();
      
    } catch (error) {
      console.error('❌ Error responding to invitation:', error);
      alert(`❌ Failed to respond to invitation: ${error.message}`);
    }
  };

  const handleInvitationUpdate = (result) => {
    console.log('Invitation updated:', result);
    fetchCounts(); // Refresh counts
  };

  const handleJoinRequestUpdate = (result) => {
    console.log('Join request updated:', result);
    fetchCounts(); // Refresh counts
  };

  const handleVoteOnRequest = async (groupId, requestUserId, approved, comment = '') => {
    try {
      console.log('🗳️ Voting on request:', { groupId, requestUserId, approved, comment });
      
      // Real API call
      const voteData = {
        userId: user.uid,
        approved: approved,
        comment: comment
      };
      
      const result = await PoolsApi.voteOnJoinRequestNew(groupId, requestUserId, voteData);
      console.log('🗳️ Vote result:', result);
      
      // Show success message
      const action = approved ? 'approved' : 'rejected';
      alert(`✅ Request ${action} successfully!\n\nStatus: ${result.requestStatus}\nVotes: ${result.totalVotesReceived}/${result.totalMembersRequired}`);
      
      // Refresh the comprehensive data
      fetchCounts();
      
    } catch (error) {
      console.error('❌ Error voting on request:', error);
      alert(`❌ Failed to vote on request: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Please log in</h3>
          <p className="mt-2 text-sm text-gray-600">
            You need to be logged in to view your invitations and requests.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Invitations & Requests
                </h1>
                <p className="text-gray-600">
                  Manage your pool invitations and join requests
                  {totalPendingItems > 0 && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {totalPendingItems} pending {totalPendingItems === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Comprehensive Overview */}
        {!loading && totalPendingItems > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  📋 Your Pending Items Overview
                </h2>
                <p className="text-gray-700">
                  You have <span className="font-bold text-blue-600">{totalPendingItems}</span> items requiring your attention
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 space-y-1">
                  <div>📨 {invitationsCount} invitation{invitationsCount !== 1 ? 's' : ''} to respond to</div>
                  <div>🗳️ {joinRequestsCount} join request{joinRequestsCount !== 1 ? 's' : ''} to vote on</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Invitations Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pool Invitations
                  </h2>
                  <p className="text-sm text-gray-600">
                    Invitations to join travel groups
                  </p>
                </div>
              </div>
              {invitationsCount > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {invitationsCount}
                </span>
              )}
            </div>
            
            <div className="text-center py-8">
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
              ) : invitationsCount > 0 ? (
                <>
                  <InboxIcon className="mx-auto h-10 w-10 text-blue-500 mb-3" />
                  <p className="text-gray-900 font-medium mb-2">
                    You have {invitationsCount} pending invitation{invitationsCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Review and respond to invitations from other travelers
                  </p>
                </>
              ) : (
                <>
                  <EnvelopeIcon className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">No pending invitations</p>
                  <p className="text-gray-500 text-sm">
                    You'll see invitations to join travel groups here
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setInvitationsModalOpen(true)}
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              View Invitations
            </button>
          </div>

          {/* Join Requests Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Join Requests
                  </h2>
                  <p className="text-sm text-gray-600">
                    Requests to join your groups
                  </p>
                </div>
              </div>
              {joinRequestsCount > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {joinRequestsCount}
                </span>
              )}
            </div>
            
            <div className="text-center py-8">
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent mx-auto"></div>
              ) : joinRequestsCount > 0 ? (
                <>
                  <BellIcon className="mx-auto h-10 w-10 text-green-500 mb-3" />
                  <p className="text-gray-900 font-medium mb-2">
                    You have {joinRequestsCount} pending request{joinRequestsCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Review and vote on join requests for your groups
                  </p>
                </>
              ) : (
                <>
                  <UserGroupIcon className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">No pending requests</p>
                  <p className="text-gray-500 text-sm">
                    Join requests for your groups will appear here
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setJoinRequestsModalOpen(true)}
              disabled={loading}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Manage Requests
            </button>
          </div>
        </div>

        {/* Invitations Display */}
        {invitationsCount > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Pool Invitations ({invitationsCount})
            </h3>
            <div className="space-y-6">
              {invitations.map((invitation) => (
                <div key={invitation.invitationId} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-blue-600">
                            {invitation.inviterName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {invitation.groupName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Invited by {invitation.inviterName} • {invitation.currentMembers}/{invitation.maxMembers} members
                          </p>
                          {invitation.tripName && (
                            <p className="text-sm font-medium text-blue-600">
                              {invitation.tripName}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 mb-3">
                          "{invitation.message}"
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">📅 Trip Dates:</span>
                          <p className="text-gray-600">
                            {new Date(invitation.tripStartDate).toLocaleDateString()} - {new Date(invitation.tripEndDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">📍 Base City:</span>
                          <p className="text-gray-600">{invitation.baseCity}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">🎯 Activities:</span>
                          <p className="text-gray-600">{invitation.preferredActivities?.join(', ')}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div>
                          Invited: {new Date(invitation.invitedAt).toLocaleDateString()} at {new Date(invitation.invitedAt).toLocaleTimeString()}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invitation.urgencyLevel === 'high' ? 'bg-red-100 text-red-800' :
                          invitation.urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {invitation.urgencyLevel === 'high' ? '🔴 High Priority' :
                           invitation.urgencyLevel === 'medium' ? '🟡 Medium Priority' :
                           '🟢 Low Priority'} 
                          ({invitation.daysRemaining} days left)
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-6">
                      <button
                        onClick={() => handleInvitationResponse(invitation.invitationId, invitation.groupId, 'accept', '')}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ✅ Accept
                      </button>
                      <button
                        onClick={() => handleInvitationResponse(invitation.invitationId, invitation.groupId, 'reject', 'Thank you for the invitation, but I cannot join this trip.')}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        ❌ Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Requests Display */}
        {joinRequestsCount > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Pending Join Requests ({joinRequestsCount})
            </h3>
            <div className="space-y-6">
              {pendingRequests.map((request) => (
                <div key={request.joinRequestId} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-gray-900 flex items-center justify-between">
                      <span>{request.groupName}</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.urgencyLevel === 'high' ? 'bg-red-100 text-red-800' :
                        request.urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {request.urgencyLevel === 'high' ? '🔴 Urgent' :
                         request.urgencyLevel === 'medium' ? '🟡 Moderate' :
                         '🟢 Low Priority'} 
                        ({request.daysPending} days pending)
                      </div>
                    </h4>
                    {request.tripName && (
                      <p className="text-sm text-blue-600 font-medium">
                        {request.tripName}
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {request.requestingUserName?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {request.requestingUserName || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {request.requestingUserEmail}
                            </p>
                            {request.requestingUserProfile && (
                              <div className="text-xs text-gray-600 mt-1">
                                {request.requestingUserProfile.nationality} • 
                                {request.requestingUserProfile.age ? ` ${request.requestingUserProfile.age} years • ` : ' '}
                                {request.requestingUserProfile.travelExperience}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">
                          "{request.requestMessage}"
                        </p>
                        
                        {request.requestingUserProfile && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-xs">
                            <div>
                              <span className="font-medium text-gray-700">🌍 Languages:</span>
                              <p className="text-gray-600">{request.requestingUserProfile.languages?.join(', ')}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">🎯 Interests:</span>
                              <p className="text-gray-600">{request.requestingUserProfile.interests?.join(', ')}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">💰 Budget Level:</span>
                              <p className="text-gray-600">{request.requestingUserProfile.budgetLevel}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">⚡ Activity Pace:</span>
                              <p className="text-gray-600">{request.requestingUserProfile.activityPacing}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div>
                            Requested: {new Date(request.requestedAt).toLocaleDateString()} at {new Date(request.requestedAt).toLocaleTimeString()}
                          </div>
                          <div className="font-medium">
                            Votes: {request.totalVotesReceived} / {request.totalVotesRequired} required
                          </div>
                        </div>
                        
                        {request.hasCurrentUserVoted && (
                          <div className="text-xs bg-blue-50 text-blue-700 p-2 rounded mb-3">
                            ✅ You have already voted: {request.currentUserVote}
                          </div>
                        )}
                      </div>
                      
                      {!request.hasCurrentUserVoted && (
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleVoteOnRequest(request.groupId, request.requestingUserId, true, '')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleVoteOnRequest(request.groupId, request.requestingUserId, false, 'Not a good fit')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/pools')}
              className="flex items-center justify-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MapPinIcon className="h-5 w-5 mr-2" />
              Find Pools
            </button>
            <button
              onClick={() => navigate('/pool-duration')}
              className="flex items-center justify-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Create Pool
            </button>
            <button
              onClick={() => navigate('/trips')}
              className="flex items-center justify-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              My Trips
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <InvitationsManager
        isOpen={invitationsModalOpen}
        onClose={() => setInvitationsModalOpen(false)}
        onInvitationUpdate={handleInvitationUpdate}
      />

      <JoinRequestsManager
        groupId={null} // This will be managed differently for user's groups
        isOpen={joinRequestsModalOpen}
        onClose={() => setJoinRequestsModalOpen(false)}
        onRequestUpdate={handleJoinRequestUpdate}
      />
    </div>
  );
};

export default InvitationsAndRequests;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PoolsApi } from '../../api/poolsApi';
import { useAuth } from '../../hooks/useAuth';
import { 
  EnvelopeIcon, 
  UserGroupIcon, 
  CalendarIcon,
  MapPinIcon,
  BellIcon,
  InboxIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const InvitationsAndRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('invitations');
  const [invitationsCount, setInvitationsCount] = useState(0);
  const [joinRequestsCount, setJoinRequestsCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPendingItems, setTotalPendingItems] = useState(0);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      console.log('🔄 Starting fetchData for user:', user.uid);
      setLoading(true);
      
      const comprehensiveResponse = await PoolsApi.getAllPendingItems(user.uid);
      console.log('📋 Response received:', comprehensiveResponse);
      
      setTotalPendingItems(comprehensiveResponse.totalPendingItems || 0);
      setInvitationsCount(comprehensiveResponse.totalInvitations || 0);
      setJoinRequestsCount(comprehensiveResponse.totalVoteRequests || 0);
      setInvitations(comprehensiveResponse.pendingInvitations || []);
      setPendingRequests(comprehensiveResponse.pendingVotes || []);
      
    } catch (error) {
      console.error('❌ Error fetching data:', error);
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
      
      const responseData = {
        userId: user.uid,
        invitationId: invitationId,
        action: action,
        message: message
      };
      
      const result = await PoolsApi.respondToInvitation(responseData);
      console.log('📮 Invitation response result:', result);
      
      alert(`✅ Invitation ${action}ed successfully!`);
      fetchData(); // Refresh data
      
    } catch (error) {
      console.error('❌ Error responding to invitation:', error);
      alert(`❌ Failed to respond to invitation: ${error.message}`);
    }
  };

  const handleVoteOnRequest = async (groupId, requestUserId, approved, comment = '') => {
    try {
      console.log('🗳️ Voting on request:', { groupId, requestUserId, approved, comment });
      
      const voteData = {
        userId: user.uid,
        approved: approved,
        comment: comment
      };
      
      const result = await PoolsApi.voteOnJoinRequestNew(groupId, requestUserId, voteData);
      console.log('🗳️ Vote result:', result);
      
      const action = approved ? 'approved' : 'rejected';
      alert(`✅ Request ${action} successfully!\n\nStatus: ${result.requestStatus}\nVotes: ${result.totalVotesReceived}/${result.totalMembersRequired}`);
      
      fetchData(); // Refresh data
      
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
        
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('invitations')}
              className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'invitations'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <EnvelopeIcon className="w-5 h-5" />
              Pool Invitations
              {invitationsCount > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  {invitationsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'requests'
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserGroupIcon className="w-5 h-5" />
              Join Requests
              {joinRequestsCount > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  {joinRequestsCount}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : activeTab === 'invitations' ? (
              /* Invitations Tab */
              invitationsCount === 0 ? (
                <div className="text-center py-12">
                  <EnvelopeIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg mb-2">No pending invitations</p>
                  <p className="text-gray-400 text-sm">You'll see invitations to join travel groups here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invitations.map((invitation, idx) => {
                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(invitation.inviterName || 'User')}&background=random&color=fff`;
                    
                    return (
                      <div key={invitation.invitationId || idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start gap-4">
                          <img 
                            src={avatarUrl} 
                            alt={invitation.inviterName || 'User'} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{invitation.groupName}</h3>
                                <p className="text-gray-600 text-sm">
                                  Invited by {invitation.inviterName} • {invitation.currentMembers}/{invitation.maxMembers} members
                                </p>
                                {invitation.tripName && (
                                  <p className="text-sm font-medium text-blue-600">{invitation.tripName}</p>
                                )}
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => handleInvitationResponse(invitation.invitationId, invitation.groupId, 'reject', 'Thank you for the invitation, but I cannot join this trip.')}
                                  className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => handleInvitationResponse(invitation.invitationId, invitation.groupId, 'accept', '')}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                                >
                                  Accept
                                </button>
                              </div>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm text-gray-700 mb-3">"{invitation.message}"</p>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500 block">Trip Dates</span>
                                <span className="font-medium">
                                  {new Date(invitation.tripStartDate).toLocaleDateString()} - {new Date(invitation.tripEndDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Base City</span>
                                <span className="font-medium">{invitation.baseCity}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Activities</span>
                                <span className="font-medium">{invitation.preferredActivities?.join(', ') || 'Various'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* Join Requests Tab */
              joinRequestsCount === 0 ? (
                <div className="text-center py-12">
                  <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg mb-2">No pending requests</p>
                  <p className="text-gray-400 text-sm">Join requests for your groups will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request, idx) => {
                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(request.requestingUserName || 'User')}&background=random&color=fff`;
                    
                    return (
                      <div key={request.joinRequestId || idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="mb-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-medium text-gray-900">{request.groupName}</h4>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.urgencyLevel === 'high' ? 'bg-red-100 text-red-800' :
                              request.urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {request.daysPending} days pending
                            </div>
                          </div>
                          {request.tripName && (
                            <p className="text-sm text-blue-600 font-medium">{request.tripName}</p>
                          )}
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <img 
                            src={avatarUrl} 
                            alt={request.requestingUserName || 'User'} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{request.requestingUserName || 'Unknown User'}</h3>
                                <p className="text-gray-600 text-sm">{request.requestingUserEmail}</p>
                                {request.requestingUserProfile && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    {request.requestingUserProfile.nationality} • 
                                    {request.requestingUserProfile.age ? ` ${request.requestingUserProfile.age} years` : ''}
                                  </div>
                                )}
                              </div>
                              {!request.hasCurrentUserVoted && (
                                <div className="flex gap-2 ml-4">
                                  <button
                                    onClick={() => handleVoteOnRequest(request.groupId, request.requestingUserId, false, 'Not a good fit')}
                                    className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                                  >
                                    Reject
                                  </button>
                                  <button
                                    onClick={() => handleVoteOnRequest(request.groupId, request.requestingUserId, true, '')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                                  >
                                    Approve
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="mt-3">
                              <p className="text-sm text-gray-700 mb-3">"{request.requestMessage}"</p>
                            </div>
                            {request.requestingUserProfile && (
                              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500 block">Languages</span>
                                  <span className="font-medium">{request.requestingUserProfile.languages?.join(', ') || 'Not specified'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 block">Budget Level</span>
                                  <span className="font-medium">{request.requestingUserProfile.budgetLevel || 'Not specified'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 block">Votes</span>
                                  <span className="font-medium">{request.totalVotesReceived} / {request.totalVotesRequired}</span>
                                </div>
                              </div>
                            )}
                            {request.hasCurrentUserVoted && (
                              <div className="mt-3 text-xs bg-blue-50 text-blue-700 p-2 rounded">
                                ✅ You have already voted: {request.currentUserVote}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
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
    </div>
  );
};

export default InvitationsAndRequests;

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
  const { user, displayInfo } = useAuth(); // Get displayInfo for user email
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
      
      // Get user email from user or displayInfo
      const userEmail = user?.email || displayInfo?.email;
      console.log('🔄 User email:', userEmail);
      
      const comprehensiveResponse = await PoolsApi.getAllPendingItems(user.uid, userEmail);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Invitations & Requests
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage your pool invitations and join requests
            {totalPendingItems > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {totalPendingItems} pending
              </span>
            )}
          </p>
        </div>
      </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-3 sm:gap-4">
          <button
            onClick={() => setActiveTab('invitations')}
            className={`flex-1 px-4 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-medium rounded-xl transition-all ${
              activeTab === 'invitations'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white dark:bg-secondary-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 border border-gray-200 dark:border-secondary-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Pool Invitations</span>
              <span className="sm:hidden">Invitations</span>
              {invitationsCount > 0 && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  activeTab === 'invitations' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {invitationsCount}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 px-4 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-medium rounded-xl transition-all ${
              activeTab === 'requests'
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                : 'bg-white dark:bg-secondary-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 border border-gray-200 dark:border-secondary-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Join Requests</span>
              <span className="sm:hidden">Requests</span>
              {joinRequestsCount > 0 && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  activeTab === 'requests' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {joinRequestsCount}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-600 p-4 sm:p-6">
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
                <div className="space-y-3 sm:space-y-4">
                  {invitations.map((invitation, idx) => {
                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(invitation.inviterName || 'User')}&background=random&color=fff`;
                    
                    return (
                      <div key={invitation.invitationId || idx} className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700 p-4 sm:p-5 hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                          <img 
                            src={avatarUrl} 
                            alt={invitation.inviterName || 'User'} 
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0" 
                          />
                          <div className="flex-1 min-w-0 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg mb-1">{invitation.groupName}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                                  Invited by <span className="font-medium">{invitation.inviterName}</span> • {invitation.currentMembers}/{invitation.maxMembers} members
                                </p>
                                {invitation.tripName && (
                                  <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">{invitation.tripName}</p>
                                )}
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  onClick={() => handleInvitationResponse(invitation.invitationId, invitation.groupId, 'reject', 'Thank you for the invitation, but I cannot join this trip.')}
                                  className="px-3 sm:px-4 py-2 bg-white dark:bg-secondary-700 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium rounded-full hover:bg-red-50 dark:hover:bg-secondary-600 transition-colors border border-red-200 dark:border-red-700"
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => handleInvitationResponse(invitation.invitationId, invitation.groupId, 'accept', '')}
                                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                  Accept
                                </button>
                              </div>
                            </div>
                            {invitation.message && (
                              <div className="bg-white/50 dark:bg-secondary-800/50 rounded-lg p-3 mb-3">
                                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic">"{invitation.message}"</p>
                              </div>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                              <div className="bg-white/60 dark:bg-secondary-800/60 rounded-lg p-2">
                                <span className="text-gray-500 dark:text-gray-400 block mb-1">Trip Dates</span>
                                <span className="font-medium text-gray-900 dark:text-white text-xs">
                                  {new Date(invitation.tripStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(invitation.tripEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              <div className="bg-white/60 dark:bg-secondary-800/60 rounded-lg p-2">
                                <span className="text-gray-500 dark:text-gray-400 block mb-1">Base City</span>
                                <span className="font-medium text-gray-900 dark:text-white">{invitation.baseCity}</span>
                              </div>
                              <div className="bg-white/60 dark:bg-secondary-800/60 rounded-lg p-2 col-span-2 sm:col-span-1">
                                <span className="text-gray-500 dark:text-gray-400 block mb-1">Activities</span>
                                <span className="font-medium text-gray-900 dark:text-white text-xs truncate block">{invitation.preferredActivities?.join(', ') || 'Various'}</span>
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
                <div className="space-y-3 sm:space-y-4">
                  {pendingRequests.map((request, idx) => {
                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(request.requestingUserName || 'User')}&background=random&color=fff`;
                    
                    return (
                      <div key={request.joinRequestId || idx} className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700 p-4 sm:p-5 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{request.groupName}</h4>
                            {request.tripName && (
                              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">{request.tripName}</p>
                            )}
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
                            request.urgencyLevel === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                            request.urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {request.daysPending}d pending
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                          <img 
                            src={avatarUrl} 
                            alt={request.requestingUserName || 'User'} 
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0" 
                          />
                          <div className="flex-1 min-w-0 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">{request.requestingUserName || 'Unknown User'}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{request.requestingUserEmail}</p>
                                {request.requestingUserProfile && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {request.requestingUserProfile.nationality}
                                    {request.requestingUserProfile.age && ` • ${request.requestingUserProfile.age} years`}
                                  </div>
                                )}
                              </div>
                              {!request.hasCurrentUserVoted && (
                                <div className="flex gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => handleVoteOnRequest(request.groupId, request.requestingUserId, false, 'Not a good fit')}
                                    className="px-3 sm:px-4 py-2 bg-white dark:bg-secondary-700 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium rounded-full hover:bg-red-50 dark:hover:bg-secondary-600 transition-colors border border-red-200 dark:border-red-700"
                                  >
                                    Reject
                                  </button>
                                  <button
                                    onClick={() => handleVoteOnRequest(request.groupId, request.requestingUserId, true, '')}
                                    className="px-3 sm:px-4 py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-green-700 transition-colors shadow-sm"
                                  >
                                    Approve
                                  </button>
                                </div>
                              )}
                            </div>
                            {request.requestMessage && (
                              <div className="bg-white/50 dark:bg-secondary-800/50 rounded-lg p-3 mb-3">
                                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic">"{request.requestMessage}"</p>
                              </div>
                            )}
                            {request.requestingUserProfile && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                                <div className="bg-white/60 dark:bg-secondary-800/60 rounded-lg p-2">
                                  <span className="text-gray-500 dark:text-gray-400 block mb-1">Languages</span>
                                  <span className="font-medium text-gray-900 dark:text-white text-xs truncate block">{request.requestingUserProfile.languages?.join(', ') || 'Not specified'}</span>
                                </div>
                                <div className="bg-white/60 dark:bg-secondary-800/60 rounded-lg p-2">
                                  <span className="text-gray-500 dark:text-gray-400 block mb-1">Budget Level</span>
                                  <span className="font-medium text-gray-900 dark:text-white">{request.requestingUserProfile.budgetLevel || 'Not specified'}</span>
                                </div>
                                <div className="bg-white/60 dark:bg-secondary-800/60 rounded-lg p-2 col-span-2 sm:col-span-1">
                                  <span className="text-gray-500 dark:text-gray-400 block mb-1">Votes</span>
                                  <span className="font-medium text-gray-900 dark:text-white">{request.totalVotesReceived} / {request.totalVotesRequired}</span>
                                </div>
                              </div>
                            )}
                            {request.hasCurrentUserVoted && (
                              <div className="mt-3 text-xs sm:text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-2 sm:p-3 rounded-lg font-medium">
                                ✅ You have already voted: <span className="capitalize">{request.currentUserVote}</span>
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

        {/* Quick Actions */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-600 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/pools')}
              className="flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-secondary-600 transition-colors border border-gray-200 dark:border-secondary-600 font-medium text-sm sm:text-base"
            >
              <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
              Find Pools
            </button>
            <button
              onClick={() => navigate('/pool-duration')}
              className="flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-secondary-600 transition-colors border border-gray-200 dark:border-secondary-600 font-medium text-sm sm:text-base"
            >
              <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
              Create Pool
            </button>
            <button
              onClick={() => navigate('/trips')}
              className="flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-secondary-600 transition-colors border border-gray-200 dark:border-secondary-600 font-medium text-sm sm:text-base"
            >
              <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
              My Trips
            </button>
          </div>
        </div>
    </div>
  );
};

export default InvitationsAndRequests;

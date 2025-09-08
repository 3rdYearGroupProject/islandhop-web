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
  const [useMockData, setUseMockData] = useState(true); // Toggle for mock data

  // Mock data for demonstration
  const mockPendingRequests = {
    groups: [
      {
        groupId: "mock-group-1",
        groupName: "Sri Lanka Adventure Seekers",
        pendingRequests: [
          {
            requestId: "req_001",
            userId: "testUser002Firebase",
            userName: "Sarah Johnson",
            userEmail: "sarah.johnson@gmail.com",
            message: "Hi everyone! I'm an experienced traveler who loves adventure activities and cultural experiences. I'd love to join your group for this amazing Sri Lankan adventure!",
            requestedAt: "2025-08-27T10:30:00Z",
            memberApprovals: [
              {
                memberId: "wBuieMHjt1RKKgRoDgI9v6VyNHF3",
                action: "approve",
                reason: "Great profile and experience!",
                respondedAt: "2025-08-27T11:00:00Z"
              }
            ],
            pendingMembers: ["testUser001Firebase"],
            totalMembersRequired: 3,
            votesReceived: 1
          },
          {
            requestId: "req_002",
            userId: "testUser003Firebase",
            userName: "Mike Chen",
            userEmail: "mike.chen@outlook.com",
            message: "I'm really excited about this trip! I've been to Southeast Asia before and I'm particularly interested in the wildlife and nature experiences in Sri Lanka.",
            requestedAt: "2025-08-27T14:15:00Z",
            memberApprovals: [],
            pendingMembers: ["wBuieMHjt1RKKgRoDgI9v6VyNHF3", "testUser001Firebase"],
            totalMembersRequired: 3,
            votesReceived: 0
          }
        ],
        totalPendingRequests: 2
      },
      {
        groupId: "mock-group-2",
        groupName: "Cultural Heritage Explorers",
        pendingRequests: [
          {
            requestId: "req_003",
            userId: "testUser004Firebase",
            userName: "Elena Rodriguez",
            userEmail: "elena.rodriguez@yahoo.com",
            message: "As an art history graduate, I'm fascinated by Sri Lankan culture and ancient temples. I would love to contribute my knowledge to the group!",
            requestedAt: "2025-08-28T09:20:00Z",
            memberApprovals: [
              {
                memberId: "groupMember1",
                action: "approve",
                reason: "Perfect fit for our cultural focus!",
                respondedAt: "2025-08-28T10:00:00Z"
              },
              {
                memberId: "groupMember2",
                action: "approve",
                reason: "Her expertise would be valuable",
                respondedAt: "2025-08-28T11:30:00Z"
              }
            ],
            pendingMembers: ["wBuieMHjt1RKKgRoDgI9v6VyNHF3"],
            totalMembersRequired: 3,
            votesReceived: 2
          }
        ],
        totalPendingRequests: 1
      }
    ],
    totalGroups: 2,
    totalPendingRequests: 3
  };

  // Mock invitations data for demonstration
  const mockInvitations = {
    invitations: [
      {
        invitationId: "inv_001",
        groupId: "group-001",
        groupName: "Colombo City Explorers",
        inviterName: "David Wilson",
        inviterEmail: "david.wilson@gmail.com",
        invitedAt: "2025-08-27T16:45:00Z",
        tripStartDate: "2025-09-15T00:00:00Z",
        tripEndDate: "2025-09-20T00:00:00Z",
        memberCount: 4,
        maxMembers: 6,
        message: "Hey! We're planning an amazing cultural tour of Colombo and the surrounding areas. Your travel experience would be a great addition to our group!",
        groupDescription: "A group focused on exploring Sri Lanka's vibrant capital city, ancient temples, and local cuisine.",
        preferredActivities: ["Cultural Tours", "Food Experiences", "Historical Sites"],
        baseCity: "Colombo",
        status: "pending"
      },
      {
        invitationId: "inv_002", 
        groupId: "group-002",
        groupName: "Wildlife Safari Adventure",
        inviterName: "Priya Sharma",
        inviterEmail: "priya.sharma@yahoo.com",
        invitedAt: "2025-08-28T09:30:00Z",
        tripStartDate: "2025-09-25T00:00:00Z",
        tripEndDate: "2025-10-02T00:00:00Z",
        memberCount: 3,
        maxMembers: 8,
        message: "Hi there! We're organizing an incredible wildlife safari covering Yala, Udawalawe, and Minneriya National Parks. Would you like to join us for this amazing wildlife experience?",
        groupDescription: "Wildlife enthusiasts planning to explore Sri Lanka's best national parks and see elephants, leopards, and exotic birds.",
        preferredActivities: ["Safari", "Wildlife Photography", "Nature Walks"],
        baseCity: "Colombo",
        status: "pending"
      },
      {
        invitationId: "inv_003",
        groupId: "group-003", 
        groupName: "Hill Country Trekkers",
        inviterName: "James Mitchell",
        inviterEmail: "james.mitchell@outlook.com",
        invitedAt: "2025-08-28T14:20:00Z",
        tripStartDate: "2025-10-10T00:00:00Z",
        tripEndDate: "2025-10-17T00:00:00Z",
        memberCount: 2,
        maxMembers: 5,
        message: "We're planning an adventurous trekking expedition through Sri Lanka's hill country including Ella, Nuwara Eliya, and Adam's Peak. Perfect for adventure lovers!",
        groupDescription: "Adventure seekers planning hiking trails, tea plantation visits, and mountain climbing in Sri Lanka's beautiful hill country.",
        preferredActivities: ["Hiking", "Mountain Climbing", "Tea Plantation Tours"],
        baseCity: "Kandy",
        status: "pending"
      }
    ],
    totalInvitations: 3
  };

  useEffect(() => {
    if (user) {
      fetchCounts();
    }
  }, [user]);

  const fetchCounts = async () => {
    try {
      console.log('🔄 Starting fetchCounts for user:', user.uid);
      setLoading(true);
      
      if (useMockData) {
        // Use mock data for demonstration
        console.log('🎭 Using mock data for demonstration');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setInvitationsCount(mockInvitations.totalInvitations); // Mock invitations count
        setInvitations(mockInvitations.invitations);
        setPendingRequests(mockPendingRequests.groups);
        setJoinRequestsCount(mockPendingRequests.totalPendingRequests);
        
        console.log('✅ Mock data loaded successfully');
        console.log('📨 Mock invitations loaded:', mockInvitations.totalInvitations);
        console.log('🗳️ Mock pending requests loaded:', mockPendingRequests.totalPendingRequests);
        return;
      }
      
      // Real API calls
      // Fetch invitations count
      console.log('📨 Calling PoolsApi.getUserInvitations with userId:', user.uid);
      const invitationsResponse = await PoolsApi.getUserInvitations(user.uid);
      console.log('📨 Invitations response received:', invitationsResponse);
      console.log('📨 Raw invitations data:', invitationsResponse.invitations);
      console.log('📨 Invitations count:', invitationsResponse.invitations?.length || 0);
      
      setInvitationsCount(invitationsResponse.invitations?.length || 0);
      setInvitations(invitationsResponse.invitations || []);
      
      // Fetch pending requests that user needs to vote on
      console.log('🗳️ Calling PoolsApi.getMyPendingRequests with userId:', user.uid);
      const pendingRequestsResponse = await PoolsApi.getMyPendingRequests(user.uid);
      console.log('🗳️ Pending requests response received:', pendingRequestsResponse);
      console.log('🗳️ Total pending requests:', pendingRequestsResponse.totalPendingRequests || 0);
      
      setPendingRequests(pendingRequestsResponse.groups || []);
      setJoinRequestsCount(pendingRequestsResponse.totalPendingRequests || 0);
      
      console.log('✅ fetchCounts completed successfully');
      
    } catch (error) {
      console.error('❌ Error fetching counts:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        userId: user.uid
      });
      
      // Set counts to 0 on error to prevent UI issues
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
      
      if (useMockData) {
        // Simulate API call for mock data
        console.log('🎭 Simulating invitation response with mock data');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Show mock success message
        alert(`✅ Mock: Invitation ${action}ed successfully!\n\nThis is a demo using mock data. In real usage, this would call the API.`);
        
        // Remove the responded invitation from mock data
        setInvitations(prev => prev.filter(inv => inv.invitationId !== invitationId));
        setInvitationsCount(prev => Math.max(0, prev - 1));
        
        return;
      }
      
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
      
      if (useMockData) {
        // Simulate API call for mock data
        console.log('🎭 Simulating vote with mock data');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Show mock success message
        const action = approved ? 'approved' : 'rejected';
        alert(`✅ Mock: Request ${action} successfully!\n\nThis is a demo using mock data. In real usage, this would call the API.`);
        
        // Simulate updating the mock data (remove the voted request)
        setPendingRequests(prev => 
          prev.map(group => 
            group.groupId === groupId 
              ? {
                  ...group,
                  pendingRequests: group.pendingRequests.filter(req => req.userId !== requestUserId)
                }
              : group
          ).filter(group => group.pendingRequests.length > 0)
        );
        
        // Update counts
        setJoinRequestsCount(prev => Math.max(0, prev - 1));
        
        return;
      }
      
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
      
      // Refresh the pending requests
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
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {useMockData ? 'Mock Data' : 'Live Data'}
                </span>
                <button
                  onClick={() => {
                    setUseMockData(!useMockData);
                    setTimeout(() => fetchCounts(), 100); // Refresh data after toggle
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    useMockData ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useMockData ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                            Invited by {invitation.inviterName} • {invitation.memberCount}/{invitation.maxMembers} members
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 mb-3">
                          "{invitation.message}"
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {invitation.groupDescription}
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

                      <div className="text-xs text-gray-500 mb-4">
                        Invited: {new Date(invitation.invitedAt).toLocaleDateString()} at {new Date(invitation.invitedAt).toLocaleTimeString()}
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
              {pendingRequests.map((group) => (
                <div key={group.groupId} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    {group.groupName}
                  </h4>
                  <div className="space-y-4">
                    {group.pendingRequests?.map((request) => (
                      <div key={request.requestId} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {request.userName?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {request.userName || 'Unknown User'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {request.userEmail}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                              "{request.message}"
                            </p>
                            <div className="text-xs text-gray-500 mb-3">
                              Requested: {new Date(request.requestedAt).toLocaleDateString()} at {new Date(request.requestedAt).toLocaleTimeString()}
                            </div>
                            <div className="text-xs text-gray-600 mb-3">
                              Votes: {request.votesReceived || 0} / {request.totalMembersRequired || 0} required
                            </div>
                            {request.memberApprovals && request.memberApprovals.length > 0 && (
                              <div className="text-xs text-gray-500 mb-3">
                                <span className="font-medium">Existing votes:</span>
                                {request.memberApprovals.map((approval, index) => (
                                  <span key={index} className="ml-1">
                                    {approval.action === 'approve' ? '✅' : '❌'}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleVoteOnRequest(group.groupId, request.userId, true, '')}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => handleVoteOnRequest(group.groupId, request.userId, false, 'Not a good fit')}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                            >
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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

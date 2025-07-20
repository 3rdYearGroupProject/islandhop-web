import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InvitationsManager from '../../components/InvitationsManager';
import JoinRequestsManager from '../../components/JoinRequestsManager';
import { PoolsApi } from '../../api/poolsApi';
import { useAuth } from '../../hooks/useAuth';
import { 
  EnvelopeIcon, 
  UserGroupIcon, 
  CheckIcon, 
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  InformationCircleIcon,
  BellIcon,
  InboxIcon
} from '@heroicons/react/24/outline';

const InvitationsAndRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('invitations');
  const [invitationsModalOpen, setInvitationsModalOpen] = useState(false);
  const [joinRequestsModalOpen, setJoinRequestsModalOpen] = useState(false);
  const [invitationsCount, setInvitationsCount] = useState(0);
  const [joinRequestsCount, setJoinRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCounts();
    }
  }, [user]);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      
      // Fetch invitations count
      const invitationsResponse = await PoolsApi.getUserInvitations(user.uid);
      setInvitationsCount(invitationsResponse.invitations?.length || 0);
      
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invitations & Requests
            </h1>
            <p className="text-gray-600">
              Manage your pool invitations and join requests
            </p>
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

  // Sample data - replace with actual API calls
  const sampleInvitations = [
    {
      id: 'inv_001',
      groupId: 'group_001',
      groupName: 'Adventure Seekers',
      inviterName: 'Sarah Johnson',
      inviterEmail: 'sarah@example.com',
      message: 'Hey! We have similar travel interests and I think you\'d be a great addition to our Sri Lanka adventure. Would love to have you join us!',
      tripDetails: {
        startDate: '2025-08-15',
        endDate: '2025-08-22',
        baseCity: 'Colombo',
        destinations: ['Kandy', 'Ella', 'Galle'],
        budgetLevel: 'Medium',
        memberCount: 4,
        maxMembers: 6
      },
      invitedAt: '2025-07-15T10:30:00Z',
      status: 'pending'
    },
    {
      id: 'inv_002',
      groupId: 'group_002',
      groupName: 'Cultural Explorers',
      inviterName: 'Mike Chen',
      inviterEmail: 'mike@example.com',
      message: 'We\'re planning an amazing cultural tour and noticed you love historical sites. Join our group for an unforgettable journey!',
      tripDetails: {
        startDate: '2025-09-01',
        endDate: '2025-09-05',
        baseCity: 'Colombo',
        destinations: ['Anuradhapura', 'Sigiriya', 'Polonnaruwa'],
        budgetLevel: 'High',
        memberCount: 3,
        maxMembers: 5
      },
      invitedAt: '2025-07-14T15:45:00Z',
      status: 'pending'
    }
  ];

  const sampleJoinRequests = [
    {
      id: 'req_001',
      groupId: 'group_003',
      groupName: 'Mountain Hikers',
      requesterName: 'Alex Kumar',
      requesterEmail: 'alex@example.com',
      message: 'Hi! I would love to join your Mountain Hikers trip! I\'m particularly interested in hiking, photography and would enjoy exploring mountain and forest areas. I think we have similar travel preferences and I\'d be excited to plan this adventure together!',
      userProfile: {
        age: 28,
        interests: ['hiking', 'photography', 'wildlife'],
        experience: 'intermediate'
      },
      requestedAt: '2025-07-16T09:15:00Z',
      status: 'pending'
    },
    {
      id: 'req_002',
      groupId: 'group_003',
      groupName: 'Mountain Hikers',
      requesterName: 'Emily Davis',
      requesterEmail: 'emily@example.com',
      message: 'Hello! I saw your group and I\'m really excited about the mountain hiking trip. I have experience in trekking and would love to contribute to the group dynamics!',
      userProfile: {
        age: 25,
        interests: ['hiking', 'adventure', 'nature'],
        experience: 'advanced'
      },
      requestedAt: '2025-07-15T14:20:00Z',
      status: 'pending'
    }
  ];

  useEffect(() => {
    // Load invitations and requests
    loadInvitations();
    loadJoinRequests();
  }, []);

  const loadInvitations = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/invitations', { credentials: 'include' });
      // const data = await response.json();
      setInvitations(sampleInvitations);
    } catch (error) {
      console.error('Failed to load invitations:', error);
    }
  };

  const loadJoinRequests = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/join-requests', { credentials: 'include' });
      // const data = await response.json();
      setJoinRequests(sampleJoinRequests);
    } catch (error) {
      console.error('Failed to load join requests:', error);
    }
  };

  const handleInvitationResponse = async (invitationId, response, groupId, groupName) => {
    console.log(`🎯 ${response.toUpperCase()} INVITATION START`);
    
    try {
      setIsProcessing(true);
      setProcessingId(invitationId);

      const userId = getUserUID();
      if (!userId) {
        alert('Please log in to respond to invitations');
        return;
      }

      // TODO: Replace with actual API call
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL_USER_SERVICES || 'http://localhost:8083'}/api/v1/invitations/${invitationId}/${response}`;
      
      console.log('📡 Making PUT request to:', apiUrl);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (response === 'accept') {
        alert(`🎉 Invitation accepted!\n\nWelcome to "${groupName}"! You can now start planning your trip with the group.`);
        
        // Navigate to trip planning page
        navigate(`/trip-planning/trip_${groupId}?groupId=${groupId}`, {
          state: {
            tripId: `trip_${groupId}`,
            groupId: groupId,
            tripName: groupName,
            joinedGroup: true
          }
        });
      } else {
        alert(`Invitation to "${groupName}" has been declined.`);
      }

      // Update local state
      setInvitations(prev => 
        prev.map(inv => 
          inv.id === invitationId 
            ? { ...inv, status: response === 'accept' ? 'accepted' : 'declined' }
            : inv
        )
      );

    } catch (error) {
      console.error(`❌ ${response.toUpperCase()} INVITATION FAILED:`, error);
      alert(`Failed to ${response} invitation. Please try again.`);
    } finally {
      setIsProcessing(false);
      setProcessingId(null);
    }
  };

  const handleJoinRequestResponse = async (requestId, response, requesterName, groupId) => {
    console.log(`🎯 ${response.toUpperCase()} JOIN REQUEST START`);
    
    try {
      setIsProcessing(true);
      setProcessingId(requestId);

      const userId = getUserUID();
      if (!userId) {
        alert('Please log in to respond to join requests');
        return;
      }

      // TODO: Replace with actual API call
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL_USER_SERVICES || 'http://localhost:8083'}/api/v1/groups/${groupId}/join-requests/${requestId}/${response}`;
      
      console.log('📡 Making PUT request to:', apiUrl);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (response === 'approve') {
        alert(`✅ Join request approved!\n\n${requesterName} has been added to your group and will be notified.`);
      } else {
        alert(`❌ Join request from ${requesterName} has been declined.`);
      }

      // Update local state
      setJoinRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: response === 'approve' ? 'approved' : 'declined' }
            : req
        )
      );

    } catch (error) {
      console.error(`❌ ${response.toUpperCase()} JOIN REQUEST FAILED:`, error);
      alert(`Failed to ${response} join request. Please try again.`);
    } finally {
      setIsProcessing(false);
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  const pendingJoinRequests = joinRequests.filter(req => req.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invitations & Requests</h1>
        <p className="text-gray-600">Manage your group invitations and join requests</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('invitations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'invitations'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5" />
              <span>Invitations</span>
              {pendingInvitations.length > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {pendingInvitations.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5" />
              <span>Join Requests</span>
              {pendingJoinRequests.length > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {pendingJoinRequests.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Invitations Tab */}
      {activeTab === 'invitations' && (
        <div>
          {pendingInvitations.length === 0 ? (
            <div className="text-center py-12">
              <EnvelopeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending invitations</h3>
              <p className="text-gray-500">You'll see group invitations here when they arrive</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {invitation.groupName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Invited by {invitation.inviterName} • {formatDateTime(invitation.invitedAt)}
                      </p>
                    </div>
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Invitation
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {formatDate(invitation.tripDetails.startDate)} - {formatDate(invitation.tripDetails.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {invitation.tripDetails.destinations.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {invitation.tripDetails.memberCount}/{invitation.tripDetails.maxMembers} members
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Invitation Message */}
                  <div className="mb-4">
                    <p className="text-gray-700 italic">"{invitation.message}"</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleInvitationResponse(invitation.id, 'accept', invitation.groupId, invitation.groupName)}
                      disabled={isProcessing && processingId === invitation.id}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <CheckIcon className="w-4 h-4" />
                      {isProcessing && processingId === invitation.id ? 'Accepting...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => handleInvitationResponse(invitation.id, 'decline', invitation.groupId, invitation.groupName)}
                      disabled={isProcessing && processingId === invitation.id}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      {isProcessing && processingId === invitation.id ? 'Declining...' : 'Decline'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Join Requests Tab */}
      {activeTab === 'requests' && (
        <div>
          {pendingJoinRequests.length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending join requests</h3>
              <p className="text-gray-500">Join requests for your groups will appear here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingJoinRequests.map((request) => (
                <div key={request.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {request.requesterName} wants to join "{request.groupName}"
                      </h3>
                      <p className="text-sm text-gray-600">
                        Requested {formatDateTime(request.requestedAt)}
                      </p>
                    </div>
                    <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      Join Request
                    </div>
                  </div>

                  {/* User Profile */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <InformationCircleIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          Age: {request.userProfile.age}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                          <strong>Interests:</strong> {request.userProfile.interests.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                          <strong>Experience:</strong> {request.userProfile.experience}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Request Message */}
                  <div className="mb-4">
                    <p className="text-gray-700 italic">"{request.message}"</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleJoinRequestResponse(request.id, 'approve', request.requesterName, request.groupId)}
                      disabled={isProcessing && processingId === request.id}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <CheckIcon className="w-4 h-4" />
                      {isProcessing && processingId === request.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleJoinRequestResponse(request.id, 'decline', request.requesterName, request.groupId)}
                      disabled={isProcessing && processingId === request.id}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      {isProcessing && processingId === request.id ? 'Declining...' : 'Decline'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvitationsAndRequests;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  UserGroupIcon, 
  CheckIcon, 
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { getUserUID } from '../../utils/userStorage';

const InvitationsAndRequests = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('invitations');
  const [invitations, setInvitations] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState(null);

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

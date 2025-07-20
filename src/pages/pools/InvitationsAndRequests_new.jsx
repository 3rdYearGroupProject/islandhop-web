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

export default InvitationsAndRequests;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Clock, 
  Car, 
  Bed, 
  Camera, 
  MessageCircle, 
  ArrowRight,
  Check,
  MapPin,
  Users,
  Calendar
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import PoolProgressBar from '../../components/PoolProgressBar';
import { Share2, Plus, Users as UsersIcon, CheckCircle, AlertCircle, Timer } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import SharePoolModal from '../../components/SharePoolModal';
import JoinPoolModal from '../../components/JoinPoolModal';
import InviteUserModal from '../../components/InviteUserModal';
import JoinRequestsManager from '../../components/JoinRequestsManager';
import { poolsApi } from '../../api/poolsApi';

const PoolDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    poolName, 
    poolDescription, 
    selectedDates, 
    poolSize, 
    startDate, 
    endDate, 
    selectedTerrains,
    selectedActivities,
    destinations,
    userUid 
  } = location.state || {};
  
  console.log('📍 PoolDetailsPage received all data:', {
    poolName,
    poolDescription,
    selectedDates,
    poolSize,
    selectedTerrains,
    selectedActivities,
    destinations,
    userUid
  });
  
  const [poolDetails, setPoolDetails] = useState({
    budget: '',
    transportation: 'shared',
    accommodation: 'shared',
    meetingPoint: '',
    additionalNotes: ''
  });

  // Added states for pool actions similar to ViewPoolPage
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [joinRequestsModalOpen, setJoinRequestsModalOpen] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isMember, setIsMember] = useState(false);
  
  // Trip Confirmation State (from ViewPoolPage)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState('pending'); // 'pending', 'confirming', 'confirmed', 'failed'
  const [confirmationLoading, setConfirmationLoading] = useState(false);

  const { user } = useAuth();

  // Helpers for capacity
  const currentParticipants = location.state?.participants || 0;
  const maxParticipants = location.state?.poolSize || 0;
  const hasCapacity = currentParticipants < maxParticipants;

  useEffect(() => {
    // Determine role based on route state; infer creator/member from passed state
    const creatorUid = location.state?.userUid || location.state?.creatorUid || null;
    const members = location.state?.members || [];

    if (user) {
      setIsCreator(!!creatorUid && (user.uid === creatorUid || user.id === creatorUid));
      setIsMember(Array.isArray(members) ? members.some(m => m.userId === user.uid || m.email === user.email) : false);
    }
  }, [location.state, user]);
  
  const [isCreatingPool, setIsCreatingPool] = useState(false);

  const budgetOptions = [
    { value: 'budget', label: 'Budget ($50-100/day)', icon: '💰' },
    { value: 'mid-range', label: 'Mid-range ($100-200/day)', icon: '💳' },
    { value: 'luxury', label: 'Luxury ($200+/day)', icon: '💎' },
    { value: 'flexible', label: 'Flexible/Discuss', icon: '🤝' }
  ];

  const transportationOptions = [
    { value: 'shared', label: 'Shared Transportation', description: 'Split costs for van/bus rental' },
    { value: 'individual', label: 'Individual Transport', description: 'Each person arranges own transport' },
    { value: 'public', label: 'Public Transport', description: 'Use buses, trains, and tuk-tuks' }
  ];

  const accommodationOptions = [
    { value: 'shared', label: 'Shared Accommodation', description: 'Share rooms/houses to split costs' },
    { value: 'individual', label: 'Individual Rooms', description: 'Everyone books their own room' },
    { value: 'mixed', label: 'Mixed/Flexible', description: 'Decide per location' }
  ];

  const handleInputChange = (field, value) => {
    setPoolDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreatePool = async () => {
    setIsCreatingPool(true);
    
    try {
      const poolData = {
        poolName,
        poolDescription,
        selectedDates,
        poolSize,
        startDate,
        endDate,
        destinations,
        ...poolDetails,
        userUid,
        createdAt: new Date()
      };

      console.log('🎉 Pool created successfully:', poolData);
      
      // Navigate back to pools page with the new pool data
      navigate('/pools', {
        state: {
          newPool: poolData,
          message: 'Pool created successfully!'
        }
      });
    } catch (error) {
      console.error('Failed to create pool:', error);
      // Still navigate back but show error
      navigate('/pools', {
        state: {
          error: 'Failed to create pool. Please try again.'
        }
      });
    } finally {
      setIsCreatingPool(false);
    }
  };

  const handleBack = () => {
    navigate('/pool-destinations', { 
      state: { 
        poolName,
        poolDescription,
        selectedDates,
        poolSize,
        startDate,
        endDate,
        selectedTerrains,
        selectedActivities,
        userUid
      } 
    });
  };

  // Trip Confirmation Functions (from ViewPoolPage)
  const handleInitiateTripConfirmation = async () => {
    setConfirmationLoading(true);
    try {
      // Create a pool object from location state for API call
      const poolData = {
        id: location.state?.poolId || 'temp-pool-id',
        tripId: location.state?.tripId || location.state?.poolId,
        startDate: selectedDates?.[0]?.toISOString() || new Date().toISOString(),
        endDate: selectedDates?.[1]?.toISOString() || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        destinations: destinations?.map(d => d.name).join(', ') || 'Sri Lanka',
        budget: poolDetails.budget || 'mid-range',
        totalCost: 40000, // Default cost
        costPerPerson: 10000 // Default cost per person
      };

      // Prepare confirmation data object matching backend API spec
      const confirmationData = {
        groupId: poolData.id,
        tripId: poolData.tripId,
        userId: user?.uid || user?.id,
        minMembers: 2,
        maxMembers: poolSize || 6,
        tripStartDate: poolData.startDate,
        tripEndDate: poolData.endDate,
        confirmationHours: 48,
        totalAmount: poolData.totalCost,
        pricePerPerson: poolData.costPerPerson,
        currency: "LKR",
        paymentDeadlineHours: 72,
        tripDetails: {
          destinations: Array.isArray(destinations) ? destinations.map(d => d.name) : [poolData.destinations],
          activities: selectedActivities || ["sightseeing"],
          accommodation: poolDetails.accommodation || "hotel",
          transportation: poolDetails.transportation || "private_van"
        }
      };
      
      console.log('🎯 Sending confirmation data:', confirmationData);
      const result = await poolsApi.initiateTripConfirmation(confirmationData);
      console.log('Trip confirmation initiated:', result);
      setConfirmationStatus('confirming');
      setShowConfirmationModal(true);
    } catch (error) {
      console.error('Failed to initiate trip confirmation:', error);
      alert('Failed to initiate trip confirmation. Please try again.');
    } finally {
      setConfirmationLoading(false);
    }
  };

  const handleConfirmParticipation = async () => {
    setConfirmationLoading(true);
    try {
      const poolId = location.state?.poolId || 'temp-pool-id';
      const result = await poolsApi.confirmParticipation(poolId, user?.uid || user?.id);
      console.log('Participation confirmed:', result);
      setConfirmationStatus('confirmed');
      // Navigate to pools page after confirmation
      setTimeout(() => {
        navigate('/pools', { state: { activeTab: 'confirmed' } });
      }, 2000);
    } catch (error) {
      console.error('Failed to confirm participation:', error);
      alert('Failed to confirm participation. Please try again.');
    } finally {
      setConfirmationLoading(false);
    }
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleInvite = (emails) => {
    console.log('Inviting:', emails);
  };

  const handleRequestJoin = () => {
    console.log('Request to join pool:', poolName);
    setJoinModalOpen(false);
  };

  const formatDateRange = () => {
    if (!selectedDates || selectedDates.length === 0) return 'No dates selected';
    if (selectedDates.length === 1) {
      return selectedDates[0].toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    const start = selectedDates[0];
    const end = selectedDates[1];
    
    return `${start.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })} → ${end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })}`;
  };

  const isFormValid = poolDetails.budget && poolDetails.meetingPoint.trim();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Trip Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-xl max-w-md w-full p-6 relative z-[10000]">
            <div className="text-center">
              {confirmationStatus === 'confirming' ? (
                <>
                  <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Confirm Your Participation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The trip organizer has initiated trip confirmation. Please confirm your participation to proceed with this amazing journey!
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Trip Details:</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Destination:</strong> {destinations?.map(d => d.name).join(', ') || 'Sri Lanka'}<br/>
                      <strong>Duration:</strong> {selectedDates?.length || 1} days<br/>
                      <strong>Dates:</strong> {formatDateRange()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleConfirmParticipation}
                      disabled={confirmationLoading}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
                    >
                      {confirmationLoading ? (
                        <>
                          <Timer className="w-4 h-4 mr-2 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Participation
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowConfirmationModal(false)}
                      className="flex-1 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </>
              ) : confirmationStatus === 'confirmed' ? (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Participation Confirmed!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Great! Your participation has been confirmed. You'll be redirected to your confirmed trips shortly.
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      🎉 You're all set! Check your email for next steps and payment details.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Trip Confirmation Started
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Trip confirmation has been initiated! All participants will be notified and can now confirm their participation.
                  </p>
                  <button
                    onClick={() => setShowConfirmationModal(false)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Got it!
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Navbar />
      
      <PoolProgressBar poolName={poolName} onBack={handleBack} currentStep={5} completedSteps={[1, 2, 3, 4]} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Pool Details Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Budget Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <DollarSign className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Budget Range</h2>
                </div>
                <p className="text-gray-600">
                  What's your expected budget range per person per day?
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgetOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange('budget', option.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                      poolDetails.budget === option.value
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{option.icon}</span>
                      <div className="font-semibold text-gray-900">{option.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Transportation */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <Car className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Transportation</h2>
                </div>
                <p className="text-gray-600">
                  How do you prefer to travel between destinations?
                </p>
              </div>
              
              <div className="space-y-3">
                {transportationOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange('transportation', option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                      poolDetails.transportation === option.value
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accommodation */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <Bed className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Accommodation</h2>
                </div>
                <p className="text-gray-600">
                  What's your preference for accommodation arrangements?
                </p>
              </div>
              
              <div className="space-y-3">
                {accommodationOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange('accommodation', option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                      poolDetails.accommodation === option.value
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Meeting Point */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Meeting Point</h2>
                </div>
                <p className="text-gray-600">
                  Where should the group meet to start the trip?
                </p>
              </div>
              
              <input
                type="text"
                placeholder="e.g., Bandaranaike International Airport, Colombo Fort Railway Station"
                value={poolDetails.meetingPoint}
                onChange={(e) => handleInputChange('meetingPoint', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Additional Notes */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <MessageCircle className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Additional Notes</h2>
                </div>
                <p className="text-gray-600">
                  Any special requirements, preferences, or information for potential pool members?
                </p>
              </div>
              
              <textarea
                rows={4}
                placeholder="e.g., Must be comfortable with early morning starts, vegetarian meals preferred, photographers welcome..."
                value={poolDetails.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Right Side - Pool Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Pool Summary</h3>
              {/* Top action buttons (Share / Invite / Join Requests / Confirm / Join) */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-md transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </button>

                {/* Invite and Join should only be shown if there is capacity */}
                {hasCapacity && (
                  <>
                    <button
                      onClick={() => setInviteModalOpen(true)}
                      className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Invite
                    </button>
                    <button
                      onClick={() => setJoinModalOpen(true)}
                      disabled={isMember}
                      className={`flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors ${isMember ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Join Pool
                    </button>
                  </>
                )}

                <button
                  onClick={() => setJoinRequestsModalOpen(true)}
                  className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-md transition-colors"
                >
                  <UsersIcon className="w-4 h-4 mr-2" /> Requests
                </button>

                {/* Confirm Trip shown only to creator */}
                {isCreator && (
                  <button
                    onClick={handleInitiateTripConfirmation}
                    disabled={confirmationLoading}
                    className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors ml-auto disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    {confirmationLoading ? (
                      <Timer className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {confirmationLoading ? 'Starting...' : 'Confirm Trip'}
                  </button>
                )}

                {/* Confirm Participation shown only to participants who are not the creator */}
                {isMember && !isCreator && (
                  <button
                    onClick={handleConfirmParticipation}
                    disabled={confirmationLoading}
                    className="flex items-center px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    {confirmationLoading ? (
                      <Timer className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mr-2" />
                    )}
                    {confirmationLoading ? 'Confirming...' : 'Confirm Participation'}
                  </button>
                )}

                {/* Render modals */}
                <SharePoolModal 
                  open={shareModalOpen} 
                  onClose={() => setShareModalOpen(false)} 
                  participants={[]} 
                  currentCount={currentParticipants} 
                  maxCount={maxParticipants} 
                  onInvite={handleInvite} 
                />
                <JoinPoolModal 
                  open={joinModalOpen} 
                  onClose={() => setJoinModalOpen(false)} 
                  poolData={{ name: poolName, id: location.state?.poolId }} 
                  onSuccess={handleRequestJoin} 
                />
                <InviteUserModal 
                  isOpen={inviteModalOpen} 
                  onClose={() => setInviteModalOpen(false)} 
                  groupData={{ name: poolName, id: location.state?.poolId }} 
                  onSuccess={(result) => {
                    console.log('Invitation sent:', result);
                    alert('Invitation sent successfully!');
                  }} 
                />
                <JoinRequestsManager
                  groupId={location.state?.poolId || 'temp-pool-id'}
                  isOpen={joinRequestsModalOpen}
                  onClose={() => setJoinRequestsModalOpen(false)}
                  onRequestUpdate={(result) => {
                    console.log('Join request updated:', result);
                    // Could refresh pool data here if needed
                  }}
                />

              </div>

              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <div className="font-semibold text-gray-900 text-lg">{poolName}</div>
                  {poolDescription && (
                    <div className="text-sm text-gray-600 mt-1">{poolDescription}</div>
                  )}
                </div>
                
                {/* Details Grid */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{formatDateRange()}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{poolSize} people total</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{destinations?.length || 0} destinations</span>
                  </div>
                </div>

                {/* Destinations List */}
                {destinations && destinations.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-900 mb-2">Route:</div>
                    <div className="space-y-1">
                      {destinations.map((dest, index) => (
                        <div key={dest.id} className="text-sm text-gray-600 flex items-center">
                          <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-2">
                            {index + 1}
                          </span>
                          {dest.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Preferences */}
                <div className="space-y-2 text-sm">
                  {poolDetails.budget && (
                    <div>
                      <span className="font-medium text-gray-900">Budget: </span>
                      <span className="text-gray-600">
                        {budgetOptions.find(opt => opt.value === poolDetails.budget)?.label}
                      </span>
                    </div>
                  )}
                  
                  {poolDetails.transportation && (
                    <div>
                      <span className="font-medium text-gray-900">Transport: </span>
                      <span className="text-gray-600">
                        {transportationOptions.find(opt => opt.value === poolDetails.transportation)?.label}
                      </span>
                    </div>
                  )}
                  
                  {poolDetails.accommodation && (
                    <div>
                      <span className="font-medium text-gray-900">Stay: </span>
                      <span className="text-gray-600">
                        {accommodationOptions.find(opt => opt.value === poolDetails.accommodation)?.label}
                      </span>
                    </div>
                  )}
                  
                  {poolDetails.meetingPoint && (
                    <div>
                      <span className="font-medium text-gray-900">Meeting: </span>
                      <span className="text-gray-600">{poolDetails.meetingPoint}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Create Pool Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCreatePool}
                  disabled={!isFormValid || isCreatingPool}
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    !isFormValid || isCreatingPool
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {isCreatingPool ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Pool...
                    </>
                  ) : (
                    <>
                      <Check className="mr-3 h-5 w-5" />
                      Create Pool
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolDetailsPage;

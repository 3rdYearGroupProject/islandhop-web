import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card, { CardBody } from '../../components/Card';
import GroupChat from '../../components/GroupChat';
import Footer from '../../components/Footer';
import { getUserData } from '../../utils/userStorage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  MapPinIcon,
  UserGroupIcon,
  CalendarIcon,
  PhoneIcon,
  ClockIcon,
  MapIcon,
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const OngoingPools = () => {
  const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);
  const [ongoingPools, setOngoingPools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPool, setSelectedPool] = useState(null);

  // Fetch ongoing pools on component mount
  useEffect(() => {
    const fetchOngoingPools = async () => {
      try {
        setIsLoading(true);
        const userData = getUserData();
        
        if (!userData || !userData.uid) {
          setError('User not authenticated');
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5006/api/pools/user/${userData.uid}`);
        
        if (response.data.success) {
          const trips = response.data.data.trips || [];
          setOngoingPools(trips);
          // Select the first pool by default
          if (trips.length > 0) {
            setSelectedPool(trips[0]);
          }
        } else {
          setError('Failed to fetch ongoing pools');
        }
      } catch (err) {
        console.error('Error fetching ongoing pools:', err);
        setError(err.response?.data?.message || 'Failed to load ongoing pools');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOngoingPools();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get current location from trip
  const getCurrentLocation = (trip) => {
    if (!trip?.tripDetails?.destinations || trip.tripDetails.destinations.length === 0) {
      return 'Unknown';
    }
    
    const today = new Date();
    const startDate = new Date(trip.tripStartDate);
    const endDate = new Date(trip.tripEndDate);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    const destinations = trip.tripDetails.destinations;
    
    // Calculate which destination based on progress
    if (daysPassed < 0) return destinations[0]; // Not started yet
    if (daysPassed >= totalDays) return destinations[destinations.length - 1]; // Ended
    
    const progressRatio = daysPassed / totalDays;
    const currentDestIndex = Math.min(
      Math.floor(progressRatio * destinations.length),
      destinations.length - 1
    );
    
    return destinations[currentDestIndex];
  };

  // Get next destination
  const getNextDestination = (trip) => {
    if (!trip?.tripDetails?.destinations || trip.tripDetails.destinations.length === 0) {
      return 'Unknown';
    }
    
    const currentLoc = getCurrentLocation(trip);
    const destinations = trip.tripDetails.destinations;
    const currentIndex = destinations.indexOf(currentLoc);
    
    if (currentIndex === -1 || currentIndex === destinations.length - 1) {
      return 'Final Destination';
    }
    
    return destinations[currentIndex + 1];
  };

  // Get participants from trip members
  const getParticipants = (trip) => {
    if (!trip?.memberIds) return [];
    
    return trip.memberIds.map((memberId, index) => {
      const memberPayment = trip.paymentInfo?.memberPayments?.find(p => p.userId === memberId);
      const isCreator = memberId === trip.creatorUserId;
      
      return {
        name: memberPayment?.userName || memberPayment?.userEmail || `Member ${index + 1}`,
        role: isCreator ? 'Owner' : 'Traveler',
        img: `https://ui-avatars.com/api/?name=${encodeURIComponent(memberPayment?.userName || `Member${index + 1}`)}&background=random`,
        status: 'active',
        email: memberPayment?.userEmail || '',
        userId: memberId,
        paymentStatus: memberPayment?.overallPaymentStatus || 'pending'
      };
    });
  };

  // Get destinations string
  const getDestinationsString = (trip) => {
    const destinations = trip?.tripDetails?.destinations || [];
    return destinations.join(', ') || 'No destinations';
  };

  // Get itinerary array
  const getItineraryArray = (trip) => {
    const destinations = trip?.tripDetails?.destinations || [];
    return destinations;
  };

  // Get pool image
  const getPoolImage = (trip) => {
    // Default image based on destination
    const destinations = trip?.tripDetails?.destinations || [];
    const firstDest = destinations[0]?.toLowerCase() || '';
    
    if (firstDest.includes('galle')) {
      return 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=320&q=80';
    } else if (firstDest.includes('kandy')) {
      return 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=320&q=80';
    } else if (firstDest.includes('colombo')) {
      return 'https://images.unsplash.com/photo-1561536542-e6389d6d5e2f?auto=format&fit=crop&w=320&q=80';
    }
    
    // Default Sri Lanka image
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=320&q=80';
  };

  // Get trip status badge
  const getStatusInfo = (status) => {
    const statusMap = {
      'payment_pending': { label: 'Payment Pending', color: 'yellow' },
      'confirmed': { label: 'Confirmed', color: 'green' },
      'ongoing': { label: 'Ongoing', color: 'blue' },
      'completed': { label: 'Completed', color: 'gray' },
      'cancelled': { label: 'Cancelled', color: 'red' }
    };
    
    return statusMap[status] || { label: status, color: 'gray' };
  };

  // Prevent background scroll when GroupChat is open
  useEffect(() => {
    if (isGroupChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isGroupChatOpen]);

  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardBody>
            <div className="text-center">
              <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Error Loading Pools
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // If no pools, show empty state
  if (ongoingPools.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardBody>
            <div className="text-center">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Ongoing Pools
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You don't have any ongoing pools at the moment.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Use selected pool or first pool
  const currentTrip = selectedPool || ongoingPools[0];
  const participants = getParticipants(currentTrip);
  const currentLocation = getCurrentLocation(currentTrip);
  const nextDestination = getNextDestination(currentTrip);
  const statusInfo = getStatusInfo(currentTrip.status);
  
  // Create ongoingPool object from real data
  const ongoingPool = {
    id: currentTrip.confirmedTripId || currentTrip._id,
    name: currentTrip.tripName || currentTrip.groupName,
    destinations: getDestinationsString(currentTrip),
    date: formatDate(currentTrip.tripStartDate),
    endDate: formatDate(currentTrip.tripEndDate),
    status: statusInfo.label,
    statusColor: statusInfo.color,
    participants: `${currentTrip.currentMemberCount || currentTrip.memberCount}/${currentTrip.maxMembers}`,
    owner: currentTrip.creatorUserId,
    image: getPoolImage(currentTrip),
    itinerary: getItineraryArray(currentTrip),
    currentLocation: currentLocation,
    notes: `Vehicle: ${currentTrip.vehicleType || 'TBD'}. ${currentTrip.driverNeeded ? 'Driver included.' : ''} ${currentTrip.guideNeeded ? 'Guide included.' : ''}`,
    nextDestination: nextDestination,
    estimatedArrival: '3:30 PM', // You can calculate this based on itinerary data
    vehicleType: currentTrip.vehicleType || 'Not specified',
    totalAmount: currentTrip.paymentInfo?.totalAmount || 0,
    pricePerPerson: currentTrip.pricePerPerson || currentTrip.paymentInfo?.pricePerPerson || 0,
    currency: currentTrip.paymentInfo?.currency || 'LKR',
    paymentStatus: currentTrip.userPaymentStatus || 'pending',
    userPayment: currentTrip.userPayment
  };
  
  // Generate live updates from trip actions
  const liveUpdates = (currentTrip.actions || [])
    .slice(0, 4) // Get last 4 actions
    .reverse() // Most recent first
    .map(action => {
      const time = new Date(action.timestamp).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      });
      
      let message = '';
      let author = 'System';
      
      switch (action.action) {
        case 'TRIP_FULLY_CONFIRMED':
          message = `🎉 Trip confirmed! All ${action.details?.confirmedMemberCount} members are ready!`;
          break;
        case 'UPFRONT_PAYMENT_COMPLETED':
          message = `💰 Upfront payment of ${currentTrip.paymentInfo?.currency} ${action.details?.amount} completed`;
          author = participants.find(p => p.userId === action.userId)?.name || 'Member';
          break;
        case 'PAYMENT_PROCESS_INITIATED':
          message = `💳 Payment process started for ${action.details?.memberCount} members`;
          break;
        case 'CONFIRM_PARTICIPATION':
          message = `✅ Confirmed participation in the trip`;
          author = participants.find(p => p.userId === action.userId)?.name || 'Member';
          break;
        case 'INITIATE_CONFIRMATION':
          message = `🚀 Trip confirmation initiated`;
          author = participants.find(p => p.userId === action.userId)?.name || 'Trip Creator';
          break;
        default:
          message = action.action.replace(/_/g, ' ').toLowerCase();
      }
      
      return { time, message, author };
    });

  // If no updates, show default message
  if (liveUpdates.length === 0) {
    liveUpdates.push({ 
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), 
      message: 'Trip in progress...', 
      author: participants[0]?.name || 'Pool Member' 
    });
  }

  return (
    <div className="space-y-8">
      {/* Trip Selector - Show if multiple trips */}
      {ongoingPools.length > 1 && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
          <CardBody className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              You have {ongoingPools.length} ongoing trips - Select one to view details:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {ongoingPools.map((trip) => (
                <button
                  key={trip._id}
                  onClick={() => setSelectedPool(trip)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedPool?._id === trip._id
                      ? 'border-blue-500 bg-blue-100 dark:bg-blue-800/50'
                      : 'border-gray-200 hover:border-blue-300 bg-white dark:bg-secondary-800'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {trip.tripName || trip.groupName}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {formatDate(trip.tripStartDate)} • {trip.currentMemberCount}/{trip.maxMembers} members
                  </div>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      getStatusInfo(trip.status).color === 'green' ? 'bg-green-100 text-green-700' :
                      getStatusInfo(trip.status).color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                      getStatusInfo(trip.status).color === 'blue' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {getStatusInfo(trip.status).label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Trip Summary - ConfirmedPools style, but with Ongoing details */}
      <div className="mb-12">
        <div className="relative group bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-400 hover:border-green-600 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 flex flex-col lg:flex-row h-full max-w-4xl mx-auto">
          {/* Image on the left */}
          <div className="relative w-full lg:w-1/3 h-56 lg:h-auto flex-shrink-0">
            <img
              src={ongoingPool.image}
              alt={ongoingPool.name}
              className="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-none lg:rounded-l-2xl"
              style={{ borderTopLeftRadius: 'inherit', borderBottomLeftRadius: 'inherit' }}
            />
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                ongoingPool.statusColor === 'green' ? 'bg-green-100 text-green-800 border-green-200' :
                ongoingPool.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                ongoingPool.statusColor === 'blue' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                ongoingPool.statusColor === 'red' ? 'bg-red-100 text-red-800 border-red-200' :
                'bg-gray-100 text-gray-800 border-gray-200'
              }`}>
                {ongoingPool.status}
              </span>
            </div>
          </div>
          {/* Details on the right */}
          <div className="flex-1 flex flex-col p-8">
            <div className="flex flex-col items-start justify-between mb-3">
              <span className="uppercase tracking-wide text-gray-400 text-xs font-semibold mb-1">Ongoing Pool</span>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {ongoingPool.name}
              </h3>
            </div>
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{ongoingPool.destinations}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{ongoingPool.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{ongoingPool.participants} participants</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm text-green-700 font-bold">Status: {ongoingPool.status}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">Owner: {ongoingPool.owner}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">Current: {ongoingPool.currentLocation}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-sm">💰 Price: {ongoingPool.currency} {ongoingPool.pricePerPerson}/person</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className={`text-sm font-semibold ${
                    ongoingPool.paymentStatus === 'paid' ? 'text-green-600' :
                    ongoingPool.paymentStatus === 'partial' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    Payment: {ongoingPool.paymentStatus === 'paid' ? '✓ Paid' : 
                              ongoingPool.paymentStatus === 'partial' ? '⚠ Partial' : 
                              '✗ Pending'}
                  </span>
                </div>
              </div>
            </div>
            {/* Itinerary Timeline */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Itinerary Progress
              </h4>
              <div className="flex items-center space-x-4">
                {ongoingPool.itinerary.map((destination, index) => (
                  <div key={destination} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                        {destination}
                      </span>
                    </div>
                    {index < ongoingPool.itinerary.length - 1 && (
                      <div className="flex-1 h-1 bg-gradient-to-r from-blue-600 to-gray-300 mx-2 rounded-full min-w-[40px]"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {/* You can add a rating or other info here if needed */}
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors">
                  View Details
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors border border-gray-400 dark:border-secondary-500">
                  Contact Group
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Status Banner & Emergency Info Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Status Banner */}
        <Card className="!bg-green-600 !border-green-600 text-white min-h-[60px]">
          <CardBody className="p-2 !bg-green-600 flex items-center h-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="font-bold text-xs">LIVE NOW</span>
                <span className="text-xs">Currently in: <strong>{ongoingPool.currentLocation}</strong></span>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-90">Next: {ongoingPool.nextDestination}</div>
                <div className="font-bold text-xs">ETA: {ongoingPool.estimatedArrival}</div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Emergency Info */}
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
          <CardBody className="p-2">
            <div className="flex items-center gap-2 mb-1">
              <ExclamationCircleIcon className="h-4 w-4 text-yellow-600" />
              <h4 className="font-bold text-yellow-800 dark:text-yellow-200 text-xs">
                Emergency Information
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div>
                <span className="font-semibold text-yellow-800 dark:text-yellow-200 block">Emergency:</span>
                <span className="text-yellow-700 dark:text-yellow-300">+94 77 123 4567</span>
              </div>
              <div>
                <span className="font-semibold text-yellow-800 dark:text-yellow-200 block">Guide:</span>
                <span className="text-yellow-700 dark:text-yellow-300">+94 71 987 6543</span>
              </div>
              <div>
                <span className="font-semibold text-yellow-800 dark:text-yellow-200 block">Driver:</span>
                <span className="text-yellow-700 dark:text-yellow-300">+94 75 456 7890</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Itinerary Progress */}
      <Card>
        <CardBody>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Journey Progress
          </h3>
          <div className="flex items-center justify-center space-x-8">
            {ongoingPool.itinerary.map((destination, index) => {
              const isCompleted = index === 0; // Kandy completed
              const isCurrent = index === 1; // Currently in Nuwara Eliya
              const isNext = index === 2; // Next is Ella
              return (
                <div key={destination} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                      isCompleted 
                        ? 'bg-green-600' 
                        : isCurrent 
                        ? 'bg-yellow-500 animate-pulse' 
                        : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-sm font-semibold mt-2 ${
                      isCompleted 
                        ? 'text-green-600' 
                        : isCurrent 
                        ? 'text-yellow-600' 
                        : 'text-gray-500'
                    }`}>
                      {destination}
                    </span>
                    {isCurrent && (
                      <span className="text-xs text-yellow-600 font-bold mt-1">
                        Current
                      </span>
                    )}
                  </div>
                  {index < ongoingPool.itinerary.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded-full min-w-[60px] max-w-[100px] ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-600 to-yellow-500' 
                        : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Live Map Placeholder */}
      <Card>
        <CardBody>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <MapIcon className="h-6 w-6 mr-2" />
            Live Location
          </h3>
          <div className="bg-gray-100 dark:bg-secondary-800 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-secondary-600">
            <MapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Live map tracking would be integrated here
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Real-time GPS location of the travel group
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Participants & Live Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Participants */}
        <Card>
          <CardBody>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Active Participants
            </h3>
            <div className="space-y-3">
              {participants.map((participant) => (
                <div key={participant.userId} className="flex items-center gap-3 bg-white dark:bg-secondary-800 rounded-lg p-3 border border-gray-200 dark:border-secondary-600">
                  <div className="relative">
                    <img
                      src={participant.img}
                      alt={participant.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {participant.name}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      {participant.role} • Online
                    </div>
                    <div className={`text-xs mt-0.5 ${
                      participant.paymentStatus === 'paid' ? 'text-green-600' :
                      participant.paymentStatus === 'partial' ? 'text-yellow-600' :
                      'text-gray-500'
                    }`}>
                      {participant.paymentStatus === 'paid' ? '✓ Fully Paid' :
                       participant.paymentStatus === 'partial' ? '⚠ Partial Payment' :
                       '○ Payment Pending'}
                    </div>
                  </div>
                  <button className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-300 transition-colors border border-green-400">
                    Message
                  </button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Live Updates Feed */}
        <Card>
          <CardBody>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
              Live Updates
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {liveUpdates.map((update, index) => (
                <div key={index} className="bg-white dark:bg-secondary-800 rounded-lg p-4 border border-gray-200 dark:border-secondary-600">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                          {update.author}
                        </span>
                        <span className="text-xs text-gray-500">
                          {update.time}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {update.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setIsGroupChatOpen(true)}
              className="flex-1 bg-green-200 text-green-800 py-3 px-6 rounded-full font-medium hover:bg-green-300 transition-colors flex items-center justify-center gap-2 border border-green-400"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              Group Chat
            </button>
            <button className="flex-1 bg-red-200 text-red-800 py-3 px-6 rounded-full font-medium hover:bg-red-300 transition-colors flex items-center justify-center gap-2 border border-red-400">
              <PhoneIcon className="h-5 w-5" />
              Emergency Call
            </button>
            <button className="flex-1 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2 border border-gray-400 dark:border-secondary-500">
              <MapIcon className="h-5 w-5" />
              Share Location
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Group Chat Modal */}
      <GroupChat 
        isOpen={isGroupChatOpen}
        onClose={() => setIsGroupChatOpen(false)}
        participants={participants}
        poolName={ongoingPool.name}
      />
      <Footer />
    </div>
  );
};

export default OngoingPools;

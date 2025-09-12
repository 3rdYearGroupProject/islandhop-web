import React, { useState, useEffect } from 'react';
import Card, { CardBody } from '../../components/Card';
import { 
  MapPinIcon,
  UserGroupIcon,
  CalendarIcon,
  PhoneIcon,
  ClockIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  IdentificationIcon,
  ExclamationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { poolsApi } from '../../api/poolsApi';

const ConfirmedPools = ({ currentUser }) => {
  const [confirmedTrips, setConfirmedTrips] = useState([]);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser?.uid) {
      loadConfirmedTrips();
    }
  }, [currentUser]);

  const loadConfirmedTrips = async () => {
    if (!currentUser?.uid) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const response = await poolsApi.getUserConfirmedTrips(currentUser.uid);
      
      if (response.success && response.data.trips.length > 0) {
        setConfirmedTrips(response.data.trips);
        setCurrentTripIndex(0);
        setError(null);
      } else {
        setConfirmedTrips([]);
        setError(null);
      }
    } catch (err) {
      console.error('Error loading confirmed trips:', err);
      setError('Failed to load confirmed trips');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'payment_pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'payment_pending':
        return 'Payment Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const mapTripToUI = (trip) => {
    if (!trip) return null;

    // Create itinerary from destinations
    const itinerary = trip.tripDetails?.destinations?.map((dest, index) => ({
      destination: dest,
      date: `Day ${index + 1}`
    })) || [];

    return {
      id: trip.confirmedTripId,
      name: trip.tripName || trip.groupName,
      destinations: trip.tripDetails?.destinations?.join(', ') || 'Destinations TBD',
      date: formatDate(trip.tripStartDate),
      status: getStatusText(trip.status),
      statusColor: getStatusColor(trip.status),
      participants: `${trip.currentMemberCount}/${trip.maxMembers}`,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=320&q=80',
      itinerary: itinerary,
      notes: `Trip ${trip.status}. ${trip.paymentInfo?.paymentDeadline ? `Payment deadline: ${formatDate(trip.paymentInfo.paymentDeadline)}` : ''}`,
      pricePerPerson: trip.paymentInfo?.pricePerPerson,
      confirmationDeadline: trip.confirmationDeadline,
      isCreator: trip.creatorUserId === currentUser?.uid,
      userConfirmed: trip.userConfirmed,
      userPaymentStatus: trip.userPaymentStatus,
      accommodation: trip.tripDetails?.accommodation,
      transportation: trip.tripDetails?.transportation,
      groupId: trip.groupId
    };
  };

  const currentTrip = confirmedTrips.length > 0 ? confirmedTrips[currentTripIndex] : null;
  const confirmedPool = mapTripToUI(currentTrip);

  const navigateTrip = (direction) => {
    if (direction === 'next' && currentTripIndex < confirmedTrips.length - 1) {
      setCurrentTripIndex(currentTripIndex + 1);
    } else if (direction === 'prev' && currentTripIndex > 0) {
      setCurrentTripIndex(currentTripIndex - 1);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <ExclamationCircleIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Please sign in to view your confirmed trips</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && confirmedTrips.length === 0) {
    return (
      <div className="text-center text-red-600 p-8">
        <ExclamationCircleIcon className="h-12 w-12 mx-auto mb-4" />
        <p>{error}</p>
        <button 
          onClick={loadConfirmedTrips}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (confirmedTrips.length === 0) {
    return (
      <div className="text-center py-12">
        <UserGroupIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Confirmed Trips
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have any confirmed trips yet. Once you confirm your participation in a trip, it will appear here.
        </p>
      </div>
    );
  }

  if (!confirmedPool) return null;

  // Payment Status Data from real API
  const paymentStatus = currentTrip.paymentInfo?.memberPayments?.map((payment) => {
    const memberConfirmation = currentTrip.memberConfirmations?.find(mc => mc.userId === payment.userId);
    const isCurrentUser = payment.userId === currentUser?.uid;
    const isCreator = payment.userId === currentTrip.creatorUserId;
    
    return {
      userId: payment.userId,
      name: isCurrentUser ? 'You' : (isCreator ? 'Trip Creator' : `Member ${payment.userId.slice(-4)}`),
      amount: payment.amount,
      paid: payment.status === 'completed' ? payment.amount : 0,
      status: payment.status === 'completed' ? 'Paid' : 'Pending',
      method: payment.paymentId ? 'Online Payment' : 'Pending',
      isCurrentUser
    };
  }) || [];

  // Participants Data from real API
  const participants = currentTrip.memberIds?.map((memberId) => {
    const memberConfirmation = currentTrip.memberConfirmations?.find(mc => mc.userId === memberId);
    const isCreator = memberId === currentTrip.creatorUserId;
    const isCurrentUser = memberId === currentUser?.uid;
    
    return {
      userId: memberId,
      name: isCurrentUser ? 'You' : (isCreator ? 'Trip Creator' : `Member ${memberId.slice(-4)}`),
      role: isCreator ? 'Creator' : 'Member',
      img: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`,
      confirmed: memberConfirmation?.confirmed || false,
      isCurrentUser,
      isCreator
    };
  }) || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Trip Navigation - Show only if multiple trips */}
      {confirmedTrips.length > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-secondary-800 rounded-lg p-4 shadow">
          <button
            onClick={() => navigateTrip('prev')}
            disabled={currentTripIndex === 0}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Trip {currentTripIndex + 1} of {confirmedTrips.length}
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {confirmedPool.name}
            </p>
          </div>
          
          <button
            onClick={() => navigateTrip('next')}
            disabled={currentTripIndex === confirmedTrips.length - 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Trip Summary - MyPools Style Card */}
      <div className="mb-8 sm:mb-12">
        <div className="relative group bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl sm:rounded-2xl border border-green-400 hover:border-green-600 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 flex flex-col lg:flex-row h-full max-w-full sm:max-w-4xl mx-auto">
          {/* Image on the left */}
          <div className="relative w-full lg:w-1/3 h-40 sm:h-56 lg:h-auto flex-shrink-0">
            <img
              src={confirmedPool.image}
              alt={confirmedPool.name}
              className="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-none lg:rounded-l-2xl"
              style={{ borderTopLeftRadius: 'inherit', borderBottomLeftRadius: 'inherit' }}
            />
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
              <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium border ${confirmedPool.statusColor}`}>
                {confirmedPool.status}
              </span>
            </div>
          </div>
          {/* Details on the right */}
          <div className="flex-1 flex flex-col p-4 sm:p-8">
            <div className="flex flex-col items-start justify-between mb-2 sm:mb-3">
              <span className="uppercase tracking-wide text-gray-400 text-xs font-semibold mb-1">Confirmed Pool</span>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {confirmedPool.name}
              </h3>
            </div>
            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-1 sm:gap-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
                  <span className="text-xs sm:text-sm">{confirmedPool.destinations}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
                  <span className="text-xs sm:text-sm">{confirmedPool.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
                  <span className="text-xs sm:text-sm">{confirmedPool.participants} participants</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-600" />
                  <span className="text-xs sm:text-sm text-green-700 font-bold">Status: {confirmedPool.status}</span>
                </div>
                {confirmedPool.pricePerPerson && (
                  <div className="flex items-center text-gray-600">
                    <CreditCardIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
                    <span className="text-xs sm:text-sm">Rs. {confirmedPool.pricePerPerson.toLocaleString()} per person</span>
                  </div>
                )}
                {confirmedPool.confirmationDeadline && (
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
                    <span className="text-xs sm:text-sm">Deadline: {formatDate(confirmedPool.confirmationDeadline)}</span>
                  </div>
                )}
              </div>
            </div>
            {/* Itinerary Timeline */}
            <div className="mb-3 sm:mb-4">
              <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 sm:mb-3">
                Itinerary Progress
              </h4>
              <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
                {confirmedPool.itinerary.map((item, index) => (
                  <div key={item.destination} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mt-1 text-center">
                        {item.destination}
                      </span>
                    </div>
                    {index < confirmedPool.itinerary.length - 1 && (
                      <div className="flex-1 h-1 bg-gradient-to-r from-blue-600 to-gray-300 mx-1 sm:mx-2 rounded-full min-w-[30px] sm:min-w-[40px]"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 sm:mt-4">
              {confirmedPool.itinerary.length} destinations over {confirmedPool.itinerary.length} days
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 mt-auto gap-3 sm:gap-0">
              <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                {confirmedPool.isCreator && (
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                    Trip Creator
                  </span>
                )}
                {confirmedPool.userConfirmed && (
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                    ✓ Confirmed
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button 
                  onClick={() => window.location.href = `/view-pool/${currentTrip.groupId}`}
                  className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-700 transition-colors flex-1 sm:flex-none justify-center"
                >
                  View Details
                </button>
                <button className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-full hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors flex-1 sm:flex-none justify-center">
                  Contact Group
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary Section */}
      <Card className="rounded-xl">
        <CardBody>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Itinerary
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Your trip spans {confirmedPool.itinerary.length} days. Here's a glance at your planned destinations.
          </p>
          <div className="flex items-start justify-center">
            {confirmedPool.itinerary.map((item, index) => (
              <React.Fragment key={item.destination}>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: '#1C4ED8' }}></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2">
                    {item.destination}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.date}
                  </span>
                </div>
                {index < confirmedPool.itinerary.length - 1 && (
                  <div className="flex items-center" style={{ marginTop: '12px' }}>
                    <div className="w-16 h-1 rounded-full" style={{ backgroundColor: '#1C4ED8' }}></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Payment Status & Participants Side by Side */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
        {/* Payment Status Section */}
        <Card className="rounded-lg sm:rounded-xl flex-1">
          <CardBody className="px-3 sm:px-4">
            <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
              <CreditCardIcon className="h-4 w-4 sm:h-6 sm:w-6 mr-1 sm:mr-2" />
              Payment Status
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {paymentStatus.map((payment) => {
                const percent = Math.round((payment.paid / payment.amount) * 100);
                return (
                  <div key={payment.name} className="bg-white dark:bg-secondary-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-secondary-600 relative">
                    {/* Status Badge - Top Right Corner */}
                    <span className={`absolute top-4 right-4 sm:top-5 sm:right-5 inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap w-fit ${
                      payment.status === 'Paid' 
                        ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300' 
                        : 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300'
                    }`}>
                      {payment.status}
                    </span>
                    <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-6 mb-3 sm:mb-4 pr-16 sm:pr-20">
                      <span className="font-bold text-gray-900 dark:text-white min-w-[120px] sm:min-w-[140px] text-sm sm:text-base">
                        {payment.name}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                        <strong>Amount:</strong> Rs. {payment.amount.toLocaleString()}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                        <strong>Method:</strong> {payment.method}
                      </span>
                    </div>
                    <div className="relative">
                    <div className="w-full rounded-full h-2 sm:h-3" style={{ backgroundColor: '#e6effc' }}>
                      <div 
                        className="h-2 sm:h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: '#1C4ED8' }}
                      ></div>
                    </div>
                      <span className="absolute right-0 -top-4 sm:-top-6 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
        {/* Participants Section */}
        <Card className="rounded-lg sm:rounded-xl flex-1">
          <CardBody className="px-3 sm:px-4">
            <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Participants ({participants.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
              {participants.map((participant) => (
                <div key={participant.userId} className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-secondary-800 rounded-lg p-2 sm:p-3 border border-gray-200 dark:border-secondary-600">
                  <img
                    src={participant.img}
                    alt={participant.name}
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-info-500"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                      {participant.name}
                      {participant.isCurrentUser && <span className="ml-1 text-blue-600">(You)</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                        participant.isCreator 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {participant.role}
                      </span>
                      {participant.confirmed && (
                        <CheckCircleIcon className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card className="rounded-lg sm:rounded-xl">
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-3 sm:mb-4">
            <button className="flex-1 bg-blue-100 text-blue-800 py-2 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-blue-200 transition-colors border border-blue-300 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base">
              <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              Contact Group
            </button>
            <button 
              onClick={() => window.location.href = `/view-pool/${confirmedPool.groupId}`}
              className="flex-1 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 py-2 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 border border-gray-400 dark:border-secondary-500 text-sm sm:text-base"
            >
              <IdentificationIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              Trip Details
            </button>
            {confirmedPool.userPaymentStatus === 'pending' && (
              <button className="flex-1 bg-green-100 text-green-800 py-2 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-green-200 transition-colors border border-green-300 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base">
                <CreditCardIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                Make Payment
              </button>
            )}
          </div>
          
          {/* Trip Information */}
          <div className="p-0 mt-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-sm sm:text-base">Trip Information</h4>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-1">
              {confirmedPool.accommodation && (
                <p><strong>Accommodation:</strong> {confirmedPool.accommodation}</p>
              )}
              {confirmedPool.transportation && (
                <p><strong>Transportation:</strong> {confirmedPool.transportation}</p>
              )}
              {confirmedPool.confirmationDeadline && (
                <p><strong>Confirmation Deadline:</strong> {formatDate(confirmedPool.confirmationDeadline)}</p>
              )}
              <p className="mt-2">All trip participants will be notified of any updates. Contact the group for any questions or changes.</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ConfirmedPools;

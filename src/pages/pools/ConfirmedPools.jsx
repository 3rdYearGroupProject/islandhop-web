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
  BanknotesIcon,
  ExclamationCircleIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { poolsApi } from '../../api/poolsApi';

const ConfirmedPools = () => {
  const [tripDetails, setTripDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [votingData, setVotingData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    loadTripDetails();
  }, []);

  const loadTripDetails = async () => {
    setLoading(true);
    try {
      const mockTripId = 'trip_123'; // In real app, get from props/router
      const details = await poolsApi.getConfirmedTripDetails(mockTripId);
      setTripDetails(details);
      setPaymentStatus(details.members || []);
    } catch (err) {
      console.error('Error loading trip details:', err);
      setError('Failed to load trip details');
      // Fallback to mock data for development
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    // Mock data for development/demo
    const mockTrip = {
      id: 'trip_123',
      name: 'Highlands Adventure',
      destinations: 'Kandy, Nuwara Eliya, Ella',
      date: '2025-07-15',
      status: 'Confirmed',
      participants: '6/6',
      guide: { name: 'Michael Guide', contact: '+94 77 987 6543', rating: 4.9 },
      driver: { name: 'Priyantha Driver', contact: '+94 77 123 4567', rating: 4.8, car: 'Toyota Prius 2018' },
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=320&q=80',
      itinerary: [
        { destination: 'Kandy', date: 'July 15' },
        { destination: 'Nuwara Eliya', date: 'July 16' },
        { destination: 'Ella', date: 'July 17' }
      ],
      totalCost: 120000,
      paymentPhase: 'upfront', // 'upfront', 'final', 'decision', 'complete'
      upfrontDeadline: '2025-06-15',
      finalDeadline: '2025-07-08',
      members: [
        { 
          userId: 'user1', 
          name: 'John Doe', 
          role: 'Creator',
          upfrontAmount: 20000,
          finalAmount: 20000,
          upfrontPaid: 20000,
          finalPaid: 0,
          upfrontStatus: 'Paid',
          finalStatus: 'Pending',
          paymentMethod: 'Credit Card',
          img: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        { 
          userId: 'user2',
          name: 'Jane Smith', 
          role: 'Member',
          upfrontAmount: 20000,
          finalAmount: 20000,
          upfrontPaid: 20000,
          finalPaid: 0,
          upfrontStatus: 'Paid',
          finalStatus: 'Pending',
          paymentMethod: 'Credit Card',
          img: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        { 
          userId: 'user3',
          name: 'Sam Perera', 
          role: 'Member',
          upfrontAmount: 20000,
          finalAmount: 20000,
          upfrontPaid: 5000,
          finalPaid: 0,
          upfrontStatus: 'Partial',
          finalStatus: 'Pending',
          paymentMethod: 'Bank Transfer',
          img: 'https://randomuser.me/api/portraits/men/45.jpg'
        },
        { 
          userId: 'user4',
          name: 'Ayesha Fernando', 
          role: 'Member',
          upfrontAmount: 20000,
          finalAmount: 20000,
          upfrontPaid: 0,
          finalPaid: 0,
          upfrontStatus: 'Pending',
          finalStatus: 'Pending',
          paymentMethod: 'Credit Card',
          img: 'https://randomuser.me/api/portraits/women/46.jpg'
        }
      ]
    };
    setTripDetails(mockTrip);
    setPaymentStatus(mockTrip.members);
  };

  const handleMakePayment = async (userId, paymentType, amount) => {
    setLoading(true);
    try {
      const result = paymentType === 'upfront' 
        ? await poolsApi.makeUpfrontPayment(tripDetails.id, userId, amount)
        : await poolsApi.makeFinalPayment(tripDetails.id, userId, amount);
      
      console.log('Payment successful:', result);
      setShowPaymentModal(false);
      await loadTripDetails(); // Refresh data
    } catch (err) {
      console.error('Payment failed:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteOnDecision = async (vote) => {
    setLoading(true);
    try {
      await poolsApi.voteOnTripDecision(tripDetails.id, vote);
      setShowVoteModal(false);
      await loadTripDetails();
    } catch (err) {
      console.error('Voting failed:', err);
      setError('Failed to submit vote');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelParticipation = async () => {
    setLoading(true);
    try {
      await poolsApi.cancelIndividualParticipation(tripDetails.id);
      setShowCancelModal(false);
      // Navigate back to pools or show success message
    } catch (err) {
      console.error('Cancellation failed:', err);
      setError('Failed to cancel participation');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentPhaseStatus = () => {
    if (!tripDetails) return 'Unknown';
    const now = new Date();
    const upfrontDeadline = new Date(tripDetails.upfrontDeadline);
    const finalDeadline = new Date(tripDetails.finalDeadline);
    
    if (now < upfrontDeadline) return 'Upfront Payment Phase';
    if (now < finalDeadline) return 'Final Payment Phase';
    return 'Payment Complete';
  };

  const getDaysUntilDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading && !tripDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !tripDetails) {
    return (
      <div className="text-center text-red-600 p-8">
        <ExclamationCircleIcon className="h-12 w-12 mx-auto mb-4" />
        <p>{error}</p>
        <button 
          onClick={loadTripDetails}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!tripDetails) return null;

  const participants = [
    { name: tripDetails.guide?.name || 'Michael Guide', role: 'Guide', img: 'https://randomuser.me/api/portraits/men/47.jpg', from: 'Colombo', contact: tripDetails.guide?.contact || '+94 77 987 6543', rating: tripDetails.guide?.rating || 4.9 },
    {
      name: tripDetails.driver?.name || 'Priyantha Driver',
      role: 'Driver',
      img: 'https://randomuser.me/api/portraits/men/48.jpg',
      car: tripDetails.driver?.car || 'Toyota Prius 2018',
      from: 'Kandy',
      contact: tripDetails.driver?.contact || '+94 77 123 4567',
      rating: tripDetails.driver?.rating || 4.8
    },
    ...tripDetails.members || []
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Payment Phase Timeline */}
      <Card className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200">
        <CardBody>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <ClockIcon className="h-6 w-6 mr-2 text-blue-600" />
            Payment Timeline - {getPaymentPhaseStatus()}
          </h3>
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute top-2 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
                <div className={`absolute top-2 left-0 h-1 bg-blue-600 rounded-full transition-all duration-500 ${
                  tripDetails.paymentPhase === 'upfront' ? 'w-1/3' :
                  tripDetails.paymentPhase === 'final' ? 'w-2/3' : 'w-full'
                }`}></div>
                <div className="relative flex justify-between">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      tripDetails.paymentPhase === 'upfront' || tripDetails.paymentPhase === 'final' || tripDetails.paymentPhase === 'complete'
                        ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                    }`}></div>
                    <span className="text-xs mt-1 text-center">Upfront Payment<br/>{getDaysUntilDeadline(tripDetails.upfrontDeadline)} days</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      tripDetails.paymentPhase === 'final' || tripDetails.paymentPhase === 'complete'
                        ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                    }`}></div>
                    <span className="text-xs mt-1 text-center">Final Payment<br/>{getDaysUntilDeadline(tripDetails.finalDeadline)} days</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      tripDetails.paymentPhase === 'complete'
                        ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'
                    }`}></div>
                    <span className="text-xs mt-1 text-center">Trip Confirmed<br/>Ready to go!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white dark:bg-secondary-800 p-3 rounded-lg">
              <span className="font-semibold text-blue-600">Total Trip Cost:</span>
              <span className="ml-2">Rs. {tripDetails.totalCost?.toLocaleString()}</span>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-3 rounded-lg">
              <span className="font-semibold text-green-600">Upfront Required:</span>
              <span className="ml-2">Rs. {(tripDetails.totalCost * 0.5)?.toLocaleString()}</span>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-3 rounded-lg">
              <span className="font-semibold text-purple-600">Final Payment:</span>
              <span className="ml-2">Rs. {(tripDetails.totalCost * 0.5)?.toLocaleString()}</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Trip Summary - Enhanced with Payment Actions */}
      <div className="mb-8 sm:mb-12">
        <div className="relative group bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl sm:rounded-2xl border border-green-400 hover:border-green-600 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 flex flex-col lg:flex-row h-full max-w-full sm:max-w-4xl mx-auto">
          {/* Image on the left */}
          <div className="relative w-full lg:w-1/3 h-40 sm:h-56 lg:h-auto flex-shrink-0">
            <img
              src={tripDetails.image}
              alt={tripDetails.name}
              className="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-none lg:rounded-l-2xl"
              style={{ borderTopLeftRadius: 'inherit', borderBottomLeftRadius: 'inherit' }}
            />
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
              <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
                {tripDetails.status}
              </span>
            </div>
          </div>
          {/* Details on the right */}
          <div className="flex-1 flex flex-col p-4 sm:p-8">
            <div className="flex flex-col items-start justify-between mb-2 sm:mb-3">
              <span className="uppercase tracking-wide text-gray-400 text-xs font-semibold mb-1">Confirmed Pool</span>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {tripDetails.name}
              </h3>
            </div>
            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-1 sm:gap-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
                  <span className="text-xs sm:text-sm">{tripDetails.destinations}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
                  <span className="text-xs sm:text-sm">{tripDetails.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
                  <span className="text-xs sm:text-sm">{tripDetails.participants} participants</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-600" />
                  <span className="text-xs sm:text-sm text-green-700 font-bold">Status: {tripDetails.status}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
                  <span className="text-xs sm:text-sm">Guide: {tripDetails.guide?.name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
                  <span className="text-xs sm:text-sm">Driver: {tripDetails.driver?.name}</span>
                </div>
              </div>
            </div>
            {/* Itinerary Timeline */}
            <div className="mb-3 sm:mb-4">
              <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 sm:mb-3">
                Itinerary Progress
              </h4>
              <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
                {tripDetails.itinerary.map((item, index) => (
                  <div key={item.destination} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mt-1 text-center">
                        {item.destination}
                      </span>
                    </div>
                    {index < tripDetails.itinerary.length - 1 && (
                      <div className="flex-1 h-1 bg-gradient-to-r from-blue-600 to-gray-300 mx-1 sm:mx-2 rounded-full min-w-[30px] sm:min-w-[40px]"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 sm:mt-4">
              {tripDetails.itinerary.length} destinations over {tripDetails.itinerary.length} days
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 mt-auto gap-3 sm:gap-0">
              <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                {/* Payment Phase Indicator */}
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  tripDetails.paymentPhase === 'upfront' ? 'bg-yellow-100 text-yellow-800' :
                  tripDetails.paymentPhase === 'final' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {getPaymentPhaseStatus()}
                </span>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-700 transition-colors flex-1 sm:flex-none justify-center">
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
            Your trip spans {tripDetails.itinerary.length} days. Here's a glance at your planned destinations.
          </p>
          <div className="flex items-start justify-center">
            {tripDetails.itinerary.map((item, index) => (
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
                {index < tripDetails.itinerary.length - 1 && (
                  <div className="flex items-center" style={{ marginTop: '12px' }}>
                    <div className="w-16 h-1 rounded-full" style={{ backgroundColor: '#1C4ED8' }}></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Two-Phase Payment Dashboard */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
        {/* Payment Status Section - Enhanced for Two-Phase System */}
        <Card className="rounded-lg sm:rounded-xl flex-1">
          <CardBody className="px-3 sm:px-4">
            <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
              <CreditCardIcon className="h-4 w-4 sm:h-6 sm:w-6 mr-1 sm:mr-2" />
              Payment Dashboard
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {paymentStatus.map((member) => {
                const currentPhaseAmount = tripDetails.paymentPhase === 'upfront' ? member.upfrontAmount : member.finalAmount;
                const currentPhasePaid = tripDetails.paymentPhase === 'upfront' ? member.upfrontPaid : member.finalPaid;
                const currentPhaseStatus = tripDetails.paymentPhase === 'upfront' ? member.upfrontStatus : member.finalStatus;
                const currentPercent = Math.round((currentPhasePaid / currentPhaseAmount) * 100);
                const totalPercent = Math.round(((member.upfrontPaid + member.finalPaid) / (member.upfrontAmount + member.finalAmount)) * 100);

                return (
                  <div key={member.userId} className="bg-white dark:bg-secondary-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-secondary-600 relative">
                    {/* Status Badge - Top Right Corner */}
                    <span className={`absolute top-4 right-4 sm:top-5 sm:right-5 inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap w-fit ${
                      currentPhaseStatus === 'Paid' 
                        ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300' 
                        : currentPhaseStatus === 'Partial'
                        ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {currentPhaseStatus}
                    </span>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-6 mb-3 sm:mb-4 pr-16 sm:pr-20">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.img}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                        />
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base block">
                            {member.name}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            member.role === 'Creator' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                        <div>
                          <span className="text-gray-700 dark:text-gray-300">
                            <strong>Current Phase:</strong> Rs. {currentPhaseAmount.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-700 dark:text-gray-300">
                            <strong>Method:</strong> {member.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Two-Phase Progress Bars */}
                    <div className="space-y-3">
                      {/* Current Phase Progress */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-gray-600">
                            {tripDetails.paymentPhase === 'upfront' ? 'Upfront Payment' : 'Final Payment'}
                          </span>
                          <span className="text-xs font-semibold text-gray-700">{currentPercent}%</span>
                        </div>
                        <div className="w-full rounded-full h-2" style={{ backgroundColor: '#e6effc' }}>
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${currentPercent}%`, 
                              backgroundColor: currentPhaseStatus === 'Paid' ? '#10B981' : currentPhaseStatus === 'Partial' ? '#F59E0B' : '#EF4444'
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Total Progress */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-gray-600">Overall Progress</span>
                          <span className="text-xs font-semibold text-gray-700">{totalPercent}%</span>
                        </div>
                        <div className="w-full rounded-full h-1" style={{ backgroundColor: '#e6effc' }}>
                          <div 
                            className="h-1 rounded-full transition-all duration-500"
                            style={{ width: `${totalPercent}%`, backgroundColor: '#1C4ED8' }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Action Buttons */}
                    {currentPhaseStatus !== 'Paid' && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {currentPhaseStatus === 'Pending' && (
                          <button
                            onClick={() => {
                              setSelectedPayment({
                                userId: member.userId,
                                name: member.name,
                                amount: currentPhaseAmount,
                                type: tripDetails.paymentPhase
                              });
                              setShowPaymentModal(true);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-full hover:bg-green-700 transition-colors"
                          >
                            <BanknotesIcon className="h-4 w-4" />
                            Pay Full Amount
                          </button>
                        )}
                        {currentPhaseStatus === 'Partial' && (
                          <button
                            onClick={() => {
                              setSelectedPayment({
                                userId: member.userId,
                                name: member.name,
                                amount: currentPhaseAmount - currentPhasePaid,
                                type: tripDetails.paymentPhase
                              });
                              setShowPaymentModal(true);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700 transition-colors"
                          >
                            <BanknotesIcon className="h-4 w-4" />
                            Complete Payment
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Decision Voting Section - Show when partial payments exist */}
            {paymentStatus.some(m => m.upfrontStatus === 'Partial' || m.finalStatus === 'Partial') && (
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                  Payment Decision Required
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  Some members have partial payments. Should the group proceed with fewer participants or wait for full payment?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowVoteModal(true)}
                    className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Vote on Decision
                  </button>
                </div>
              </div>
            )}

            {/* Emergency Actions */}
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Emergency Actions</h4>
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
                Cancel My Participation
              </button>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Note: Cancellation may incur penalties based on timing and payment status.
              </p>
            </div>
          </CardBody>
        </Card>
        {/* Participants Section */}
        <Card className="rounded-lg sm:rounded-xl flex-1">
          <CardBody className="px-3 sm:px-4">
            <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Participants
            </h3>
            {/* Highlight Guide and Driver at the top */}
            <div className="space-y-2 mb-3 sm:mb-4">
              {participants.filter(p => p.role === 'Guide' || p.role === 'Driver').map((participant) => (
                <div
                  key={participant.name}
                  className={`relative flex flex-row items-center gap-3 sm:gap-4 p-3 sm:p-5 rounded-lg sm:rounded-2xl max-w-xl mx-auto ${
                    participant.role === 'Guide'
                      ? 'border-green-200 dark:border-green-300 bg-green-50 dark:bg-green-900/20'
                      : 'border-blue-200 dark:border-blue-300 bg-blue-50 dark:bg-blue-900/20'
                  }`}
                  style={{ minWidth: 0, borderWidth: 2 }}
                >
                  <div className="flex flex-col items-start w-20 sm:w-32 flex-shrink-0">
                    <div className="relative">
                      <img
                        src={participant.img}
                        alt={participant.name}
                        className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border-2 sm:border-4 ${
                          participant.role === 'Guide'
                            ? 'border-green-400'
                            : 'border-blue-400'
                        }`}
                      />
                      <span className={`absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 p-0.5 sm:p-1 rounded-full bg-white dark:bg-secondary-900 border ${
                        participant.role === 'Guide' ? 'border-green-400' : 'border-blue-400'
                      }`}>{participant.role === 'Guide' ? (
                        <IdentificationIcon className="h-3 w-3 sm:h-6 sm:w-6 text-green-500" />
                      ) : (
                        <UserIcon className="h-3 w-3 sm:h-6 sm:w-6 text-blue-500" />
                      )}</span>
                    </div>
                  </div>
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white truncate">{participant.name}</span>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full ${
                        participant.role === 'Guide'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                      }`}>{participant.role}</span>
                    </div>
                    {/* Extra info for Guide and Driver */}
                    {participant.role === 'Driver' && (
                      <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-0.5 sm:space-y-1">
                        <div><span className="font-semibold">Car:</span> {participant.car}</div>
                        <div><span className="font-semibold">From:</span> {participant.from}</div>
                        <div><span className="font-semibold">Contact:</span> {participant.contact}</div>
                        <div className="flex items-center"><span className="font-semibold mr-1">Rating:</span> <span>{participant.rating}</span> <span className="ml-1 text-yellow-400">★</span></div>
                      </div>
                    )}
                    {participant.role === 'Guide' && (
                      <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-0.5 sm:space-y-1">
                        <div><span className="font-semibold">Contact:</span> {participant.contact ? participant.contact : 'N/A'}</div>
                        <div><span className="font-semibold">From:</span> {participant.from ? participant.from : ''}</div>
                        <div className="flex items-center"><span className="font-semibold mr-1">Rating:</span> <span>4.9</span> <span className="ml-1 text-yellow-400">★</span></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Other participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              {participants.filter(p => p.role !== 'Guide' && p.role !== 'Driver').map((participant) => (
                <div key={participant.name} className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-secondary-800 rounded-lg p-2 sm:p-3 border border-gray-200 dark:border-secondary-600">
                  <img
                    src={participant.img}
                    alt={participant.name}
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-info-500"
                  />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                      {participant.name}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-info-600">
                      {participant.role}
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
            <button className="flex-1 bg-green-200 text-green-900 py-2 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-green-300 transition-colors border border-green-400 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base">
              <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              Contact Guide
            </button>
            <button className="flex-1 bg-blue-100 text-blue-800 py-2 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-blue-200 transition-colors border border-blue-300 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base">
              <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              Contact Driver
            </button>
            <button className="flex-1 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 py-2 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 border border-gray-400 dark:border-secondary-500 text-sm sm:text-base">
              <IdentificationIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              Download
            </button>
          </div>
          
          {/* Important Notes */}
          <div className="p-0 mt-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-sm sm:text-base">Important Notes</h4>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              All participants, please check your emails for the final itinerary and pickup times. 
              Make sure to complete your payments by the deadlines to secure your spot on this amazing trip!
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Payment
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment for: {selectedPayment.name}
                </label>
                <div className="bg-gray-50 dark:bg-secondary-700 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>Amount:</strong> Rs. {selectedPayment.amount.toLocaleString()}
                  </p>
                  <p className="text-sm">
                    <strong>Type:</strong> {selectedPayment.type === 'upfront' ? 'Upfront Payment (50%)' : 'Final Payment (50%)'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleMakePayment(selectedPayment.userId, selectedPayment.type, selectedPayment.amount)}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Processing...' : 'Pay Now (Mock)'}
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voting Modal */}
      {showVoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Vote on Trip Decision
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Some members have partial payments. Should the group proceed with fewer participants or wait for everyone to complete their payments?
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleVoteOnDecision('proceed')}
                disabled={loading}
                className="w-full flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <HandThumbUpIcon className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <div className="font-semibold text-green-800 dark:text-green-200">Proceed with Current Members</div>
                  <div className="text-sm text-green-600 dark:text-green-400">Continue the trip with members who have paid</div>
                </div>
              </button>
              
              <button
                onClick={() => handleVoteOnDecision('wait')}
                disabled={loading}
                className="w-full flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
              >
                <ClockIcon className="h-6 w-6 text-yellow-600" />
                <div className="text-left">
                  <div className="font-semibold text-yellow-800 dark:text-yellow-200">Wait for All Members</div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">Extend deadline for remaining payments</div>
                </div>
              </button>
              
              <button
                onClick={() => setShowVoteModal(false)}
                className="w-full bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Participation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
              Cancel Participation
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to cancel your participation in this trip? This action cannot be undone.
              </p>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Cancellation Policy:</h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• 48+ hours before trip: 10% penalty</li>
                  <li>• 24-48 hours before: 25% penalty</li>
                  <li>• Less than 24 hours: 50% penalty</li>
                  <li>• Refunds processed within 3-5 business days</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCancelParticipation}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Processing...' : 'Confirm Cancellation'}
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors"
                >
                  Keep My Spot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <ExclamationCircleIcon className="h-5 w-5" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmedPools;

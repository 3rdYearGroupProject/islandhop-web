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
import axios from 'axios';

const ConfirmedPools = ({ currentUser }) => {
  const [confirmedTrips, setConfirmedTrips] = useState([]);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [payHereLoaded, setPayHereLoaded] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Sri Lanka'
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (currentUser?.uid) {
      loadConfirmedTrips();
    }
  }, [currentUser]);

  // Helper functions for data processing
  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Dates TBD';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const endDay = end.getDate();
    const year = start.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
  };

  const calculateDurationDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  // Load PayHere script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      console.log('PayHere script loaded successfully');
      setPayHereLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load PayHere script');
      setPaymentError('Failed to load payment system. Please refresh the page and try again.');
    };
    
    // Check if script is already loaded
    const existingScript = document.querySelector('script[src="https://www.payhere.lk/lib/payhere.js"]');
    if (existingScript) {
      if (window.payhere) {
        setPayHereLoaded(true);
      } else {
        existingScript.onload = () => {
          setPayHereLoaded(true);
        };
      }
    } else {
      document.head.appendChild(script);
    }

    return () => {
      // Only remove if we added it
      if (!existingScript && document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const loadConfirmedTrips = async () => {
    if (!currentUser?.uid) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      console.log('📋 Loading confirmed trips for user:', currentUser.uid);
      
      // Fetch user's confirmed trips from the real API
      const response = await poolsApi.getUserConfirmedTrips(currentUser.uid, {
        status: 'payment_pending,confirmed,completed', // Get all statuses
        page: 1,
        limit: 50 // Get more trips to show pagination later if needed
      });
      
      console.log('📋 API response for confirmed trips:', response);
      
      if (response.success && response.data.trips && response.data.trips.length > 0) {
        // Process the trips data to match UI expectations
        const processedTrips = response.data.trips.map(trip => {
          // Map API response to expected format
          return {
            ...trip,
            // Ensure consistent field names
            confirmedTripId: trip.confirmedTripId || trip._id,
            tripStartDate: trip.tripStartDate,
            tripEndDate: trip.tripEndDate,
            // Add calculated fields for UI
            formattedDateRange: formatDateRange(trip.tripStartDate, trip.tripEndDate),
            tripDurationDays: calculateDurationDays(trip.tripStartDate, trip.tripEndDate),
            memberCountText: `${trip.currentMemberCount} participants / ${trip.maxMembers}`,
            // User-specific fields
            isCreator: trip.creatorUserId === currentUser.uid,
            userConfirmed: trip.userConfirmed || false,
            userPaymentStatus: trip.userPaymentStatus || 'pending',
            // Ensure destinations are formatted properly
            cities: trip.tripDetails?.destinations || [],
            topAttractions: trip.tripDetails?.activities || [],
            // Payment info
            pricePerPerson: trip.paymentInfo?.pricePerPerson || 0,
            compatibilityScore: 85 // Default compatibility score
          };
        });
        
        setConfirmedTrips(processedTrips);
        setCurrentTripIndex(0);
        setError(null);
        console.log('📋 Processed confirmed trips:', processedTrips);
      } else {
        console.log('📋 No confirmed trips found for user');
        setConfirmedTrips([]);
        setError(null);
      }
    } catch (err) {
      console.error('📋❌ Error loading confirmed trips:', err);
      setError(`Failed to load confirmed trips: ${err.message}`);
      setConfirmedTrips([]);
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

    // Determine user payment status
    let userPaymentStatus = 'pending';
    const userPayment = trip.paymentInfo?.memberPayments?.find(p => p.userId === currentUser?.uid);
    
    if (userPayment) {
      if (userPayment.upfrontPayment && userPayment.finalPayment) {
        // Phased payment structure
        if (userPayment.upfrontPayment.status === 'paid' && userPayment.finalPayment.status === 'paid') {
          userPaymentStatus = 'completed';
        } else if (userPayment.upfrontPayment.status === 'paid' || userPayment.finalPayment.status === 'paid') {
          userPaymentStatus = 'partially_paid';
        } else {
          userPaymentStatus = 'pending';
        }
      } else {
        // Single payment structure
        userPaymentStatus = userPayment.status === 'paid' || userPayment.status === 'completed' ? 'completed' : 'pending';
      }
    }

    return {
      id: trip.confirmedTripId || trip._id,
      name: trip.tripName || trip.groupName,
      destinations: trip.tripDetails?.destinations?.join(', ') || trip.cities?.join(', ') || 'Destinations TBD',
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
      userConfirmed: trip.userConfirmed || false,
      userPaymentStatus: userPaymentStatus,
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

  const handleCustomerDetailsChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePaymentForm = () => {
    const { firstName, lastName, email, phone } = customerDetails;
    
    // Check required fields
    if (!firstName?.trim()) {
      setPaymentError('First name is required');
      return false;
    }
    
    if (!lastName?.trim()) {
      setPaymentError('Last name is required');
      return false;
    }
    
    if (!email?.trim()) {
      setPaymentError('Email is required');
      return false;
    }
    
    if (!phone?.trim()) {
      setPaymentError('Phone number is required');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setPaymentError('Please enter a valid email address');
      return false;
    }
    
    // Validate phone format (basic validation for Sri Lankan numbers)
    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      setPaymentError('Please enter a valid phone number');
      return false;
    }
    
    // Check if payment amount is valid - handle different payment structures
    const userPayment = currentTrip?.paymentInfo?.memberPayments?.find(
      payment => payment.userId === currentUser?.uid
    );
    
    if (!userPayment) {
      setPaymentError('Payment information not found. Please contact support.');
      return false;
    }
    
    let paymentAmount = 0;
    
    if (userPayment.upfrontPayment && userPayment.finalPayment) {
      // Phased payment structure - check if upfront payment is pending
      if (userPayment.upfrontPayment.status === 'pending') {
        paymentAmount = userPayment.upfrontPayment.amount;
      } else if (userPayment.finalPayment.status === 'pending') {
        paymentAmount = userPayment.finalPayment.amount;
      } else {
        setPaymentError('All payments for this trip have been completed.');
        return false;
      }
    } else {
      // Single payment structure
      if (userPayment.status === 'pending') {
        paymentAmount = userPayment.amount;
      } else {
        setPaymentError('Payment for this trip has already been completed.');
        return false;
      }
    }
    
    if (!paymentAmount || paymentAmount <= 0) {
      setPaymentError('Invalid payment amount. Please contact support.');
      return false;
    }
    
    return true;
  };

  const completePayment = async (orderId, tripId) => {
    try {
      console.log('💳 Completing payment for confirmed trip ID:', tripId, 'Order:', orderId);
      
      // Use the correct endpoint for completing pool trip payments
      const response = await axios.post(
        `http://localhost:8074/api/v1/pooling-confirm/${tripId}/complete-payment`,
        {
          userId: currentUser.uid,
          orderId: orderId
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('💳 Payment completion response:', response.data);
      
      if (response.data.status === 'success' || response.status === 200) {
        // Refresh the confirmed trips to update payment status
        await loadConfirmedTrips();
        setShowPaymentForm(false);
        setCustomerDetails({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          country: 'Sri Lanka'
        });
        
        // Show success message
        alert('Payment completed successfully! Your pool trip payment has been processed.');
        
      } else {
        throw new Error(response.data.message || 'Failed to complete payment');
      }
    } catch (error) {
      console.error('💳❌ Error completing payment:', error);
      setPaymentError(error.response?.data?.message || error.message || 'Failed to complete payment');
    }
  };

  // Navigation and UI event handlers
  const handleViewDetails = () => {
    if (currentTrip?.groupId) {
      window.location.href = `/view-pool/${currentTrip.groupId}`;
    }
  };

  const handleContactGroup = () => {
    // TODO: Implement group contact functionality
    console.log('Contact group functionality to be implemented');
  };

  const handleViewTripDetails = () => {
    if (confirmedPool?.groupId) {
      window.location.href = `/view-pool/${confirmedPool.groupId}`;
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentForm(false);
    setPaymentError(null);
  };

  const handleCancelPayment = () => {
    setShowPaymentForm(false);
    setPaymentError(null);
  };

  const handlePoolPayment = async () => {
    if (!validatePaymentForm()) {
      return;
    }

    if (!payHereLoaded || !window.payhere) {
      setPaymentError('Payment system is not ready. Please refresh the page and try again.');
      return;
    }

    setPaymentProcessing(true);
    setPaymentError(null);

    try {
      // Get user's payment details from the trip data
      const userPayment = currentTrip.paymentInfo?.memberPayments?.find(
        payment => payment.userId === currentUser.uid
      );

      if (!userPayment) {
        throw new Error('Payment information not found for current user');
      }

      const paymentAmount = userPayment.amount || userPayment.upfrontPayment?.amount || currentTrip.paymentInfo?.pricePerPerson;
      
      if (!paymentAmount || paymentAmount <= 0) {
        throw new Error('Invalid payment amount');
      }
      
      console.log('💰 Processing payment for confirmed trip ID:', currentTrip.confirmedTripId);
      console.log('💳 Payment amount:', paymentAmount);
      
      // Generate short order ID (max 50 characters)
      const shortTripId = currentTrip.confirmedTripId.substring(0, 8);
      const timestamp = Date.now().toString().slice(-8);
      const orderId = `POOL_${shortTripId}_${timestamp}`;
      
      console.log('📝 Generated order ID:', orderId, `(${orderId.length} chars)`);
      
      // Send payment request to backend
      const paymentRequest = {
        amount: paymentAmount,
        currency: "LKR",
        orderId: orderId,
        tripId: currentTrip.confirmedTripId, // Use confirmedTripId for pool payments
        itemName: `Pool Trip Payment - ${currentTrip.tripName}`,
        customerDetails: {
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: customerDetails.address,
          city: customerDetails.city,
          country: customerDetails.country
        }
      };

      console.log('💳 Sending pool payment request to backend:', paymentRequest);

      // Call payment creation API
      const response = await axios.post('http://localhost:8088/api/v1/payments/create-payhere-payment', paymentRequest);

      console.log('💳 Backend payment response:', response.data);
      
      if (response.data && response.data.status === 'success') {
        const paymentData = response.data.payHereData;

        // Setup PayHere event handlers
        window.payhere.onCompleted = async function onCompleted(orderId) {
          console.log("💳 Pool payment completed. OrderID:" + orderId);
          
          // Complete payment on backend using confirmedTripId
          await completePayment(orderId, currentTrip.confirmedTripId);
          
          setPaymentProcessing(false);
        };

        window.payhere.onDismissed = function onDismissed() {
          console.log("💳 Pool payment dismissed");
          setPaymentError("Payment was cancelled");
          setPaymentProcessing(false);
        };

        window.payhere.onError = function onError(error) {
          console.log("💳 Pool payment error:" + error);
          setPaymentError("Payment failed: " + error);
          setPaymentProcessing(false);
        };

        // PayHere payment initiation
        const paymentDetails = {
          sandbox: paymentData.sandbox || true,
          merchant_id: paymentData.merchant_id,
          return_url: paymentData.return_url,
          cancel_url: paymentData.cancel_url,
          notify_url: paymentData.notify_url,
          order_id: paymentData.order_id,
          items: paymentData.items,
          amount: paymentData.amount,
          currency: paymentData.currency,
          hash: paymentData.hash,
          first_name: paymentData.first_name,
          last_name: paymentData.last_name,
          email: paymentData.email,
          phone: paymentData.phone,
          address: paymentData.address,
          city: paymentData.city,
          country: paymentData.country,
        };

        console.log('💳 Initiating PayHere pool payment with details:', paymentDetails);
        window.payhere.startPayment(paymentDetails);

      } else {
        throw new Error(response.data.data?.message || 'Failed to create payment');
      }

    } catch (err) {
      console.error('💳❌ Pool payment creation error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Payment failed. Please try again.';
      setPaymentError(errorMessage);
      setPaymentProcessing(false);
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading confirmed pools...</p>
        </div>
      </div>
    );
  }

  if (error && confirmedTrips.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <ExclamationCircleIcon className="h-12 w-12 mx-auto text-red-400 mb-4" />
          <p className="text-red-600 font-medium mb-2">Error loading confirmed pools</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button 
            onClick={loadConfirmedTrips}
            className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
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
  const paymentStatus = currentTrip?.paymentInfo?.memberPayments?.map((payment) => {
    const memberConfirmation = currentTrip.memberConfirmations?.find(mc => mc.userId === payment.userId);
    const isCurrentUser = payment.userId === currentUser?.uid;
    const isCreator = payment.userId === currentTrip.creatorUserId;
    
    // Handle different payment structures (single payment vs phased payments)
    let amount, paid, status;
    
    if (payment.upfrontPayment && payment.finalPayment) {
      // Phased payment structure
      amount = payment.upfrontPayment.amount + payment.finalPayment.amount;
      paid = payment.totalPaid || 0;
      status = payment.overallPaymentStatus === 'paid' || payment.overallPaymentStatus === 'completed' ? 'Paid' : 'Pending';
    } else {
      // Single payment structure
      amount = payment.amount;
      paid = payment.status === 'completed' || payment.status === 'paid' ? payment.amount : 0;
      status = payment.status === 'completed' || payment.status === 'paid' ? 'Paid' : 'Pending';
    }
    
    return {
      userId: payment.userId,
      name: isCurrentUser ? 'You' : (isCreator ? 'Trip Creator' : `Member ${payment.userId.slice(-4)}`),
      amount: amount,
      paid: paid,
      status: status,
      method: payment.paymentId || payment.paymentMethod ? 'Online Payment' : 'Pending',
      isCurrentUser
    };
  }) || [];

  // Participants Data from real API
  const participants = currentTrip?.memberIds?.map((memberId) => {
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
                  onClick={handleViewDetails}
                  className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-700 transition-colors flex-1 sm:flex-none justify-center"
                >
                  View Details
                </button>
                <button 
                  onClick={handleContactGroup}
                  className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-full hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors flex-1 sm:flex-none justify-center"
                >
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
            <button 
              onClick={handleContactGroup}
              className="flex-1 bg-blue-100 text-blue-800 py-2 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-blue-200 transition-colors border border-blue-300 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
              disabled={!currentTrip?.groupId}
            >
              <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              Contact Group
            </button>
            <button 
              onClick={handleViewTripDetails}
              className="flex-1 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 py-2 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 border border-gray-400 dark:border-secondary-500 text-sm sm:text-base"
            >
              <IdentificationIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              Trip Details
            </button>
            {/* Show payment button only if user has pending payments */}
            {(() => {
              const userPayment = currentTrip?.paymentInfo?.memberPayments?.find(p => p.userId === currentUser?.uid);
              if (!userPayment) return null;
              
              let hasPendingPayment = false;
              
              if (userPayment.upfrontPayment && userPayment.finalPayment) {
                // Phased payment structure
                hasPendingPayment = userPayment.upfrontPayment.status === 'pending' || userPayment.finalPayment.status === 'pending';
              } else {
                // Single payment structure
                hasPendingPayment = userPayment.status === 'pending';
              }
              
              if (hasPendingPayment) {
                return (
                  <button 
                    onClick={() => setShowPaymentForm(true)}
                    disabled={paymentProcessing}
                    className="flex-1 bg-green-100 text-green-800 py-2 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-green-200 transition-colors border border-green-300 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCardIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    {paymentProcessing ? 'Processing...' : 'Make Payment'}
                  </button>
                );
              }
              return null;
            })()}
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

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Make Payment</h3>
              <button
                onClick={handleClosePaymentModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!payHereLoaded && (
              <div className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Loading secure payment system...
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={customerDetails.firstName}
                    onChange={handleCustomerDetailsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerDetails.lastName}
                    onChange={handleCustomerDetailsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={customerDetails.email}
                  onChange={handleCustomerDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerDetails.phone}
                  onChange={handleCustomerDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={customerDetails.address}
                  onChange={handleCustomerDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={customerDetails.city}
                    onChange={handleCustomerDetailsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={customerDetails.country}
                    onChange={handleCustomerDetailsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    readOnly
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">Amount Due:</span>
                  <span className="text-xl font-bold text-primary-600">
                    LKR {(() => {
                      const userPayment = currentTrip?.paymentInfo?.memberPayments?.find(p => p.userId === currentUser?.uid);
                      if (!userPayment) return '0';
                      
                      // Handle different payment structures
                      if (userPayment.upfrontPayment && userPayment.finalPayment) {
                        // Phased payment - show pending amount
                        if (userPayment.upfrontPayment.status === 'pending') {
                          return userPayment.upfrontPayment.amount?.toLocaleString() || '0';
                        } else if (userPayment.finalPayment.status === 'pending') {
                          return userPayment.finalPayment.amount?.toLocaleString() || '0';
                        }
                        return '0'; // All paid
                      } else {
                        // Single payment
                        return userPayment.amount?.toLocaleString() || '0';
                      }
                    })()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Payment will be processed securely through PayHere
                </p>
                {(() => {
                  const userPayment = currentTrip?.paymentInfo?.memberPayments?.find(p => p.userId === currentUser?.uid);
                  if (userPayment?.upfrontPayment && userPayment?.finalPayment) {
                    return (
                      <p className="text-xs text-blue-600 mt-1">
                        {userPayment.upfrontPayment.status === 'pending' 
                          ? 'This is your upfront payment' 
                          : 'This is your final payment'}
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>

              {paymentError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  {paymentError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCancelPayment}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePoolPayment}
                  disabled={paymentProcessing || !payHereLoaded}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {paymentProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : !payHereLoaded ? (
                    'Loading...'
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                <p>Secured by PayHere Payment Gateway</p>
                <p>Your payment information is encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmedPools;

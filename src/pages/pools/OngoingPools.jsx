import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card, { CardBody } from '../../components/Card';
import GroupChat from '../../components/GroupChat';
import { getUserData } from '../../utils/userStorage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getRandomCityImage } from '../../utils/imageUtils';
import { 
  MapPinIcon,
  UserGroupIcon,
  CalendarIcon,
  PhoneIcon,
  ClockIcon,
  MapIcon,
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TruckIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const OngoingPools = () => {
  const navigate = useNavigate();
  const [ongoingPools, setOngoingPools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);

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
          setOngoingPools(response.data.data);
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

  // Navigate between trips
  const navigateTrip = (direction) => {
    if (direction === 'prev' && currentTripIndex > 0) {
      setCurrentTripIndex(currentTripIndex - 1);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (direction === 'next' && currentTripIndex < ongoingPools.length - 1) {
      setCurrentTripIndex(currentTripIndex + 1);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Format date range
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  // Calculate duration in days
  const calculateDurationDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end days
  };

  // Get current location from itinerary
  const getCurrentLocation = (pool) => {
    const today = new Date();
    const startDate = new Date(pool.poolDetails.preferences.startDate);
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    const itinerary = pool.poolDetails.preferences.itinerary;
    const currentDay = itinerary?.[daysPassed];
    
    if (currentDay?.activities?.[0]) {
      return currentDay.activities[0].name;
    }
    
    return pool.poolDetails.preferences.destinations?.[0]?.name || 'Unknown';
  };

  // Get next destination
  const getNextDestination = (pool) => {
    const today = new Date();
    const startDate = new Date(pool.poolDetails.preferences.startDate);
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    const itinerary = pool.poolDetails.preferences.itinerary;
    const nextDay = itinerary?.[daysPassed + 1];
    
    if (nextDay?.activities?.[0]) {
      return nextDay.activities[0].name;
    }
    
    return 'Final Destination';
  };

  // Map pool data to UI format
  const mapPoolToUI = (poolData) => {
    const poolDetails = poolData.poolDetails;
    const tripDetails = poolData.tripDetails;
    const preferences = poolDetails.preferences;
    
    // Get destinations
    const destinations = preferences.destinations?.map(d => d.name).filter(Boolean) || [];
    const destinationsText = destinations.join(', ') || 'No destinations';
    
    // Calculate duration
    const durationDays = calculateDurationDays(preferences.startDate, preferences.endDate);
    
    // Format date range
    const dateRange = {
      start: preferences.startDate,
      end: preferences.endDate,
      formatted: formatDateRange(preferences.startDate, preferences.endDate)
    };
    
    // Get participants info
    const participants = poolDetails.members || [];
    const participantsText = `${participants.length}/${poolDetails.maxMembers}`;
    
    // Get itinerary destinations
    const itinerary = Object.values(preferences.itinerary || {}).map((day, index) => ({
      destination: destinations[index] || `Day ${index + 1}`,
      activities: day.activities || [],
      food: day.food || [],
      places: day.places || []
    }));

    return {
      id: poolDetails.poolId,
      groupId: poolDetails.poolId,
      tripId: poolDetails.tripId,
      name: poolDetails.groupName || poolDetails.tripName,
      destinations: destinationsText,
      destinationsList: destinations,
      dateRange: dateRange,
      durationDays: durationDays,
      status: poolDetails.status,
      statusText: poolDetails.status === 'active' ? 'Ongoing' : poolDetails.status,
      statusColor: 'bg-green-100 text-green-800 border-green-200',
      participantsText: participantsText,
      participants: participants,
      owner: poolDetails.creatorEmail,
      isCreator: participants.some(m => m.userId === getUserData()?.uid && m.isCreator),
      image: null, // Will use random image
      itinerary: itinerary,
      currentLocation: getCurrentLocation(poolData),
      nextDestination: getNextDestination(poolData),
      // Cost information
      currency: 'LKR',
      totalAmount: poolDetails.totalCost || 0,
      costPerPerson: poolDetails.costPerPerson || 0,
      // Service information
      needDriver: poolDetails.needDriver,
      needGuide: poolDetails.needGuide,
      vehicleType: poolDetails.vehicleType,
      driverCost: poolDetails.averageDriverCost,
      guideCost: poolDetails.averageGuideCost,
      driverStatus: tripDetails?.driverStatus || 'Not Assigned',
      driverEmail: tripDetails?.driverEmail || '',
      guideStatus: tripDetails?.guideStatus || 'Not Assigned',
      guideEmail: tripDetails?.guideEmail || '',
      // Trip details
      baseCity: tripDetails?.baseCity || 'Colombo',
      arrivalTime: tripDetails?.arrivalTime || 'N/A',
      budgetLevel: tripDetails?.budgetLevel || 'Medium',
      activityPacing: tripDetails?.activityPacing || 'Normal',
      payedAmount: tripDetails?.payedAmount || '0'
    };
  };



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

  // Get current pool
  const currentPoolData = ongoingPools[currentTripIndex];
  const ongoingPool = mapPoolToUI(currentPoolData);
  
  // Format participants for display
  const participants = ongoingPool.participants.map(member => ({
    name: `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.email,
    role: member.isCreator ? 'Trip Creator' : 'Traveler',
    img: member.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.firstName || member.email)}&background=random`,
    status: 'active',
    email: member.email,
    userId: member.userId
  }));

  const handleViewDetails = () => {
    console.log('View details clicked for pool:', ongoingPool.id);
    console.log('Current pool data:', currentPoolData);
    
    // Transform pool data to match OngoingTripPage expected format
    const tripData = {
      // IDs
      tripId: ongoingPool.tripId || ongoingPool.id,
      _id: ongoingPool.id,
      id: ongoingPool.id,
      
      // Basic info
      tripName: ongoingPool.name,
      baseCity: ongoingPool.destinationsList[0] || ongoingPool.destinations.split(',')[0]?.trim() || 'Unknown',
      
      // Dates
      startDate: ongoingPool.dateRange.start,
      endDate: ongoingPool.dateRange.end,
      
      // Service providers
      driverNeeded: ongoingPool.needDriver ? 1 : 0,
      guideNeeded: ongoingPool.needGuide ? 1 : 0,
      driver_email: ongoingPool.driverEmail || '',
      guide_email: ongoingPool.guideEmail || '',
      
      // User info
      userId: getUserData()?.uid,
      
      // Participants - pass full participant list and count
      travelers: ongoingPool.participants.length,
      participants: ongoingPool.participants.map(p => ({
        userId: p.userId,
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        isCreator: p.isCreator,
        profilePicture: p.profilePicture
      })),
      
      // Daily plans - transform from itinerary
      dailyPlans: ongoingPool.itinerary.map((day, index) => ({
        day: index + 1,
        city: day.destination,
        attractions: day.activities?.map((activity, actIndex) => ({
          id: actIndex + 1,
          name: activity.name || activity,
          location: { lat: 0, lng: 0 }, // Will be fetched from API if needed
          rating: 4.5,
          description: activity.description || '',
          time: activity.time || '',
          image: activity.image || ''
        })) || [],
        restaurants: day.food?.map((food, foodIndex) => ({
          id: foodIndex + 1,
          name: food.name || food,
          location: { lat: 0, lng: 0 },
          rating: 4.0,
          description: food.description || '',
          time: food.time || ''
        })) || [],
        hotels: day.places?.map((place, placeIndex) => ({
          id: placeIndex + 1,
          name: place.name || place,
          location: { lat: 0, lng: 0 },
          rating: 4.0,
          description: place.description || ''
        })) || [],
        // Meter readings
        start_meter_read: null,
        end_meter_read: null,
        deduct_amount: 0
      })),
      
      // Store original pool data for reference
      _originalData: currentPoolData,
      
      // Additional metadata
      updatedAt: new Date().toISOString()
    };
    
    console.log('Transformed trip data:', tripData);
    console.log('Total travelers:', tripData.travelers);
    console.log('Participant details:', tripData.participants);
    
    // Navigate to OngoingTripPage with the trip data and itinerary collapsed state
    navigate('/ongoing-trip', { 
      state: { 
        tripData,
        itineraryCollapsed: true // Keep itinerary collapsed by default
      } 
    });
  };

  const handleContactGroup = () => {
    // Scroll to chat section
    const chatSection = document.querySelector('.group-chat-section');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Trip Navigation - Only show if multiple trips */}
      {ongoingPools.length > 1 && (
        <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigateTrip('prev')}
            disabled={currentTripIndex === 0}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Trip {currentTripIndex + 1} of {ongoingPools.length}
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {ongoingPool.name}
            </p>
          </div>
        
          <button
            onClick={() => navigateTrip('next')}
            disabled={currentTripIndex === ongoingPools.length - 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Trip Summary - Compact Card matching ConfirmedPools style */}
      <div className="mb-6 sm:mb-8" key={`trip-summary-${ongoingPool.id}-${currentTripIndex}`}>
        <div className="relative group bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-400 hover:border-green-600 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 flex flex-col lg:flex-row max-w-full sm:max-w-4xl mx-auto">
          {/* Image on the left - More compact */}
          <div className="relative w-full lg:w-1/4 h-32 sm:h-44 lg:h-auto flex-shrink-0">
            <img
              src={ongoingPool.image || getRandomCityImage(ongoingPool.id || ongoingPool.groupId)}
              alt={ongoingPool.name}
              className="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-none lg:rounded-l-2xl"
              style={{ borderTopLeftRadius: 'inherit', borderBottomLeftRadius: 'inherit' }}
              onError={(e) => {
                e.target.src = getRandomCityImage(ongoingPool.id || ongoingPool.groupId);
              }}
            />
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
              <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium border ${ongoingPool.statusColor}`}>
                {ongoingPool.statusText}
              </span>
            </div>
            {/* Live indicator */}
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex items-center gap-1.5 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              LIVE
            </div>
          </div>
          {/* Details on the right - More compact */}
          <div className="flex-1 flex flex-col p-3 sm:p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <span className="uppercase tracking-wide text-gray-500 text-[10px] sm:text-xs font-semibold">Ongoing Pool</span>
                <h3 className="text-base sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mt-0.5">
                  {ongoingPool.name}
                </h3>
              </div>
            </div>
        
        
            {/* Compact 3-column grid for info */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-1.5 sm:gap-y-2 mb-3">
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-blue-500 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs truncate">{ongoingPool.destinations}</span>
              </div>
          
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-blue-500 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs">{new Date(ongoingPool.dateRange.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
          
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-orange-500 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs">{new Date(ongoingPool.dateRange.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
          
              <div className="flex items-center text-gray-600">
                <UserGroupIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-blue-500 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs">{ongoingPool.participantsText}</span>
              </div>
          
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-blue-500 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs">{ongoingPool.durationDays} {ongoingPool.durationDays === 1 ? 'day' : 'days'}</span>
              </div>
          
              <div className="flex items-center text-gray-600">
                <CheckCircleIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-green-600 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs text-green-700 font-semibold">{ongoingPool.statusText}</span>
              </div>
          
              {ongoingPool.costPerPerson && ongoingPool.totalAmount && (
                <div className="flex items-center text-gray-600 col-span-2 lg:col-span-3">
                  <CreditCardIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-blue-500 flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs font-medium">{ongoingPool.currency} {ongoingPool.costPerPerson.toLocaleString()} / person • Total: {ongoingPool.currency} {ongoingPool.totalAmount.toLocaleString()}</span>
                </div>
              )}
            </div>
        
            {/* Compact Itinerary Timeline */}
            <div className="mb-2">
              <h4 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white mb-1.5">
                Itinerary
              </h4>
              <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-1">
                {ongoingPool.itinerary.map((item, index) => (
                  <div key={`${ongoingPool.id}-${item.destination}-${index}`} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-600 rounded-full border border-white shadow-sm"></div>
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mt-0.5 text-center max-w-[60px] sm:max-w-[80px] truncate">
                        {item.destination}
                      </span>
                    </div>
                    {index < ongoingPool.itinerary.length - 1 && (
                      <div className="h-0.5 bg-gradient-to-r from-green-600 to-gray-300 mx-1 rounded-full w-[20px] sm:w-[30px]"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-2">
              {ongoingPool.itinerary.length} {ongoingPool.itinerary.length === 1 ? 'destination' : 'destinations'} • {ongoingPool.durationDays} {ongoingPool.durationDays === 1 ? 'day' : 'days'}
            </p>
        
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                {ongoingPool.isCreator && (
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                    Trip Creator
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleViewDetails}
                  className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-700 transition-colors justify-center"
                >
                  View Details
                </button>
                <button 
                  onClick={handleContactGroup}
                  className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-full hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors justify-center"
                >
                  Contact Group
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingPools;

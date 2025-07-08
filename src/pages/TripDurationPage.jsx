import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Plane, Clock, DollarSign, Users, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendar';
import TripProgressBar from '../components/TripProgressBar';
import { tripPlanningApi } from '../api/axios';
import Footer from '../components/Footer';

const TripDurationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripName, userUid } = location.state || {};
  
  const [selectedDates, setSelectedDates] = useState([]);
  const [flightData, setFlightData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const leftCardRef = useRef(null);
  const [leftCardHeight, setLeftCardHeight] = useState('auto');

  console.log('📍 TripDurationPage received:', { tripName, userUid });
  console.log('📊 Current state - selectedDates:', selectedDates.length, 'userUid:', userUid, 'isCreatingTrip:', isCreatingTrip);

  // Mock flight data
  const mockFlightData = {
    '2025-07-14': [
      { airline: 'SriLankan Airlines', price: '$450', departure: '6:30 AM', arrival: '2:15 PM', duration: '7h 45m' },
      { airline: 'Emirates', price: '$520', departure: '11:45 PM', arrival: '8:30 AM+1', duration: '8h 45m' },
      { airline: 'Qatar Airways', price: '$480', departure: '2:20 AM', arrival: '10:05 AM', duration: '7h 45m' }
    ],
    '2025-07-15': [
      { airline: 'SriLankan Airlines', price: '$465', departure: '6:30 AM', arrival: '2:15 PM', duration: '7h 45m' },
      { airline: 'Emirates', price: '$535', departure: '11:45 PM', arrival: '8:30 AM+1', duration: '8h 45m' },
      { airline: 'Singapore Airlines', price: '$510', departure: '9:15 AM', arrival: '5:00 PM', duration: '7h 45m' }
    ],
    '2025-07-16': [
      { airline: 'SriLankan Airlines', price: '$440', departure: '6:30 AM', arrival: '2:15 PM', duration: '7h 45m' },
      { airline: 'Emirates', price: '$505', departure: '11:45 PM', arrival: '8:30 AM+1', duration: '8h 45m' },
      { airline: 'Qatar Airways', price: '$475', departure: '2:20 AM', arrival: '10:05 AM', duration: '7h 45m' }
    ]
  };

  useEffect(() => {
    if (selectedDates.length > 0) {
      setIsLoading(true);
      const startDate = selectedDates[0];
      // Ensure startDate is a valid Date object
      const dateObj = startDate instanceof Date ? startDate : new Date(startDate);
      if (isNaN(dateObj.getTime())) {
        setIsLoading(false);
        return;
      }
      const dateKey = dateObj.toISOString().split('T')[0];
      
      // Simulate API call delay
      setTimeout(() => {
        setFlightData(mockFlightData[dateKey] || []);
        setIsLoading(false);
      }, 1000);
    }
  }, [selectedDates]);

  useEffect(() => {
    if (leftCardRef.current) {
      setLeftCardHeight(leftCardRef.current.offsetHeight + 'px');
    }
  }, [selectedDates, isLoading, flightData]);

  const handleDateSelect = (dates) => {
    // This handles both single date and range selection
    setSelectedDates(dates);
  };

  const handleDateRangeSelect = (dates) => {
    // This is called when a range is completed
    setSelectedDates(dates);
  };

  const handleDateClear = () => {
    setSelectedDates([]);
    setFlightData([]);
  };

  const formatDateRange = (dates) => {
    if (dates.length === 0) return 'Add dates';
    if (dates.length === 1) return dates[0].toLocaleDateString();
    if (dates.length === 2) {
      return `${dates[0].toLocaleDateString()} - ${dates[1].toLocaleDateString()}`;
    }
    return `${dates.length} dates selected`;
  };

  const handleBack = () => {
    navigate('/trips');
  };

  // Create basic trip with minimal information to reduce initial friction
  async function createBasicTrip(tripData) {
    console.log('🚀 Sending trip creation request to backend...', {
      userUid: tripData.userUid,
      tripName: tripData.tripName,
      startDate: tripData.startDate,
      endDate: tripData.endDate
    });
    
    try {
      const response = await tripPlanningApi.post('/trip/create-basic', {
        userId: tripData.userUid,
        tripName: tripData.tripName,
        startDate: tripData.startDate,
        endDate: tripData.endDate
      });

      console.log('✅ Trip creation response received:', response.data);
      
      return {
        tripId: response.data.tripId,
        trip: response.data.trip,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error creating trip:', error);
      throw new Error(`HTTP error! status: ${error.response?.status || 'unknown'}`);
    }
  }

  const handleContinue = async () => {
    if (selectedDates.length > 0) {
      setIsCreatingTrip(true);
      
      try {
        // Format dates for backend (ISO format)
        const startDateObj = selectedDates[0] instanceof Date ? selectedDates[0] : new Date(selectedDates[0]);
        const endDateObj = selectedDates[selectedDates.length - 1] instanceof Date ? selectedDates[selectedDates.length - 1] : new Date(selectedDates[selectedDates.length - 1]);
        
        // Validate dates
        if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
          console.error('Invalid dates selected');
          setIsCreatingTrip(false);
          return;
        }
        
        const startDate = startDateObj.toISOString().split('T')[0];
        const endDate = endDateObj.toISOString().split('T')[0];
        
        // Only try to create trip in backend if we have userUid
        let result = null;
        if (userUid) {
          try {
            result = await createBasicTrip({
              userUid,
              tripName,
              startDate,
              endDate
            });
            console.log('🎉 Trip created successfully:', result);
          } catch (error) {
            console.error('Failed to create trip in backend:', error);
            // Continue anyway without backend trip creation
          }
        }
        
        // Navigate to next step with trip data
        navigate('/trip-preferences', { 
          state: { 
            tripName, 
            selectedDates,
            tripId: result?.tripId,
            trip: result?.trip,
            userUid
          } 
        });
      } catch (error) {
        console.error('Failed to continue:', error);
        // Fallback navigation without backend data
        navigate('/trip-preferences', { 
          state: { 
            tripName, 
            selectedDates,
            userUid
          } 
        });
      } finally {
        setIsCreatingTrip(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navbar */}
      <Navbar />
      {/* Spacer to prevent overlap with fixed/floating navbar */}
      <div className="h-20 md:h-24 lg:h-28 bg-white"></div>

      {/* Header Section */}
      <TripProgressBar tripName={tripName} onBack={handleBack} currentStep={2} completedSteps={[1]} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Calendar */}
          <div className="lg:col-span-1">
            <div ref={leftCardRef} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 max-w-md flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Select Your Travel Dates</h2>
                  <p className="text-gray-600">Choose when you'd like to travel to see available options</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
              
              {/* Calendar Component */}
              <div className="mb-6">
                <Calendar
                  selectedDates={selectedDates}
                  onDateSelect={handleDateSelect}
                  mode="range"
                  minDate={new Date()}
                  className="w-full"
                />
              </div>

              {/* Clear Dates Button */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={handleDateClear}
                  className="px-2 py-1 text-xs text-blue-700 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors duration-200 font-medium border border-blue-200"
                  type="button"
                  disabled={selectedDates.length === 0}
                >
                  Clear Dates
                </button>
              </div>
            </div>

            {/* Action Buttons removed from left card */}
          </div>

          {/* Right Column - Flight Options */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full flex flex-col" style={{ height: leftCardHeight }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Flight Options</h3>
                <Plane className="h-6 w-6 text-blue-600" />
              </div>

              {selectedDates.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Select Travel Dates</h4>
                  <p className="text-gray-600 text-sm">Choose your dates to see available flights and pricing</p>
                </div>
              )}

              {isLoading && selectedDates.length > 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <h4 className="font-medium text-gray-900 mb-2">Finding Flights</h4>
                  <p className="text-gray-600 text-sm">Searching for the best options...</p>
                </div>
              )}

              {!isLoading && flightData.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    <span>From Colombo (CMB) • {selectedDates[0]?.toLocaleDateString()}</span>
                  </div>
                  
                  {flightData.map((flight, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {flight.airline}
                          </h4>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{flight.duration}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">{flight.price}</div>
                          <div className="text-xs text-gray-500">per person</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-600">
                          <span className="font-medium">{flight.departure}</span> → <span className="font-medium">{flight.arrival}</span>
                        </div>
                        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium">
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Removed horizontal line and disclaimer text as requested */}
                </div>
              )}

              {!isLoading && selectedDates.length > 0 && flightData.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plane className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">No Flights Available</h4>
                  <p className="text-gray-600 text-sm mb-4">No flights found for the selected date</p>
                  <button 
                    onClick={handleDateClear}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Try different dates
                  </button>
                </div>
              )}
            </div>
            {/* Flight Options Action Buttons */}
            <div className="flex flex-row gap-4 justify-end mt-6">
              <button
                onClick={handleBack}
                className="px-6 py-2 rounded-full border border-primary-600 text-primary-600 bg-white hover:bg-primary-50 hover:border-primary-700 transition-all duration-200 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 text-base"
                style={{ minWidth: '120px' }}
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                disabled={selectedDates.length === 0 || isCreatingTrip}
                className={`px-6 py-2 rounded-full font-semibold text-base transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                  selectedDates.length > 0 && !isCreatingTrip
                    ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                style={{ minWidth: '180px' }}
              >
                {isCreatingTrip ? 'Creating Trip...' : 'Continue to Preferences'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TripDurationPage;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendar';

const TripDurationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripName } = location.state || {};
  
  const [selectedDates, setSelectedDates] = useState([]);
  const [flightData, setFlightData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      const dateKey = startDate.toISOString().split('T')[0];
      
      // Simulate API call delay
      setTimeout(() => {
        setFlightData(mockFlightData[dateKey] || []);
        setIsLoading(false);
      }, 1000);
    }
  }, [selectedDates]);

  const handleDateSelect = (date) => {
    // Start new range selection
    setSelectedDates([date]);
  };

  const handleDateRangeSelect = (dates) => {
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

  const handleContinue = () => {
    if (selectedDates.length > 0) {
      navigate('/trip-preferences', { 
        state: { 
          tripName, 
          selectedDates 
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="w-full py-8">
        <div className="page-container">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={handleBack}
              className="flex items-center text-primary-600 hover:text-primary-700 mr-4"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to trips
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Trip Details and Calendar */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{tripName || 'New Trip'}</h1>
              <p className="text-gray-600 mb-8">Select your travel dates to see flight options</p>

              {/* Date Selection with Embedded Calendar */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">When are you traveling?</h2>
                
                {/* Calendar Component */}
                <Calendar
                  selectedDates={selectedDates}
                  onDateSelect={handleDateSelect}
                  onDateRangeSelect={handleDateRangeSelect}
                  mode="range"
                  minDate={new Date()}
                  className="mb-4"
                />

                {selectedDates.length > 0 && (
                  <div className="text-sm text-gray-600 border-t pt-4">
                    <p className="mb-2">Selected dates:</p>
                    <div className="bg-primary-50 p-3 rounded-lg">
                      <p className="font-medium text-primary-800">
                        {formatDateRange(selectedDates)}
                      </p>
                      {selectedDates.length === 2 && (
                        <p className="text-primary-600">
                          Duration: {Math.ceil((selectedDates[1] - selectedDates[0]) / (1000 * 60 * 60 * 24))} days
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleDateClear}
                      className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Clear dates
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleContinue}
                  disabled={selectedDates.length === 0}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    selectedDates.length > 0
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Right Column - Flight Data */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {selectedDates.length > 0 ? 'Available Flights' : 'Select dates to see flights'}
              </h2>

              {selectedDates.length === 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  <p className="text-gray-600 text-lg">Choose your travel dates to see flight options</p>
                </div>
              )}

              {isLoading && selectedDates.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading flight options...</p>
                </div>
              )}

              {!isLoading && flightData.length > 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Flights for {selectedDates[0]?.toLocaleDateString()} • From Colombo (CMB) to your destination
                  </p>
                  
                  {flightData.map((flight, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-primary-300">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
                            <span className="text-xl font-bold text-primary-600">{flight.price}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <span className="mr-4">{flight.departure} → {flight.arrival}</span>
                            <span className="text-gray-500">{flight.duration}</span>
                          </div>
                        </div>
                        <button className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && selectedDates.length > 0 && flightData.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 text-yellow-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-yellow-800">No flights available for the selected date</p>
                  <p className="text-yellow-600 text-sm mt-1">Try selecting a different date</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripDurationPage;

import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Users, Clock, MapPin, ChevronLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Calendar from '../../components/Calendar';
import PoolProgressBar from '../../components/PoolProgressBar';

const PoolDurationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { poolName, poolDescription, userUid } = location.state || {};
  
  console.log('📍 PoolDurationPage received:', { poolName, poolDescription, userUid });
  
  const [selectedDates, setSelectedDates] = useState([]);
  const [poolSize, setPoolSize] = useState(4);
  const [isCreatingPool, setIsCreatingPool] = useState(false);
  const leftCardRef = useRef(null);
  const [leftCardHeight, setLeftCardHeight] = useState('auto');

  useEffect(() => {
    if (leftCardRef.current) {
      setLeftCardHeight(`${leftCardRef.current.offsetHeight}px`);
    }
  }, [selectedDates, poolSize]);

  const poolSizeOptions = [
    { value: 2, label: '2 people', description: 'Intimate duo adventure' },
    { value: 3, label: '3 people', description: 'Small group exploration' },
    { value: 4, label: '4 people', description: 'Perfect travel squad' },
    { value: 5, label: '5 people', description: 'Fun group experience' },
    { value: 6, label: '6 people', description: 'Large group adventure' },
    { value: 8, label: '8 people', description: 'Big group exploration' },
    { value: 9, label: '9 people', description: 'Super group getaway' },
    { value: 10, label: '10 people', description: 'Ultimate party pool' }
  ];

  const handleNext = async () => {
    if (selectedDates && selectedDates.length >= 1 && selectedDates[0] && poolSize >= 2) {
      setIsCreatingPool(true);
      
      try {
        const startDate = selectedDates[0];
        const endDate = selectedDates.length > 1 && selectedDates[1] ? selectedDates[1] : selectedDates[0];
        
        console.log('🎉 Pool duration set successfully');
         // Navigate to next step with pool data
        navigate('/pool-preferences', { 
          state: { 
            poolName,
            poolDescription,
            selectedDates,
            poolSize,
            startDate,
            endDate,
            userUid
          }
        });
      } catch (error) {
        console.error('Failed to process pool duration:', error);
        navigate('/pool-destinations', { 
          state: { 
            poolName,
            poolDescription,
            selectedDates,
            poolSize,
            userUid
          } 
        });
      } finally {
        setIsCreatingPool(false);
      }
    }
  };

  const handleBack = () => {
    navigate('/pools', { 
      state: { 
        poolName,
        poolDescription,
        userUid
      } 
    });
  };

  const formatDateRange = () => {
    if (!selectedDates || selectedDates.length === 0) return 'No dates selected';
    
    const firstDate = selectedDates[0];
    if (!firstDate) return 'No dates selected';
    
    if (selectedDates.length === 1) {
      return `${firstDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`;
    }
    
    const start = selectedDates[0];
    const end = selectedDates[1];
    
    if (!start || !end) return 'Date range incomplete';
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return `${start.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })} → ${end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })} (${diffDays} days)`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navbar */}
      <Navbar />

      {/* Header Section */}
      <PoolProgressBar poolName={poolName} onBack={handleBack} currentStep={2} completedSteps={[1]} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Calendar */}
          <div className="lg:col-span-1">
            <div ref={leftCardRef} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 max-w-md flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Select Your Pool Dates</h2>
                  <p className="text-gray-600">Choose when your pool will travel. You can select a single day or a date range.</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>

              {/* Calendar Component */}
              <div className="mb-6">
                <Calendar
                  selectedDates={selectedDates}
                  onDateSelect={setSelectedDates}
                  mode="range"
                  minDate={new Date()}
                  className="w-full"
                />
              </div>

              {/* Clear Dates Button */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => { setSelectedDates([]); }}
                  className="px-5 py-2 text-xs text-blue-700 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors duration-200 font-medium border border-blue-200 shadow-sm"
                  type="button"
                  disabled={selectedDates.length === 0}
                >
                  Clear Dates
                </button>
              </div>
            </div>
            {/* Action Buttons removed from left card */}
          </div>

          {/* Right Column - Pool Size Selector */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full flex flex-col" style={{ height: leftCardHeight }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Pool Size</h3>
                <Users className="h-6 w-6 text-blue-600" />
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-2">How many people should join your travel pool? (including yourself)</p>
                <div className="grid grid-cols-2 gap-3">
                  {poolSizeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPoolSize(option.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                        poolSize === option.value
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons (outside the card) */}
            <div className="flex flex-row gap-4 justify-end mt-6">
              <button
                onClick={handleBack}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:border-blue-300 hover:text-blue-700 transition-all duration-200 font-semibold order-1 sm:order-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                style={{ minWidth: '120px' }}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedDates || selectedDates.length === 0 || !selectedDates[0] || isCreatingPool}
                className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  !selectedDates || selectedDates.length === 0 || !selectedDates[0] || isCreatingPool
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
                style={{ minWidth: '180px' }}
              >
                {isCreatingPool ? 'Processing...' : 'Continue to Preferences'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PoolDurationPage;

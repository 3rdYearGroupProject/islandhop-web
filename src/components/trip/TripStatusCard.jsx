import React from 'react';
import { Play, Square } from 'lucide-react';

const TripStatusCard = ({ 
  tripName,
  currentDayIndex,
  dailyPlansLength,
  daysLeft,
  dayStarted,
  dayEnded,
  startMeterReading,
  setShowStartModal,
  setShowEndModal,
  setShowTripCompletionModal,
  onNextDay 
}) => {
  // Calculate progress percentage
  const calculateProgress = () => {
    const totalDays = Math.max(1, dailyPlansLength || daysLeft);
    if (dayEnded) {
      return Math.round((currentDayIndex + 1) / totalDays * 100);
    } else if (dayStarted) {
      return Math.round((currentDayIndex + 1) / totalDays * 100);
    } else {
      return Math.round(currentDayIndex / totalDays * 100);
    }
  };

  const progress = calculateProgress();

  // Not started yet
  if (!dayStarted && currentDayIndex === 0) {
    return (
      <div className="relative">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4 blur-sm">
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-600 mb-1">Trip Ready to Start</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span className="font-medium">{tripName}</span>
              <span className="text-gray-400">|</span>
              <span>Day <span className="font-bold">{currentDayIndex + 1}</span> of <span className="font-bold">{dailyPlansLength || Math.max(1, daysLeft)}</span></span>
              <span className="text-gray-400">|</span>
              <span>{Math.max(0, daysLeft - currentDayIndex)} days remaining</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-1 mb-1">
              <div className="h-full bg-gray-300 transition-all" style={{ width: '0%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Ready to Start</span>
              <span>Waiting to begin</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-semibold">Not Started</span>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center gap-4">
          <div className="text-center">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Ready to Begin Your Journey?</h4>
            <p className="text-gray-600 text-sm">Click the button below to start your trip</p>
          </div>
          <button
            onClick={() => setShowStartModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-3 text-base shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Start Trip
          </button>
        </div>
      </div>
    );
  }

  // Ready for next day
  if (!dayStarted && currentDayIndex > 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-600 mb-1">Day {currentDayIndex + 1} Ready</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span className="font-medium">{tripName}</span>
            <span className="text-gray-400">|</span>
            <span>Day <span className="font-bold">{currentDayIndex + 1}</span> of <span className="font-bold">{dailyPlansLength || Math.max(1, daysLeft)}</span></span>
            <span className="text-gray-400">|</span>
            <span>{Math.max(0, daysLeft - currentDayIndex)} days remaining</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-1 mb-1">
            <div className="h-full bg-gray-300 transition-all" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Ready for next day</span>
            <span>Check Today's Plan to start</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-semibold">Ready</span>
        </div>
      </div>
    );
  }

  // Trip in progress
  if (dayStarted && !dayEnded) {
    return (
      <div className="bg-white border border-primary-200 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-primary-700 mb-1">Trip in Progress</h3>
          <div className="flex items-center gap-4 text-sm text-gray-700 mb-2">
            <span className="font-medium">{tripName}</span>
            <span className="text-gray-400">|</span>
            <span>Day <span className="font-bold">{currentDayIndex + 1}</span> of <span className="font-bold">{dailyPlansLength || Math.max(1, daysLeft)}</span></span>
            <span className="text-gray-400">|</span>
            <span>{Math.max(0, daysLeft - currentDayIndex)} days left</span>
            {startMeterReading && (
              <>
                <span className="text-gray-400">|</span>
                <span>Started at {startMeterReading} km</span>
              </>
            )}
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-1 mb-1">
            <div
              className="h-full bg-primary-500 transition-all animate-pulse"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>In Progress</span>
            <span>Trip Active</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Active
          </span>
        </div>
      </div>
    );
  }

  // Day completed
  if (dayEnded) {
    return (
      <div className="bg-white border border-green-200 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-green-700 mb-1">Day {currentDayIndex + 1} Completed</h3>
          <div className="flex items-center gap-4 text-sm text-gray-700 mb-2">
            <span className="font-medium">{tripName}</span>
            <span className="text-gray-400">|</span>
            <span>Day <span className="font-bold">{currentDayIndex + 1}</span> completed</span>
            {startMeterReading && (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-green-600 font-semibold">Distance: 157 km</span>
              </>
            )}
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-1 mb-1">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Completed</span>
            <span>{currentDayIndex + 1 < dailyPlansLength ? 'Next day available' : 'Trip finished!'}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {currentDayIndex + 1 < dailyPlansLength ? (
            <button
              onClick={onNextDay}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-1 px-3 rounded-md transition-colors duration-200 flex items-center gap-2 text-xs"
            >
              <Play className="w-3 h-3" />
              Next Day
            </button>
          ) : (
            <button
              onClick={() => setShowTripCompletionModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded-md transition-colors duration-200 flex items-center gap-2 text-xs"
            >
              <Square className="w-3 h-3" />
              End Trip
            </button>
          )}
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">✓ Completed</span>
        </div>
      </div>
    );
  }

  return null;
};

export default TripStatusCard;

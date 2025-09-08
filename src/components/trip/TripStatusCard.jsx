import React, { useState } from 'react';
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
  // Track completed days - in a real app this would come from props or state management
  const [completedDays, setCompletedDays] = useState(new Set());
  const [currentAction, setCurrentAction] = useState('start'); // 'start' or 'end'
  // Calculate current day and action needed
  const getCurrentDayAndAction = () => {
    const totalDays = dailyPlansLength || Math.max(1, daysLeft);
    
    // Find the current day that needs action
    for (let day = 1; day <= totalDays; day++) {
      const dayStarted = completedDays.has(`day-${day}-start`);
      const dayEnded = completedDays.has(`day-${day}-end`);
      
      if (!dayStarted) {
        return { currentDay: day, action: 'start', allCompleted: false };
      } else if (!dayEnded) {
        return { currentDay: day, action: 'end', allCompleted: false };
      }
    }
    
    // All days completed
    return { currentDay: totalDays, action: 'trip-end', allCompleted: true };
  };

  const { currentDay, action, allCompleted } = getCurrentDayAndAction();

  const handleDayStart = (day) => {
    setCompletedDays(prev => new Set([...prev, `day-${day}-start`]));
    setShowStartModal(true);
  };

  const handleDayEnd = (day) => {
    setCompletedDays(prev => new Set([...prev, `day-${day}-end`]));
    setShowEndModal(true);
  };

  const handleTripEnd = () => {
    setShowTripCompletionModal(true);
  };

  // Calculate progress percentage based on completed actions
  const calculateProgress = () => {
    const totalDays = Math.max(1, dailyPlansLength || daysLeft);
    const totalActions = totalDays * 2; // Each day has start and end
    const completedActions = completedDays.size;
    return Math.round((completedActions / totalActions) * 100);
  };

  const progress = calculateProgress();

  // Main trip status display
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {allCompleted ? 'Trip Ready to Complete' : `Day ${currentDay} ${action === 'start' ? 'Ready to Start' : action === 'end' ? 'Ready to End' : ''}`}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span className="font-medium">{tripName}</span>
            <span className="text-gray-400">|</span>
            <span>Progress: {completedDays.size}/{(dailyPlansLength || Math.max(1, daysLeft)) * 2} actions</span>
            <span className="text-gray-400">|</span>
            <span>{dailyPlansLength || Math.max(1, daysLeft)} total days</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-1 mb-1">
            <div 
              className={`h-full transition-all ${allCompleted ? 'bg-green-500' : 'bg-primary-500'}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{allCompleted ? 'All days completed' : `${action === 'start' ? 'Ready to start' : action === 'end' ? 'Ready to end' : ''} Day ${currentDay}`}</span>
            <span>{progress}% Complete</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          {allCompleted ? (
            <button
              onClick={handleTripEnd}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-3 text-base shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Square className="w-5 h-5" />
              Confirm Trip End
            </button>
          ) : action === 'start' ? (
            <button
              onClick={() => handleDayStart(currentDay)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-3 text-base shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Play className="w-5 h-5" />
              Confirm Day {currentDay} Start
            </button>
          ) : (
            <button
              onClick={() => handleDayEnd(currentDay)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-3 text-base shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Square className="w-5 h-5" />
              Confirm Day {currentDay} End
            </button>
          )}
          
          <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
            allCompleted 
              ? 'bg-green-100 text-green-700' 
              : action === 'start' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-orange-100 text-orange-700'
          }`}>
            {allCompleted ? 'Ready to Complete' : action === 'start' ? 'Ready to Start' : 'Ready to End'}
          </span>
        </div>
      </div>
      
      {/* Progress Summary */}
      {completedDays.size > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: dailyPlansLength || Math.max(1, daysLeft) }, (_, i) => i + 1).map((day) => {
              const dayStarted = completedDays.has(`day-${day}-start`);
              const dayEnded = completedDays.has(`day-${day}-end`);
              
              return (
                <div key={day} className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-600">Day {day}:</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    dayStarted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {dayStarted ? '✓ Started' : 'Not Started'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    dayEnded ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {dayEnded ? '✓ Ended' : 'Not Ended'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripStatusCard;

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
  onNextDay,
  tripData, // Add tripData prop to access dailyPlans with meter readings
  refreshTripData // Add refreshTripData prop to refresh data after actions
}) => {
  // Get daily plans from trip data
  const dailyPlans = tripData?.dailyPlans || [];
  
  // Calculate current day and action needed based on actual trip data
  const getCurrentDayAndAction = () => {
    const totalDays = dailyPlans.length || Math.max(1, daysLeft);
    
    // Find the current day that needs action based on actual data
    for (let day = 1; day <= totalDays; day++) {
      const dayPlan = dailyPlans.find(plan => plan.day === day);
      
      if (!dayPlan) continue;
      
      // Check if day has start/end times (required for confirmation)
      const hasStartTime = dayPlan.start && (dayPlan.start.$date || dayPlan.start);
      const hasEndTime = dayPlan.end && (dayPlan.end.$date || dayPlan.end);
      
      const dayStartConfirmed = dayPlan.start_confirmed === 1;
      const dayEndConfirmed = dayPlan.end_confirmed === 1;
      
      // Can only confirm start if start time exists and not yet confirmed
      if (hasStartTime && !dayStartConfirmed) {
        return { 
          currentDay: day, 
          action: 'start', 
          allCompleted: false,
          dayPlan,
          canConfirm: true
        };
      } 
      // Can only confirm end if start is confirmed, end time exists, and end not yet confirmed
      else if (dayStartConfirmed && hasEndTime && !dayEndConfirmed) {
        return { 
          currentDay: day, 
          action: 'end', 
          allCompleted: false,
          dayPlan,
          canConfirm: true
        };
      }
      // If this day is not complete, block further actions
      else if (!dayEndConfirmed && hasStartTime) {
        return { 
          currentDay: day, 
          action: dayStartConfirmed ? 'end' : 'start', 
          allCompleted: false,
          dayPlan,
          canConfirm: hasEndTime || !dayStartConfirmed
        };
      }
    }
    
    // All days completed
    return { currentDay: totalDays, action: 'trip-end', allCompleted: true, dayPlan: null, canConfirm: true };
  };

  const { currentDay, action, allCompleted, dayPlan, canConfirm } = getCurrentDayAndAction();

  const handleDayStart = (day) => {
    const dayPlan = dailyPlans.find(plan => plan.day === day);
    if (dayPlan && dayPlan.start_meter_read !== undefined) {
      // Pass the meter reading to the modal
      setShowStartModal(true, {
        day: day,
        meterReading: dayPlan.start_meter_read,
        startTime: dayPlan.start && (dayPlan.start.$date || dayPlan.start)
      });
    }
  };

  const handleDayEnd = (day) => {
    const dayPlan = dailyPlans.find(plan => plan.day === day);
    if (dayPlan) {
      // Pass end data to the modal
      setShowEndModal(true, {
        day: day,
        endMeterReading: dayPlan.end_meter_read,
        deductAmount: dayPlan.deduct_amount,
        additionalNote: dayPlan.additional_note,
        endTime: dayPlan.end && (dayPlan.end.$date || dayPlan.end)
      });
    }
  };

  const handleTripEnd = () => {
    setShowTripCompletionModal(true);
  };

  // Calculate progress percentage based on actual confirmed actions
  const calculateProgress = () => {
    const totalDays = dailyPlans.length || Math.max(1, daysLeft);
    const totalActions = totalDays * 2; // Each day has start and end
    
    let completedActions = 0;
    dailyPlans.forEach(plan => {
      if (plan.start_confirmed === 1) completedActions++;
      if (plan.end_confirmed === 1) completedActions++;
    });
    
    return Math.round((completedActions / totalActions) * 100);
  };

  const progress = calculateProgress();
  
  // Count confirmed actions for display
  const getConfirmedActionsCount = () => {
    let count = 0;
    dailyPlans.forEach(plan => {
      if (plan.start_confirmed === 1) count++;
      if (plan.end_confirmed === 1) count++;
    });
    return count;
  };

  const confirmedActions = getConfirmedActionsCount();
  const totalPossibleActions = dailyPlans.length * 2;

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
            <span>Progress: {confirmedActions}/{totalPossibleActions} actions</span>
            <span className="text-gray-400">|</span>
            <span>{dailyPlans.length} total days</span>
            {dayPlan && action === 'start' && dayPlan.start_meter_read !== undefined && (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-blue-600 font-medium">Start: {dayPlan.start_meter_read} km</span>
              </>
            )}
            {dayPlan && action === 'end' && (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-orange-600 font-medium">End: {dayPlan.end_meter_read} km</span>
                {dayPlan.deduct_amount !== undefined && (
                  <>
                    <span className="text-gray-400">|</span>
                    <span className="text-red-600 font-medium">Deduct: ${dayPlan.deduct_amount}</span>
                  </>
                )}
              </>
            )}
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-1 mb-1">
            <div 
              className={`h-full transition-all ${allCompleted ? 'bg-green-500' : 'bg-primary-500'}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {allCompleted 
                ? 'All days completed' 
                : !canConfirm 
                  ? `Waiting for ${action === 'start' ? 'start time' : 'previous day completion'} - Day ${currentDay}`
                  : `${action === 'start' ? 'Ready to start' : action === 'end' ? 'Ready to end' : ''} Day ${currentDay}`
              }
            </span>
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
              disabled={!canConfirm}
              className={`font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-3 text-base shadow-lg ${
                canConfirm 
                  ? 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-xl transform hover:scale-105 cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-5 h-5" />
              Confirm Day {currentDay} Start
              {dayPlan?.start_meter_read !== undefined && canConfirm && (
                <span className="text-sm opacity-80">({dayPlan.start_meter_read} km)</span>
              )}
            </button>
          ) : (
            <button
              onClick={() => handleDayEnd(currentDay)}
              disabled={!canConfirm}
              className={`font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-3 text-base shadow-lg ${
                canConfirm 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-xl transform hover:scale-105 cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Square className="w-5 h-5" />
              Confirm Day {currentDay} End
              {dayPlan?.end_meter_read !== undefined && canConfirm && (
                <span className="text-sm opacity-80">({dayPlan.end_meter_read} km)</span>
              )}
            </button>
          )}
          
          <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
            allCompleted 
              ? 'bg-green-100 text-green-700' 
              : !canConfirm
                ? 'bg-gray-100 text-gray-500'
                : action === 'start' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-orange-100 text-orange-700'
          }`}>
            {allCompleted 
              ? 'Ready to Complete' 
              : !canConfirm 
                ? 'Waiting for Requirements'
                : action === 'start' 
                  ? 'Ready to Start' 
                  : 'Ready to End'
            }
          </span>
        </div>
      </div>
      
      {/* Progress Summary - Updated to use real data */}
      {confirmedActions > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {dailyPlans.map((dayPlan) => {
              const dayStartConfirmed = dayPlan.start_confirmed === 1;
              const dayEndConfirmed = dayPlan.end_confirmed === 1;
              const hasStartTime = dayPlan.start && (dayPlan.start.$date || dayPlan.start);
              const hasEndTime = dayPlan.end && (dayPlan.end.$date || dayPlan.end);
              
              return (
                <div key={dayPlan.day} className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-600">Day {dayPlan.day}:</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    dayStartConfirmed ? 'bg-green-100 text-green-700' : hasStartTime ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {dayStartConfirmed ? '✓ Started' : hasStartTime ? 'Ready to Start' : 'No Start Time'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    dayEndConfirmed ? 'bg-green-100 text-green-700' : hasEndTime && dayStartConfirmed ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {dayEndConfirmed ? '✓ Ended' : hasEndTime && dayStartConfirmed ? 'Ready to End' : 'Waiting'}
                  </span>
                  {dayPlan.start_meter_read !== undefined && (
                    <span className="text-xs text-blue-600">Start: {dayPlan.start_meter_read}km</span>
                  )}
                  {dayPlan.end_meter_read !== undefined && dayEndConfirmed && (
                    <span className="text-xs text-orange-600">End: {dayPlan.end_meter_read}km</span>
                  )}
                  {dayPlan.additional_note && (
                    <span className="text-xs text-gray-500 italic">"{dayPlan.additional_note}"</span>
                  )}
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

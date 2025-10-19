import React, { useState } from 'react';
import { Play, Square } from 'lucide-react';
import { useToast } from '../ToastProvider';

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
  const toast = useToast();
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
      
      // If no start time exists, cannot confirm start
      if (!hasStartTime) {
        return { 
          currentDay: day, 
          action: 'start', 
          allCompleted: false,
          dayPlan,
          canConfirm: false,
          reason: 'No start time available'
        };
      }
      
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
      // If start is confirmed but no end time, wait for end time
      else if (dayStartConfirmed && !hasEndTime) {
        return { 
          currentDay: day, 
          action: 'end', 
          allCompleted: false,
          dayPlan,
          canConfirm: false,
          reason: 'No end time available'
        };
      }
      // If this day is not complete, block further actions
      else if (!dayEndConfirmed && hasStartTime) {
        return { 
          currentDay: day, 
          action: dayStartConfirmed ? 'end' : 'start', 
          allCompleted: false,
          dayPlan,
          canConfirm: hasEndTime || !dayStartConfirmed,
          reason: !hasEndTime && dayStartConfirmed ? 'No end time available' : undefined
        };
      }
    }
    
    // All days completed - but check if any day actually has times
    const hasAnyTimes = dailyPlans.some(plan => 
      (plan.start && (plan.start.$date || plan.start)) || 
      (plan.end && (plan.end.$date || plan.end))
    );
    
    if (!hasAnyTimes) {
      return { 
        currentDay: 1, 
        action: 'start', 
        allCompleted: false, 
        dayPlan: dailyPlans[0], 
        canConfirm: false,
        reason: 'No trip times scheduled yet'
      };
    }
    
    // All days completed
    return { currentDay: totalDays, action: 'trip-end', allCompleted: true, dayPlan: null, canConfirm: true };
  };

  const { currentDay, action, allCompleted, dayPlan, canConfirm, reason } = getCurrentDayAndAction();

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
        startMeterReading: dayPlan.start_meter_read,
        deductAmount: dayPlan.deduct_amount,
        additionalNote: dayPlan.additional_note,
        endTime: dayPlan.end && (dayPlan.end.$date || dayPlan.end)
      });
    }
  };

  const handleTripEnd = () => {
    // Check if trip has been ended by driver/guide (ended field must be 1)
    if (tripData?.ended !== 1) {
      toast.warning('The trip cannot be completed yet. The driver or guide needs to end the trip first.', { duration: 3000 });
      return;
    }
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
            {dayPlan && action === 'start' && dayPlan.start_meter_read !== undefined && canConfirm && (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-blue-600 font-medium">Start: {dayPlan.start_meter_read} km</span>
              </>
            )}
            {dayPlan && action === 'end' && canConfirm && (
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
            {!canConfirm && reason && (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-amber-600 font-medium">{reason}</span>
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
                  ? `${reason || 'Waiting for requirements'} - Day ${currentDay}`
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
              disabled={tripData?.ended !== 1}
              className={`font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-3 text-base shadow-lg ${
                tripData?.ended === 1
                  ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow-xl transform hover:scale-105 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title={tripData?.ended !== 1 ? 'Waiting for driver/guide to end the trip' : 'Complete and finalize your trip'}
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
              ? tripData?.ended === 1
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
              : !canConfirm
                ? 'bg-amber-100 text-amber-700'
                : action === 'start' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-orange-100 text-orange-700'
          }`}>
            {allCompleted 
              ? tripData?.ended === 1 
                ? 'Ready to Complete' 
                : 'Waiting for Trip End'
              : !canConfirm 
                ? 'Waiting for Schedule'
                : action === 'start' 
                  ? 'Ready to Start' 
                  : 'Ready to End'
            }
          </span>
        </div>
      </div>
      
      {/* Progress Summary - Updated to use real data */}
      {confirmedActions > 0 || dailyPlans.length > 0 ? (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {dailyPlans.length > 0 ? (
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
                      {dayEndConfirmed ? '✓ Ended' : hasEndTime && dayStartConfirmed ? 'Ready to End' : hasEndTime ? 'Waiting for Start' : 'No End Time'}
                    </span>
                    {dayPlan.start_meter_read !== undefined && hasStartTime && (
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
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No daily plans available</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default TripStatusCard;

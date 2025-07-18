import React, { useState } from 'react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Calendar = ({
  selectedDates = [],
  onDateSelect,
  onDateRangeSelect,
  mode = 'single', // 'single', 'range', 'multiple'
  minDate,
  maxDate,
  disabledDates = [],
  className = '',
  ...props
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rangeStart, setRangeStart] = useState(null);

  // Ensure selectedDates is always an array
  const safeDates = Array.isArray(selectedDates) ? selectedDates : [];

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isDateSelected = (day) => {
    if (!day) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return safeDates.some(selectedDate => {
      if (!selectedDate) return false;
      // Ensure selectedDate is a Date object
      const dateObj = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
      if (isNaN(dateObj.getTime())) return false; // Invalid date
      return date.toDateString() === dateObj.toDateString();
    });
  };

  const isDateDisabled = (day) => {
    if (!day) return true;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (minDate) {
      const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (dateOnly < minDateOnly) return true;
    }
    
    if (maxDate) {
      const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (dateOnly > maxDateOnly) return true;
    }
    
    return disabledDates.some(disabledDate => {
      const dateObj = disabledDate instanceof Date ? disabledDate : new Date(disabledDate);
      if (isNaN(dateObj.getTime())) return false; // Invalid date
      return date.toDateString() === dateObj.toDateString();
    });
  };

  const isDateInRange = (day) => {
    if (!day || safeDates.length !== 2) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    // Convert dates to Date objects safely
    const dateObjs = safeDates.map(d => {
      const dateObj = d instanceof Date ? d : new Date(d);
      return isNaN(dateObj.getTime()) ? null : dateObj;
    }).filter(Boolean);
    
    if (dateObjs.length !== 2) return false;
    
    const [start, end] = dateObjs.sort((a, b) => a - b);
    
    // Don't highlight the start and end dates as "in range" since they are already highlighted as selected
    const isStartOrEnd = date.toDateString() === start.toDateString() || date.toDateString() === end.toDateString();
    if (isStartOrEnd) return false;
    
    return date > start && date < end;
  };

  const isRangeStart = (day) => {
    if (!day || safeDates.length !== 2) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    // Convert dates to Date objects safely
    const dateObjs = safeDates.map(d => {
      const dateObj = d instanceof Date ? d : new Date(d);
      return isNaN(dateObj.getTime()) ? null : dateObj;
    }).filter(Boolean);
    
    if (dateObjs.length !== 2) return false;
    
    const [start] = dateObjs.sort((a, b) => a - b);
    return date.toDateString() === start.toDateString();
  };

  const isRangeEnd = (day) => {
    if (!day || safeDates.length !== 2) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    // Convert dates to Date objects safely
    const dateObjs = safeDates.map(d => {
      const dateObj = d instanceof Date ? d : new Date(d);
      return isNaN(dateObj.getTime()) ? null : dateObj;
    }).filter(Boolean);
    
    if (dateObjs.length !== 2) return false;
    
    const [, end] = dateObjs.sort((a, b) => a - b);
    return date.toDateString() === end.toDateString();
  };

  const handleDateClick = (day) => {
    if (!day || isDateDisabled(day)) return;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (mode === 'single') {
      onDateSelect?.([date]);
    } else if (mode === 'range') {
      if (safeDates.length === 0) {
        // First date selection
        setRangeStart(date);
        onDateSelect?.([date]);
      } else if (safeDates.length === 1) {
        // Second date selection - complete the range
        const firstDate = safeDates[0] instanceof Date ? safeDates[0] : new Date(safeDates[0]);
        if (isNaN(firstDate.getTime())) {
          // Invalid first date, start over
          setRangeStart(date);
          onDateSelect?.([date]);
          return;
        }
        const start = firstDate < date ? firstDate : date;
        const end = firstDate < date ? date : firstDate;
        setRangeStart(null);
        onDateSelect?.([start, end]);
      } else {
        // Start a new range selection
        setRangeStart(date);
        onDateSelect?.([date]);
      }
    } else if (mode === 'multiple') {
      const newDates = isDateSelected(day) 
        ? safeDates.filter(d => {
            const dateObj = d instanceof Date ? d : new Date(d);
            if (isNaN(dateObj.getTime())) return true; // Keep invalid dates (shouldn't happen)
            return dateObj.toDateString() !== date.toDateString();
          })
        : [...safeDates, date];
      onDateSelect?.(newDates);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const getDayClasses = (day) => {
    if (!day) return 'invisible';
    
    const baseClasses = 'w-10 h-10 flex items-center justify-center text-sm cursor-pointer transition-all duration-200 font-medium relative z-10';
    
    if (isDateDisabled(day)) {
      return `${baseClasses} text-gray-300 cursor-not-allowed`;
    }
    
    if (isDateSelected(day)) {
      return `${baseClasses} bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-full`;
    }
    
    if (isDateInRange(day)) {
      return `${baseClasses} text-blue-800 hover:bg-blue-200 hover:rounded-full`;
    }
    
    return `${baseClasses} text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-full`;
  };

  return (
    <div className={`bg-white ${className}`} style={{ maxWidth: 340, margin: '0 auto' }} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((weekday, index) => (
          <div key={`weekday-${index}`} className="w-10 h-10 flex items-center justify-center text-sm font-medium text-gray-500">
            {weekday}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0">
        {calendarDays.map((day, index) => {
          const inRange = isDateInRange(day);
          const rangeStart = isRangeStart(day);
          const rangeEnd = isRangeEnd(day);
          const isSelected = isDateSelected(day);
          
          return (
            <div key={`day-${currentMonth.getMonth()}-${currentMonth.getFullYear()}-${index}`} className="relative">
              {/* Range background for in-between dates */}
              {inRange && (
                <div className="absolute inset-0 bg-blue-100" />
              )}
              
              {/* Partial backgrounds for start and end dates to connect with range */}
              {rangeStart && (
                <div 
                  className="absolute inset-0 bg-blue-100"
                  style={{ left: '50%' }}
                />
              )}
              
              {rangeEnd && (
                <div 
                  className="absolute inset-0 bg-blue-100"
                  style={{ right: '50%' }}
                />
              )}
              
              {/* Day cell */}
              <div
                className={getDayClasses(day)}
                onClick={() => handleDateClick(day)}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

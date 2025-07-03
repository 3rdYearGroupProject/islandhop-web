import React, { useState } from 'react';

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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
    return selectedDates.some(selectedDate => 
      selectedDate && 
      date.getTime() === selectedDate.getTime()
    );
  };

  const isDateDisabled = (day) => {
    if (!day) return true;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    
    return disabledDates.some(disabledDate => 
      date.getTime() === disabledDate.getTime()
    );
  };

  const isDateInRange = (day) => {
    if (!day || !rangeStart || selectedDates.length < 2) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const [start, end] = selectedDates.sort((a, b) => a - b);
    return date >= start && date <= end;
  };

  const handleDateClick = (day) => {
    if (!day || isDateDisabled(day)) return;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (mode === 'single') {
      onDateSelect?.(date);
    } else if (mode === 'range') {
      if (!rangeStart) {
        setRangeStart(date);
        onDateSelect?.(date);
      } else {
        const start = rangeStart < date ? rangeStart : date;
        const end = rangeStart < date ? date : rangeStart;
        setRangeStart(null);
        onDateRangeSelect?.([start, end]);
      }
    } else if (mode === 'multiple') {
      const newDates = isDateSelected(day) 
        ? selectedDates.filter(d => d.getTime() !== date.getTime())
        : [...selectedDates, date];
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
    
    const baseClasses = 'w-8 h-8 flex items-center justify-center text-sm rounded-full cursor-pointer transition-colors';
    
    if (isDateDisabled(day)) {
      return `${baseClasses} text-gray-300 cursor-not-allowed`;
    }
    
    if (isDateSelected(day)) {
      return `${baseClasses} bg-primary-600 text-white font-semibold`;
    }
    
    if (isDateInRange(day)) {
      return `${baseClasses} bg-primary-100 text-primary-800`;
    }
    
    return `${baseClasses} text-gray-700 hover:bg-primary-50 hover:text-primary-600`;
  };

  return (
    <div className={`bg-white ${className}`} {...props}>
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
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
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
        {weekdays.map((weekday) => (
          <div key={weekday} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
            {weekday}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={getDayClasses(day)}
            onClick={() => handleDateClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;

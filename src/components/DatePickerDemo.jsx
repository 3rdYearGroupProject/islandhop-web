import React, { useState } from 'react';
import DatePicker from './DatePicker';

const DatePickerDemo = () => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateApply = (dates) => {
    setSelectedDates(dates);
    console.log('Selected dates:', dates);
  };

  const handleDateClear = () => {
    setSelectedDates([]);
    console.log('Dates cleared');
  };

  const formatDateRange = (dates) => {
    if (dates.length === 0) return 'Select dates';
    if (dates.length === 1) return dates[0].toLocaleDateString();
    if (dates.length === 2) {
      return `${dates[0].toLocaleDateString()} - ${dates[1].toLocaleDateString()}`;
    }
    return `${dates.length} dates selected`;
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Date Picker Demo</h2>
      
      <div className="space-y-4">
        <button
          onClick={() => setIsDatePickerOpen(true)}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Open Date Picker
        </button>
        
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-700">
            <strong>Selected:</strong> {formatDateRange(selectedDates)}
          </p>
        </div>
      </div>

      <DatePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onApply={handleDateApply}
        onClear={handleDateClear}
        title="Add dates"
        mode="range"
        initialDates={selectedDates}
      />
    </div>
  );
};

export default DatePickerDemo;

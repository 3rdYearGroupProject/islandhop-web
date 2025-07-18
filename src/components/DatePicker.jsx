import React, { useState } from 'react';
import Modal from './Modal';
import Calendar from './Calendar';

const DatePicker = ({
  isOpen,
  onClose,
  onApply,
  onClear,
  title = "Add dates",
  mode = 'range',
  initialDates = [],
  className = '',
  ...props
}) => {
  const [selectedDates, setSelectedDates] = useState(initialDates);
  const [tempDates, setTempDates] = useState(initialDates);

  const handleDateSelect = (date) => {
    if (mode === 'single') {
      setTempDates([date]);
    } else if (mode === 'range') {
      if (tempDates.length === 0) {
        setTempDates([date]);
      } else if (tempDates.length === 1) {
        const [start] = tempDates;
        const end = date;
        const sortedDates = start <= end ? [start, end] : [end, start];
        setTempDates(sortedDates);
      } else {
        setTempDates([date]);
      }
    }
  };

  const handleDateRangeSelect = (dateRange) => {
    setTempDates(dateRange);
  };

  const handleApply = () => {
    setSelectedDates(tempDates);
    onApply?.(tempDates);
    onClose?.();
  };

  const handleClear = () => {
    setTempDates([]);
    setSelectedDates([]);
    onClear?.();
  };

  const handleClose = () => {
    setTempDates(selectedDates); // Reset to last applied dates
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="md"
      className={className}
      {...props}
    >
      <div className="space-y-6">
        {/* Calendar */}
        <Calendar
          selectedDates={tempDates}
          onDateSelect={handleDateSelect}
          onDateRangeSelect={handleDateRangeSelect}
          mode={mode}
          className="mx-auto"
        />

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear
          </button>
          
          <button
            onClick={handleApply}
            disabled={tempDates.length === 0}
            className={`
              px-6 py-2 rounded-lg text-sm font-semibold transition-colors
              ${tempDates.length > 0 
                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DatePicker;

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({ 
  value, 
  onChange, 
  options, 
  className = '', 
  placeholder = 'Select...',
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 border border-gray-300 rounded-full 
          focus:ring-2 focus:ring-blue-500 focus:border-transparent 
          text-base bg-white text-left flex items-center justify-between
          hover:border-blue-400 hover:shadow-md transition-all duration-200 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'ring-2 ring-blue-500 border-transparent' : ''}
        `}
      >
        <span className="text-gray-900">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                w-full px-4 py-3 text-left text-base transition-colors duration-150
                hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700
                ${value === option.value 
                  ? 'bg-blue-100 text-blue-800 font-medium' 
                  : 'text-gray-900'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;

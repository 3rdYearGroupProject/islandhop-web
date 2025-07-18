import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 4000, 
  onClose, 
  position = 'top-right',
  showProgress = true 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow animation to complete
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "fixed z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out";
    const positionStyles = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    };
    
    const visibilityStyles = isVisible 
      ? 'translate-y-0 opacity-100 scale-100' 
      : 'translate-y-2 opacity-0 scale-95';
    
    return `${baseStyles} ${positionStyles[position]} ${visibilityStyles}`;
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-white dark:bg-secondary-800',
          border: 'border-l-4 border-success-500',
          icon: CheckCircleIcon,
          iconColor: 'text-success-500',
          textColor: 'text-gray-900 dark:text-white'
        };
      case 'error':
        return {
          bg: 'bg-white dark:bg-secondary-800',
          border: 'border-l-4 border-danger-500',
          icon: XCircleIcon,
          iconColor: 'text-danger-500',
          textColor: 'text-gray-900 dark:text-white'
        };
      case 'warning':
        return {
          bg: 'bg-white dark:bg-secondary-800',
          border: 'border-l-4 border-warning-500',
          icon: ExclamationTriangleIcon,
          iconColor: 'text-warning-500',
          textColor: 'text-gray-900 dark:text-white'
        };
      case 'info':
      default:
        return {
          bg: 'bg-white dark:bg-secondary-800',
          border: 'border-l-4 border-info-500',
          icon: InformationCircleIcon,
          iconColor: 'text-info-500',
          textColor: 'text-gray-900 dark:text-white'
        };
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const typeStyles = getTypeStyles();
  const IconComponent = typeStyles.icon;

  return (
    <div className={getToastStyles()}>
      <div className={`
        ${typeStyles.bg} ${typeStyles.border}
        rounded-lg shadow-lg border border-gray-200 dark:border-secondary-700
        overflow-hidden
      `}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <IconComponent className={`h-5 w-5 ${typeStyles.iconColor}`} />
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${typeStyles.textColor}`}>
                {message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={handleClose}
                className={`
                  rounded-md inline-flex text-gray-400 dark:text-gray-500 
                  hover:text-gray-500 dark:hover:text-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                  transition-colors duration-200
                `}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        {showProgress && duration > 0 && (
          <div className="h-1 bg-gray-200 dark:bg-secondary-700">
            <div 
              className={`h-full transition-all duration-100 ease-linear ${
                type === 'success' ? 'bg-success-500' :
                type === 'error' ? 'bg-danger-500' :
                type === 'warning' ? 'bg-warning-500' :
                'bg-info-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;

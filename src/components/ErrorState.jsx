import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * ErrorState Component
 * A reusable error display component with consistent styling across the app
 * 
 * @param {string} title - The main error title (default: "Unable to Load Data")
 * @param {string} message - The error message to display
 * @param {function} onRetry - Optional callback for retry button
 * @param {string} retryText - Text for retry button (default: "Try Again")
 * @param {boolean} showRetry - Whether to show retry button (default: true)
 * @param {string} icon - Icon type: 'alert' or 'custom' (default: 'alert')
 * @param {node} customIcon - Custom icon component to display
 */
const ErrorState = ({ 
  title = "Unable to Load Data",
  message = "We're having trouble connecting to the server. Please check your connection and try again.",
  onRetry,
  retryText = "Try Again",
  showRetry = true,
  icon = 'alert',
  customIcon
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="text-center py-20">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          {customIcon ? (
            customIcon
          ) : icon === 'alert' ? (
            <svg 
              className="h-12 w-12 text-blue-600 dark:text-blue-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          ) : (
            <AlertCircle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {message}
        </p>

        {/* Retry Button */}
        {showRetry && (
          <button
            onClick={handleRetry}
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-full font-semibold text-base hover:bg-blue-700 transition-colors shadow"
          >
            <svg 
              className="mr-2 h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;

import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  color = 'primary',
  text = '',
  centered = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  const spinnerClasses = `
    animate-spin rounded-full border-2 border-gray-200 
    ${sizeClasses[size]} 
    ${colorClasses[color]} 
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const containerClasses = centered ? 'flex items-center justify-center' : 'flex items-center';

  return (
    <div className={containerClasses}>
      <div 
        className={spinnerClasses} 
        style={{ 
          borderTopColor: color === 'primary' ? '#2563eb' : 'currentColor',
          borderRightColor: 'transparent'
        }}
      ></div>
      {text && (
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;

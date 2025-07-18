import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm hover:shadow-md',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500 bg-transparent',
    'outline-secondary': 'border-2 border-secondary-600 text-secondary-600 hover:bg-secondary-600 hover:text-white focus:ring-secondary-500 bg-transparent',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-sm hover:shadow-md',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 shadow-sm hover:shadow-md',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 shadow-sm hover:shadow-md',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500 bg-transparent',
    'ghost-secondary': 'text-secondary-600 hover:bg-secondary-50 focus:ring-secondary-500 bg-transparent',
    link: 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-500 bg-transparent',
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs rounded-full',
    sm: 'px-3 py-1.5 text-sm rounded-full',
    md: 'px-4 py-2 text-sm rounded-full',
    lg: 'px-6 py-3 text-base rounded-full',
    xl: 'px-8 py-4 text-lg rounded-full',
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClasses}
    ${className}
  `.trim();

  const iconSize = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size={size === 'xs' ? 'sm' : 'sm'} 
          className={`${leftIcon || children ? 'mr-2' : ''}`}
          color={variant.includes('outline') || variant.includes('ghost') || variant === 'link' ? 'primary' : 'white'}
        />
      )}
      
      {leftIcon && !loading && (
        <span className={`${iconSize[size]} ${children ? 'mr-2' : ''}`}>
          {leftIcon}
        </span>
      )}
      
      {children && (
        <span className={loading && !leftIcon ? 'ml-2' : ''}>
          {children}
        </span>
      )}
      
      {rightIcon && !loading && (
        <span className={`${iconSize[size]} ${children ? 'ml-2' : ''}`}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};

// Button Group Component
export const ButtonGroup = ({ children, className = '', ...props }) => {
  return (
    <div className={`inline-flex ${className}`} {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const isFirst = index === 0;
          const isLast = index === React.Children.count(children) - 1;
          
          return React.cloneElement(child, {
            className: `
              ${child.props.className || ''}
              ${!isFirst && !isLast ? 'rounded-none border-l-0' : ''}
              ${isFirst ? 'rounded-r-none' : ''}
              ${isLast ? 'rounded-l-none border-l-0' : ''}
              ${!isFirst && !isLast ? 'border-l-0' : ''}
            `.trim()
          });
        }
        return child;
      })}
    </div>
  );
};

// Icon Button Component
export const IconButton = ({
  icon,
  size = 'md',
  variant = 'ghost',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  return (
    <Button
      variant={variant}
      className={`rounded-full ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <span className={iconSizes[size]}>
        {icon}
      </span>
    </Button>
  );
};

// Floating Action Button Component
export const FloatingActionButton = ({
  icon,
  onClick,
  className = '',
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 
        ${sizeClasses[size]}
        bg-primary-600 text-white 
        rounded-full shadow-lg hover:shadow-xl 
        hover:bg-primary-700 
        transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        z-50
        ${className}
      `.trim()}
      {...props}
    >
      <span className={`${iconSizes[size]} mx-auto`}>
        {icon}
      </span>
    </button>
  );
};

export default Button;

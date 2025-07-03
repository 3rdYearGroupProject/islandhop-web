import React, { useState } from 'react';

// Base Input Component
const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder = '',
  error = '',
  helpText = '',
  required = false,
  disabled = false,
  fullWidth = true,
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const baseClasses = `
    block w-full border rounded-md shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-2 focus:ring-offset-0 
    transition-colors duration-200
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    dark:bg-secondary-800 dark:border-secondary-600 dark:text-white dark:placeholder-gray-400
  `;

  const stateClasses = error
    ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-secondary-600 dark:focus:border-primary-500';

  const widthClasses = fullWidth ? 'w-full' : '';

  const inputClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${stateClasses}
    ${widthClasses}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${className}
  `.trim();

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
};

// Textarea Component
export const Textarea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder = '',
  error = '',
  helpText = '',
  required = false,
  disabled = false,
  fullWidth = true,
  rows = 3,
  resize = 'vertical',
  className = '',
  ...props
}) => {
  const baseClasses = `
    block w-full border rounded-md shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-2 focus:ring-offset-0 
    transition-colors duration-200
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    dark:bg-secondary-800 dark:border-secondary-600 dark:text-white dark:placeholder-gray-400
  `;

  const stateClasses = error
    ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-secondary-600 dark:focus:border-primary-500';

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  const textareaClasses = `
    ${baseClasses}
    ${stateClasses}
    ${resizeClasses[resize]}
    px-3 py-2 text-sm
    ${className}
  `.trim();

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
};

// Select Component
export const Select = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  onFocus,
  options = [],
  placeholder = 'Select an option',
  error = '',
  helpText = '',
  required = false,
  disabled = false,
  fullWidth = true,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const baseClasses = `
    block w-full border rounded-md shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-offset-0 
    transition-colors duration-200
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    dark:bg-secondary-800 dark:border-secondary-600 dark:text-white
  `;

  const stateClasses = error
    ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-secondary-600 dark:focus:border-primary-500';

  const selectClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${stateClasses}
    ${className}
  `.trim();

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
};

// Checkbox Component
export const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  error = '',
  helpText = '',
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`${className}`}>
      <div className="flex items-start">
        <input
          type="checkbox"
          name={name}
          id={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          {...props}
        />
        {label && (
          <label 
            htmlFor={name}
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
};

// Radio Component
export const Radio = ({
  label,
  name,
  value,
  checked,
  onChange,
  error = '',
  helpText = '',
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`${className}`}>
      <div className="flex items-start">
        <input
          type="radio"
          name={name}
          id={`${name}-${value}`}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          {...props}
        />
        {label && (
          <label 
            htmlFor={`${name}-${value}`}
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
};

// Password Input Component
export const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder = 'Enter password',
  error = '',
  helpText = '',
  required = false,
  disabled = false,
  fullWidth = true,
  size = 'md',
  showStrengthIndicator = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const EyeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  );

  const rightIcon = (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="text-gray-400 hover:text-gray-600 focus:outline-none"
    >
      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );

  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholder}
      error={error}
      helpText={helpText}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      rightIcon={rightIcon}
      className={className}
      {...props}
    />
  );
};

export default Input;

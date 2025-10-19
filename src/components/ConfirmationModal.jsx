import React from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Reusable Confirmation Modal Component
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Function to close modal
 * @param {function} onConfirm - Function to call when user confirms
 * @param {string} title - Modal title
 * @param {string} message - Modal message/description
 * @param {string} confirmText - Text for confirm button (default: "Confirm")
 * @param {string} cancelText - Text for cancel button (default: "Cancel")
 * @param {string} variant - Visual variant: 'warning', 'danger', 'success', 'info' (default: 'warning')
 * @param {boolean} loading - Shows loading state on confirm button
 * @param {React.ReactNode} children - Optional children to render custom content
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false,
  children
}) => {
  if (!isOpen) return null;

  // Variant styling matching the system design
  const variantStyles = {
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      confirmBg: 'bg-orange-600 hover:bg-orange-700',
      titleColor: 'text-gray-900 dark:text-white'
    },
    danger: {
      icon: AlertCircle,
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      confirmBg: 'bg-red-600 hover:bg-red-700',
      titleColor: 'text-gray-900 dark:text-white'
    },
    success: {
      icon: CheckCircle,
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      confirmBg: 'bg-green-600 hover:bg-green-700',
      titleColor: 'text-gray-900 dark:text-white'
    },
    info: {
      icon: Info,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      confirmBg: 'bg-blue-600 hover:bg-blue-700',
      titleColor: 'text-gray-900 dark:text-white'
    }
  };

  const styles = variantStyles[variant] || variantStyles.warning;
  const IconComponent = styles.icon;

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={!loading ? onClose : undefined}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors"
          onClick={onClose}
          aria-label="Close"
          disabled={loading}
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center`}>
            <IconComponent className={`w-8 h-8 ${styles.iconColor}`} />
          </div>
        </div>
        
        {/* Content */}
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${styles.titleColor} mb-4`}>
            {title}
          </h2>
          
          {children || (
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {message}
            </p>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-secondary-600 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`flex-1 ${styles.confirmBg} text-white px-6 py-3 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

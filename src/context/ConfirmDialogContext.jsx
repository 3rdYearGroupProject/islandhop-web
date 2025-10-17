import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const ConfirmDialogContext = createContext();

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirmDialog must be used within ConfirmDialogProvider');
  }
  return context;
};

export const ConfirmDialogProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm', // 'confirm', 'alert', 'warning', 'info'
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  });

  // Use ref to store the promise resolver - survives re-renders
  const resolveRef = useRef(null);

  // Intercept browser confirm() calls
  useEffect(() => {
    const originalConfirm = window.confirm;
    const originalAlert = window.alert;

    // Override window.confirm - SYNCHRONOUS blocking version
    window.confirm = (message) => {
      // This won't work for truly blocking synchronous code
      // But we can try to make it work better
      let userChoice = false;
      let dialogClosed = false;

      const promise = new Promise((resolve) => {
        resolveRef.current = (choice) => {
          userChoice = choice;
          dialogClosed = true;
          resolve(choice);
        };
        
        setDialogState({
          isOpen: true,
          title: 'Confirm Action',
          message: message || 'Are you sure?',
          type: 'confirm',
          confirmText: 'OK',
          cancelText: 'Cancel',
        });
      });

      // For async code, return the promise
      return promise;
    };

    // Override window.alert
    window.alert = (message) => {
      return new Promise((resolve) => {
        resolveRef.current = resolve;
        setDialogState({
          isOpen: true,
          title: 'Alert',
          message: message || '',
          type: 'alert',
          confirmText: 'OK',
          cancelText: null,
        });
      });
    };

    // Cleanup on unmount
    return () => {
      window.confirm = originalConfirm;
      window.alert = originalAlert;
    };
  }, []);

  const showConfirm = ({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'confirm' }) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve; // Store resolver in ref
      setDialogState({
        isOpen: true,
        title,
        message,
        type,
        confirmText,
        cancelText,
      });
    });
  };

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    resolveRef.current = null; // Clear the resolver
  };

  const handleConfirm = () => {
    if (resolveRef.current) {
      resolveRef.current(true); // Resolve with true
      resolveRef.current = null; // Clear after use
    }
    closeDialog();
  };

  const handleCancel = () => {
    if (resolveRef.current) {
      resolveRef.current(false); // Resolve with false
      resolveRef.current = null; // Clear after use
    }
    closeDialog();
  };

  const getIcon = () => {
    switch (dialogState.type) {
      case 'warning':
        return (
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
          </div>
        );
      case 'alert':
        return (
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
          </div>
        );
      case 'info':
        return (
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <InformationCircleIcon className="w-5 h-5 text-primary-600" />
          </div>
        );
      case 'confirm':
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <CheckCircleIcon className="w-5 h-5 text-primary-600" />
          </div>
        );
    }
  };

  return (
    <ConfirmDialogContext.Provider value={{ showConfirm }}>
      {children}

      {/* Custom Confirm Dialog */}
      {dialogState.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-8">
          {/* Backdrop - Just blur, no dark overlay */}
          <div 
            className="absolute inset-0 backdrop-blur-sm animate-fade-in"
            onClick={dialogState.type === 'confirm' ? handleCancel : null}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-secondary-200/50 animate-slide-down">
            {/* Modern Header - No background, clean design */}
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-start justify-between gap-3">
                {/* Icon and Title */}
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {getIcon()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-secondary-900 mb-1">
                      {dialogState.title}
                    </h3>
                    <p className="text-secondary-600 text-sm leading-relaxed">
                      {dialogState.message}
                    </p>
                  </div>
                </div>

                {/* Close button */}
                {dialogState.type === 'confirm' && (
                  <button
                    onClick={handleCancel}
                    className="flex-shrink-0 text-secondary-400 hover:text-secondary-600 transition-colors rounded-lg hover:bg-secondary-100 p-1"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Footer with modern actions */}
            <div className="px-5 py-4 bg-gradient-to-t from-secondary-50/50 to-transparent flex items-center justify-end gap-2 border-t border-secondary-100">
              {dialogState.cancelText && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-white text-secondary-700 rounded-lg text-sm font-semibold 
                           border border-secondary-300 hover:bg-secondary-50 hover:border-secondary-400
                           transition-all shadow-sm hover:shadow active:scale-95"
                >
                  {dialogState.cancelText}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95
                  ${dialogState.type === 'alert' || dialogState.type === 'warning'
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white'
                  }`}
              >
                {dialogState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </ConfirmDialogContext.Provider>
  );
};

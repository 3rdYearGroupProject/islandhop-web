import React from 'react';

const SettingsModal = ({ show, onClose, currentCurrency, setCurrentCurrency, currentUnits, setCurrentUnits }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-lg animate-navbar-dropdown overflow-hidden border border-gray-200"
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin: 0 }}
      >
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl transition-colors z-10" onClick={onClose} aria-label="Close settings">&times;</button>
        {/* Settings Header */}
        <div className="bg-white h-20 w-full flex items-center justify-center px-6 border-b border-gray-100">
          <div className="text-2xl font-bold text-gray-800 tracking-tight">Settings</div>
        </div>
        {/* Settings Body */}
        <div className="p-6">
          {/* Settings Options */}
          <div className="space-y-4">
            {/* Change Password */}
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-800">Change Password</div>
                  <div className="text-xs text-gray-500">Update your account password</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Change Currency */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-800">Currency</div>
                  <div className="text-xs text-gray-500">Select your preferred currency</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['USD', 'EUR', 'GBP', 'LKR', 'INR', 'AUD'].map((currency) => (
                  <button
                    key={currency}
                    onClick={() => setCurrentCurrency(currency)}
                    className={`p-2 rounded-full text-sm font-medium transition-colors ${
                      currentCurrency === currency 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-white border text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </div>

            {/* Change Units */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-800">Units</div>
                  <div className="text-xs text-gray-500">Choose measurement system</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Imperial', 'Metric'].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setCurrentUnits(unit)}
                    className={`p-2 rounded-full text-sm font-medium transition-colors ${
                      currentUnits === unit 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-white border text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Deactivate Account */}
            <button className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-full transition-colors border border-red-200">
              <div className="flex items-center">
                <div className="w-10 h-10 border-2 border-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-red-700">Deactivate Account</div>
                  <div className="text-xs text-red-500">Permanently disable your account</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

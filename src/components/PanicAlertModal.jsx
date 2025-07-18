import React from 'react';

const PanicAlertModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-2xl p-8 m-8 w-full max-w-sm border border-red-200 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
          </svg>
          Send Panic Alert
        </h2>
        <p className="mb-6 text-gray-700">
          Are you sure you want to send a panic alert? Our support team will be notified immediately.
        </p>
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
          onClick={() => {
            onClose();
            alert('Panic alert sent!');
          }}
        >
          Send Alert
        </button>
      </div>
    </div>
  );
};

export default PanicAlertModal;

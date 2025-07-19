import React from 'react';

const PanicAlertModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 w-full max-w-md border border-red-100 relative animate-fade-in-up">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-200 transition"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-extrabold text-red-600 mb-6 flex items-center gap-3">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
          </svg>
          Send Panic Alert
        </h2>
        <p className="mb-8 text-gray-700 text-base text-center">
          Are you sure you want to send a panic alert? <br />Our support team will be notified immediately.
        </p>
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full font-semibold text-lg shadow transition focus:outline-none focus:ring-2 focus:ring-red-200"
          onClick={() => {
            onClose();
            alert('Panic alert sent!');
          }}
        >
          Send Alert
        </button>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.3s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PanicAlertModal;

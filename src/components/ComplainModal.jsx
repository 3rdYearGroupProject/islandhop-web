import React, { useState } from 'react';

const ComplainModal = ({ onClose }) => {
  const [complaint, setComplaint] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-2xl p-8 m-8 w-full max-w-sm border border-yellow-200 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-yellow-700 mb-4 flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.994-1.85l.007-.15V6c0-1.054-.816-1.918-1.85-1.994L18.222 4H6.364c-1.054 0-1.918.816-1.994 1.85L4.364 6v12c0 1.054.816 1.918 1.85 1.994l.15.006z"
            />
          </svg>
          Complain
        </h2>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 mb-4"
          rows={4}
          placeholder="Describe your complaint..."
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
        ></textarea>
        <button
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold"
          onClick={() => {
            onClose();
            alert('Complaint submitted!');
          }}
        >
          Submit Complaint
        </button>
      </div>
    </div>
  );
};

export default ComplainModal;

import React, { useState } from 'react';

const ReportLostItemModal = ({ onClose }) => {
  const [lostItem, setLostItem] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-2xl p-8 m-8 w-full max-w-sm border border-blue-200 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
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
              d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-4 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m4 4v6m-4 0h8"
            />
          </svg>
          Report Lost Item
        </h2>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 mb-4"
          rows={4}
          placeholder="Describe the lost item..."
          value={lostItem}
          onChange={(e) => setLostItem(e.target.value)}
        ></textarea>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          onClick={() => {
            onClose();
            alert('Lost item reported!');
          }}
        >
          Report Item
        </button>
      </div>
    </div>
  );
};

export default ReportLostItemModal;

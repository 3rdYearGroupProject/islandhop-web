import React, { useState } from 'react';

const ReportLostItemModal = ({ onClose }) => {
  const [lostItem, setLostItem] = useState('');
  const [lostDate, setLostDate] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 w-full max-w-md border border-blue-100 relative animate-fade-in-up">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-extrabold text-blue-700 mb-6 flex items-center gap-3">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-4 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m4 4v6m-4 0h8" />
          </svg>
          Report Lost Item
        </h2>
        <div className="space-y-4">
          <textarea
            className="w-full border border-blue-100 bg-blue-50 focus:bg-white focus:border-blue-400 rounded-xl p-4 min-h-[96px] text-base mb-1 transition placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            rows={4}
            placeholder="Describe the lost item..."
            value={lostItem}
            onChange={(e) => setLostItem(e.target.value)}
          ></textarea>
          <div>
            <label className="block text-gray-600 font-medium mb-1" htmlFor="lost-date">Date lost <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              id="lost-date"
              type="date"
              className="w-full border border-blue-100 bg-blue-50 focus:bg-white focus:border-blue-400 rounded-xl p-3 text-base transition focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={lostDate}
              onChange={e => setLostDate(e.target.value)}
            />
          </div>
        </div>
        <button
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold text-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-200"
          onClick={() => {
            onClose();
            alert(`Lost item reported!${lostDate ? ' Date lost: ' + lostDate : ''}`);
          }}
        >
          Report Item
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

export default ReportLostItemModal;

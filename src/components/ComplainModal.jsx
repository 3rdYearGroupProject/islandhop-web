import React, { useState } from 'react';

const ComplainModal = ({ onClose }) => {
  const [complaint, setComplaint] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 w-full max-w-md border border-yellow-100 relative animate-fade-in-up">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-extrabold text-yellow-700 mb-6 flex items-center gap-3">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.994-1.85l.007-.15V6c0-1.054-.816-1.918-1.85-1.994L18.222 4H6.364c-1.054 0-1.918.816-1.994 1.85L4.364 6v12c0 1.054.816 1.918 1.85 1.994l.15.006z" />
          </svg>
          Complain
        </h2>
        <div className="space-y-4">
          <textarea
            className="w-full border border-yellow-100 bg-yellow-50 focus:bg-white focus:border-yellow-400 rounded-xl p-4 min-h-[96px] text-base mb-1 transition placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
            rows={4}
            placeholder="Describe your complaint..."
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
          ></textarea>
        </div>
        <button
          className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-full font-semibold text-lg shadow transition focus:outline-none focus:ring-2 focus:ring-yellow-200"
          onClick={() => {
            onClose();
            alert('Complaint submitted!');
          }}
        >
          Submit Complaint
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

export default ComplainModal;

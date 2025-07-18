import React, { useState, useRef, useEffect } from 'react';
import PanicAlertModal from './PanicAlertModal';
import ComplainModal from './ComplainModal';
import ReportLostItemModal from './ReportLostItemModal';


// Usage: <QuickActionsButton isLoggedIn={true} userRole="tourist" />

const QuickActionsButton = ({ isLoggedIn, userRole }) => {
  const [open, setOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'panic' | 'complain' | 'lost' | null
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

if (!isLoggedIn) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={menuRef}>
      <button
        className="bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200"
        title="Quick Actions"
        aria-label="Quick Actions"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={`block transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      {open && !activeModal && (
        <div className="absolute bottom-16 right-0 flex flex-col items-end gap-2 z-50">
          <button
            className="bg-white border border-gray-200 shadow-lg rounded-full px-5 py-3 hover:bg-red-100 text-red-600 font-semibold flex items-center justify-between gap-2 transition-transform transform translate-y-0 animate-slide-up whitespace-nowrap"
            style={{ animationDelay: '0.1s' }}
            onClick={() => setActiveModal('panic')}
          >
            Send Panic Alert
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
            </svg>
          </button>
          <button
            className="bg-white border border-gray-200 shadow-lg rounded-full px-5 py-3 hover:bg-yellow-100 text-yellow-700 font-semibold flex items-center justify-between gap-2 transition-transform transform translate-y-0 animate-slide-up whitespace-nowrap"
            style={{ animationDelay: '0.2s' }}
            onClick={() => setActiveModal('complain')}
          >
            Complain
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.994-1.85l.007-.15V6c0-1.054-.816-1.918-1.85-1.994L18.222 4H6.364c-1.054 0-1.918.816-1.994 1.85L4.364 6v12c0 1.054.816 1.918 1.85 1.994l.15.006z" />
            </svg>
          </button>
          <button
            className="bg-white border border-gray-200 shadow-lg rounded-full px-5 py-3 hover:bg-blue-100 text-blue-700 font-semibold flex items-center justify-between gap-2 transition-transform transform translate-y-0 animate-slide-up whitespace-nowrap"
            style={{ animationDelay: '0.3s' }}
            onClick={() => setActiveModal('lost')}
          >
            Report Lost Item
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-4 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m4 4v6m-4 0h8" />
            </svg>
          </button>
        </div>
      )}

      {/* Panic Alert Modal */}
      {activeModal === 'panic' && (
        <PanicAlertModal onClose={() => { setActiveModal(null); setOpen(false); }} />
      )}

      {/* Complain Modal */}
      {activeModal === 'complain' && (
        <ComplainModal onClose={() => { setActiveModal(null); setOpen(false); }} />
      )}

      {/* Report Lost Item Modal */}
      {activeModal === 'lost' && (
        <ReportLostItemModal onClose={() => { setActiveModal(null); setOpen(false); }} />
      )}
    </div>
  );
};

export default QuickActionsButton;

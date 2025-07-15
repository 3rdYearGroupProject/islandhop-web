import React from 'react';

const JoinPoolModal = ({ open, onClose, participants, onRequestJoin }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-primary-700">Request to Join Pool</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Participants</h3>
          <div className="flex flex-wrap gap-3 mb-2">
            {participants.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-primary-50 px-3 py-1 rounded-full">
                <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                <span className="text-sm font-medium text-primary-700">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onRequestJoin}
          className="w-full py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 mt-2"
        >
          Request to Join
        </button>
      </div>
    </div>
  );
};

export default JoinPoolModal;

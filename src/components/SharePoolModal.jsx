import React, { useState } from 'react';

const SharePoolModal = ({ open, onClose, participants, onInvite }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteList, setInviteList] = useState([]);

  const handleAddEmail = () => {
    if (inviteEmail && !inviteList.includes(inviteEmail)) {
      setInviteList([...inviteList, inviteEmail]);
      setInviteEmail('');
    }
  };

  const handleInvite = () => {
    if (onInvite) {
      onInvite(inviteList);
    }
    setInviteList([]);
    onClose();
  };

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
        <h2 className="text-2xl font-bold mb-4 text-primary-700">Share Pool</h2>
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
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Invite by Email</label>
          <div className="flex gap-2 mb-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={handleAddEmail}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
            >
              Add
            </button>
          </div>
          {inviteList.length > 0 && (
            <div className="mb-2">
              <span className="text-xs text-gray-500">To be invited:</span>
              <ul className="list-disc ml-5 mt-1 text-sm">
                {inviteList.map((email, idx) => (
                  <li key={idx}>{email}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleInvite}
          className="w-full py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 mt-2"
        >
          Send Invites
        </button>
      </div>
    </div>
  );
};

export default SharePoolModal;

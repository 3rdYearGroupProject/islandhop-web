import React from 'react';

const ReportIssueModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="text-2xl">&times;</span>
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900">Report an Issue</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
              placeholder="Describe the issue you are facing..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            onClick={e => { e.preventDefault(); onClose(); }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssueModal;

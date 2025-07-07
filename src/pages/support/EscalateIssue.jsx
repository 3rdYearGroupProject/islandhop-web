import React, { useState } from 'react';
import { 
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  PaperClipIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const EscalateIssue = () => {
  const [ticket] = useState({
    id: 'TCK-20250621-0012',
    title: 'Driver did not arrive at pickup location',
    createdAt: '2025-06-21 09:14',
    assignedTo: 'Agent Samantha',
    description: 'Tourist reported that the assigned driver did not arrive at the scheduled pickup location in Colombo. The tourist waited for 30 minutes and had to book another ride.',
    tourist: {
      name: 'Ayesha Fernando',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      role: 'Tourist',
      email: 'ayesha.fernando@email.com',
      phone: '+94 77 123 4567',
    },
    driver: {
      name: 'Nuwan Perera',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      role: 'Driver',
      email: 'nuwan.perera@email.com',
      phone: '+94 76 987 6543',
    },
  });

  const [notes, setNotes] = useState('');
  const [screenshots, setScreenshots] = useState([]);
  const [escalated, setEscalated] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setScreenshots(prev => [...prev, ...files.map(file => ({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    }))]);
  };

  const handleEscalate = () => {
    if (!notes.trim()) {
      alert('Please provide escalation notes');
      return;
    }
    setEscalated(true);
    alert('Issue has been escalated to management!');
  };

  const removeScreenshot = (index) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Escalate Issue
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Escalate complex issues to management for resolution
        </p>
      </div>

      {escalated && (
        <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-success-600 dark:text-success-400" />
            <div>
              <h3 className="text-sm font-medium text-success-800 dark:text-success-300">
                Issue Successfully Escalated
              </h3>
              <p className="text-sm text-success-700 dark:text-success-400 mt-1">
                The issue has been escalated to management and they will be notified immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-warning-600 dark:text-warning-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {ticket.title}
                </h2>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                escalated 
                  ? 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300'
                  : 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300'
              }`}>
                {escalated ? 'Escalated' : 'Pending'}
              </span>
            </div>
            
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Ticket ID: {ticket.id}</p>
              <p>Created: {ticket.createdAt}</p>
              <p>Assigned to: {ticket.assignedTo}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300">{ticket.description}</p>
            </div>
          </div>

          {/* Escalation Form */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Escalation Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Escalation Notes <span className="text-danger-500">*</span>
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide detailed reasoning for escalation, steps taken, and recommended actions..."
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500"
                  disabled={escalated}
                />
              </div>

              <div>
                <label htmlFor="screenshots" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Supporting Documents/Screenshots
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-secondary-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white dark:bg-secondary-800 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleFileChange}
                          disabled={escalated}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, PDF up to 10MB each
                    </p>
                  </div>
                </div>
              </div>

              {screenshots.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Uploaded Files
                  </h4>
                  <div className="space-y-2">
                    {screenshots.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-secondary-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <PaperClipIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        {!escalated && (
                          <button
                            onClick={() => removeScreenshot(index)}
                            className="text-danger-600 hover:text-danger-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!escalated && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleEscalate}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 transition-colors duration-200"
                >
                  <ShieldExclamationIcon className="h-4 w-4 mr-2" />
                  Escalate to Management
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - User Profiles */}
        <div className="space-y-6">
          {/* Tourist Profile */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex flex-col items-center text-center">
              <img
                src={ticket.tourist.avatar}
                alt={ticket.tourist.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-secondary-600 mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {ticket.tourist.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {ticket.tourist.role}
              </p>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>{ticket.tourist.email}</p>
                <p>{ticket.tourist.phone}</p>
              </div>
            </div>
          </div>

          {/* Driver Profile */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex flex-col items-center text-center">
              <img
                src={ticket.driver.avatar}
                alt={ticket.driver.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-secondary-600 mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {ticket.driver.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {ticket.driver.role}
              </p>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>{ticket.driver.email}</p>
                <p>{ticket.driver.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscalateIssue;

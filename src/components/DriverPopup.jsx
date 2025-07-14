import React from 'react';

const DriverPopup = ({ newDriver, setNewDriver, addDriver }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addDriver();
      }}
      className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-md border border-neutral-200 dark:border-secondary-700"
    >
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Driver Name"
          value={newDriver.name}
          onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
          required
          className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white"
        />
        <input
          type="text"
          placeholder="License Number"
          value={newDriver.license}
          onChange={(e) => setNewDriver({ ...newDriver, license: e.target.value })}
          required
          className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white"
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={newDriver.contact}
          onChange={(e) => setNewDriver({ ...newDriver, contact: e.target.value })}
          required
          className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white"
        />
      </div>
      <button type="submit" className="mt-6 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
        Add Driver
      </button>
    </form>
  );
};

export default DriverPopup;

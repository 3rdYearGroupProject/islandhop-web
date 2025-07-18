import React from 'react';

const GuidePopup = ({ newGuide, setNewGuide, addGuide }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addGuide();
      }}
      className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-md border border-neutral-200 dark:border-secondary-700"
    >
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Guide Name"
          value={newGuide.name}
          onChange={(e) => setNewGuide({ ...newGuide, name: e.target.value })}
          required
          className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white"
        />
        <input
          type="text"
          placeholder="Expertise"
          value={newGuide.expertise}
          onChange={(e) => setNewGuide({ ...newGuide, expertise: e.target.value })}
          required
          className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white"
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={newGuide.contact}
          onChange={(e) => setNewGuide({ ...newGuide, contact: e.target.value })}
          required
          className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white"
        />
      </div>
      <button type="submit" className="mt-6 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
        Add Guide
      </button>
    </form>
  );
};

export default GuidePopup;

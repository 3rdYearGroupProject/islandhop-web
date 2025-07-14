import React from 'react';

const VehiclePopup = ({ newVehicle, setNewVehicle, addVehicle }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addVehicle();
      }}
      className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-md border border-neutral-200 dark:border-secondary-700"
    >
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Type Name"
          value={newVehicle.typeName}
          onChange={(e) => setNewVehicle({ ...newVehicle, typeName: e.target.value })}
          required
          className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white"
        />
        <input
          type="number"
          placeholder="Capacity"
          value={newVehicle.capacity}
          onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
          required
          className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white"
        />
        <input
          type="text"
          placeholder="Description"
          value={newVehicle.description}
          onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
          className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white"
        />
        <input
          type="text"
          placeholder="Fuel Type"
          value={newVehicle.fuelType}
          onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
          className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white"
        />
        <input
          type="number"
          placeholder="Price per KM"
          value={newVehicle.pricePerKm}
          onChange={(e) => setNewVehicle({ ...newVehicle, pricePerKm: e.target.value })}
          required
          className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white"
        />
        <label className="flex items-center text-neutral-900 dark:text-white">
          <input
            type="checkbox"
            checked={newVehicle.isAvailable}
            onChange={(e) => setNewVehicle({ ...newVehicle, isAvailable: e.target.checked })}
            className="mr-2"
          />
          Is Available
        </label>
      </div>
      <button type="submit" className="mt-6 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
        Add Vehicle
      </button>
    </form>
  );
};

export default VehiclePopup;

import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';

const CreatePoolModal = ({ isOpen, onClose, onCreatePool }) => {
  const [formData, setFormData] = useState({
    name: '',
    poolSize: 4
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Pool name is required';
    } else if (formData.name.length > 60) {
      newErrors.name = 'Pool name must be 60 characters or less';
    }
    if (!formData.poolSize || formData.poolSize < 2) {
      newErrors.poolSize = 'Select at least 2 participants';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onCreatePool(formData);
      // Reset form
      setFormData({ name: '', poolSize: 4 });
      setErrors({});
      onClose();
    }
  };

  const handleCancel = () => {
    // Reset form and close
    setFormData({ name: '', poolSize: 4 });
    setErrors({});
    onClose();
  };

  const remainingNameChars = 60 - formData.name.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Create Your Travel Pool"
      size="md"
      showCloseButton={true}
    >
      <div className="space-y-6">
        <form onSubmit={handleSubmit}>
          {/* Pool Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              What should we call your travel pool?
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Sri Lanka Adventure Squad"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              className="w-full text-lg"
            />
            <div className="flex justify-between items-center mt-1">
              {errors.name && (
                <span className="text-sm text-red-600">{errors.name}</span>
              )}
              <span className={`text-sm ml-auto ${remainingNameChars < 10 ? 'text-red-600' : 'text-gray-500'}`}>
                {remainingNameChars}/60 characters
              </span>
            </div>
          </div>

          {/* Pool Size (Slider) */}
          <div className="mb-6">
            <label htmlFor="poolSize" className="block text-sm font-medium text-gray-900 mb-2">
              How many participants?
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 font-medium w-8 text-right">2</span>
              <div className="flex-1 relative">
                <input
                  id="poolSize"
                  name="poolSize"
                  type="range"
                  min={2}
                  max={8}
                  step={1}
                  value={formData.poolSize}
                  onChange={e => handleInputChange({ target: { name: 'poolSize', value: Number(e.target.value) } })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all slider-blue-thumb"
                />

                <div className="flex justify-between text-xs text-gray-400 mt-1 absolute w-full">
                  {[2,3,4,5,6,7,8].map((n, index) => (
                    <span key={n} className="transform -translate-x-1/2" style={{ left: `${(index / 6) * 100}%` }}>
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium w-8 text-left">8</span>
              <span className="ml-4 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-base font-semibold border border-blue-200 shadow-sm">
                {formData.poolSize}
              </span>
            </div>
            {errors.poolSize && (
              <span className="text-sm text-red-600 mt-1 block">{errors.poolSize}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
            <Button
              type="button"
              onClick={handleCancel}
              variant="ghost"
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={!formData.name.trim()}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                !formData.name.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Create Pool
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreatePoolModal;

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

          {/* Pool Size (Slider) removed as requested */}

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

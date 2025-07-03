import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';

const CreateTripModal = ({ isOpen, onClose, onCreateTrip }) => {
  const [formData, setFormData] = useState({
    name: '',
    destination: ''
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
      newErrors.name = 'Trip name is required';
    } else if (formData.name.length > 80) {
      newErrors.name = 'Trip name must be 80 characters or less';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCreateTrip(formData);
      // Reset form
      setFormData({ name: '', destination: '' });
      setErrors({});
      onClose();
    }
  };

  const handleCancel = () => {
    // Reset form and close
    setFormData({ name: '', destination: '' });
    setErrors({});
    onClose();
  };

  const remainingChars = 80 - formData.name.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Create a trip"
      size="md"
      showCloseButton={true}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
            Trip name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="e.g., Summer vacation in Greece"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            className="w-full"
          />
          <div className="flex justify-between items-center mt-1">
            {errors.name && (
              <span className="text-sm text-red-600">{errors.name}</span>
            )}
            <span className={`text-sm ml-auto ${remainingChars < 10 ? 'text-red-600' : 'text-gray-500'}`}>
              {remainingChars}/80 max characters
            </span>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
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
            disabled={!formData.name.trim() || !formData.destination.trim()}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              !formData.name.trim() || !formData.destination.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-800 text-white hover:bg-primary-900'
            }`}
          >
            Create trip
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTripModal;

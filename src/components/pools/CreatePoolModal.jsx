import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';

const CreatePoolModal = ({ isOpen, onClose, onCreatePool }) => {
  const [formData, setFormData] = useState({
    name: '',
    poolSize: 4,
    privacy: 'public', // default to public
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
      setFormData({ name: '', poolSize: 4, privacy: 'public' });
      setErrors({});
      onClose();
    }
  };

  const handleCancel = () => {
    // Reset form and close
    setFormData({ name: '', poolSize: 4, privacy: 'public' });
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

          {/* Pool Privacy Option - Styled Button Group */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Pool Privacy
            </label>
            <div className="flex w-full gap-3">
              <button
                type="button"
                className={`w-1/2 px-4 py-3 rounded-lg border-2 font-semibold transition-colors duration-150 focus:outline-none text-center flex flex-col items-center justify-center
                  ${formData.privacy === 'public' ? 'bg-blue-100 text-blue-900 border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:bg-primary-50'}`}
                onClick={() => setFormData(prev => ({ ...prev, privacy: 'public' }))}
                aria-pressed={formData.privacy === 'public'}
              >
                <span className="font-bold text-base">Public</span>
                <span className={`text-xs mt-1 ${formData.privacy === 'public' ? 'text-blue-800' : 'text-gray-500'}`}>Visible to everyone</span>
              </button>
              <button
                type="button"
                className={`w-1/2 px-4 py-3 rounded-lg border-2 font-semibold transition-colors duration-150 focus:outline-none text-center flex flex-col items-center justify-center
                  ${formData.privacy === 'private' ? 'bg-blue-100 text-blue-900 border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:bg-primary-50'}`}
                onClick={() => setFormData(prev => ({ ...prev, privacy: 'private' }))}
                aria-pressed={formData.privacy === 'private'}
              >
                <span className="font-bold text-base">Private</span>
                <span className={`text-xs mt-1 ${formData.privacy === 'private' ? 'text-blue-800' : 'text-gray-500'}`}>Accessible by invite</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Choose who can join your pool.</p>
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

import React, { useState } from "react";
import {
  CheckBadgeIcon,
  XMarkIcon,
  UserIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  IdentificationIcon,
  GlobeAltIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const VerificationForm = ({ entity, onVerify, onCancel }) => {
  const [formData, setFormData] = useState({
    entityId: entity.id,
    documents: entity.documents.map((doc) => ({
      type: doc.type,
      url: doc.url,
      name: "",
      expiryDate: "",
    })),
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedDocuments = [...prev.documents];
      updatedDocuments[index][name] = value;
      return { ...prev, documents: updatedDocuments };
    });

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    formData.documents.forEach((doc, index) => {
      if (!doc.name.trim()) {
        newErrors[`name-${index}`] = "Document name is required";
      }
      if (!doc.expiryDate) {
        newErrors[`expiryDate-${index}`] = "Expiry date is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // await axios.post('/api/verify', formData);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onVerify(formData);
    } catch (error) {
      console.error("Error verifying entity:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {entity.type === "guide"
                ? "Guide Verification"
                : "Driver Verification"}
            </h1>
            <p className="text-gray-600">
              Enter verification details for{" "}
              {entity.type === "guide"
                ? "guide certificates"
                : "driver licenses"}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <XMarkIcon className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <CheckBadgeIcon className="h-5 w-5 mr-2" />
          Verification Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.documents.map((doc, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">
                  {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} Document
                </span>
                <button
                  onClick={() => window.open(doc.url, "_blank")}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={doc.name}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="Enter document name"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[`name-${index}`]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors[`name-${index}`] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[`name-${index}`]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={doc.expiryDate}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[`expiryDate-${index}`]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors[`expiryDate-${index}`] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[`expiryDate-${index}`]}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              placeholder="Any additional verification notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <CheckBadgeIcon className="h-4 w-4 mr-2" />
                  Verify
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationForm;

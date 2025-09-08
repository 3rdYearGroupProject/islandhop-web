import React from 'react';
import { X, Square, Gauge } from 'lucide-react';

const ConfirmEndModal = ({ isOpen, onClose, onConfirm, driverMeterReading, startMeterReading, deductAmount = 0, additionalNote = "" }) => {

  const handleConfirm = () => {
    onConfirm(driverMeterReading);
    onClose();
  };

  // Calculate distance traveled with deduction
  const grossDistance = driverMeterReading && startMeterReading 
    ? parseFloat(driverMeterReading.replace(/,/g, '')) - parseFloat(startMeterReading.replace(/,/g, ''))
    : 0;
  
  const totalDistance = grossDistance - (deductAmount || 0);
  
  const formattedGrossDistance = grossDistance.toLocaleString();
  const formattedTotalDistance = totalDistance.toLocaleString();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Square className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Trip End</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                The driver has provided the following final odometer reading to end today's trip:
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Gauge className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Final Odometer Reading</p>
                    <p className="text-2xl font-bold text-gray-900">{driverMeterReading} km</p>
                  </div>
                </div>
                
                {/* Trip Summary */}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <p className="text-gray-600">Start Reading</p>
                      <p className="font-semibold text-gray-900">{startMeterReading} km</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">End Reading</p>
                      <p className="font-semibold text-gray-900">{driverMeterReading} km</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Gross Distance</p>
                      <p className="font-semibold text-gray-900">{formattedGrossDistance} km</p>
                    </div>
                    {deductAmount > 0 && (
                      <div className="flex justify-between">
                        <p className="text-gray-600">Deduct Amount</p>
                        <p className="font-semibold text-red-600">-{deductAmount} km</p>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <p className="text-gray-700 font-medium">Total Distance</p>
                      <p className="font-bold text-green-600">{formattedTotalDistance} km</p>
                    </div>
                  </div>
                  
                  {/* Calculation Formula */}
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium mb-1">Calculation:</p>
                    <p className="text-xs text-blue-600">
                      Total Distance = (End Reading - Start Reading) - Deduct Amount
                    </p>
                    <p className="text-xs text-blue-600">
                      {formattedTotalDistance} km = ({driverMeterReading} - {startMeterReading}) - {deductAmount || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Additional Note */}
              {additionalNote && additionalNote.trim() && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-yellow-800 mb-1">Additional Note:</p>
                  <p className="text-sm text-yellow-700">{additionalNote}</p>
                </div>
              )}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Note:</strong> Confirming will mark today's trip as completed and record the total distance traveled.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Confirm End
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEndModal;

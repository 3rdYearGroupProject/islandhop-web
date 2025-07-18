import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';

const PoolProgressBar = ({ poolName, onBack, currentStep = 3, completedSteps = [] }) => {
  const steps = [
    { number: 1, label: 'Name' },
    { number: 2, label: 'Dates' },
    { number: 3, label: 'Preferences' },
    { number: 4, label: 'Itinerary' }
  ];

  const getStepDescription = (step) => {
    switch(step) {
      case 1: return 'Choose your pool name';
      case 2: return 'Select your travel dates';
      case 3: return 'Set your preferences';
      case 4: return 'Plan your itinerary';
      default: return 'Plan your pool';
    }
  };

  const getStepStyle = (stepNumber) => {
    const isCompleted = completedSteps.includes(stepNumber);
    const isCurrent = currentStep === stepNumber;
    
    if (isCompleted) {
      return {
        circle: 'bg-green-600 text-white border-2 border-green-600 shadow-sm',
        text: 'text-gray-900',
        connector: 'bg-green-600'
      };
    } else if (isCurrent) {
      return {
        circle: 'bg-blue-600 text-white border-2 border-blue-600 ring-4 ring-blue-100 shadow-lg',
        text: 'text-blue-600 font-bold',
        connector: 'bg-gray-200'
      };
    } else {
      return {
        circle: 'bg-gray-100 text-gray-500 border-2 border-gray-200',
        text: 'text-gray-500',
        connector: 'bg-gray-200'
      };
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {poolName || 'New Pool'}
              </h1>
              <p className="text-gray-600 mt-1">Step {currentStep} of 4 - {getStepDescription(currentStep)}</p>
            </div>
          </div>
          
          {/* Dynamic Progress Indicator */}
          <div className="hidden md:flex items-center space-x-1">
            {steps.map((step, index) => {
              const styles = getStepStyle(step.number);
              const isLastStep = index === steps.length - 1;
              
              return (
                <React.Fragment key={step.number}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 ${styles.circle} rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300`}>
                      {completedSteps.includes(step.number) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${styles.text} transition-colors duration-300`}>
                      {step.label}
                    </span>
                  </div>
                  {!isLastStep && (
                    <div className={`w-8 h-1 mx-2 ${
                      completedSteps.includes(step.number) || currentStep > step.number 
                        ? 'bg-green-600' 
                        : styles.connector
                    } rounded transition-colors duration-300`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolProgressBar;

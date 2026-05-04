import React from 'react';

const Stepper = ({ currentStep }) => {
  // Define your steps. 
  // Step 1: Primary Info, Step 2: Personal, Step 3: Education
  const steps = [
    { id: 1, label: "Primary" },
    { id: 2, label: "Personal" },
    { id: 3, label: "Education and Experience" }
  ];

  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* THE STEP DOT */}
          <div className="step">
            <div className={`step-dot ${
              currentStep === step.id ? 'active' : 
              currentStep > step.id ? 'done' : ''
            }`}>
              {currentStep > step.id ? '✓' : step.id}
            </div>
            <span className={`step-label ${
              currentStep === step.id ? 'active' : 
              currentStep > step.id ? 'done' : ''
            }`}>
              {step.label}
            </span>
          </div>

          {/* THE CONNECTOR LINE (Show between steps, but not after the last one) */}
          {index < steps.length - 1 && (
            <div className={`step-line ${currentStep > step.id ? 'done' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;
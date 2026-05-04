import { useContext } from "react";
import { FormContext } from "../../context/FormContext";

const steps = ["Primary Info", "Personal Details", "Education"];

const FormStepper = () => {
  const { formData } = useContext(FormContext);

  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = formData.step === stepNumber;
        const isDone = formData.step > stepNumber;

        return (
          <div className="step" key={step}>
            <div
              className={`step-dot ${
                isDone ? "done" : isActive ? "active" : ""
              }`}
            >
              {isDone ? "✓" : stepNumber}
            </div>

            <div
              className={`step-label ${
                isDone ? "done" : isActive ? "active" : ""
              }`}
            >
              {step}
            </div>

            {index < steps.length - 1 && <div className="step-line"></div>}
          </div>
        );
      })}
    </div>
  );
};

export default FormStepper;
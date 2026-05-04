import { useContext } from "react";
import { FormContext } from "../../context/FormContext";
import PrimaryInfoForm from "../../components/registration/PrimaryInfoForm";
import PersonalDetailsForm from "../../components/registration/PersonalDetailsForm";
import EducationDetailsForm from "../../components/registration/EducationDetailsForm";

const RegisterPage = () => {
  const { formData } = useContext(FormContext);

  return (
    <>
      {formData.step === 1 && <PrimaryInfoForm />}
      {formData.step === 2 && <PersonalDetailsForm />}
      {formData.step === 3 && <EducationDetailsForm />}
    </>
  );
};

export default RegisterPage;
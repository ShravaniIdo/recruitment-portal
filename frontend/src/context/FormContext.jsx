import { createContext, useState } from "react";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    step: 1, //which page directly opens on running the frontend server
    primary: {},
    personal: {},
    education: {},
  });

  const updateForm = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  return (
    <FormContext.Provider value={{ formData, setFormData, updateForm }}>
      {children}
    </FormContext.Provider>
  );
};

import { useContext, useState, useEffect } from "react";
import { FormContext } from "../../context/FormContext";
import FormStepper from "./FormStepper";

const PersonalDetailsForm = () => {
  const { formData, setFormData } = useContext(FormContext);

  // 1. State initialized to match your HTML exactly
  const [data, setData] = useState(formData.personal || {
    gender: "",
    fatherName: "",
    fatherOcc: "",
    motherName: "",
    motherOcc: "",
    permAddr: "",
    corrAddr: "",
    sameAddr: false,
  });

  // 2. Sync data on load if they clicked "Back" from Step 3
  useEffect(() => {
    if (formData.personal && Object.keys(formData.personal).length > 0) {
      setData(formData.personal);
    }
  }, [formData.personal]);

  // 3. Handle Custom Toggle for Addresses
  const toggleSameAddr = () => {
    setData((prev) => ({
      ...prev,
      sameAddr: !prev.sameAddr,
      // If toggling ON, instantly copy the permanent address over
      corrAddr: !prev.sameAddr ? prev.permAddr : prev.corrAddr, 
    }));
  };


  //    Submit & Validations
  // const handleSubmit = async () => {
  //   // Before validating, sync addresses just in case
  //   let finalData = { ...data };
  //   if (finalData.sameAddr) {
  //     finalData.corrAddr = finalData.permAddr;
  //   }

  //   // ... (keep your gender, fatherName, motherName validations here) ...

  //   // 🏠 1. PERMANENT ADDRESS VALIDATION (Min 15 Characters)
  //   if (!finalData.permAddr || finalData.permAddr.trim().length < 15) {
  //     alert("Please enter a valid Permanent Address (at least 15 characters).");
  //     return;
  //   }

  //   // 🏠 2. CORRESPONDENCE ADDRESS VALIDATION (Min 15 Characters)
  //   // If the toggle is OFF, they MUST enter a correspondence address of at least 15 chars
  //   if (!finalData.sameAddr && (!finalData.corrAddr || finalData.corrAddr.trim().length < 15)) {
  //     alert("Please enter a valid Correspondence Address (at least 15 characters).");
  //     return;
  //   }

  //   try {
  //     // Save to context and move to Step 3 (Education)
  //     setFormData((prev) => ({
  //       ...prev,
  //       personal: finalData,
  //       step: 3,
  //     }));
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error saving personal details. Please try again.");
  //   }
  // };

  const handleSubmit = async () => {
    let finalData = { ...data };
    if (finalData.sameAddr) {
      finalData.corrAddr = finalData.permAddr;
    }

    // --- NEW NAME VALIDATION LOGIC ---
    // This regex allows only English letters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;

    // Validate Father's Name
    if (!finalData.fatherName || finalData.fatherName.trim().length < 2) {
      alert("Please enter Father's Full Name.");
      return;
    }
    if (!nameRegex.test(finalData.fatherName)) {
      alert("Father's Name should only contain letters.");
      return;
    }

    // Validate Mother's Name
    if (!finalData.motherName || finalData.motherName.trim().length < 2) {
      alert("Please enter Mother's Full Name.");
      return;
    }
    if (!nameRegex.test(finalData.motherName)) {
      alert("Mother's Name should only contain letters.");
      return;
    }

    // --- EXISTING GENDER VALIDATION ---
    if (!finalData.gender) {
        alert("Please select a gender.");
        return;
    }

    // --- ADDRESS VALIDATIONS ---
    if (!finalData.permAddr || finalData.permAddr.trim().length < 15) {
      alert("Please enter a valid Permanent Address (at least 15 characters).");
      return;
    }

    if (!finalData.sameAddr && (!finalData.corrAddr || finalData.corrAddr.trim().length < 15)) {
      alert("Please enter a valid Correspondence Address (at least 15 characters).");
      return;
    }

    try {
      setFormData((prev) => ({
        ...prev,
        personal: finalData,
        step: 3,
      }));
    } catch (err) {
      console.error(err);
      alert("Error saving personal details. Please try again.");
    }
  };




  return (
    <>

      <div className="card">
        <div className="card-title">Personal Details</div>
        <div className="card-sub">Family and address information</div>

        <div className="form-grid">
          
          {/* GENDER */}
          <div className="form-group full">
            <label>Gender <span className="req">*</span></label>
            <div className="radio-group">
              {["Male", "Female", "Non-binary", "Prefer not to say"].map((g) => (
                <label
                  key={g}
                  className={`radio-pill ${data.gender === g ? "selected" : ""}`}
                  onClick={() => setData({ ...data, gender: g })}
                >
                  <input type="radio" name="gender" value={g} style={{display: 'none'}} />
                  {g}
                </label>
              ))}
            </div>
          </div>

          {/* FATHER'S DETAILS */}
          <div className="form-group">
            <label>Father's Full Name <span className="req">*</span></label>
            <input
              type="text"
              placeholder="e.g. Ramesh Sharma"
              value={data.fatherName}
              onChange={(e) => setData({ ...data, fatherName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Father's Occupation</label>
            <input
              type="text"
              placeholder="e.g. Engineer (Optional)"
              value={data.fatherOcc}
              onChange={(e) => setData({ ...data, fatherOcc: e.target.value })}
            />
          </div>

          {/* MOTHER'S DETAILS */}
          <div className="form-group">
            <label>Mother's Full Name <span className="req">*</span></label>
            <input
              type="text"
              placeholder="e.g. Sunita Sharma"
              value={data.motherName}
              onChange={(e) => setData({ ...data, motherName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Mother's Occupation</label>
            <input
              type="text"
              placeholder="e.g. Teacher (Optional)"
              value={data.motherOcc}
              onChange={(e) => setData({ ...data, motherOcc: e.target.value })}
            />
          </div>

          {/* PERMANENT ADDRESS */}
          <div className="form-group full">
            <label>Permanent Address <span className="req">*</span></label>
            <textarea
              placeholder="House no., Street, City, State, PIN"
              value={data.permAddr}
              onChange={(e) => setData({ ...data, permAddr: e.target.value })}
            />
          </div>

          {/* CUSTOM TOGGLE SWITCH */}
          <div className="form-group full">
            <div className="toggle-row" onClick={toggleSameAddr}>
              <div className={`toggle-box ${data.sameAddr ? "on" : ""}`} id="toggleBox"></div>
              <span className="toggle-label">Correspondence address same as permanent address</span>
            </div>
          </div>

          {/* CONDITIONAL CORRESPONDENCE ADDRESS */}
          {!data.sameAddr && (
            <div className="form-group full">
              <label>Correspondence Address <span className="req">*</span></label>
              <textarea
                placeholder="House no., Street, City, State, PIN"
                value={data.corrAddr}
                onChange={(e) => setData({ ...data, corrAddr: e.target.value })}
              />
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="btn-row">
          <button
            className="btn btn-ghost"
            onClick={() => setFormData((prev) => ({ ...prev, step: 1 }))}
          >
            ← Back
          </button>

          <button className="btn btn-primary" onClick={handleSubmit}>
            Continue →
          </button>
        </div>
      </div>
    </>
  );
};

export default PersonalDetailsForm;
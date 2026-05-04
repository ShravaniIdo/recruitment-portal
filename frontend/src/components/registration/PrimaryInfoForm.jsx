import { useContext, useState, useEffect } from "react";
import { FormContext } from "../../context/FormContext";
import FormStepper from "./FormStepper";
// import { createPrimary } from "../../services/candidate.api";

const PrimaryInfoForm = () => {
  const { formData, setFormData } = useContext(FormContext);

  // 1. Initialize from context to persist data when clicking "Back"
  // const [data, setData] = useState(formData.primary || {
  //   fullName: "",
  //   phone: "",
  //   email: "",
  //   resume: null,
  // });

  const [data, setData] = useState({
  fullName: formData.primary?.fullName || "",
  phone: formData.primary?.phone || "",
  email: formData.primary?.email || "",
  resume: formData.primary?.resume || null,
  });

  const [fileName, setFileName] = useState("");

  // 2. Sync data on load
  useEffect(() => {
    if (formData.primary) {
  setData({
    fullName: formData.primary.fullName || "",
    phone: formData.primary.phone || "",
    email: formData.primary.email || "",
    resume: formData.primary.resume || null,
  });

  if (formData.primary.resume?.name) {
    setFileName(formData.primary.resume.name);
  }
}
  }, [formData.primary]);

  // 📁 File Upload Handler
  const handleFileChange = (file) => {
  if (!file) return;

  if (!data.fullName || !data.phone) {
    alert("Please enter Full Name and Phone Number first.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("File size should be less than 5MB");
    return;
  }

  const cleanName = data.fullName.replace(/\s+/g, "");
  const extension = file.name.split(".").pop();

  const newFileName = `${cleanName}_${data.phone}_Resume.${extension}`;

  const renamedFile = new File([file], newFileName, {
    type: file.type,
    lastModified: file.lastModified,
  });

  setFileName(newFileName);

  setData({
    ...data,
    resume: renamedFile,
  });
};
  // const handleFileChange = (file) => {
  //   if (!file) return;

  //   if (file.size > 5 * 1024 * 1024) {
  //     alert("File size should be less than 5MB");
  //     return;
  //   }

  //   setFileName(file.name);
  //   setData({ ...data, resume: file });
  // };

//    Submit & API Call
  // const handleSubmit = async () => {
  //   // Standard Validations
  //   if (!data.fullName || !data.phone || !data.email) {
  //     alert("Please fill all required fields");
  //     return;
  //   }

  //   // Phone Validation (Exact 10 digits)
  //   if (data.phone.length !== 10) {
  //     alert("Phone number must be exactly 10 digits");
  //     return;
  //   }

  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(data.email)) {
  //     alert("Please enter a valid email address (e.g., yourname@email.com)");
  //     return;
  //   }

  //   if (!data.resume) {
  //     alert("Please upload your resume");
  //     return;
  //   }

  //   try {
  //     // 🛑 BACKEND CALL COMMENTED OUT
  //     // const res = await createPrimary(data);

  //     // Save to context and proceed
  //     setFormData((prev) => ({
  //       ...prev,
  //       primary: data,
  //       // 🛑 REAL ID COMMENTED OUT
  //       // candidateId: res.data.id, 
  //       candidateId: "mock-id-12345", // 🛠️ FAKE ID just to make the frontend work
  //       step: 2,
  //     }));
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error saving primary data. Please try again.");
  //   }
  // };

  const handleSubmit = async () => {
    // 1. Define Regex for letters and spaces only
    const nameRegex = /^[a-zA-Z\s]+$/;

    // 2. Basic Required Field Check
    if (!data.fullName || !data.phone || !data.email) {
      alert("Please fill all required fields");
      return;
    }

    // 3. FULL NAME VALIDATION (No special characters or numbers)
    if (!nameRegex.test(data.fullName)) {
      alert("Full Name should only contain letters.");
      return;
    }

    // 4. Phone Validation (Exact 10 digits)
    if (data.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    // 5. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!data.resume) {
      alert("Please upload your resume");
      return;
    }

    try {
      setFormData((prev) => ({
        ...prev,
        primary: data,
        // candidateId: "mock-id-12345", 
        step: 2,
      }));
    } catch (err) {
      console.error(err);
      alert("Error saving primary data.");
    }
  };

  return (
    <>

      <div className="card">
        <div className="card-title">Primary Information</div>
        <div className="card-sub">
          Basic contact details and your resume
        </div>

        <div className="form-grid">
          {/* NAME */}
          <div className="form-group">
            <label>
              Full Name <span className="req">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Priya Sharma"
              value={data.fullName}
              onChange={(e) =>
                setData({ ...data, fullName: e.target.value })
              }
            />
          </div>

          {/* PHONE */}
          <div className="form-group">
            <label>
              Phone Number <span className="req">*</span>
            </label>
            <input
                type="tel"
                placeholder="9876543210"
                value={data.phone}
                maxLength={10}
                onChange={(e) => {
                    // Only allow numeric input
                    const value = e.target.value.replace(/\D/g, ""); 
                    setData({ ...data, phone: value });
                }}
            />
          </div>

          {/* EMAIL */}
          <div className="form-group full">
            <label>
              Email Address <span className="req">*</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={data.email}
              onChange={(e) =>
                setData({ ...data, email: e.target.value })
              }
            />
          </div>

          {/* DROPZONE */}
          <div className="form-group full">
            <label>
              Resume / CV <span className="req">*</span>
            </label>

            <div
              className="dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileChange(e.dataTransfer.files[0]);
              }}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  handleFileChange(e.target.files[0])
                }
              />

              <span className="dropzone-icon">📄</span>

              <div className="dropzone-text">
                {fileName ? (
                  <div className="file-chip">
                    📎 {fileName}
                  </div>
                ) : (
                  <>
                    <strong>Click or drag & drop</strong> your resume
                    <br />
                    <span
                      style={{
                        fontSize: "12px",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      PDF, DOC, DOCX · Max 5MB
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="btn-row">
          <div></div>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Continue →
          </button>
        </div>
      </div>
    </>
  );
};

export default PrimaryInfoForm;
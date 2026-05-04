import { useContext, useState, useEffect } from "react";
import { FormContext } from "../../context/FormContext";
import FormStepper from "./FormStepper";
import { registerCandidate } from "../../services/candidate.api"; // ✅ added

const EducationDetailsForm = () => {
  const { formData, setFormData } = useContext(FormContext);

  // 1. Initialize with strict fallbacks (from our previous fix)
  const [data, setData] = useState({
    ssc: formData.education?.ssc || { board: "", cgpa: "", year: "" },
    hsc: formData.education?.hsc || { board: "", cgpa: "", year: "" },
    degree: formData.education?.degree || { college: "", stream: "", cgpa: "", year: "" },
    profile: formData.education?.profile || "fresher",
    experience: formData.education?.experience || [{ company: "", role: "", months: "" }],
  });

  // 2. Sync data safely on load
  useEffect(() => {
    if (formData.education && Object.keys(formData.education).length > 0) {
      setData({
        ssc: formData.education.ssc || { board: "", cgpa: "", year: "" },
        hsc: formData.education.hsc || { board: "", cgpa: "", year: "" },
        degree: formData.education.degree || { college: "", stream: "", cgpa: "", year: "" },
        profile: formData.education.profile || "fresher",
        experience: formData.education.experience || [{ company: "", role: "", months: "" }],
      });
    }
  }, [formData.education]);

  // --- HELPER FUNCTIONS FOR EXPERIENCE ARRAY ---
  const addExp = () => {
    setData((prev) => ({
      ...prev,
      experience: [...prev.experience, { company: "", role: "", months: "" }],
    }));
  };

  const removeExp = (index) => {
    setData((prev) => {
      const newExp = [...prev.experience];
      newExp.splice(index, 1);
      return { ...prev, experience: newExp };
    });
  };

  const updateExp = (index, field, value) => {
    setData((prev) => {
      const newExp = [...prev.experience];
      newExp[index][field] = value;
      return { ...prev, experience: newExp };
    });
  };

  // Generate Year Options (1990 to 2030)
  const years = [];
  for (let y = 2030; y >= 1990; y--) years.push(y);

  //    Submit & Validations
//    Submit & Validations
  const handleSubmit = async () => {
    // 🛑 1. MANDATORY CHECK: Ensure NO basic education field is left empty
    if (
      !data.ssc.board.trim() || !data.ssc.cgpa || !data.ssc.year ||
      !data.hsc.board.trim() || !data.hsc.cgpa || !data.hsc.year ||
      !data.degree.college.trim() || !data.degree.stream.trim() || !data.degree.cgpa || !data.degree.year
    ) {
      alert("Please fill out ALL mandatory fields for SSC, HSC, and Degree.");
      return;
    }

    // 🛑 2. STRICT YEAR TIMELINE LOGIC
    // Force the dropdown string values into true Numbers
    const sscYear = Number(data.ssc.year);
    const hscYear = Number(data.hsc.year);
    const degreeYear = Number(data.degree.year);

    // HSC vs SSC Validations
    if (hscYear <= sscYear) {
      alert(`Invalid Timeline: HSC year (${hscYear}) cannot be before or the same as SSC year (${sscYear}).`);
      return;
    }

    if (hscYear - sscYear < 2) {
      alert(`Invalid Timeline: There must be a gap of at least 2 years between SSC (${sscYear}) and HSC (${hscYear}).`);
      return;
    }

    // Degree vs HSC Validations
    if (degreeYear <= hscYear) {
      alert(`Invalid Timeline: Your Degree passing year (${degreeYear}) must be after your HSC passing year (${hscYear}).`);
      return;
    }

    // 🛑 3. EXPERIENCE CHECK: If experienced, ensure all array fields are filled
    if (data.profile === "experienced") {
      const isValid = data.experience.every(
        (e) => e.company.trim() && e.role.trim() && e.months
      );
      if (!isValid) {
        alert("Please complete all fields for your Work Experience (or switch to Fresher).");
        return;
      }
    }

    try {
      // ✅ Step 1: build the full formData snapshot with latest education
      // const fullFormData = {
      //   ...formData,
      //   education: data,
      // };
      const fullFormData = {
        primary: formData.primary,
        personal: formData.personal,
        education: data,
      };

      console.log("FINAL DATA SENT:", fullFormData); 

      // ✅ Step 2: call backend — saves all 3 forms to CANDIDATE_INFO
      const res = await registerCandidate(fullFormData);

      // ✅ Step 3: store real candidateId + applicationNo in context, move to step 4
      setFormData((prev) => ({
        ...prev,
        education:     data,
        candidateId:   res.candidateId,
        applicationNo: res.applicationNo,
        step: 4,
      }));
    } catch (err) {
      console.error(err);
      alert(err.message || "Registration failed. Please try again.");
    }
  };
  return (
    <>

      <div className="card">
        <div className="card-title">Education & Professional Details</div>
        <div className="card-sub">Academic qualifications and work experience</div>

        {/* ── SSC / 10TH ── */}
        <div className="edu-row">
          <div className="edu-row-title">
            <span className="edu-tag">SSC / 10th</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Board / School <span className="req">*</span></label>
              <input
                type="text"
                placeholder="e.g. Maharashtra State Board"
                value={data.ssc.board}
                onChange={(e) => setData({ ...data, ssc: { ...data.ssc, board: e.target.value } })}
              />
            </div>
            <div className="form-group">
              <label>Percentage / CGPA <span className="req">*</span></label>
              <input
                type="number"
                placeholder="e.g. 85.40"
                step="0.01"
                min="0"
                max="100"
                value={data.ssc.cgpa}
                onChange={(e) => setData({ ...data, ssc: { ...data.ssc, cgpa: e.target.value } })}
              />
            </div>
            <div className="form-group">
              <label>Passing Year <span className="req">*</span></label>
              <select
                value={data.ssc.year}
                onChange={(e) => setData({ ...data, ssc: { ...data.ssc, year: e.target.value } })}
              >
                <option value="">Select year</option>
                {years.map((y) => (
                  <option key={`ssc-${y}`} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── HSC / 12TH ── */}
        <div className="edu-row">
          <div className="edu-row-title">
            <span className="edu-tag">HSC / 12th</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Board / College <span className="req">*</span></label>
              <input
                type="text"
                placeholder="e.g. CBSE"
                value={data.hsc.board}
                onChange={(e) => setData({ ...data, hsc: { ...data.hsc, board: e.target.value } })}
              />
            </div>
            <div className="form-group">
              <label>Percentage / CGPA <span className="req">*</span></label>
              <input
                type="number"
                placeholder="e.g. 78.60"
                step="0.01"
                min="0"
                max="100"
                value={data.hsc.cgpa}
                onChange={(e) => setData({ ...data, hsc: { ...data.hsc, cgpa: e.target.value } })}
              />
            </div>
            <div className="form-group">
              <label>Passing Year <span className="req">*</span></label>
              <select
                value={data.hsc.year}
                onChange={(e) => setData({ ...data, hsc: { ...data.hsc, year: e.target.value } })}
              >
                <option value="">Select year</option>
                {years.map((y) => (
                  <option key={`hsc-${y}`} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── DEGREE / UG / PG ── */}
        <div className="edu-row">
          <div className="edu-row-title">
            <span className="edu-tag">Degree / UG / PG</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>College / University <span className="req">*</span></label>
              <input
                type="text"
                placeholder="e.g. Mumbai University"
                value={data.degree.college}
                onChange={(e) => setData({ ...data, degree: { ...data.degree, college: e.target.value } })}
              />
            </div>
            <div className="form-group">
              <label>Stream / Branch <span className="req">*</span></label>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                value={data.degree.stream}
                onChange={(e) => setData({ ...data, degree: { ...data.degree, stream: e.target.value } })}
              />
            </div>
            <div className="form-group">
              <label>CGPA / Percentage <span className="req">*</span></label>
              <input
                type="number"
                placeholder="e.g. 8.20"
                step="0.01"
                min="0"
                max="100"
                value={data.degree.cgpa}
                onChange={(e) => setData({ ...data, degree: { ...data.degree, cgpa: e.target.value } })}
              />
            </div>
            <div className="form-group">
              <label>Passing Year <span className="req">*</span></label>
              <select
                value={data.degree.year}
                onChange={(e) => setData({ ...data, degree: { ...data.degree, year: e.target.value } })}
              >
                <option value="">Select year</option>
                {years.map((y) => (
                  <option key={`deg-${y}`} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── CANDIDATE PROFILE RADIO ── */}
        <div style={{ margin: "1.25rem 0 .75rem" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text2)", display: "block", marginBottom: ".5rem" }}>
            Candidate Profile <span className="req">*</span>
          </label>
          <div className="radio-group">
            <label
              className={`radio-pill ${data.profile === "fresher" ? "selected" : ""}`}
              onClick={() => setData({ ...data, profile: "fresher" })}
            >
              <input type="radio" name="profile" style={{ display: "none" }} /> 🎓 Fresher
            </label>
            <label
              className={`radio-pill ${data.profile === "experienced" ? "selected" : ""}`}
              onClick={() => setData({ ...data, profile: "experienced" })}
            >
              <input type="radio" name="profile" style={{ display: "none" }} /> 💼 Experienced
            </label>
          </div>
        </div>

        {/* ── WORK EXPERIENCE (DYNAMIC ARRAY) ── */}
        {data.profile === "experienced" && (
          <div className="exp-section">
            <div className="exp-section-title">
              ⚡ Work Experience <span className="req">*</span>
            </div>
            
            {data.experience.map((exp, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.6)", borderRadius: "8px", padding: ".875rem", marginBottom: ".75rem", border: "1px solid #FDE68A" }}>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--warn)", marginBottom: ".5rem" }}>
                  Experience {i + 1}
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Company Name <span className="req">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Infosys Ltd."
                      value={exp.company}
                      onChange={(e) => updateExp(i, "company", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Designation / Role <span className="req">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Software Engineer"
                      value={exp.role}
                      onChange={(e) => updateExp(i, "role", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (months) <span className="req">*</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 24"
                      min="1"
                      value={exp.months}
                      onChange={(e) => updateExp(i, "months", e.target.value)}
                    />
                  </div>
                </div>

                {data.experience.length > 1 && (
                  <button
                    className="btn btn-ghost"
                    style={{ marginTop: ".5rem", fontSize: "12px", padding: "5px 10px" }}
                    onClick={() => removeExp(i)}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            ))}
            
            <button className="btn btn-ghost" style={{ fontSize: "13px" }} onClick={addExp}>
              + Add Another Company
            </button>
          </div>
        )}

        {/* ── BUTTONS ── */}
        <div className="btn-row" style={{ marginTop: "30px" }}>
          <button
          className="btn btn-ghost"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              education: data,   // ✅ SAVE DATA BEFORE GOING BACK
              step: 2,
            }))
          }
        > 
          ← Back
        </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit Registration →
          </button>
        </div>
      </div>
    </>
  );
};

export default EducationDetailsForm;
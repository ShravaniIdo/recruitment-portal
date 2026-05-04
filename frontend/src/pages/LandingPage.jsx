import { useContext, useState } from "react";
import { FormContext } from "../context/FormContext";

const LandingPage = () => {
  const { setFormData } = useContext(FormContext);
  const [agreed, setAgreed] = useState(false);

  const handleStartTest = async () => {
    if (!agreed) return alert("Please agree to the rules.");
    
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen().catch(() => {});
    }

    setFormData(prev => ({ ...prev, step: 5 }));
  };

  return (
    // <div className="card">
      <div className="card" style={{ 
      marginTop: "5rem", //  This pushes the card down from the Navbar
      width: "100%",
      boxSizing: "border-box" 
    }}>
      <div className="test-landing" style={{ padding: '0' }}></div>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem", color: "var(--navy)", fontFamily: "Syne" }}>
        Global Tech Assessment
      </h1>
      <p style={{ color: "var(--text2)", marginBottom: "2rem", fontSize: "0.95rem" }}>
        Please read the instructions carefully. Your session is monitored.
      </p>

      {/* Info Grid */}
      <div style={{ 
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", 
        gap: "1rem", marginBottom: "2rem", textAlign: "center" 
      }}>
        <div style={{ padding: "1rem", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--blue)" }}>15</div>
          <div style={{ fontSize: "12px", color: "var(--text3)" }}>Minutes</div>
        </div>
        <div style={{ padding: "1rem", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--blue)" }}>15</div>
          <div style={{ fontSize: "12px", color: "var(--text3)" }}>Questions</div>
        </div>
        <div style={{ padding: "1rem", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--blue)" }}>70%</div>
          <div style={{ fontSize: "12px", color: "var(--text3)" }}>Pass</div>
        </div>
      </div>

      <div style={{ background: "#FEF3C7", padding: "1rem", borderRadius: "var(--radius)", marginBottom: "2rem" }}>
        <p style={{ fontSize: "13px", color: "#92400E" }}>
          <strong>⚠️ Warning:</strong> Full-screen is mandatory. Tab-switching is disabled.
        </p>
      </div>

      <label style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "2rem", cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
        <span style={{ fontSize: "13px" }}>I agree to the assessment rules.</span>
      </label>

      <button 
        className="btn btn-primary" 
        style={{ width: "100%", padding: "14px", opacity: agreed ? 1 : 0.6, display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }} 
        onClick={handleStartTest}
      >
         Start Assessment
      </button>
    </div>
  );
};

export default LandingPage;
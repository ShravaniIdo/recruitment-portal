import { useContext } from "react";
import { FormContext } from "../../context/FormContext";

const ResultPage = () => {
  const { formData } = useContext(FormContext);
  const result = formData?.result;

  if (!result) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>⚠️ No result found</h2>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Start Over
        </button>
      </div>
    );
  }

  const isDisqualified = result.status === "FAILED_UNFAIR";
  const isPassed = result.status === "PASS";

  return (
    <div style={{ maxWidth: "700px", margin: "60px auto" }}>
      <div className="card" style={{ padding: "2rem", textAlign: "center" }}>

        {/* STATUS */}
        <h2 style={{
          color: isDisqualified ? "red" : isPassed ? "green" : "orange",
          marginBottom: "1rem"
        }}>
          {isDisqualified ? "DISQUALIFIED" : isPassed ? "PASSED" : "FAILED"}
        </h2>

        {/* PASSING CRITERIA */}
        <p style={{ color: "#666", marginBottom: "20px" }}>
           Passing Criteria: Minimum 70% required to qualify the assessment.
        </p>

        {/* SUBJECT TABLE */}
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px"
        }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={cellStyle}>Subject</th>
              <th style={cellStyle}>Total</th>
              <th style={cellStyle}>Attempted</th>
              <th style={cellStyle}>Unattempted</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(result.subjectStats || {}).map(([subject, data]) => (
              <tr key={subject}>
                <td style={cellStyle}>{subject.toUpperCase()}</td>
                <td style={cellStyle}>{data.total}</td>
                <td style={cellStyle}>{data.attempted}</td>
                <td style={cellStyle}>{data.unattempted}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* VIOLATIONS */}
        <p style={{ marginBottom: "20px" }}>
          Violations: <b>{result.violations || 0}</b>
        </p>

        {/* APP NO */}
        {formData.applicationNo && (
          <p style={{ marginBottom: "20px" }}>
            Application No: <b>{formData.applicationNo}</b>
          </p>
        )}

        {/* BUTTON */}
        {/* <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Return Home
        </button> */}

          {/* ── Final Message ── */}
          <div style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "10px",
            background: isPassed ? "#DCFCE7" : "#F3F4F6",
            color: isPassed ? "#166534" : "#5c6f8c",
            fontWeight: "500",
          }}>
            {isDisqualified ? (
              "You have been disqualified due to violation of assessment rules."
            ) : isPassed ? (
              "🎉 Congratulations! You have successfully cleared the assessment. Our HR team will reach out to you shortly with the next steps."
            ) : (
              "Thank you for taking the assessment. We appreciate your effort. Unfortunately, you did not meet the qualifying criteria this time. We wish you the best for your future opportunities."
            )}
          </div>

      </div>
    </div>
  );
};

const cellStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "center"
};

export default ResultPage;





























// import { useContext } from "react";
// import { FormContext } from "../../context/FormContext";

// const ResultPage = () => {
//   const { formData } = useContext(FormContext);
//   const result = formData?.result;

//   if (!result) {
//     return (
//       <div style={{ textAlign: "center", padding: "80px 20px" }}>
//         <h2 style={{ color: "var(--navy)" }}>⚠️ No result found</h2>
//         <p style={{ color: "var(--text2)", margin: "1rem 0" }}>
//           Your session may have expired.
//         </p>
//         <button className="btn btn-primary" onClick={() => window.location.reload()}>
//           Start Over
//         </button>
//       </div>
//     );
//   }

//   const isDisqualified = result.status === "FAILED_UNFAIR";
//   const isPassed       = result.percentage >= 70 && !isDisqualified;

//   return (
//     <div style={{ maxWidth: "640px", margin: "60px auto", padding: "0 1rem" }}>
//       <div className="card" style={{ padding: "2.5rem", textAlign: "center" }}>

//         {/* ── Status banner ── */}
//         {isDisqualified ? (
//           <>
//             <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>🚫</div>
//             <h2 style={{ color: "var(--danger)", fontFamily: "Syne, sans-serif" }}>Disqualified</h2>
//             <p style={{ color: "var(--text2)", margin: "1rem 0 1.5rem" }}>
//               This assessment was terminated due to repeated security violations.
//             </p>
//             <div style={{ background: "#FEE2E2", color: "#991B1B", padding: "0.875rem",
//                           borderRadius: "8px", fontWeight: "700", marginBottom: "2rem" }}>
//               STATUS: FAILED — UNFAIR MEANS
//             </div>
//           </>
//         ) : (
//           <>
//             <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>
//               {isPassed ? "🎉" : "😔"}
//             </div>
//             <h2 style={{ color: "var(--navy)", fontFamily: "Syne, sans-serif" }}>
//               Assessment Complete
//             </h2>

//             {/* Score circle */}
//             <div style={{ margin: "1.5rem auto", width: "130px", height: "130px",
//                           borderRadius: "50%", display: "flex", flexDirection: "column",
//                           alignItems: "center", justifyContent: "center",
//                           background: isPassed ? "#DCFCE7" : "#FEE2E2",
//                           border: `4px solid ${isPassed ? "var(--success)" : "var(--danger)"}` }}>
//               <span style={{ fontSize: "2rem", fontWeight: "800",
//                              color: isPassed ? "var(--success)" : "var(--danger)" }}>
//                 {result.percentage}%
//               </span>
//               <span style={{ fontSize: "0.75rem", color: isPassed ? "#166534" : "#991B1B",
//                              fontWeight: "600" }}>
//                 {result.score} / {result.total}
//               </span>
//             </div>

//             {/* Pass / Fail badge */}
//             <div style={{ display: "inline-block", padding: "6px 24px", borderRadius: "20px",
//                           fontWeight: "700", fontSize: "0.9rem", marginBottom: "1.5rem",
//                           background: isPassed ? "var(--success)" : "var(--danger)", color: "white" }}>
//               {isPassed ? "✓ PASSED" : "✗ FAILED"} — Cut-off: 70%
//             </div>
//           </>
//         )}

//         {/* ── Topic-wise breakdown ── */}
//         {!isDisqualified && (
//           <div style={{ background: "var(--surface)", borderRadius: "12px",
//                         padding: "1.25rem", marginBottom: "1.5rem", textAlign: "left" }}>
//             <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text3)",
//                         textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1rem" }}>
//               Topic Breakdown
//             </p>
//             {[
//               { label: "🐍 Python", key: "python" },
//               { label: "🗄️ SQL",    key: "sql"    },
//               { label: "🤖 AI / ML", key: "aiml"  },
//             ].map(({ label, key }) => {
//               const correct = result.breakdown?.filter(q => q.topic === key && q.isCorrect).length ?? 0;
//               const total   = result.breakdown?.filter(q => q.topic === key).length ?? 5;
//               const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;
//               return (
//                 <div key={key} style={{ marginBottom: "0.875rem" }}>
//                   <div style={{ display: "flex", justifyContent: "space-between",
//                                 marginBottom: "4px", fontSize: "0.875rem" }}>
//                     <span style={{ color: "var(--text2)", fontWeight: "500" }}>{label}</span>
//                     <span style={{ fontWeight: "700", color: "var(--text1)" }}>
//                       {correct} / {total}
//                     </span>
//                   </div>
//                   <div style={{ height: "8px", borderRadius: "99px",
//                                 background: "var(--border)", overflow: "hidden" }}>
//                     <div style={{ height: "100%", borderRadius: "99px",
//                                   width: `${pct}%`, transition: "width 0.6s ease",
//                                   background: pct >= 60 ? "var(--success)" : "var(--danger)" }} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* ── Stats row ── */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px",
//                       marginBottom: "2rem", textAlign: "center" }}>
//           <div style={{ background: "var(--surface)", padding: "1rem", borderRadius: "10px",
//                         border: "1px solid var(--border)" }}>
//             <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--blue)" }}>
//               {result.score ?? 0}
//             </div>
//             <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>Correct Answers</div>
//           </div>
//           <div style={{ background: "var(--surface)", padding: "1rem", borderRadius: "10px",
//                         border: "1px solid var(--border)" }}>
//             <div style={{ fontSize: "1.4rem", fontWeight: "800",
//                           color: (result.violations ?? 0) > 0 ? "var(--danger)" : "var(--success)" }}>
//               {result.violations ?? 0}
//             </div>
//             <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>Violations</div>
//           </div>
//         </div>

//         {formData.applicationNo && (
//           <p style={{ fontSize: "0.8rem", color: "var(--text3)", marginBottom: "1.5rem" }}>
//             Application No: <strong style={{ color: "var(--blue)" }}>{formData.applicationNo}</strong>
//           </p>
//         )}

//         <button className="btn btn-primary"
//           style={{ width: "100%", justifyContent: "center" }}
//           onClick={() => window.location.reload()}>
//           Return Home
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ResultPage;




import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { FormContext } from "../../context/FormContext";
import { fetchTestQuestions, submitTestAnswers } from "../../services/test.api";     // ✅ real API
import { saveResult } from "../../services/candidate.api";                           // ✅ saves to DB

const TestPage = () => {
  const { formData, setFormData } = useContext(FormContext);

  // ── State ────────────────────────────────────────────────────
  const [questions,   setQuestions]   = useState([]);
  const [currentQ,    setCurrentQ]    = useState(0);
  const [answers,     setAnswers]     = useState({});      // { questionIndex: optionIndex }
  const [timeLeft,    setTimeLeft]    = useState(15 * 60); // 15 minutes
  const [violations,  setViolations]  = useState(0);
  const [isLocked,    setIsLocked]    = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useRef so callbacks always read the latest violations without stale closure
  const violationsRef = useRef(0);
  const timeLeftRef   = useRef(15 * 60);

  // keep timeLeftRef in sync
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  // ── Load questions from backend ───────────────────────────────
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTestQuestions(); // GET /api/questions/test
      setQuestions(data.questions);
      setCurrentQ(0);
      setAnswers({});
    } catch (err) {
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  // ── Submit — scores server-side, saves to DB ──────────────────
const isSubmittingRef = useRef(false); // ✅ FIX

const submitTest = useCallback(async (isFailed = false) => {
  isSubmittingRef.current = true; // ✅ instant flag

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }

  if (isFailed) {
    try {
      await saveResult({
        candidateId: formData.candidateId,
        applicationNo: formData.applicationNo,
        result: {
          subjectStats: {},
          violations: violationsRef.current,
          status: "FAILED_UNFAIR",
        },
        timeTakenSecs: 15 * 60 - timeLeftRef.current,
      });
    } catch (e) {
      console.error("saveResult error:", e);
    }

    setFormData((prev) => ({
      ...prev,
      result: {
        subjectStats: {},
        violations: violationsRef.current,
        status: "FAILED_UNFAIR",
      },
      step: 6,
    }));

    return;
  }

  try {
    // Build answers payload
    const answersPayload = {};
    questions.forEach((q, index) => {
      if (answers[index] !== undefined) {
        answersPayload[q.id] = answers[index];
      }
    });

    const data = await submitTestAnswers(answersPayload);

    // 🔥 SUBJECT STATS
    const subjectStats = {};

    questions.forEach((q, index) => {
      const topic = q.topic;

      if (!subjectStats[topic]) {
        subjectStats[topic] = {
          total: 0,
          attempted: 0,
        };
      }

      subjectStats[topic].total++;

      if (answers[index] !== undefined) {
        subjectStats[topic].attempted++;
      }
    });

    Object.keys(subjectStats).forEach((topic) => {
      subjectStats[topic].unattempted =
        subjectStats[topic].total - subjectStats[topic].attempted;
    });

    // 🔥 STATUS LOGIC
    let status = "FAIL";

    if (violationsRef.current >= 2) {
      status = "FAILED_UNFAIR";
    } else if (data.result.score >= 11) {
      status = "PASS";
    }

    const finalResult = {
      subjectStats,
      violations: violationsRef.current,
      status,

      // ✅ marks for backend
      score: data.result.score,
      total: data.result.total,
      percentage: data.result.percentage,
      breakdown: data.result.breakdown,
    };

    await saveResult({
      candidateId: formData.candidateId,
      applicationNo: formData.applicationNo,
      result: finalResult,
      timeTakenSecs: 15 * 60 - timeLeftRef.current,
    });

    setFormData((prev) => ({
      ...prev,
      result: finalResult,
      step: 6,
    }));

  } catch (err) {
    console.error("Submit error:", err);
    alert("Error submitting test. Please try again.");
  }
}, [questions, answers, formData, setFormData]);


// ── Anti-cheat ────────────────────────────────────────────────
const handleViolation = useCallback(() => {
  violationsRef.current += 1;
  setViolations(violationsRef.current);

  if (violationsRef.current === 1) {
    setIsLocked(true);
    loadQuestions();
  } else if (violationsRef.current >= 2) {
    submitTest(true);
  }
}, [loadQuestions, submitTest]);


// ── Security listeners (FINAL FIX) ────────────────────────────
useEffect(() => {
  const handleSecurity = () => {
    // Ignore events while intentionally submitting/exiting fullscreen
    if (isSubmittingRef.current) return;

    const leftTab = document.hidden;
    const lostFocus = !document.hasFocus();
    const exitedFullscreen = !document.fullscreenElement;

    if (leftTab || lostFocus || exitedFullscreen) {
      handleViolation();
    }
  };

  const prevent = (e) => {
    if (isSubmittingRef.current) return;

    e.preventDefault();
    handleViolation();
  };

  // Keep all original protections
  document.addEventListener("fullscreenchange", handleSecurity);
  document.addEventListener("visibilitychange", handleSecurity);
  window.addEventListener("blur", handleSecurity);

  document.addEventListener("copy", prevent);
  document.addEventListener("paste", prevent);
  document.addEventListener("contextmenu", prevent);

  return () => {
    document.removeEventListener("fullscreenchange", handleSecurity);
    document.removeEventListener("visibilitychange", handleSecurity);
    window.removeEventListener("blur", handleSecurity);

    document.removeEventListener("copy", prevent);
    document.removeEventListener("paste", prevent);
    document.removeEventListener("contextmenu", prevent);
  };
}, [handleViolation]);


  // // ── Submit — scores server-side, saves to DB ──────────────────
  // const submitTest = useCallback(async (isFailed = false) => {
  //   setIsSubmitting(true);
  //   if (document.fullscreenElement) document.exitFullscreen().catch(() => {});

  //   if (isFailed) {
  //     // Disqualified — save immediately without scoring
  //     try {
  //       await saveResult({
  //         candidateId: formData.candidateId,
  //         applicationNo: formData.applicationNo,
  //         result: {
  //           subjectStats: {}, // empty because failed
  //           violations: violationsRef.current,
  //           status: "FAILED_UNFAIR",
  //         },
  //         timeTakenSecs: 15 * 60 - timeLeftRef.current,
  //       });
  //             } catch (e) { console.error("saveResult error:", e); }

  //     setFormData((prev) => ({
  //       ...prev,
  //       result: {
  //         subjectStats: {},
  //         violations: violationsRef.current,
  //         status: "FAILED_UNFAIR",
  //       },
  //       step: 6,
  //     }));
  //     return;
  //   }

  //   try {
  //     // Build { questionId: selectedOptionIndex } for backend
  //     const answersPayload = {};
  //     questions.forEach((q, index) => {
  //       if (answers[index] !== undefined) {
  //         answersPayload[q.id] = answers[index];
  //       }
  //     });

  //     // POST /api/questions/submit — server scores it
  //     const data = await submitTestAnswers(answersPayload);

  //     // const finalResult = {
  //     //   ...data.result,
  //     //   violations: violationsRef.current,
  //     //   status: "COMPLETED",
  //     // };

  //     // 🔥 SUBJECT-WISE STATS CALCULATION
  //     const subjectStats = {};

  //     questions.forEach((q, index) => {
  //       const topic = q.topic;

  //       if (!subjectStats[topic]) {
  //         subjectStats[topic] = {
  //           total: 0,
  //           attempted: 0,
  //         };
  //       }

  //       subjectStats[topic].total++;

  //       if (answers[index] !== undefined) {
  //         subjectStats[topic].attempted++;
  //       }
  //     });

  //     // add unattempted
  //     Object.keys(subjectStats).forEach((topic) => {
  //       subjectStats[topic].unattempted =
  //         subjectStats[topic].total - subjectStats[topic].attempted;
  //     });

  //     // 🔥 PASS / FAIL LOGIC (simple)
  //     let status = "FAIL";

  //     if (violationsRef.current >= 2) {
  //       status = "FAILED_UNFAIR";
  //     } else if (data.result.score >= 15) {  // you can adjust
  //       status = "PASS";
  //     }

  //     const finalResult = {
  //     subjectStats,
  //     violations: violationsRef.current,
  //     status,

  //     // 🔥 ADD THIS (VERY IMPORTANT)
  //     score: data.result.score,
  //     total: data.result.total,
  //     percentage: data.result.percentage,
  //     breakdown: data.result.breakdown,
  //   };

  //     // const finalResult = {
  //     //   subjectStats,                     // ✅ NEW
  //     //   violations: violationsRef.current,
  //     //   status,
  //     // };

  //     // POST /api/candidates/save-result — persist to DB
  //     await saveResult({
  //       candidateId:   formData.candidateId,
  //       applicationNo: formData.applicationNo,
  //       result:        finalResult,
  //       timeTakenSecs: 15 * 60 - timeLeftRef.current,
  //     });

  //     setFormData((prev) => ({ ...prev, result: finalResult, step: 6 }));
  //   } catch (err) {
  //     console.error("Submit error:", err);
  //     alert("Error submitting test. Please try again.");
  //   }
  // }, [questions, answers, formData, setFormData]);

  // // ── Anti-cheat ────────────────────────────────────────────────
  // const handleViolation = useCallback(() => {
  //   violationsRef.current += 1;
  //   setViolations(violationsRef.current);

  //   if (violationsRef.current === 1) {
  //     setIsLocked(true);
  //     loadQuestions(); // fresh questions on first violation
  //   } else if (violationsRef.current >= 2) {
  //     submitTest(true); // disqualify on second
  //   }
  // }, [loadQuestions, submitTest]);

  // useEffect(() => {
  //   const handleSecurity = () => {
  //     if (isSubmitting) return; // ✅ IGNORE DURING SUBMIT

  //     if (document.hidden || !document.hasFocus() || !document.fullscreenElement) {
  //       handleViolation();
  //     }
  //   };
  //   const prevent = (e) => { 
  //     if (isSubmitting) return;
  //     e.preventDefault();
  //     handleViolation(); 
  //   };

  //   document.addEventListener("fullscreenchange", handleSecurity);
  //   window.addEventListener("blur", handleSecurity);
  //   document.addEventListener("copy", prevent);
  //   document.addEventListener("paste", prevent);
  //   document.addEventListener("contextmenu", prevent);

  //   return () => {
  //     document.removeEventListener("fullscreenchange", handleSecurity);
  //     window.removeEventListener("blur", handleSecurity);
  //     document.removeEventListener("copy", prevent);
  //     document.removeEventListener("paste", prevent);
  //     document.removeEventListener("contextmenu", prevent);
  //   };
  // }, [handleViolation]);

  const enterFullScreen = () => {
    document.documentElement.requestFullscreen().then(() => setIsLocked(false));
  };

  // ── Timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft <= 0) { submitTest(); return; }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitTest]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // ── Loading screen ────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center",
                    justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <div style={{ width: "40px", height: "40px", border: "4px solid var(--border)",
                      borderTop: "4px solid var(--blue)", borderRadius: "50%",
                      animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "var(--text3)" }}>Loading your questions...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "calc(100vh - 60px)", display: "flex",
                    alignItems: "center", justifyContent: "center" }}>
        <div className="card" style={{ padding: "2rem", textAlign: "center", maxWidth: "400px" }}>
          <p style={{ color: "var(--danger)", marginBottom: "1rem" }}>⚠️ {error}</p>
          <button className="btn btn-primary" onClick={loadQuestions}>Try Again</button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;
  const q = questions[currentQ];

  // ── Violation overlay ─────────────────────────────────────────
  if (isLocked) {
    return (
      <div style={{ height: "100vh", width: "100vw", display: "flex", alignItems: "center",
                    justifyContent: "center", background: "rgba(13,27,42,0.98)",
                    position: "fixed", top: 0, left: 0, zIndex: 10000 }}>
        <div style={{ background: "white", padding: "3rem", borderRadius: "20px",
                      textAlign: "center", maxWidth: "500px", border: "2px solid #DC2626" }}>
          <h2 style={{ color: "#DC2626" }}>⚠️ Security Warning</h2>
          <p style={{ margin: "1rem 0" }}>
            A violation was detected. Your progress has been <b>reset</b> with new questions.
          </p>
          <p style={{ marginBottom: "2rem" }}>Any further violations will result in immediate failure.</p>
          <button className="btn btn-primary" onClick={enterFullScreen}>Resume Test</button>
        </div>
      </div>
    );
  }

  // ── Main layout ───────────────────────────────────────────────
  return (
    <div style={{ background: "var(--surface)", minHeight: "calc(100vh - 60px)", padding: "2rem 2.5rem" }}>
      <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>

        {/* ── LEFT: Question panel ───────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="card" style={{ padding: "2.5rem" }}>

            {/* Header: title + timer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                          borderBottom: "1px solid var(--border)", paddingBottom: "1.25rem",
                          marginBottom: "2rem" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.6rem", color: "var(--navy)",
                             fontFamily: "Syne, sans-serif" }}>Technical Assessment</h2>
                <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--text3)" }}>
                  Question {currentQ + 1} of {questions.length}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
                            background: timeLeft < 60 ? "#FEE2E2" : "var(--blue3)",
                            border: `2px solid ${timeLeft < 60 ? "var(--danger)" : "var(--blue)"}`,
                            borderRadius: "12px", padding: "10px 20px", minWidth: "100px" }}>
                <span style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase",
                               letterSpacing: "0.5px",
                               color: timeLeft < 60 ? "var(--danger)" : "var(--blue)" }}>
                  Time Left
                </span>
                <span style={{ fontSize: "1.75rem", fontWeight: "700", lineHeight: 1.1,
                               color: timeLeft < 60 ? "var(--danger)" : "var(--blue)" }}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Topic badge + question text */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "inline-block", background: "var(--blue3)", color: "var(--blue)",
                            fontSize: "11px", fontWeight: "700", padding: "3px 10px",
                            borderRadius: "20px", letterSpacing: "0.5px", marginBottom: "14px",
                            textTransform: "uppercase" }}>
                {q.topic}
              </div>
              <h3 style={{ fontSize: "1.25rem", lineHeight: "1.6", color: "var(--text1)", margin: 0 }}>
                {q.text}
              </h3>
            </div>

            {/* Answer options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {q.options.map((opt, idx) => {
                const isSelected = answers[currentQ] === idx;
                return (
                  <button key={idx}
                    onClick={() => setAnswers({ ...answers, [currentQ]: idx })}
                    style={{ textAlign: "left", width: "100%", padding: "1rem 1.25rem",
                             borderRadius: "10px", cursor: "pointer",
                             display: "flex", alignItems: "center", gap: "16px",
                             fontSize: "1rem", transition: "all 0.15s ease",
                             background: isSelected ? "var(--blue3)" : "var(--white)",
                             border: `2px solid ${isSelected ? "var(--blue)" : "var(--border)"}`,
                             boxShadow: isSelected ? "0 0 0 3px rgba(37,99,235,0.1)" : "none" }}>
                    <span style={{ width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                                   display: "flex", alignItems: "center", justifyContent: "center",
                                   fontWeight: "700", fontSize: "0.85rem",
                                   background: isSelected ? "var(--blue)" : "var(--surface)",
                                   color: isSelected ? "white" : "var(--text3)",
                                   border: `1px solid ${isSelected ? "var(--blue)" : "var(--border)"}` }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div style={{ marginTop: "2.5rem", paddingTop: "1.5rem",
                          borderTop: "1px solid var(--border)",
                          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {currentQ > 0
                ? <button className="btn btn-ghost" onClick={() => setCurrentQ(c => c - 1)}>← Previous</button>
                : <div />}
              {currentQ === questions.length - 1
                ? <button className="btn btn-primary"
                    style={{ background: "var(--success)", borderColor: "var(--success)" }}
                    onClick={() => submitTest(false)}>
                    ✓ Submit Final Exam
                  </button>
                : <button className="btn btn-primary" onClick={() => setCurrentQ(c => c + 1)}>
                    Next Question →
                  </button>}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Sidebar ─────────────────────────────────── */}
        <div style={{ width: "300px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Candidate details */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.85rem", textTransform: "uppercase",
                         letterSpacing: "0.5px", color: "var(--text3)" }}>Candidate</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text3)", minWidth: "44px" }}>Name</span>
                <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text1)" }}>
                  {formData.primary?.fullName || "Guest"}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text3)", minWidth: "44px" }}>Email</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text2)", wordBreak: "break-all" }}>
                  {formData.primary?.email || "N/A"}
                </span>
              </div>
              {formData.applicationNo && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text3)", minWidth: "44px" }}>App No</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--blue)", fontWeight: "600" }}>
                    {formData.applicationNo}
                  </span>
                </div>
              )}
            </div>
            <div style={{ marginTop: "14px", padding: "10px 14px", borderRadius: "8px",
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          background: violations > 0 ? "#FEE2E2" : "#DCFCE7" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: "600",
                             color: violations > 0 ? "#991B1B" : "#166534" }}>⚠ Violations</span>
              <span style={{ fontWeight: "700", fontSize: "0.9rem",
                             color: violations > 0 ? "#DC2626" : "#059669" }}>{violations} / 2</span>
            </div>
          </div>

          {/* Question palette */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h4 style={{ margin: "0 0 4px 0", fontSize: "0.85rem", textTransform: "uppercase",
                         letterSpacing: "0.5px", color: "var(--text3)" }}>Question Palette</h4>
            <p style={{ fontSize: "0.75rem", color: "var(--text3)", margin: "0 0 1rem 0" }}>
              Click any number to jump to that question
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
              {questions.map((_, i) => {
                const isAnswered = answers[i] !== undefined;
                const isCurrent  = currentQ === i;
                return (
                  <div key={i} onClick={() => setCurrentQ(i)}
                    style={{ aspectRatio: "1/1", display: "flex", alignItems: "center",
                             justifyContent: "center", borderRadius: "8px", cursor: "pointer",
                             fontSize: "0.875rem", fontWeight: "600", transition: "all 0.15s",
                             background: isCurrent ? "var(--blue)" : isAnswered ? "var(--success)" : "var(--white)",
                             color: isCurrent || isAnswered ? "white" : "var(--text2)",
                             border: `2px solid ${isCurrent ? "var(--blue)" : isAnswered ? "var(--success)" : "var(--border)"}`,
                             boxShadow: isCurrent ? "0 0 0 3px rgba(37,99,235,0.2)" : "none" }}>
                    {i + 1}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "5px" }}>
              {[{ color: "var(--blue)",    label: "Current" },
                { color: "var(--success)", label: "Answered" },
                { color: "var(--white)",   label: "Not visited", border: "var(--border)" }]
                .map(({ color, label, border }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px",
                                           fontSize: "0.75rem", color: "var(--text3)" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "3px",
                                  background: color, border: `1px solid ${border || color}`, flexShrink: 0 }} />
                    {label}
                  </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TestPage;












// backend/controllers/candidate.controller.js

const Candidate = require("../models/Candidate");
const Result    = require("../models/Result");

// ── Helper: generate Application_no e.g. "APP-2026-00012" ────
// const generateAppNo = async () => {
//   const year  = new Date().getFullYear();
//   const count = await Candidate.count();
//   return `APP-${year}-${String(count + 1).padStart(5, "0")}`;
// };

const generateAppNo = async () => {
  const count = await Candidate.count();
  return `IBS_${String(count + 1).padStart(5, "0")}`;
};

// ─────────────────────────────────────────────────────────────
//  POST /api/candidates/register
// ─────────────────────────────────────────────────────────────
const registerCandidate = async (req, res) => {
  try {
    const { primary, personal, education } = req.body;

    if (!primary?.fullName || !primary?.email || !primary?.phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Candidate.findOne({
      where: { email: primary.email },
    });

    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const Application_no = await generateAppNo();

    const candidate = await Candidate.create({
      Application_no,
      Fullname: primary.fullName,
      Contact_no: primary.phone,
      email: primary.email,

      Gender: personal?.gender || null,
      Father_Name: personal?.fatherName || null,
      Mother_Name: personal?.motherName || null,
      Father_Occupation: personal?.fatherOcc || null,
      Mother_Occupation: personal?.motherOcc || null,

      Permanent_address: personal?.permAddr || null,
      Correspondence_address:
        personal?.corrAddr || personal?.permAddr || null,

      Ssc_details: JSON.stringify(education?.ssc || {}),
      Hsc_details: JSON.stringify(education?.hsc || {}),
      Degree_details: JSON.stringify(education?.degree || {}),

      Candidate_profile: education?.profile || "fresher",

      Experience_details:
        education?.profile === "experienced"
          ? JSON.stringify(education?.experience || [])
          : null,
    });

    res.status(201).json({
      success: true,
      candidateId: candidate.Id,
      applicationNo: Application_no,
    });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
//  POST /api/candidates/save-result
// ─────────────────────────────────────────────────────────────
const saveResult = async (req, res) => {
  try {
    const { candidateId, applicationNo, result, timeTakenSecs } = req.body;

    if (!candidateId || !result) {
      return res.status(400).json({ message: "Missing data" });
    }

    // ✅ Extract subject-wise stats safely
    // const python = result.subjectStats?.python || {};
    // const sql    = result.subjectStats?.sql || {};
    // const aiml   = result.subjectStats?.aiml || {};

    const pythonScore = result.breakdown?.filter(
      q => q.topic === "python" && q.isCorrect
    ).length || 0;

    const sqlScore = result.breakdown?.filter(
      q => q.topic === "sql" && q.isCorrect
    ).length || 0;

    const aimlScore = result.breakdown?.filter(
      q => q.topic === "aiml" && q.isCorrect
    ).length || 0;


    // ✅ Save into RESULT table
    await Result.create({
      Candidate_id: candidateId,
      Application_no: applicationNo,

      // 🔥 NO score / percentage now
      Score: result.score,
      Total_questions: result.total,
      Percentage: result.percentage,

      Status: result.status,
      Violations: result.violations || 0,

      // Python_score: python.attempted || 0,
      // Sql_score: sql.attempted || 0,
      // Aiml_score: aiml.attempted || 0,

      Python_score: pythonScore,
      Sql_score: sqlScore,
      Aiml_score: aimlScore,

      Time_taken_secs: timeTakenSecs || null,

      // optional debug storage
      Subject_stats: JSON.stringify(result.subjectStats || {}),
    });

    // ✅ Update candidate table
    await Candidate.update(
      {
        Result: result.status,
        Marks: null, // ❌ no percentage now
      },
      { where: { Id: candidateId } }
    );

    res.status(201).json({ success: true });

  } catch (err) {
    console.error("SAVE RESULT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};







module.exports = { registerCandidate, saveResult };


















// const saveResult = async (req, res) => {
//   try {
//     const { candidateId, applicationNo, result, timeTakenSecs } = req.body;

//     if (!candidateId || !result) {
//       return res.status(400).json({ message: "Missing data" });
//     }

//     const pythonScore =
//       result.breakdown?.filter(q => q.topic === "python" && q.isCorrect).length || 0;

//     const sqlScore =
//       result.breakdown?.filter(q => q.topic === "sql" && q.isCorrect).length || 0;

//     const aimlScore =
//       result.breakdown?.filter(q => q.topic === "aiml" && q.isCorrect).length || 0;

//     let status = "FAIL";
//     if (result.status === "FAILED_UNFAIR") status = "DISQUALIFIED";
//     else if (result.percentage >= 70) status = "PASS";

//     await Result.create({
//       Candidate_id: candidateId,
//       Application_no: applicationNo,

//       Score: result.score,
//       Total_questions: result.total,
//       Percentage: result.percentage,

//       Status: status,
//       Violations: result.violations || 0,

//       Python_score: pythonScore,
//       Sql_score: sqlScore,
//       Aiml_score: aimlScore,

//       Time_taken_secs: timeTakenSecs || null,
//     });

//     await Candidate.update(
//       { Result: status, Marks: result.percentage },
//       { where: { Id: candidateId } }
//     );

//     res.status(201).json({ success: true });
//   } catch (err) {
//     console.error("SAVE RESULT ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };


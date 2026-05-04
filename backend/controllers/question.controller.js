// backend/controllers/question.controller.js
// Works with [PLACEMENT_DB].[dbo].[SETS]
// Options column = JSON string  {"A":"...","B":"...","C":"...","D":"..."}
// Correct_option column = letter string "A" | "B" | "C" | "D"

const { Sequelize } = require("sequelize");
const Sets = require("../models/Sets");

// ─────────────────────────────────────────────────────────────
//  GET /api/questions/test
//  Returns 15 questions: 5 random per topic (python, sql, aiml)
//  Correct_option is NEVER included in the response
// ─────────────────────────────────────────────────────────────
const getTestQuestions = async (req, res) => {
  try {
    const topics = ["python", "sql", "aiml"];
    let allQuestions = [];

    for (const topic of topics) {
      const rows = await Sets.findAll({
        where: { Topic_type: topic },
        order: Sequelize.literal("NEWID()"),   // MS SQL Server random order
        limit: 5,
        attributes: ["Id", "Topic_type", "Question", "Options"],
        // ✅ Correct_option intentionally excluded — scored server-side only
      });
      allQuestions = [...allQuestions, ...rows];
    }

    // Shuffle the 15 so topics are not grouped together
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);

    // Format for frontend
    // Options getter on the model already parses JSON → { A, B, C, D }
    const formatted = shuffled.map((q) => {
      const opts = q.Options; // { A: "...", B: "...", C: "...", D: "..." }
      return {
        id: q.Id,
        topic: q.Topic_type,
        text: q.Question,
        // Convert to array so frontend can use index 0=A 1=B 2=C 3=D
        options: [opts.A, opts.B, opts.C, opts.D],
      };
    });

    res.status(200).json({ success: true, questions: formatted });
  } catch (err) {
    console.error("getTestQuestions error:", err);
    res.status(500).json({ success: false, message: "Failed to load questions." });
  }
};

// ─────────────────────────────────────────────────────────────
//  POST /api/questions/submit
//  Body: { answers: { "questionId": selectedIndex, ... } }
//  selectedIndex: 0=A  1=B  2=C  3=D  (matches frontend options array)
//  Returns score, percentage, pass/fail, per-question breakdown
// ─────────────────────────────────────────────────────────────
const submitTest = async (req, res) => {
  try {
    const { answers } = req.body;
    // answers example: { "3": 1, "7": 2, "12": 0 }

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ success: false, message: "Invalid answers payload." });
    }

    const questionIds = Object.keys(answers).map(Number);
    if (questionIds.length === 0) {
      return res.status(400).json({ success: false, message: "No answers submitted." });
    }

    // Fetch Correct_option ONLY for the submitted question IDs
    const questions = await Sets.findAll({
      where: { Id: questionIds },
      attributes: ["Id", "Topic_type", "Correct_option"],
    });

    // Convert letter to index:  A=0  B=1  C=2  D=3
    const letterToIndex = { A: 0, B: 1, C: 2, D: 3 };

    let score = 0;
    const breakdown = questions.map((q) => {
      const correctIndex = letterToIndex[q.Correct_option];
      const selectedIndex = Number(answers[q.Id]);
      const isCorrect = selectedIndex === correctIndex;
      if (isCorrect) score++;

      return {
        questionId: q.Id,
        topic: q.Topic_type,
        selected: selectedIndex,
        correct: correctIndex,
        correctLetter: q.Correct_option,
        isCorrect,
      };
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    res.status(200).json({
      success: true,
      result: {
        score,
        total,
        percentage,
        passed: percentage >= 70,
        breakdown,
      },
    });
  } catch (err) {
    console.error("submitTest error:", err);
    res.status(500).json({ success: false, message: "Failed to submit test." });
  }
};

module.exports = { getTestQuestions, submitTest };
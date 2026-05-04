// backend/routes/question.routes.js

const express = require("express");
const router = express.Router();
const { getTestQuestions, submitTest } = require("../controllers/question.controller");

// GET  /api/questions/test    → fetch 15 questions (5 per topic, randomised)
router.get("/test", getTestQuestions);

// POST /api/questions/submit  → submit answers, returns server-side score
router.post("/submit", submitTest);

module.exports = router;
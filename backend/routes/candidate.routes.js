// backend/routes/candidate.routes.js

const express = require("express");
const router = express.Router();
const { registerCandidate, saveResult } = require("../controllers/candidate.controller");

// POST /api/candidates/register    → save all 3 forms to CANDIDATE_INFO
router.post("/register", registerCandidate);

// POST /api/candidates/save-result → save test score to RESULT table
router.post("/save-result", saveResult);

module.exports = router;
// backend/server.js

// require("dotenv").config(); // ✅ must be FIRST before anything else

require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const questionRoutes  = require("./routes/question.routes");
const candidateRoutes = require("./routes/candidate.routes"); // ✅ was missing

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use("/api/questions",  questionRoutes);
app.use("/api/candidates", candidateRoutes); // ✅ was missing

// ── DB connect + server start ─────────────────────────────────
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to PLACEMENT_DB");
    // return sequelize.sync({ alter: true });
    sequelize.sync()
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB connection failed:", err.message));
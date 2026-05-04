// frontend/src/services/test.api.js

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Fetch 15 questions from backend (5 random per topic)
// Response shape: { success, questions: [{ id, topic, text, options: [A,B,C,D] }] }
export const fetchTestQuestions = async () => {
  const res = await fetch(`${BASE_URL}/questions/test`);
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
};

// Submit answers for server-side scoring
// answers = { questionId: selectedIndex }   e.g. { 3: 1, 7: 0, 12: 2 }
// Response shape: { success, result: { score, total, percentage, passed, breakdown } }
export const submitTestAnswers = async (answers) => {
  const res = await fetch(`${BASE_URL}/questions/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) throw new Error("Failed to submit test");
  return res.json();
};
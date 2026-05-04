import { useState } from "react";

export default function Questions() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "What is React?",
      subject: "Web",
      difficulty: "Easy",
    },
    {
      id: 2,
      question: "What is SQL JOIN?",
      subject: "SQL",
      difficulty: "Medium",
    },
  ]);

  const [search, setSearch] = useState("");
  const [newQuestion, setNewQuestion] = useState("");

  const filtered = questions.filter((q) =>
    q.question.toLowerCase().includes(search.toLowerCase())
  );

  const addQuestion = () => {
    if (!newQuestion) return;

    const obj = {
      id: Date.now(),
      question: newQuestion,
      subject: "General",
      difficulty: "Easy",
    };

    setQuestions([...questions, obj]);
    setNewQuestion("");
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Questions Management
      </h1>

      <div className="bg-white p-5 rounded-xl shadow mb-5">
        <div className="flex gap-3">
          <input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter question"
            className="border p-2 rounded w-full"
          />

          <button
            onClick={addQuestion}
            className="bg-blue-600 text-white px-5 rounded"
          >
            Add
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">

        <input
          placeholder="Search question..."
          className="border p-2 rounded w-full mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table className="w-full border">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">ID</th>
              <th>Question</th>
              <th>Subject</th>
              <th>Difficulty</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((q) => (
              <tr key={q.id} className="border-t text-center">
                <td className="p-3">{q.id}</td>
                <td>{q.question}</td>
                <td>{q.subject}</td>
                <td>{q.difficulty}</td>

                <td>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
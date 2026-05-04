// import { useState } from "react";

// export default function Questions() {
//   const [questions, setQuestions] = useState([
//     {
//       id: 1,
//       question: "What is React?",
//       category: "Frontend",
//       difficulty: "Easy",
//     },
//     {
//       id: 2,
//       question: "Explain SQL JOIN.",
//       category: "SQL",
//       difficulty: "Medium",
//     },
//   ]);

//   const [search, setSearch] = useState("");
//   const [newQuestion, setNewQuestion] = useState("");

//   const filtered = questions.filter((q) =>
//     q.question.toLowerCase().includes(search.toLowerCase())
//   );

//   const addQuestion = () => {
//     if (!newQuestion.trim()) return;

//     const obj = {
//       id: Date.now(),
//       question: newQuestion,
//       category: "General",
//       difficulty: "Easy",
//     };

//     setQuestions([obj, ...questions]);
//     setNewQuestion("");
//   };

//   const deleteQuestion = (id) => {
//     setQuestions(questions.filter((q) => q.id !== id));
//   };

//   return (
//     <div>
//       <h1 className="page-title">Question Management</h1>

//       {/* Top Panel */}
//       <div className="question-top-panel">

//         <input
//           type="text"
//           placeholder="Enter new question..."
//           className="input-box"
//           value={newQuestion}
//           onChange={(e) => setNewQuestion(e.target.value)}
//         />

//         <button className="btn-primary" onClick={addQuestion}>
//           Add Question
//         </button>
//       </div>

//       {/* Search */}
//       <div className="search-wrap">
//         <input
//           type="text"
//           placeholder="Search questions..."
//           className="search-box"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* Table */}
//       <div className="table-box">
//         <table className="question-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Question</th>
//               <th>Category</th>
//               <th>Difficulty</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filtered.map((q) => (
//               <tr key={q.id}>
//                 <td>{q.id}</td>
//                 <td>{q.question}</td>
//                 <td>{q.category}</td>
//                 <td>{q.difficulty}</td>
//                 <td>
//                   <button
//                     className="btn-delete"
//                     onClick={() => deleteQuestion(q.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}

//             {filtered.length === 0 && (
//               <tr>
//                 <td colSpan="5">No Questions Found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }




import { useState, useRef, useEffect } from "react";

const CATEGORIES = ["General", "Frontend", "Backend", "SQL", "DSA", "System Design", "HR"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const DIFF_STYLE = {
  Easy:   { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  Medium: { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  Hard:   { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
};

const CAT_COLORS = {
  Frontend:        "#dbeafe",
  Backend:         "#ede9fe",
  SQL:             "#fce7f3",
  DSA:             "#d1fae5",
  "System Design": "#ffedd5",
  General:         "#f3f4f6",
  HR:              "#cffafe",
};

let nextId = 4;

export default function Questions() {
  const [questions, setQuestions] = useState([
    { id: 1, question: "What is React and how does the virtual DOM work?", category: "Frontend", difficulty: "Easy" },
    { id: 2, question: "Explain the difference between SQL INNER JOIN and LEFT JOIN.", category: "SQL", difficulty: "Medium" },
    { id: 3, question: "What is the time complexity of QuickSort in the worst case?", category: "DSA", difficulty: "Hard" },
  ]);

  const [search, setSearch]       = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [toast, setToast]         = useState(null);
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir]     = useState("asc");
  const [form, setForm]           = useState({ question: "", category: "General", difficulty: "Easy" });
  const [formError, setFormError] = useState("");
  const searchRef  = useRef(null);
  const toastTimer = useRef(null);

  const showToast = (msg, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = questions
    .filter((q) => {
      const s = search.toLowerCase();
      const matchSearch = q.question.toLowerCase().includes(s) || q.category.toLowerCase().includes(s);
      const matchCat    = filterCat  === "All" || q.category   === filterCat;
      const matchDiff   = filterDiff === "All" || q.difficulty === filterDiff;
      return matchSearch && matchCat && matchDiff;
    })
    .sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ?  1 : -1;
      return 0;
    });

  const openAdd = () => {
    setEditTarget(null);
    setForm({ question: "", category: "General", difficulty: "Easy" });
    setFormError("");
    setShowModal(true);
  };
  const openEdit = (q) => {
    setEditTarget(q.id);
    setForm({ question: q.question, category: q.category, difficulty: q.difficulty });
    setFormError("");
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.question.trim())           { setFormError("Question text cannot be empty."); return; }
    if (form.question.trim().length < 8) { setFormError("Question is too short (min 8 chars)."); return; }
    if (editTarget !== null) {
      setQuestions(qs => qs.map(q => q.id === editTarget ? { ...q, ...form } : q));
      showToast("Question updated successfully.");
    } else {
      setQuestions(qs => [{ id: nextId++, ...form }, ...qs]);
      showToast("New question added!");
    }
    setShowModal(false);
  };

  const deleteQuestion = (id) => {
    setQuestions(qs => qs.filter(q => q.id !== id));
    showToast("Question deleted.", "error");
  };

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }) => (
    <span style={{ marginLeft: 4, fontSize: 11, color: sortField === field ? "#6366f1" : "#9ca3af" }}>
      {sortField !== field ? "⇅" : sortDir === "asc" ? "↑" : "↓"}
    </span>
  );

  const stats = {
    total:  questions.length,
    easy:   questions.filter(q => q.difficulty === "Easy").length,
    medium: questions.filter(q => q.difficulty === "Medium").length,
    hard:   questions.filter(q => q.difficulty === "Hard").length,
  };

  const hasFilters = search || filterCat !== "All" || filterDiff !== "All";

  return (
    <div style={S.page}>
      <div style={S.bgGrid} />

      {/* Header */}
      <header style={S.header}>
        <div>
          <h1 style={S.title}>Question Bank</h1>
          <p style={S.subtitle}>Manage your interview &amp; quiz questions</p>
        </div>
        <button style={S.btnAdd} onClick={openAdd}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>＋</span> Add Question
        </button>
      </header>

      {/* Stat cards */}
      <div style={S.statsRow}>
        {[
          { label: "Total",  value: stats.total,  accent: "#6366f1" },
          { label: "Easy",   value: stats.easy,   accent: "#10b981" },
          { label: "Medium", value: stats.medium, accent: "#f59e0b" },
          { label: "Hard",   value: stats.hard,   accent: "#ef4444" },
        ].map(s => (
          <div key={s.label} style={{ ...S.statCard, borderTop: `3px solid ${s.accent}` }}>
            <span style={{ ...S.statNum, color: s.accent }}>{s.value}</span>
            <span style={S.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={S.toolbar}>
        <div style={S.searchWrap}>
          <span style={{ fontSize: 15, color: "#9ca3af" }}>🔍</span>
          <input
            ref={searchRef}
            style={S.searchInput}
            placeholder="Search questions or categories…  (Ctrl+K)"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button style={S.clearBtn} onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <select style={S.select} value={filterCat}  onChange={e => setFilterCat(e.target.value)}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        <select style={S.select} value={filterDiff} onChange={e => setFilterDiff(e.target.value)}>
          <option value="All">All Difficulties</option>
          {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
        </select>

        {hasFilters && (
          <button style={S.resetBtn} onClick={() => { setSearch(""); setFilterCat("All"); setFilterDiff("All"); }}>
            ✕ Reset
          </button>
        )}
      </div>

      <p style={S.resultInfo}>
        Showing <strong>{filtered.length}</strong> of <strong>{questions.length}</strong> questions
      </p>

      {/* Table */}
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              {[
                { label: "#",          field: "id"         },
                { label: "Question",   field: "question"   },
                { label: "Category",   field: "category"   },
                { label: "Difficulty", field: "difficulty" },
                { label: "Actions",    field: null         },
              ].map(col => (
                <th
                  key={col.label}
                  style={{ ...S.th, cursor: col.field ? "pointer" : "default" }}
                  onClick={() => col.field && toggleSort(col.field)}
                >
                  {col.label}{col.field && <SortIcon field={col.field} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((q, i) => (
              <tr key={q.id} style={{ ...S.tr, animationDelay: `${i * 30}ms` }}>
                <td style={{ ...S.td, color: "#9ca3af", fontFamily: "monospace", fontSize: 13 }}>
                  #{String(q.id).padStart(3, "0")}
                </td>
                <td style={{ ...S.td, maxWidth: 400 }}>
                  <span style={S.questionText}>{q.question}</span>
                </td>
                <td style={S.td}>
                  <span style={{ ...S.badge, background: CAT_COLORS[q.category] || "#f3f4f6", color: "#374151" }}>
                    {q.category}
                  </span>
                </td>
                <td style={S.td}>
                  <span style={{ ...S.diffBadge, background: DIFF_STYLE[q.difficulty].bg, color: DIFF_STYLE[q.difficulty].color }}>
                    <span style={{ ...S.dot, background: DIFF_STYLE[q.difficulty].dot }} />
                    {q.difficulty}
                  </span>
                </td>
                <td style={S.td}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={S.btnEdit}   onClick={() => openEdit(q)}>✏️ Edit</button>
                    <button style={S.btnDelete} onClick={() => deleteQuestion(q.id)}>🗑 Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={S.empty}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 40 }}>🔍</span>
                    <p style={{ margin: 0, fontWeight: 600, color: "#374151" }}>No questions found</p>
                    <p style={{ margin: 0, color: "#9ca3af", fontSize: 13 }}>Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={S.modal}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={S.modalTitle}>{editTarget ? "Edit Question" : "Add New Question"}</h2>
              <button style={S.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <label style={S.label}>Question Text <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea
              style={{ ...S.textarea, borderColor: formError ? "#ef4444" : "#e5e7eb" }}
              rows={4}
              placeholder="Type the full question here…"
              value={form.question}
              onChange={e => { setForm({ ...form, question: e.target.value }); setFormError(""); }}
            />
            {formError && <p style={{ color: "#ef4444", fontSize: 12, margin: "0 0 12px" }}>{formError}</p>}

            <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={S.label}>Category</label>
                <select style={S.modalSelect} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={S.label}>Difficulty</label>
                <select style={S.modalSelect} value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                  {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
              <button style={S.btnCancel} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={S.btnSave}   onClick={handleSave}>
                {editTarget ? "Save Changes" : "Add Question"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          ...S.toast,
          background:   toast.type === "error" ? "#fef2f2" : "#f0fdf4",
          borderColor:  toast.type === "error" ? "#fca5a5" : "#86efac",
          color:        toast.type === "error" ? "#991b1b" : "#14532d",
        }}>
          {toast.type === "error" ? "🗑" : "✅"} {toast.msg}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeSlide { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        tr[style] { animation: fadeSlide 0.22s ease both; }
        tr[style]:hover td { background: #fafbff !important; }
        button { transition: opacity 0.15s, transform 0.12s; }
        button:hover { opacity: 0.88; }
        button:active { transform: scale(0.97); }
      `}</style>
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh", background: "#f8fafc", position: "relative",
    fontFamily: "'DM Sans', sans-serif", padding: "32px 24px 64px",
    maxWidth: 1100, margin: "0 auto",
  },
  bgGrid: {
    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage: "linear-gradient(#e2e8f0 1px,transparent 1px),linear-gradient(90deg,#e2e8f0 1px,transparent 1px)",
    backgroundSize: "40px 40px", opacity: 0.45,
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 28, position: "relative", zIndex: 1,
  },
  title: {
    fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800,
    color: "#0f172a", margin: 0, letterSpacing: "-0.5px",
  },
  subtitle: { margin: "4px 0 0", color: "#64748b", fontSize: 14 },
  btnAdd: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#6366f1", color: "#fff", border: "none",
    borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px #6366f140",
  },
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14,
    marginBottom: 24, position: "relative", zIndex: 1,
  },
  statCard: {
    background: "#fff", borderRadius: 12, padding: "16px 20px",
    display: "flex", flexDirection: "column", gap: 4,
    boxShadow: "0 1px 4px #0000000d",
  },
  statNum:   { fontSize: 28, fontWeight: 700, lineHeight: 1 },
  statLabel: { fontSize: 12, color: "#6b7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" },
  toolbar: {
    display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
    marginBottom: 10, position: "relative", zIndex: 1,
  },
  searchWrap: {
    display: "flex", alignItems: "center", gap: 8, flex: "1 1 260px",
    background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10,
    padding: "0 12px", boxShadow: "0 1px 3px #0000000a",
  },
  searchInput: {
    border: "none", outline: "none", background: "transparent",
    fontSize: 14, color: "#1e293b", flex: 1, padding: "10px 0", fontFamily: "inherit",
  },
  clearBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "#9ca3af", fontSize: 13, padding: "2px 4px", borderRadius: 4,
  },
  select: {
    border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "9px 14px",
    fontSize: 13, color: "#374151", background: "#fff", cursor: "pointer",
    fontFamily: "inherit", outline: "none",
  },
  resetBtn: {
    background: "none", border: "1.5px solid #e5e7eb", borderRadius: 10,
    padding: "9px 14px", fontSize: 13, color: "#6366f1",
    cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
  },
  resultInfo: { fontSize: 13, color: "#6b7280", margin: "0 0 10px", position: "relative", zIndex: 1 },
  tableWrap: {
    background: "#fff", borderRadius: 14, overflow: "hidden",
    boxShadow: "0 1px 8px #0000000f", position: "relative", zIndex: 1,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "13px 16px", textAlign: "left", fontSize: 12, fontWeight: 600,
    color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em",
    background: "#f8fafc", borderBottom: "1px solid #e5e7eb", userSelect: "none",
  },
  tr:  { borderBottom: "1px solid #f1f5f9" },
  td:  { padding: "13px 16px", fontSize: 14, color: "#374151", verticalAlign: "middle" },
  questionText: {
    lineHeight: 1.45, display: "-webkit-box",
    WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
  },
  badge: { display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 },
  diffBadge: { display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  dot: { width: 7, height: 7, borderRadius: "50%", display: "inline-block" },
  btnEdit: {
    background: "#eef2ff", color: "#4f46e5", border: "none",
    borderRadius: 7, padding: "5px 12px", fontSize: 12, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
  },
  btnDelete: {
    background: "#fef2f2", color: "#dc2626", border: "none",
    borderRadius: 7, padding: "5px 12px", fontSize: 12, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
  },
  empty: { padding: "52px 16px", textAlign: "center" },
  overlay: {
    position: "fixed", inset: 0, background: "#00000060", zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(3px)",
  },
  modal: {
    background: "#fff", borderRadius: 16, width: "100%", maxWidth: 520,
    padding: 28, boxShadow: "0 20px 60px #0000002a", margin: "0 16px",
  },
  modalTitle: { fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, margin: 0, color: "#0f172a" },
  closeBtn: {
    background: "#f1f5f9", border: "none", width: 32, height: 32,
    borderRadius: 8, fontSize: 14, cursor: "pointer", color: "#64748b",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  textarea: {
    width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 10,
    padding: "10px 12px", fontSize: 14, fontFamily: "inherit", color: "#1e293b",
    resize: "vertical", outline: "none", marginBottom: 4, lineHeight: 1.5,
  },
  modalSelect: {
    width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 10,
    padding: "10px 12px", fontSize: 14, fontFamily: "inherit", color: "#374151",
    background: "#fff", outline: "none", cursor: "pointer",
  },
  btnCancel: {
    background: "#f1f5f9", color: "#374151", border: "none",
    borderRadius: 9, padding: "10px 20px", fontSize: 14, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
  },
  btnSave: {
    background: "#6366f1", color: "#fff", border: "none",
    borderRadius: 9, padding: "10px 22px", fontSize: 14, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px #6366f133",
  },
  toast: {
    position: "fixed", bottom: 28, right: 28, zIndex: 200,
    padding: "12px 20px", borderRadius: 12, border: "1.5px solid",
    fontSize: 13, fontWeight: 600, fontFamily: "inherit",
    boxShadow: "0 8px 24px #0000001a", animation: "fadeSlide 0.3s ease",
  },
};
export default function Dashboard() {
  const stats = [
    ["Total Candidates", 120],
    ["Passed", 74],
    ["Failed", 46],
    ["Questions", 215],
  ];

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      <div className="cards">
        {stats.map((item, index) => (
          <div className="card" key={index}>
            <p>{item[0]}</p>
            <h2>{item[1]}</h2>
          </div>
        ))}
      </div>

      <div className="section-box">
        <h3>Recent Activity</h3>
        <p>Candidate registrations and exam analytics will appear here.</p>
      </div>
    </div>
  );
}
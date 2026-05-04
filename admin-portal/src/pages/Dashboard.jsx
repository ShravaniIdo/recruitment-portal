export default function Dashboard() {
  const cards = [
    { title: "Total Candidates", value: 120 },
    { title: "Passed", value: 74 },
    { title: "Failed", value: 46 },
    { title: "Questions", value: 215 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-5"
          >
            <p className="text-gray-500">{card.title}</p>
            <h2 className="text-3xl font-bold mt-3">
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Recent Activity
        </h2>

        <p className="text-gray-500">
          New candidate registrations and exam analytics
          will appear here.
        </p>
      </div>
    </div>
  );
}
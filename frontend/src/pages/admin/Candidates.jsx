export default function Candidates() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Candidate Details
      </h1>

      <div className="bg-white p-5 rounded-xl shadow">

        <input
          placeholder="Search Candidate..."
          className="border p-2 rounded w-full mb-4"
        />

        <table className="w-full border">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">App No</th>
              <th>Name</th>
              <th>Email</th>
              <th>CGPA</th>
              <th>Resume</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t text-center">
              <td className="p-3">IBS001</td>
              <td>Rahul</td>
              <td>rahul@gmail.com</td>
              <td>8.2</td>
              <td>
                <button className="bg-green-600 text-white px-3 py-1 rounded">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
}
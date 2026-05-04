export default function Users() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        User Management
      </h1>

      <div className="bg-white p-5 rounded-xl shadow">
        <table className="w-full border">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t text-center">
              <td className="p-3">Admin</td>
              <td>admin@ibs.com</td>
              <td>HR</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
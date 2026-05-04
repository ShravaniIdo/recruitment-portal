import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-white text-blue-900 font-semibold"
        : "text-white hover:bg-blue-800"
    }`;

  return (
    <div className="w-64 bg-blue-900 p-5">
      <h1 className="text-white text-2xl font-bold mb-10">
        IBS Admin
      </h1>

      <div className="space-y-3">
        <NavLink to="/admin" end className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/questions" className={linkClass}>
          Questions
        </NavLink>

        <NavLink to="/admin/candidates" className={linkClass}>
          Candidates
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          Users
        </NavLink>
      </div>
    </div>
  );
}
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h1 className="logo">IBS Admin</h1>

      <ul className="menu">
        <li><NavLink to="/">Dashboard</NavLink></li>
        <li><NavLink to="/questions">Questions</NavLink></li>
        <li><NavLink to="/candidates">Candidates</NavLink></li>
        <li><NavLink to="/users">Users</NavLink></li>
      </ul>
    </div>
  );
}
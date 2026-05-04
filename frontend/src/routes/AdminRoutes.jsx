import { Routes, Route } from "react-router-dom";

import AdminLayout from "../components/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Questions from "../pages/admin/Questions";
import Candidates from "../pages/admin/Candidates";
import Users from "../pages/admin/Users";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="questions" element={<Questions />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  );
}
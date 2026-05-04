import { Routes, Route } from "react-router-dom";
import RegisterPage from "../pages/registration/RegisterPage";
import TestPage from "../pages/test/TestPage";
import ResultPage from "../pages/result/ResultPage";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/" element={<RegisterPage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/result" element={<ResultPage />} />
      
    </Routes>
  );
};

export default AppRoutes;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginAdmin from "./pages/LoginAdmin";
import DashboardAdmin from "./pages/DashboardAdmin";
import Users from "./pages/Users";
import Clinics from "./pages/Clinics";
import Operators from "./pages/Operators";
import Logs from "./pages/Logs";

export default function AppAdmin() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/login" element={<LoginAdmin />} />
        <Route path="/dashboard" element={<DashboardAdmin />} />
        <Route path="/users" element={<Users />} />
        <Route path="/clinics" element={<Clinics />} />
        <Route path="/operators" element={<Operators />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

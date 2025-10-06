import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Pacientes from "../pages/Pacientes";
import Citas from "../pages/Citas";
import Estadisticas from "../pages/Estadisticas";
import Configuracion from "../pages/Configuracion";
import Login from "../pages/Login";

export default function AppDoctor() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/citas" element={<Citas />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

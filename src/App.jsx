import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Campaigns from "./pages/Campaigns.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Education from "./pages/Education.jsx";
import Employees from "./pages/Employees.jsx";
import FakeLogin from "./pages/FakeLogin.jsx";
import FakePassword from "./pages/FakePassword.jsx";
import FakeVerify from "./pages/FakeVerify.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Reports from "./pages/Reports.jsx";
import Templates from "./pages/Templates.jsx";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("phishscale_token");
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  const token = localStorage.getItem("phishscale_token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <Campaigns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <Templates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route path="/login/:token" element={<FakeLogin />} />
        <Route path="/login/:token/password" element={<FakePassword />} />
        <Route path="/login/:token/verify" element={<FakeVerify />} />
        <Route path="/education" element={<Education />} />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

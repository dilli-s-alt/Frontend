import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { safeLocalStorage } from "./utils/storage.js";

const Campaigns = lazy(() => import("./pages/Campaigns.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Education = lazy(() => import("./pages/Education.jsx"));
const Employees = lazy(() => import("./pages/Employees.jsx"));
const FakeLogin = lazy(() => import("./pages/FakeLogin.jsx"));
const FakePassword = lazy(() => import("./pages/FakePassword.jsx"));
const FakeVerify = lazy(() => import("./pages/FakeVerify.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Reports = lazy(() => import("./pages/Reports.jsx"));
const Templates = lazy(() => import("./pages/Templates.jsx"));

function ProtectedRoute({ children }) {
  const token = safeLocalStorage.getItem("phishscale_token");
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  const token = safeLocalStorage.getItem("phishscale_token");

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loading-screen">Loading workspace...</div>}>
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
      </Suspense>
    </BrowserRouter>
  );
}

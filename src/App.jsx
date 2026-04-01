import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FakeLogin from "./pages/FakeLogin";
import Education from "./pages/Education";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login/:token" element={<FakeLogin />} />
        <Route path="/education" element={<Education />} />
      </Routes>
    </BrowserRouter>
  );
}
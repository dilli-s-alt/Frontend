import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { apiBase } from "../api";
import { getAuthErrorMessage } from "../utils/authErrors.js";
import { safeLocalStorage } from "../utils/storage.js";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      safeLocalStorage.setItem("phishscale_token", data.token);
      safeLocalStorage.setItem("phishscale_user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(getAuthErrorMessage(err, "Unable to log in. Check your email and password."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <p className="eyebrow">PhishScale</p>
        <h1>Simple glowing admin login for your phishing awareness project.</h1>
        <p>
          Sign in to manage campaigns, upload target lists, review results, and keep the whole project in one neat dashboard.
        </p>
        <div className="hero-badges">
          <span>Login</span>
          <span>Dashboard</span>
          <span>Reports</span>
        </div>
      </section>

      <form className="auth-card" onSubmit={submit}>
        <div>
          <p className="eyebrow">Admin Access</p>
          <h2>Login</h2>
          <p className="muted">Enter your admin email and password to open the workspace.</p>
        </div>

        <label>
          Email address
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            required
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button className="primary-btn" type="submit" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>

        <p className="muted small-text">
          Need a tenant? <Link to="/register">Create an organization</Link>
        </p>
        <p className="support-copy">Demo login: `admin@phishscale.demo` / `Admin@123`</p>
        <p className="support-copy">API target: `{apiBase || "/api"}`</p>
        <p className="auth-footer-note">This frontend is intentionally simple and project-ready.</p>
      </form>
    </div>
  );
}

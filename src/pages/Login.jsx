import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
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
      setError(err.response?.data?.message || "Unable to log in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <p className="eyebrow">PhishScale</p>
        <h1>Login and manage your phishing awareness campaigns.</h1>
        <p>
          This website lets an administrator create campaigns, add target data, send tracked emails, and review reports in one place.
        </p>
        <div className="hero-badges">
          <span>Targets</span>
          <span>Campaigns</span>
          <span>Reports</span>
        </div>
      </section>

      <form className="auth-card" onSubmit={submit}>
        <div>
          <p className="eyebrow">Admin Access</p>
          <h2>Login</h2>
          <p className="muted">Enter your administrator email and password.</p>
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
      </form>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@phishscale.demo", password: "Admin@123" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("phishscale_token", data.token);
      localStorage.setItem("phishscale_user", JSON.stringify(data.user));
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
        <h1>Experiential phishing simulations for modern security teams.</h1>
        <p>
          Launch safe awareness campaigns, monitor opens and clicks in real time, and redirect employees to teachable moments instead of storing risky data.
        </p>
        <div className="hero-badges">
          <span>CSV target import</span>
          <span>Tracked email opens</span>
          <span>Demo-safe credential simulation</span>
        </div>
      </section>

      <form className="auth-card" onSubmit={submit}>
        <div>
          <p className="eyebrow">Welcome Back</p>
          <h2>Admin Login</h2>
          <p className="muted">Use the seeded demo account or create your own workspace.</p>
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

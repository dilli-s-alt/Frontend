import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function FakeLogin() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [context, setContext] = useState(null);
  const [form, setForm] = useState({ username: "", password: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/track/context/${token}`).then(({ data }) => setContext(data)).catch(() => setContext(null));
  }, [token]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await api.post("/track/submit", { token, ...form });
      navigate(`/education?token=${token}`);
    } finally {
      setBusy(false);
    }
  };

  const title = context?.template?.landingTitle || "Secure Sign-In";

  return (
    <div className="trap-shell">
      <div className="trap-brand">
        <div className="brand-mark" />
        <span>{title}</span>
      </div>

      <form className="trap-card" onSubmit={submit}>
        <h1>Sign in</h1>
        <p className="muted">{context ? `Welcome back, ${context.target.firstName}. Continue to access your account.` : "Loading branded sign-in page..."}</p>

        <label>
          Email, phone, or username
          <input
            value={form.username}
            onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
            placeholder={context?.target?.email || "name@company.com"}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Password"
            required
          />
        </label>

        <button className="primary-btn full-width" type="submit" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>

        <p className="tiny-note">This simulation records only that data was entered. It never stores the password itself.</p>
      </form>
    </div>
  );
}

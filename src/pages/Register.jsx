import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    organizationName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/auth/register", form);
      localStorage.setItem("phishscale_token", data.token);
      localStorage.setItem("phishscale_user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create the workspace.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-hero accent-alt">
        <p className="eyebrow">Secure Training Starts Here</p>
        <h1>Create an organization and launch your first awareness drill.</h1>
        <p>
          The free tier is perfect for evaluation mode and student demos, with test-mode sending and target limits built in.
        </p>
      </section>

      <form className="auth-card" onSubmit={submit}>
        <div>
          <p className="eyebrow">New Workspace</p>
          <h2>Register</h2>
        </div>

        <div className="grid-2">
          <label>
            First name
            <input value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} required />
          </label>
          <label>
            Last name
            <input value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} required />
          </label>
        </div>

        <label>
          Organization name
          <input value={form.organizationName} onChange={(event) => setForm((current) => ({ ...current, organizationName: event.target.value }))} required />
        </label>

        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
        </label>

        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button className="primary-btn" type="submit" disabled={busy}>
          {busy ? "Creating..." : "Create workspace"}
        </button>

        <p className="muted small-text">
          Already registered? <Link to="/">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

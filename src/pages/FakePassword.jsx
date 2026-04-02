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

export default function FakePassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [context, setContext] = useState(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const flow = readFlow(token);
    if (!flow.username) {
      navigate(`/login/${token}`);
      return;
    }
    api.get(`/track/context/${token}`).then(({ data }) => setContext(data)).catch(() => setContext(null));
  }, [token, navigate]);

  const submit = (event) => {
    event.preventDefault();
    writeFlow(token, { password });
    navigate(`/login/${token}/verify`);
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
          <span className="done" />
          <span className="active" />
          <span />
        </div>
        <h1>Enter password</h1>
        <p className="muted">Your details are being processed securely. Continue to complete sign-in.</p>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
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

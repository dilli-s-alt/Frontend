import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { readJson, safeSessionStorage } from "../utils/storage.js";

const sessionKey = (token) => `phishscale_flow_${token}`;

const readFlow = (token) => readJson(safeSessionStorage, sessionKey(token), {});

const clearFlow = (token) => {
  safeSessionStorage.removeItem(sessionKey(token));
};

export default function FakeVerify() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [context, setContext] = useState(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const flow = readFlow(token);
    if (!flow.username || !flow.password) {
      navigate(`/login/${token}`);
      return;
    }
    api.get(`/track/context/${token}`).then(({ data }) => setContext(data)).catch(() => setContext(null));
  }, [token, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    const flow = readFlow(token);
    setBusy(true);
    try {
      await api.post("/track/submit", {
        token,
        username: flow.username,
        password: flow.password,
        verificationCodeEntered: Boolean(code.trim())
      });
      clearFlow(token);
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
        <div className="progress-dots">
          <span className="done" />
          <span className="done" />
          <span className="active" />
        </div>
        <h1>Verify identity</h1>
        <p className="muted">Enter the one-time code from your authenticator or mobile device to finish signing in.</p>

        <label>
          Verification code
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="123456"
            inputMode="numeric"
            autoComplete="off"
            required
          />
        </label>

        <button className="primary-btn full-width" type="submit" disabled={busy}>
          {busy ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}

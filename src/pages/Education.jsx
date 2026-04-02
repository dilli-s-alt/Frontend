import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";

export default function Education() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const missing = params.get("missing");
  const [context, setContext] = useState(null);

  useEffect(() => {
    if (!token) return;
    api.get(`/track/context/${token}`).then(({ data }) => setContext(data)).catch(() => setContext(null));
  }, [token]);

  return (
    <div className="education-shell">
      <section className="education-card">
        <p className="eyebrow">Teachable Moment</p>
        <h1>{missing ? "This simulation link is no longer active." : "Oops. This was a phishing simulation."}</h1>
        <p>
          The goal is still the same: keep the lesson clear, calm, and easy to understand after the simulated flow.
        </p>

        <div className="clue-list">
          {(context?.clues || [
            "Urgent language is designed to make you act before you verify.",
            "Unexpected login links are safer to ignore until you confirm the source.",
            "When in doubt, open the known company portal yourself instead of using the email button."
          ]).map((clue) => (
            <article className="clue-card" key={clue}>
              <strong>Clue</strong>
              <p>{clue}</p>
            </article>
          ))}
        </div>

        <div className="education-footer">
          <p className="muted">Practice tips: hover over links, verify the sender, and report suspicious emails to your security team.</p>
          <Link className="primary-btn link-btn" to="/">Back to Admin Portal</Link>
        </div>
      </section>
    </div>
  );
}

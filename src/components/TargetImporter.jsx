import { useState } from "react";
import { DEPARTMENTS } from "../constants.js";

export default function TargetImporter({ campaigns, onUpload, onAddTarget, busy }) {
  const [campaignId, setCampaignId] = useState("");
  const [file, setFile] = useState(null);
  const [manualTarget, setManualTarget] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    campaignId: ""
  });

  const submitFile = async (event) => {
    event.preventDefault();
    if (!campaignId || !file) return;
    await onUpload({ campaignId, file });
    setFile(null);
    event.target.reset();
  };

  const submitManual = async (event) => {
    event.preventDefault();
    await onAddTarget(manualTarget);
    setManualTarget({ firstName: "", lastName: "", email: "", department: "", campaignId: manualTarget.campaignId });
  };

  return (
    <div className="stack-gap">
      <div className="card form-card">
        <div className="section-head compact">
          <div>
            <p className="eyebrow">Required Target Data</p>
            <h3>Use These 4 Fields Only</h3>
          </div>
        </div>
        <div className="detail-stack">
          <div className="detail-row"><strong>1. First Name</strong><span>Required</span></div>
          <div className="detail-row"><strong>2. Last Name</strong><span>Required</span></div>
          <div className="detail-row"><strong>3. Email</strong><span>Real target email</span></div>
          <div className="detail-row"><strong>4. Department</strong><span>Choose one department</span></div>
        </div>
        <p className="muted">Do not use demo emails. Use real email addresses only if you want real delivery.</p>
      </div>

      <form className="card form-card" onSubmit={submitFile}>
        <div className="section-head compact">
          <div>
            <p className="eyebrow">Step 1</p>
            <h3>Import Many Targets</h3>
          </div>
        </div>

        <label>
          Campaign
          <select value={campaignId} onChange={(event) => setCampaignId(event.target.value)} required>
            <option value="">Select a campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </label>

        <label className="file-input">
          CSV file
          <input type="file" accept=".csv" onChange={(event) => setFile(event.target.files?.[0] || null)} required />
          <span className="muted">Column order must be exactly: First Name, Last Name, Email, Department</span>
        </label>

        <button className="primary-btn" type="submit" disabled={busy}>
          {busy ? "Importing..." : "Upload CSV"}
        </button>
      </form>

      <form className="card form-card" onSubmit={submitManual}>
        <div className="section-head compact">
          <div>
            <p className="eyebrow">Step 2</p>
            <h3>Add One Target</h3>
          </div>
        </div>

        <div className="grid-2">
          <label>
            First name
            <input
              value={manualTarget.firstName}
              onChange={(event) => setManualTarget((current) => ({ ...current, firstName: event.target.value }))}
              required
            />
          </label>
          <label>
            Last name
            <input
              value={manualTarget.lastName}
              onChange={(event) => setManualTarget((current) => ({ ...current, lastName: event.target.value }))}
              required
            />
          </label>
        </div>

        <div className="grid-2">
          <label>
            Work email
            <input
              type="email"
              value={manualTarget.email}
              onChange={(event) => setManualTarget((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>
          <label>
            Department
            <select
              value={manualTarget.department}
              onChange={(event) => setManualTarget((current) => ({ ...current, department: event.target.value }))}
              required
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.filter((department) => department !== "All Departments").map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Campaign
          <select
            value={manualTarget.campaignId}
            onChange={(event) => setManualTarget((current) => ({ ...current, campaignId: event.target.value }))}
            required
          >
            <option value="">Select a campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </label>

        <button className="secondary-btn" type="submit" disabled={busy}>
          {busy ? "Saving..." : "Add target"}
        </button>
      </form>
    </div>
  );
}

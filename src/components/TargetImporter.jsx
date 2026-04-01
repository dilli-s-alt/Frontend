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
      <form className="card form-card" onSubmit={submitFile}>
        <div className="section-head compact">
          <div>
            <p className="eyebrow">Week 1</p>
            <h3>Import Target Group</h3>
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
          <span className="muted">Expected columns: First Name, Last Name, Email, Department</span>
        </label>

        <button className="primary-btn" type="submit" disabled={busy}>
          {busy ? "Importing..." : "Upload CSV"}
        </button>
      </form>

      <form className="card form-card" onSubmit={submitManual}>
        <div className="section-head compact">
          <div>
            <p className="eyebrow">Quick Add</p>
            <h3>Add Single Target</h3>
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

import { useEffect, useMemo, useState } from "react";
import api from "../api";
import CampaignForm from "../components/CampaignForm.jsx";
import TargetImporter from "../components/TargetImporter.jsx";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [activeCampaignId, setActiveCampaignId] = useState("");
  const [campaignDetail, setCampaignDetail] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [{ data: dashboardData }, { data: templateData }] = await Promise.all([
      api.get("/campaigns/dashboard"),
      api.get("/campaigns/templates")
    ]);

    setDashboard(dashboardData);
    setTemplates(templateData);

    if (!activeCampaignId && dashboardData.campaigns[0]) {
      setActiveCampaignId(dashboardData.campaigns[0].id);
    }
  };

  useEffect(() => {
    load().catch((err) => setError(err.response?.data?.message || "Failed to load dashboard."));
  }, []);

  useEffect(() => {
    if (!activeCampaignId) return;
    api
      .get(`/campaigns/${activeCampaignId}`)
      .then(({ data }) => setCampaignDetail(data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load campaign details."));
  }, [activeCampaignId, dashboard?.campaigns?.length]);

  const runAction = async (work, successMessage) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await work();
      await load();
      setMessage(successMessage);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const createCampaign = (form) =>
    runAction(async () => {
      await api.post("/campaigns", form);
    }, "Campaign created successfully.");

  const uploadTargets = ({ campaignId, file }) =>
    runAction(async () => {
      const formData = new FormData();
      formData.append("campaignId", campaignId);
      formData.append("file", file);
      await api.post("/targets/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setActiveCampaignId(campaignId);
    }, "Targets imported successfully.");

  const addTarget = (target) =>
    runAction(async () => {
      await api.post("/targets", target);
      setActiveCampaignId(target.campaignId);
    }, "Target added successfully.");

  const sendCampaign = (campaignId, options) =>
    runAction(async () => {
      const { data } = await api.post(`/campaigns/${campaignId}/send`, options);
      if (data.previews?.[0]) {
        setMessage(`${data.message} Sent to ${data.previews[0].to}`);
      }
    }, "Campaign sent.");

  const logout = () => {
    localStorage.removeItem("phishscale_token");
    localStorage.removeItem("phishscale_user");
    window.location.href = "/";
  };

  const campaigns = dashboard?.campaigns || [];
  const activeCampaign = campaigns.find((campaign) => campaign.id === activeCampaignId) || campaigns[0];
  const activeTargets = useMemo(() => campaignDetail?.targets || [], [campaignDetail]);

  if (!dashboard) {
    return <div className="loading-screen">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-shell">
      <header className="topbar simple-topbar">
        <div>
          <p className="eyebrow">PhishScale</p>
          <h1>Dashboard</h1>
          <p className="muted">
            {dashboard.organization.name} | {dashboard.summary.campaignCount} campaigns | {dashboard.summary.targetCount} targets
          </p>
        </div>
        <button className="ghost-btn" onClick={logout}>Logout</button>
      </header>

      {message ? <div className="notice success">{message}</div> : null}
      {error ? <div className="notice error">{error}</div> : null}

      <section className="simple-summary">
        <div className="card simple-card">
          <h3>Total Campaigns</h3>
          <p className="simple-number">{dashboard.summary.campaignCount}</p>
        </div>
        <div className="card simple-card">
          <h3>Total Targets</h3>
          <p className="simple-number">{dashboard.summary.targetCount}</p>
        </div>
        <div className="card simple-card">
          <h3>Open Rate</h3>
          <p className="simple-number">{dashboard.summary.openRate}%</p>
        </div>
      </section>

      <section className="main-grid">
        <CampaignForm templates={templates} onSubmit={createCampaign} busy={busy} />
        <TargetImporter campaigns={campaigns} onUpload={uploadTargets} onAddTarget={addTarget} busy={busy} />
      </section>

      <section className="card simple-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Campaigns</p>
            <h2>Select Campaign</h2>
          </div>
          {activeCampaign ? (
            <div className="action-row">
              <select value={activeCampaignId} onChange={(event) => setActiveCampaignId(event.target.value)}>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
              <button className="secondary-btn" onClick={() => sendCampaign(activeCampaign.id, { testMode: true, sendToSelf: true })}>
                Send Test
              </button>
              <button className="primary-btn" onClick={() => sendCampaign(activeCampaign.id, { testMode: false, sendToSelf: false })}>
                Send Campaign
              </button>
            </div>
          ) : null}
        </div>

        <div className="simple-campaign-list">
          {campaigns.map((campaign) => (
            <button
              key={campaign.id}
              className={`simple-campaign-item ${campaign.id === activeCampaign?.id ? "selected" : ""}`}
              onClick={() => setActiveCampaignId(campaign.id)}
            >
              <strong>{campaign.name}</strong>
              <span>{campaign.templateName}</span>
              <span>{campaign.targetCount} targets</span>
            </button>
          ))}
          {!campaigns.length ? <p className="muted">No campaigns created yet.</p> : null}
        </div>
      </section>

      <section className="data-grid simple-data-grid">
        <div className="card table-card">
          <div className="section-head compact">
            <div>
              <p className="eyebrow">Targets</p>
              <h3>{activeCampaign?.name || "Campaign details"}</h3>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeTargets.map((target) => (
                  <tr key={target.id}>
                    <td>{target.firstName} {target.lastName}</td>
                    <td>{target.email}</td>
                    <td>{target.department}</td>
                    <td>{target.status}</td>
                  </tr>
                ))}
                {!activeTargets.length ? (
                  <tr>
                    <td colSpan="4" className="muted">No targets available for this campaign.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card table-card">
          <div className="section-head compact">
            <div>
              <p className="eyebrow">Recent Activity</p>
              <h3>Latest Events</h3>
            </div>
          </div>
          <div className="timeline">
            {(campaignDetail?.timeline || dashboard.timeline).map((event) => (
              <div key={event.id} className="timeline-item">
                <strong>{event.kind}</strong>
                <p>{event.campaignName}</p>
                <span>{new Date(event.createdAt).toLocaleString()}</span>
              </div>
            ))}
            {!(campaignDetail?.timeline || dashboard.timeline).length ? (
              <p className="muted">No activity yet.</p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

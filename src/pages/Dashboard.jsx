import { useEffect, useMemo, useState } from "react";
import api, { apiBase } from "../api";
import BarChart from "../components/BarChart.jsx";
import CampaignForm from "../components/CampaignForm.jsx";
import MetricCard from "../components/MetricCard.jsx";
import TargetImporter from "../components/TargetImporter.jsx";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [activeCampaignId, setActiveCampaignId] = useState("");
  const [campaignDetail, setCampaignDetail] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState("All");
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
    const query = departmentFilter !== "All" ? `?department=${encodeURIComponent(departmentFilter)}` : "";
    api
      .get(`/campaigns/${activeCampaignId}${query}`)
      .then(({ data }) => setCampaignDetail(data))
      .catch(() => setCampaignDetail(null));
  }, [activeCampaignId, departmentFilter, dashboard?.campaigns?.length]);

  const campaigns = dashboard?.campaigns || [];
  const activeCampaign = campaigns.find((campaign) => campaign.id === activeCampaignId) || campaigns[0];
  const activeTargets = useMemo(() => campaignDetail?.targets || [], [campaignDetail]);

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
    }, "Campaign created.");

  const uploadTargets = ({ campaignId, file }) =>
    runAction(async () => {
      const formData = new FormData();
      formData.append("campaignId", campaignId);
      formData.append("file", file);
      await api.post("/targets/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setActiveCampaignId(campaignId);
    }, "Targets imported from CSV.");

  const addTarget = (target) =>
    runAction(async () => {
      await api.post("/targets", target);
      setActiveCampaignId(target.campaignId);
    }, "Target added.");

  const sendCampaign = (campaignId, options) =>
    runAction(async () => {
      const { data } = await api.post(`/campaigns/${campaignId}/send`, options);
      if (data.previews?.[0]) {
        setMessage(`${data.message} Preview recipient: ${data.previews[0].to}`);
      }
    }, "Campaign delivery prepared.");

  const logout = () => {
    localStorage.removeItem("phishscale_token");
    localStorage.removeItem("phishscale_user");
    window.location.href = "/";
  };

  const selectedDepartments = campaignDetail?.departments || ["All"];

  useEffect(() => {
    if (!selectedDepartments.includes(departmentFilter)) {
      setDepartmentFilter("All");
    }
  }, [departmentFilter, selectedDepartments]);

  if (!dashboard) {
    return <div className="loading-screen">Loading PhishScale dashboard...</div>;
  }

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Security Awareness Platform</p>
          <h1>PhishScale Control Center</h1>
          <p className="muted">
            {dashboard.organization.name} • {dashboard.organization.subscriptionTier} tier • Demo account: {dashboard.seedCredentials.email}
          </p>
        </div>
        <div className="topbar-actions">
          <div className="status-pill">API: {apiBase}</div>
          <button className="ghost-btn" onClick={logout}>Sign out</button>
        </div>
      </header>

      {message ? <div className="notice success">{message}</div> : null}
      {error ? <div className="notice error">{error}</div> : null}

      <section className="metric-grid">
        <MetricCard label="Open Rate" value={`${dashboard.summary.openRate}%`} hint="Recipients who loaded the tracking pixel" />
        <MetricCard label="Click Rate" value={`${dashboard.summary.clickRate}%`} hint="Employees who clicked the phishing link" />
        <MetricCard label="Compromise Rate" value={`${dashboard.summary.compromiseRate}%`} hint="Users who typed data into the fake form" />
        <MetricCard label="Targets Managed" value={dashboard.summary.targetCount} hint={`${dashboard.summary.campaignCount} campaigns in this organization`} />
      </section>

      <section className="main-grid">
        <CampaignForm templates={templates} onSubmit={createCampaign} busy={busy} />
        <TargetImporter campaigns={campaigns} onUpload={uploadTargets} onAddTarget={addTarget} busy={busy} />
      </section>

      <section className="analytics-grid">
        <BarChart title="Department Click Rate" rows={dashboard.departments} valueKey="clickRate" colorClass="amber" />
        <BarChart title="Department Compromise Rate" rows={dashboard.departments} valueKey="compromiseRate" colorClass="rose" />
      </section>

      <section className="campaign-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Campaign Operations</p>
            <h2>Launches and Target Groups</h2>
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
              <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}>
                {selectedDepartments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              <button className="secondary-btn" onClick={() => sendCampaign(activeCampaign.id, { testMode: true, sendToSelf: true })}>
                Send Test
              </button>
              <button className="primary-btn" onClick={() => sendCampaign(activeCampaign.id, { testMode: false, sendToSelf: false })}>
                Launch Campaign
              </button>
            </div>
          ) : null}
        </div>

        <div className="campaign-list">
          {campaigns.map((campaign) => (
            <article
              key={campaign.id}
              className={`campaign-card ${campaign.id === activeCampaign?.id ? "selected" : ""}`}
              onClick={() => setActiveCampaignId(campaign.id)}
            >
              <div>
                <p className="eyebrow">{campaign.templateName}</p>
                <h3>{campaign.name}</h3>
                <p className="muted">{campaign.departmentFocus} • {campaign.status}</p>
              </div>
              <div className="campaign-stats">
                <span>{campaign.metrics.openRate}% opened</span>
                <span>{campaign.metrics.clickRate}% clicked</span>
                <span>{campaign.metrics.compromiseRate}% submitted</span>
              </div>
            </article>
          ))}
        </div>

        {campaignDetail ? (
          <div className="analytics-grid">
            <BarChart
              title={`${campaignDetail.campaign.name} Department Click Rate`}
              rows={campaignDetail.departmentStats}
              valueKey="clickRate"
              colorClass="amber"
            />
            <BarChart
              title={`${campaignDetail.campaign.name} Department Open Rate`}
              rows={campaignDetail.departmentStats}
              valueKey="openRate"
              colorClass="rose"
            />
          </div>
        ) : null}

        <div className="data-grid">
          <div className="card table-card">
            <div className="section-head compact">
              <div>
                <p className="eyebrow">Targets</p>
                <h3>{activeCampaign?.name || "Select a campaign"}</h3>
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
                    <th>Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTargets.map((target) => (
                    <tr key={target.id}>
                      <td>{target.firstName} {target.lastName}</td>
                      <td>{target.email}</td>
                      <td>{target.department}</td>
                      <td>{target.status}</td>
                      <td>{target.token ? `/login/${target.token}` : "Pending send"}</td>
                    </tr>
                  ))}
                  {campaignDetail && !activeTargets.length ? (
                    <tr>
                      <td colSpan="5" className="muted">No targets loaded for this campaign and filter yet.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card table-card">
            <div className="section-head compact">
              <div>
                <p className="eyebrow">Campaign Detail</p>
                <h3>{campaignDetail?.campaign?.name || "Recent Events"}</h3>
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
              {!dashboard.timeline.length ? <p className="muted">Events will appear here after targets interact.</p> : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import CampaignForm from "../components/CampaignForm.jsx";
import useAdminData from "../hooks/useAdminData.js";
import api from "../api";

export default function Campaigns() {
  const {
    dashboard,
    templates,
    campaigns,
    activeCampaign,
    activeCampaignId,
    setActiveCampaignId,
    campaignDetail,
    refresh,
    loading,
    error,
    setError
  } = useAdminData();
  const [message, setMessage] = useState("");
  const [sendResults, setSendResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [mailStatus, setMailStatus] = useState(null);

  useEffect(() => {
    api.get("/health").then(({ data }) => setMailStatus(data.mailStatus || null)).catch(() => setMailStatus(null));
  }, []);

  const runAction = async (work, successMessage) => {
    setBusy(true);
    setError("");
    setMessage("");
    setSendResults([]);
    try {
      await work();
      await refresh();
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

  const sendCampaign = (campaignId, options) =>
    runAction(async () => {
      const { data } = await api.post(`/campaigns/${campaignId}/send`, options);
      setMessage(data.message || "Campaign processed.");
      setSendResults(data.results || []);
    }, "Campaign sent.");

  if (loading && !dashboard) {
    return <div className="loading-screen">Loading campaigns...</div>;
  }

  return (
    <AdminLayout
      title="Campaigns"
      subtitle="Simple order: create campaign, add targets, check mail status, then send the live campaign."
    >
      {message ? <div className="notice success">{message}</div> : null}
      {error ? <div className="notice error">{error}</div> : null}

      <section className="main-grid">
        <CampaignForm templates={templates} onSubmit={createCampaign} busy={busy} />

        <div className="card form-card">
          <div className="section-head compact">
            <div>
              <p className="eyebrow">Step 1</p>
              <h3>{activeCampaign?.name || "No campaign selected"}</h3>
            </div>
          </div>

          <label>
            Campaign
            <select value={activeCampaignId} onChange={(event) => setActiveCampaignId(event.target.value)}>
              <option value="">Select a campaign</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </label>

          {activeCampaign ? (
            <>
              <div className="detail-stack">
                <div className="detail-row"><strong>Template</strong><span>{activeCampaign.templateName}</span></div>
                <div className="detail-row"><strong>Targets</strong><span>{activeCampaign.targetCount}</span></div>
                <div className="detail-row"><strong>Open rate</strong><span>{activeCampaign.metrics.openRate}%</span></div>
                <div className="detail-row"><strong>Click rate</strong><span>{activeCampaign.metrics.clickRate}%</span></div>
                <div className="detail-row"><strong>Department focus</strong><span>{activeCampaign.departmentFocus}</span></div>
              </div>
              <div className="action-row">
                <button className="secondary-btn" onClick={() => sendCampaign(activeCampaign.id, { testMode: true, sendToSelf: true })}>
                  Send test
                </button>
                <button
                  className="primary-btn"
                  onClick={() => sendCampaign(activeCampaign.id, { testMode: false, sendToSelf: false })}
                  disabled={!mailStatus?.ready || busy}
                >
                  Send live campaign
                </button>
              </div>
              {!mailStatus?.ready ? (
                <p className="error-text">Live send is blocked until SMTP Delivery Readiness says Yes.</p>
              ) : null}
            </>
          ) : (
            <p className="muted">Create a campaign first to see details here.</p>
          )}
        </div>
      </section>

      <section className="card table-card">
        <div className="section-head compact">
          <div>
            <p className="eyebrow">Step 2</p>
            <h3>SMTP Delivery Readiness</h3>
          </div>
        </div>
        {mailStatus ? (
          <div className="detail-stack">
            <div className="detail-row"><strong>Mode</strong><span>{mailStatus.mode}</span></div>
            <div className="detail-row"><strong>Ready</strong><span>{mailStatus.ready ? "Yes" : "No"}</span></div>
            <div className="detail-row"><strong>Sender email</strong><span>{mailStatus.senderEmail || "Not set"}</span></div>
            <div className="detail-row"><strong>Reply-To email</strong><span>{mailStatus.replyToEmail || "Not set"}</span></div>
            <div className="detail-row"><strong>SMTP host</strong><span>{mailStatus.smtpHost || "Not set"}</span></div>
            <div className="detail-row"><strong>SMTP port</strong><span>{mailStatus.smtpPort || "Not set"}</span></div>
            <div className="detail-row"><strong>Status</strong><span>{mailStatus.message}</span></div>
          </div>
        ) : (
          <p className="muted">Mail status could not be loaded from the backend.</p>
        )}
      </section>

      {sendResults.length ? (
        <section className="card table-card">
          <div className="section-head compact">
            <div>
              <p className="eyebrow">Step 3</p>
              <h3>Latest Send Attempt</h3>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Mode</th>
                  <th>Delivered</th>
                  <th>SMTP response</th>
                </tr>
              </thead>
              <tbody>
                {sendResults.map((result) => (
                  <tr key={`${result.to}-${result.mode}`}>
                    <td>{result.to}</td>
                    <td>{result.mode}</td>
                    <td>{result.delivered ? "Yes" : "No"}</td>
                    <td>{result.response || result.rejected?.join(", ") || "Preview only"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="card simple-section">
        <div className="section-head compact">
          <div>
            <p className="eyebrow">Campaign List</p>
            <h3>All Campaigns</h3>
          </div>
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

      {campaignDetail ? (
        <section className="card table-card">
          <div className="section-head compact">
            <div>
              <p className="eyebrow">Timeline</p>
              <h3>{campaignDetail.campaign.name}</h3>
            </div>
          </div>
          <div className="timeline">
            {campaignDetail.timeline.map((event) => (
              <div key={event.id} className="timeline-item">
                <strong>{event.kind}</strong>
                <p>{event.campaignName}</p>
                <span>{new Date(event.createdAt).toLocaleString()}</span>
              </div>
            ))}
            {!campaignDetail.timeline.length ? <p className="muted">No activity for this campaign yet.</p> : null}
          </div>
        </section>
      ) : null}
    </AdminLayout>
  );
}

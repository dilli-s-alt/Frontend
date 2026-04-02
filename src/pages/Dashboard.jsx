import AdminLayout from "../components/AdminLayout.jsx";
import useAdminData from "../hooks/useAdminData.js";

function formatTrackingLabel(status) {
  if (!status) {
    return "Queued";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function Dashboard() {
  const {
    dashboard,
    campaigns,
    activeCampaign,
    activeCampaignId,
    setActiveCampaignId,
    campaignDetail,
    loading,
    error
  } = useAdminData();

  if (loading && !dashboard) {
    return <div className="loading-screen">Loading workspace...</div>;
  }

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Login first, then review campaign targets and tracking activity from one main dashboard."
    >
      {error ? <div className="notice error">{error}</div> : null}

      {dashboard ? (
        <>
          <section className="glow-grid">
            <div className="card overview-hero">
              <p className="eyebrow">Project Workflow</p>
              <h2>Login, choose a campaign, review targets, then monitor opens, clicks, and submissions.</h2>
              <p className="muted">
                This first screen after login is now focused on the real project flow from the README: targets and tracking first.
              </p>
              <div className="hero-stats">
                <span>{dashboard.summary.campaignCount} campaigns</span>
                <span>{dashboard.summary.targetCount} targets</span>
                <span>{dashboard.summary.deliveryCount} deliveries</span>
              </div>
            </div>

            <div className="stat-panel card">
              <p className="eyebrow">Workspace</p>
              <strong>{dashboard.organization.name}</strong>
              <p className="muted">Current subscription: {dashboard.organization.subscriptionTier}</p>
              <div className="detail-stack">
                <div className="detail-row"><strong>Open Rate</strong><span>{dashboard.summary.openRate}%</span></div>
                <div className="detail-row"><strong>Click Rate</strong><span>{dashboard.summary.clickRate}%</span></div>
                <div className="detail-row"><strong>Submit Rate</strong><span>{dashboard.summary.compromiseRate}%</span></div>
                <div className="detail-row"><strong>Workspace Slug</strong><span>{dashboard.organization.slug}</span></div>
              </div>
            </div>
          </section>

          <section className="simple-summary">
            <div className="card simple-card">
              <p className="eyebrow">Campaigns</p>
              <h3>Total Campaigns</h3>
              <p className="simple-number">{dashboard.summary.campaignCount}</p>
            </div>
            <div className="card simple-card">
              <p className="eyebrow">Targets</p>
              <h3>Total Targets</h3>
              <p className="simple-number">{dashboard.summary.targetCount}</p>
            </div>
            <div className="card simple-card">
              <p className="eyebrow">Engagement</p>
              <h3>Open Rate</h3>
              <p className="simple-number">{dashboard.summary.openRate}%</p>
            </div>
          </section>

          <section className="card table-card">
            <div className="section-head compact">
              <div>
                <p className="eyebrow">Step 1</p>
                <h3>Select campaign</h3>
                <p className="muted">Choose the campaign whose target list and tracking details you want to inspect.</p>
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
          </section>

          <section className="data-grid">
            <div className="card table-card">
              <div className="section-head compact">
                <div>
                  <p className="eyebrow">Active Campaign</p>
                  <h3>{activeCampaign?.name || "No campaign selected"}</h3>
                </div>
              </div>
              <div className="detail-stack">
                <div className="detail-row"><strong>Template</strong><span>{activeCampaign?.templateName || "Not selected"}</span></div>
                <div className="detail-row"><strong>Department Focus</strong><span>{activeCampaign?.departmentFocus || "All Departments"}</span></div>
                <div className="detail-row"><strong>Targets</strong><span>{activeCampaign?.targetCount ?? 0}</span></div>
                <div className="detail-row"><strong>Open Rate</strong><span>{activeCampaign?.metrics?.openRate ?? 0}%</span></div>
                <div className="detail-row"><strong>Click Rate</strong><span>{activeCampaign?.metrics?.clickRate ?? 0}%</span></div>
                <div className="detail-row"><strong>Submit Rate</strong><span>{activeCampaign?.metrics?.compromiseRate ?? 0}%</span></div>
              </div>
            </div>

            <div className="card table-card">
              <div className="section-head compact">
                <div>
                  <p className="eyebrow">Tracking Summary</p>
                  <h3>What happened to this campaign</h3>
                </div>
              </div>
              <div className="detail-stack">
                {(campaignDetail?.departmentStats || dashboard.departments).map((dept) => (
                  <div className="detail-row" key={dept.department}>
                    <strong>{dept.department}</strong>
                    <span>
                      {dept.total} targets • {dept.openRate}% open • {dept.clickRate}% click
                    </span>
                  </div>
                ))}
                {!(campaignDetail?.departmentStats || dashboard.departments).length ? <p className="muted">No department data yet.</p> : null}
              </div>
            </div>
          </section>

          <section className="card table-card">
            <div className="section-head compact">
              <div>
                <p className="eyebrow">Step 2</p>
                <h3>Target details</h3>
                <p className="muted">These are the uploaded targets for the selected campaign and their latest tracking status.</p>
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
                  {(campaignDetail?.targets || []).map((target) => (
                    <tr key={target.id}>
                      <td>{target.firstName} {target.lastName}</td>
                      <td>{target.email}</td>
                      <td>{target.department || "General"}</td>
                      <td>
                        <span className={`status-chip ${target.status || "queued"}`}>
                          {formatTrackingLabel(target.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!campaignDetail?.targets?.length ? (
                    <tr>
                      <td colSpan="4" className="muted">No target details available yet for this campaign.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card table-card">
            <div className="section-head compact">
              <div>
                <p className="eyebrow">Step 3</p>
                <h3>Tracking details</h3>
                <p className="muted">Track opens, clicks, and submissions from the campaign timeline below.</p>
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
              {!(campaignDetail?.timeline || dashboard.timeline).length ? <p className="muted">No activity yet.</p> : null}
            </div>
          </section>
        </>
      ) : null}
    </AdminLayout>
  );
}

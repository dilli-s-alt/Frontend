import AdminLayout from "../components/AdminLayout.jsx";
import useAdminData from "../hooks/useAdminData.js";

export default function Dashboard() {
  const { dashboard, loading, error } = useAdminData();

  if (loading && !dashboard) {
    return <div className="loading-screen">Loading workspace...</div>;
  }

  return (
    <AdminLayout
      title="Overview"
      subtitle="A simple post-login overview with glowing cards and quick project stats."
    >
      {error ? <div className="notice error">{error}</div> : null}

      {dashboard ? (
        <>
          <section className="glow-grid">
            <div className="card overview-hero">
              <p className="eyebrow">Workspace Snapshot</p>
              <h2>Everything after login stays intentionally clean, readable, and project-like.</h2>
              <p className="muted">
                Review your campaign totals, organization details, and the latest activity from one simple dashboard.
              </p>
              <div className="hero-stats">
                <span>{dashboard.summary.campaignCount} campaigns</span>
                <span>{dashboard.summary.targetCount} targets</span>
                <span>{dashboard.summary.openRate}% open rate</span>
              </div>
            </div>

            <div className="stat-panel card">
              <p className="eyebrow">Quick Status</p>
              <strong>{dashboard.organization.name}</strong>
              <p className="muted">Current subscription: {dashboard.organization.subscriptionTier}</p>
              <div className="detail-stack">
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

          <section className="data-grid">
            <div className="card table-card">
              <div className="section-head compact">
                <div>
                  <p className="eyebrow">Organization</p>
                  <h3>{dashboard.organization.name}</h3>
                </div>
              </div>
              <div className="detail-stack">
                <div className="detail-row"><strong>Workspace slug</strong><span>{dashboard.organization.slug}</span></div>
                <div className="detail-row"><strong>Subscription</strong><span>{dashboard.organization.subscriptionTier}</span></div>
                <div className="detail-row"><strong>Campaigns</strong><span>{dashboard.summary.campaignCount}</span></div>
                <div className="detail-row"><strong>Targets</strong><span>{dashboard.summary.targetCount}</span></div>
                <div className="detail-row"><strong>Click rate</strong><span>{dashboard.summary.clickRate}%</span></div>
                <div className="detail-row"><strong>Submit rate</strong><span>{dashboard.summary.compromiseRate}%</span></div>
              </div>
            </div>

            <div className="card table-card">
              <div className="section-head compact">
                <div>
                  <p className="eyebrow">Departments</p>
                  <h3>Coverage Snapshot</h3>
                </div>
              </div>
              <div className="detail-stack">
                {dashboard.departments.map((dept) => (
                  <div className="detail-row" key={dept.department}>
                    <strong>{dept.department}</strong>
                    <span>{dept.total} targets</span>
                  </div>
                ))}
                {!dashboard.departments.length ? <p className="muted">No department data yet.</p> : null}
              </div>
            </div>
          </section>

          <section className="card table-card">
            <div className="section-head compact">
                <div>
                  <p className="eyebrow">Recent Activity</p>
                  <h3>Latest Events</h3>
                </div>
              </div>
            <div className="timeline">
              {dashboard.timeline.map((event) => (
                <div key={event.id} className="timeline-item">
                  <strong>{event.kind}</strong>
                  <p>{event.campaignName}</p>
                  <span>{new Date(event.createdAt).toLocaleString()}</span>
                </div>
              ))}
              {!dashboard.timeline.length ? <p className="muted">No activity yet.</p> : null}
            </div>
          </section>
        </>
      ) : null}
    </AdminLayout>
  );
}

import BarChart from "../components/BarChart.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import useAdminData from "../hooks/useAdminData.js";

export default function Reports() {
  const {
    dashboard,
    campaigns,
    activeCampaignId,
    setActiveCampaignId,
    campaignDetail,
    loading,
    error
  } = useAdminData();

  if (loading && !dashboard) {
    return <div className="loading-screen">Loading reports...</div>;
  }

  return (
    <AdminLayout
      title="Reports"
      subtitle="View simple performance summaries, department breakdowns, and campaign-level results."
    >
      {error ? <div className="notice error">{error}</div> : null}

      {dashboard ? (
        <>
          <section className="simple-summary">
            <div className="card simple-card">
              <h3>Open Rate</h3>
              <p className="simple-number">{dashboard.summary.openRate}%</p>
            </div>
            <div className="card simple-card">
              <h3>Click Rate</h3>
              <p className="simple-number">{dashboard.summary.clickRate}%</p>
            </div>
            <div className="card simple-card">
              <h3>Submit Rate</h3>
              <p className="simple-number">{dashboard.summary.compromiseRate}%</p>
            </div>
          </section>

          <section className="analytics-grid">
            <BarChart title="Department Open Rate" rows={dashboard.departments} valueKey="openRate" colorClass="amber" />
            <BarChart title="Department Click Rate" rows={dashboard.departments} valueKey="clickRate" colorClass="rose" />
          </section>

          <section className="card table-card">
            <div className="section-head compact">
              <div>
                <p className="eyebrow">Campaign Report</p>
                <h3>Compare Campaign Results</h3>
              </div>
              <select value={activeCampaignId} onChange={(event) => setActiveCampaignId(event.target.value)}>
                <option value="">Select a campaign</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>

            {campaignDetail ? (
              <div className="analytics-grid">
                <BarChart title="Campaign Department Open Rate" rows={campaignDetail.departmentStats} valueKey="openRate" colorClass="amber" />
                <BarChart title="Campaign Department Click Rate" rows={campaignDetail.departmentStats} valueKey="clickRate" colorClass="rose" />
              </div>
            ) : (
              <p className="muted">Select a campaign to see department-level reporting.</p>
            )}
          </section>
        </>
      ) : null}
    </AdminLayout>
  );
}

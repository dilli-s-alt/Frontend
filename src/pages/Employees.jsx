import { useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import TargetImporter from "../components/TargetImporter.jsx";
import useAdminData from "../hooks/useAdminData.js";
import api from "../api";

export default function Employees() {
  const {
    dashboard,
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
  const [busy, setBusy] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const runAction = async (work, successMessage) => {
    setBusy(true);
    setError("");
    setMessage("");
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

  const departments = useMemo(
    () => ["All", ...new Set((campaignDetail?.targets || []).map((target) => target.department || "General"))],
    [campaignDetail]
  );

  const visibleTargets = useMemo(
    () =>
      (campaignDetail?.targets || []).filter(
        (target) => departmentFilter === "All" || target.department === departmentFilter
      ),
    [campaignDetail, departmentFilter]
  );

  if (loading && !dashboard) {
    return <div className="loading-screen">Loading employees...</div>;
  }

  return (
    <AdminLayout
      title="Employees"
      subtitle="Upload targets, add individuals, and review the list in a clean post-login page."
    >
      {message ? <div className="notice success">{message}</div> : null}
      {error ? <div className="notice error">{error}</div> : null}

      <section className="main-grid">
        <TargetImporter campaigns={campaigns} onUpload={uploadTargets} onAddTarget={addTarget} busy={busy} />

        <div className="card form-card">
          <div className="section-head compact">
            <div>
              <p className="eyebrow">Target Review</p>
              <h3>{activeCampaign?.name || "Check added targets"}</h3>
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

          <label>
            Department
            <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>

          <div className="detail-stack">
            <div className="detail-row"><strong>Total visible</strong><span>{visibleTargets.length}</span></div>
            <div className="detail-row"><strong>Opened</strong><span>{visibleTargets.filter((target) => target.status !== "queued").length}</span></div>
            <div className="detail-row"><strong>Submitted</strong><span>{visibleTargets.filter((target) => target.status === "submitted").length}</span></div>
          </div>
          <p className="muted">If the email column is wrong here, the mail will not go to the right person.</p>
        </div>
      </section>

      <section className="card table-card">
        <div className="section-head compact">
          <div>
            <p className="eyebrow">Employee Table</p>
            <h3>Campaign targets</h3>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleTargets.map((target) => (
                <tr key={target.id}>
                  <td>{target.firstName}</td>
                  <td>{target.lastName}</td>
                  <td>{target.email}</td>
                  <td>{target.department}</td>
                  <td>{target.status}</td>
                </tr>
              ))}
              {!visibleTargets.length ? (
                <tr>
                  <td colSpan="5" className="muted">No targets match this view yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

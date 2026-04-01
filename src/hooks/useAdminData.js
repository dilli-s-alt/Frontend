import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api";

export default function useAdminData() {
  const [dashboard, setDashboard] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [activeCampaignId, setActiveCampaignId] = useState("");
  const [campaignDetail, setCampaignDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [{ data: dashboardData }, { data: templateData }] = await Promise.all([
        api.get("/campaigns/dashboard"),
        api.get("/campaigns/templates")
      ]);

      setDashboard(dashboardData);
      setTemplates(templateData);

      if (!activeCampaignId && dashboardData.campaigns[0]) {
        setActiveCampaignId(dashboardData.campaigns[0].id);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load workspace data.");
    } finally {
      setLoading(false);
    }
  }, [activeCampaignId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!activeCampaignId) {
      setCampaignDetail(null);
      return;
    }

    api
      .get(`/campaigns/${activeCampaignId}`)
      .then(({ data }) => setCampaignDetail(data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load campaign details."));
  }, [activeCampaignId]);

  const campaigns = dashboard?.campaigns || [];
  const activeCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === activeCampaignId) || campaigns[0] || null,
    [campaigns, activeCampaignId]
  );

  return {
    dashboard,
    templates,
    campaigns,
    activeCampaignId,
    setActiveCampaignId,
    activeCampaign,
    campaignDetail,
    loading,
    error,
    setError,
    refresh: load
  };
}

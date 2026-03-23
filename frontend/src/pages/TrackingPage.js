import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ApplicationTable from "../components/ApplicationTable";
import { getApplications } from "../services/applicationService";
import Loader from "../components/Loader";

const TrackingPage = ({ setToast }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getApplications();
        console.log("[TrackingPage] Applications API response:", data);
        setApplications(data);
        if (!data.length) {
          console.warn("[TrackingPage] No tracking data returned from backend.");
        }
      } catch (error) {
        console.error("[TrackingPage] Failed to load tracking data:", error);
        setToast?.({ type: "error", message: "Unable to load tracking details." });
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setToast]);

  return (
    <DashboardLayout title="Application Tracking Page">
      {loading ? <Loader /> : <ApplicationTable data={applications} />}
    </DashboardLayout>
  );
};

export default TrackingPage;

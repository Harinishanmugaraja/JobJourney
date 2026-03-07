import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ApplicationTable from "../components/ApplicationTable";
import { getApplications } from "../services/applicationService";
import Loader from "../components/Loader";

const TrackingPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getApplications();
        setApplications(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout title="Application Tracking Page">
      {loading ? <Loader /> : <ApplicationTable data={applications} />}
    </DashboardLayout>
  );
};

export default TrackingPage;

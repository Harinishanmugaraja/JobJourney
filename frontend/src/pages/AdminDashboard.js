import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import DashboardCards from "../components/DashboardCards";
import ApplicationTable from "../components/ApplicationTable";
import { getApplications, deleteApplication } from "../services/applicationService";
import Loader from "../components/Loader";

const AdminDashboard = ({ setToast }) => {
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

  const removeRejected = async () => {
    const rejected = applications.filter((item) => item.status === "Rejected");
    await Promise.all(rejected.map((item) => deleteApplication(item.id)));
    setApplications((prev) => prev.filter((item) => item.status !== "Rejected"));
    setToast({ type: "success", message: "Rejected applications removed" });
  };

  const cards = [
    { label: "Applications", value: applications.length },
    { label: "Selected", value: applications.filter((a) => a.status === "Selected").length },
    { label: "Rejected", value: applications.filter((a) => a.status === "Rejected").length },
    { label: "Under Review", value: applications.filter((a) => a.status === "Under Review").length }
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      {loading ? (
        <Loader />
      ) : (
        <>
          <DashboardCards items={cards} />
          <div className="actions-row">
            <button className="btn btn-outline" onClick={removeRejected}>
              Clean Rejected Applications
            </button>
          </div>
          <ApplicationTable data={applications} />
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;

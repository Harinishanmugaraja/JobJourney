import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import DashboardCards from "../components/DashboardCards";
import ApplicationTable from "../components/ApplicationTable";
import NotificationPanel from "../components/NotificationPanel";
import { getApplications } from "../services/applicationService";
import { getInterviews } from "../services/interviewService";
import Loader from "../components/Loader";

const JobSeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appRes, intRes] = await Promise.all([getApplications(), getInterviews()]);
        setApplications(appRes.data);
        setInterviews(intRes.data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const cards = [
    { label: "Total Applications", value: applications.length },
    { label: "In Review", value: applications.filter((a) => a.status === "Under Review").length },
    { label: "Interviews", value: interviews.length },
    { label: "Selected", value: applications.filter((a) => a.status === "Selected").length }
  ];

  const notifications = applications
    .slice(0, 5)
    .map((item) => ({ message: `${item.companyName} - ${item.status}`, time: "Recent" }));

  return (
    <DashboardLayout title="Job Seeker Dashboard">
      {loading ? (
        <Loader />
      ) : (
        <>
          <DashboardCards items={cards} />
          <ApplicationTable data={applications.slice(0, 6)} />
          <NotificationPanel items={notifications} />
        </>
      )}
    </DashboardLayout>
  );
};

export default JobSeekerDashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import StatsWidget from "../components/StatsWidget";
import RecentActivityTable from "../components/RecentActivityTable";
import { getApplications } from "../services/applicationService";
import { getInterviews } from "../services/interviewService";
import Loader from "../components/Loader";

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
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
    { label: "Applied Jobs", value: applications.filter((a) => a.status === "Applied").length },
    { label: "Interview Scheduled", value: applications.filter((a) => a.status === "Interview Scheduled").length },
    {
      label: "Selected / Rejected",
      value: `${applications.filter((a) => a.status === "Selected").length} / ${
        applications.filter((a) => a.status === "Rejected").length
      }`
    }
  ];

  const recentApplications = applications
    .slice()
    .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      company: item.companyName,
      role: item.jobRole,
      appliedOn: new Date(item.applicationDate).toLocaleDateString(),
      status: item.status
    }));

  const upcomingInterviews = interviews
    .slice()
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      company: item.company,
      date: new Date(item.interviewDate).toLocaleDateString(),
      time: item.interviewTime,
      link: item.meetingLink
    }));

  const statusSummary = ["Applied", "Under Review", "Interview Scheduled", "Selected", "Rejected"].map(
    (status) => ({
      id: status,
      status,
      count: applications.filter((item) => item.status === status).length
    })
  );

  return (
    <DashboardLayout title="Job Seeker Dashboard">
      {loading ? (
        <Loader />
      ) : (
        <>
          <StatsWidget items={cards} />
          <div className="actions-row actions-row-start">
            <button className="btn" onClick={() => navigate("/applications")}>
              Apply for Job
            </button>
          </div>
          <RecentActivityTable
            title="Recent Applications"
            columns={[
              { key: "company", label: "Company" },
              { key: "role", label: "Role" },
              { key: "appliedOn", label: "Applied On" },
              { key: "status", label: "Status", type: "status" }
            ]}
            rows={recentApplications}
            emptyMessage="No applications submitted yet."
          />
          <RecentActivityTable
            title="Upcoming Interviews"
            columns={[
              { key: "company", label: "Company" },
              { key: "date", label: "Date" },
              { key: "time", label: "Time" },
              { key: "link", label: "Meeting", type: "link", linkLabel: "Join" }
            ]}
            rows={upcomingInterviews}
            emptyMessage="No interviews scheduled."
          />
          <RecentActivityTable
            title="Application Status Tracking"
            columns={[
              { key: "status", label: "Status", type: "status" },
              { key: "count", label: "Count" }
            ]}
            rows={statusSummary}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default JobSeekerDashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import StatsWidget from "../components/StatsWidget";
import RecentActivityTable from "../components/RecentActivityTable";
import { getApplications } from "../services/applicationService";
import { getInterviews } from "../services/interviewService";
import Loader from "../components/Loader";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : NO_AVAILABLE_DETAILS_MESSAGE);

const JobSeekerDashboard = ({ setToast }) => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appRes, intRes] = await Promise.all([getApplications(), getInterviews()]);
        console.log("[JobSeekerDashboard] Applications API response:", appRes.data);
        console.log("[JobSeekerDashboard] Interviews API response:", intRes.data);
        setApplications(appRes.data);
        setInterviews(intRes.data);
        if (!appRes.data.length) {
          console.warn("[JobSeekerDashboard] No applications returned from backend.");
        }
        if (!intRes.data.length) {
          console.warn("[JobSeekerDashboard] No interviews returned from backend.");
        }
      } catch (error) {
        console.error("[JobSeekerDashboard] Failed to load dashboard data:", error);
        setToast?.({ type: "error", message: "Unable to load dashboard details." });
        setApplications([]);
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [setToast]);

  const cards = [
    { label: "Total Applications", value: applications.length },
    { label: "Interviews Scheduled", value: applications.filter((a) => a.status === "Interview Scheduled").length },
    { label: "Offers Received", value: applications.filter((a) => a.status === "Selected").length },
    { label: "Rejected Applications", value: applications.filter((a) => a.status === "Rejected").length }
  ];

  const recentApplications = applications
    .slice()
    .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      company: item.companyName,
      role: item.jobRole,
      appliedOn: formatDate(item.applicationDate),
      status: item.status
    }));

  const upcomingInterviews = interviews
    .slice()
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      company: item.company,
      date: formatDate(item.interviewDate),
      time: item.interviewTime || NO_AVAILABLE_DETAILS_MESSAGE,
      link: item.meetingLink || ""
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
            <button className="btn" onClick={() => navigate("/jobs")}>
              Browse Job Listings
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
            emptyMessage={NO_AVAILABLE_DETAILS_MESSAGE}
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
            emptyMessage={NO_AVAILABLE_DETAILS_MESSAGE}
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

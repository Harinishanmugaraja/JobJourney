import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Loader from "../components/Loader";
import PageHero from "../components/PageHero";
import RecentActivityTable from "../components/RecentActivityTable";
import StatsWidget from "../components/StatsWidget";
import { getApplications } from "../services/applicationService";
import { getInterviews } from "../services/interviewService";
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
        setApplications(appRes.data);
        setInterviews(intRes.data);
      } catch (error) {
        setToast?.({ type: "error", message: "Unable to load dashboard details." });
        setApplications([]);
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [setToast]);

  const interviewCount = applications.filter((item) => item.status === "Interview Scheduled").length;
  const selectedCount = applications.filter((item) => item.status === "Selected").length;
  const rejectedCount = applications.filter((item) => item.status === "Rejected").length;

  const cards = [
    { label: "Total Applications", value: applications.length, helper: "All tracked submissions", icon: "document", trend: `${applications.length || 0} total` },
    { label: "Interviews", value: interviewCount, helper: "Scheduled interview stages", icon: "interviews", trend: `${interviewCount || 0} scheduled` },
    { label: "Selected", value: selectedCount, helper: "Positive decisions received", icon: "check", trend: `${selectedCount || 0} offers` },
    { label: "Rejected", value: rejectedCount, helper: "Roles closed out", icon: "tracking", trend: `${rejectedCount || 0} closed` }
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
      company: item.company || item.companyName,
      date: formatDate(item.interviewDate),
      time: item.interviewTime || NO_AVAILABLE_DETAILS_MESSAGE,
      link: item.meetingLink || ""
    }));

  const statusSummary = ["Applied", "Under Review", "Interview Scheduled", "Selected", "Rejected"].map((status) => ({
    id: status,
    status,
    count: applications.filter((item) => item.status === status).length
  }));

  return (
    <DashboardLayout title="Job Seeker Dashboard">
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageHero
            badge="Career Command Center"
            title="Track every application with clarity."
            description="Your dashboard highlights the current pipeline, upcoming interviews, and status movement from live backend records only."
            stats={[
              { label: "Applications in motion", value: applications.length, helper: "Across all tracked roles" },
              { label: "Next interviews", value: upcomingInterviews.length, helper: "Scheduled from backend" }
            ]}
            actions={
              <>
                <button className="btn" type="button" onClick={() => navigate("/jobs")}>
                  Browse jobs
                </button>
                <button className="btn btn-outline" type="button" onClick={() => navigate("/tracking")}>
                  View tracking
                </button>
              </>
            }
            visual={
              <div className="hero-visual-card">
                <div className="hero-visual-row">
                  <div>
                    <strong>Pipeline health</strong>
                    <p className="section-empty-text">A quick snapshot of your current momentum.</p>
                  </div>
                  <span className="mini-badge">{interviewCount} interviews</span>
                </div>
                <div className="hero-mini-chart" />
              </div>
            }
          />
          <StatsWidget items={cards} />
          <RecentActivityTable
            title="Recent applications"
            subtitle="The latest submissions sorted by application date."
            columns={[
              { key: "company", label: "Company", type: "strong", secondaryKey: "role" },
              { key: "appliedOn", label: "Applied On" },
              { key: "status", label: "Status", type: "status" }
            ]}
            rows={recentApplications}
            emptyTitle="No applications recorded"
            emptyMessage="Once you apply to jobs, your recent activity will appear here."
            emptyIcon="document"
          />
          <RecentActivityTable
            title="Upcoming interviews"
            subtitle="Scheduled interviews from your live interview feed."
            columns={[
              { key: "company", label: "Company" },
              { key: "date", label: "Date" },
              { key: "time", label: "Time" },
              { key: "link", label: "Meeting", type: "link", linkLabel: "Join" }
            ]}
            rows={upcomingInterviews}
            emptyTitle="No interviews scheduled"
            emptyMessage="Interview invites will surface here when the backend has upcoming sessions."
            emptyIcon="interviews"
          />
          <RecentActivityTable
            title="Status breakdown"
            subtitle="A clean summary of how your applications are progressing."
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

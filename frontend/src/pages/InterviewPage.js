import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Loader from "../components/Loader";
import PageHero from "../components/PageHero";
import RecentActivityTable from "../components/RecentActivityTable";
import { getInterviews } from "../services/interviewService";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

const InterviewPage = ({ setToast }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getInterviews();
        setInterviews(data);
      } catch (error) {
        setToast?.({ type: "error", message: "Unable to load interviews." });
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setToast]);

  return (
    <DashboardLayout title="Interviews">
      <PageHero
        badge="Interview Planner"
        title="Review scheduled conversations with a sharper visual structure."
        description="Interview date, time, and meeting link data remain unchanged, but the experience is now easier to scan on desktop and mobile."
        stats={[
          { label: "Interview sessions", value: interviews.length, helper: "Fetched from backend" },
          { label: "Linked meetings", value: interviews.filter((item) => item.meetingLink).length, helper: "Sessions with join links" }
        ]}
        visual={<div className="hero-visual-card"><div className="hero-visual-row"><div><strong>Scheduling view</strong><p className="section-empty-text">Keep upcoming meetings easy to review at a glance.</p></div><span className="mini-badge">{interviews.length} planned</span></div><div className="hero-mini-chart" /></div>}
      />
      {loading ? (
        <Loader />
      ) : (
        <RecentActivityTable
          title="Interview schedule"
          subtitle="A refined list of interview sessions and meeting access links."
          columns={[
            { key: "company", label: "Company" },
            { key: "date", label: "Interview Date" },
            { key: "time", label: "Interview Time" },
            { key: "link", label: "Meeting Link", type: "link", linkLabel: "Join meeting" }
          ]}
          rows={interviews.map((item) => ({
            id: item.id,
            company: item.company || item.companyName || NO_AVAILABLE_DETAILS_MESSAGE,
            date: item.interviewDate ? new Date(item.interviewDate).toLocaleDateString() : NO_AVAILABLE_DETAILS_MESSAGE,
            time: item.interviewTime || NO_AVAILABLE_DETAILS_MESSAGE,
            link: item.meetingLink || ""
          }))}
          emptyTitle="No interviews scheduled"
          emptyMessage="Interview records will appear here when they are created in the backend."
          emptyIcon="calendar"
        />
      )}
    </DashboardLayout>
  );
};

export default InterviewPage;

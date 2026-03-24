import React, { useEffect, useState } from "react";
import ApplicationTable from "../components/ApplicationTable";
import DashboardLayout from "../components/DashboardLayout";
import Loader from "../components/Loader";
import PageHero from "../components/PageHero";
import { getApplications } from "../services/applicationService";

const TrackingPage = ({ setToast }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getApplications();
        setApplications(data);
      } catch (error) {
        setToast?.({ type: "error", message: "Unable to load tracking details." });
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setToast]);

  return (
    <DashboardLayout title="Application Tracking">
      <PageHero
        badge="Tracking Board"
        title="Follow status changes with a calmer, more readable interface."
        description="This page keeps the same backend application data and simply presents progress in a more polished and scan-friendly format."
        stats={[
          { label: "Total tracked", value: applications.length, helper: "All fetched application records" },
          { label: "In progress", value: applications.filter((item) => ["Applied", "Under Review", "Interview Scheduled"].includes(item.status)).length, helper: "Still moving through the funnel" }
        ]}
        visual={
          <div className="hero-visual-card">
            <div className="hero-visual-row">
              <div>
                <strong>Status overview</strong>
                <p className="section-empty-text">Review how each application is evolving over time.</p>
              </div>
              <span className="mini-badge">{applications.length} entries</span>
            </div>
            <div className="hero-mini-chart" />
          </div>
        }
      />
      {loading ? (
        <Loader />
      ) : (
        <ApplicationTable
          data={applications}
          title="Tracking timeline"
          subtitle="A cleaner record of current statuses and submission dates."
          emptyTitle="Nothing to track yet"
          emptyMessage="Once applications exist in the backend, they will show up here."
        />
      )}
    </DashboardLayout>
  );
};

export default TrackingPage;

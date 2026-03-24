import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Loader from "../components/Loader";
import JobGrid from "../components/JobGrid";
import PageHero from "../components/PageHero";
import { getJobs } from "../services/jobService";

const JobsPage = ({ setToast }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const { data } = await getJobs({ status: "Active" });
        console.log("[JobsPage] Jobs API response:", data);
        setJobs(data);
        if (!data.length) {
          console.warn("[JobsPage] No jobs returned from backend.");
        }
      } catch (error) {
        console.error("[JobsPage] Failed to load jobs:", error);
        setToast?.({ type: "error", message: "Unable to load jobs." });
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [setToast]);

  return (
    <DashboardLayout title="Apply for Jobs">
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageHero
            badge="Open Roles"
            title="Explore active opportunities with a cleaner card-based layout."
            description="Every job card is driven by live backend data and redesigned to surface company, location, role, and deadline more clearly."
            stats={[
              { label: "Active openings", value: jobs.length, helper: "Listings currently available" },
              { label: "Flexible formats", value: jobs.filter((job) => job.jobType).length, helper: "With role metadata provided" }
            ]}
            visual={
              <div className="hero-visual-card">
                <div className="hero-visual-row">
                  <div>
                    <strong>Opportunity feed</strong>
                    <p className="section-empty-text">Browse, compare, and apply without losing context.</p>
                  </div>
                  <span className="mini-badge">{jobs.length} roles</span>
                </div>
                <div className="hero-mini-chart" />
              </div>
            }
          />
          <JobGrid jobs={jobs} onOpen={(jobId) => navigate(`/jobs/${jobId}`)} />
        </>
      )}
    </DashboardLayout>
  );
};

export default JobsPage;

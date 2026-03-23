import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Loader from "../components/Loader";
import JobGrid from "../components/JobGrid";
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
      {loading ? <Loader /> : <JobGrid jobs={jobs} onOpen={(jobId) => navigate(`/jobs/${jobId}`)} />}
    </DashboardLayout>
  );
};

export default JobsPage;

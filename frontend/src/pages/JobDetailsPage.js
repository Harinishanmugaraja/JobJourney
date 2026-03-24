import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Loader from "../components/Loader";
import JobDetails from "../components/JobDetails";
import EmptyState from "../components/EmptyState";
import { getJobById } from "../services/jobService";
import { createApplication } from "../services/applicationService";
import { useAuth } from "../context/AuthContext";

const hasValidResume = (resume) => {
  const lower = String(resume || "").toLowerCase();
  return [".pdf", ".doc", ".docx"].some((ext) => lower.endsWith(ext));
};

const JobDetailsPage = ({ setToast }) => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      try {
        const { data } = await getJobById(jobId);
        console.log("[JobDetailsPage] Job details API response:", data);
        setJob(data);
        if (!data) {
          console.warn(`[JobDetailsPage] No job details returned for job ${jobId}.`);
        }
      } catch (error) {
        console.error("[JobDetailsPage] Failed to load job details:", error);
        setToast?.({ type: "error", message: "Unable to load job details." });
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId, setToast]);

  const applyToJob = async (form) => {
    if (!hasValidResume(form.resume)) {
      setToast?.({ type: "error", message: "Resume must be PDF/DOC/DOCX." });
      return;
    }

    try {
      const payload = {
        jobId: job.id,
        companyName: job.companyName,
        jobRole: job.title,
        applicationDate: new Date().toISOString().slice(0, 10),
        resume: form.resume,
        applicantName: form.applicantName,
        applicantEmail: form.applicantEmail,
        coverLetter: form.coverLetter
      };
      const { data } = await createApplication(payload);
      console.log("[JobDetailsPage] Application created:", data);
      setToast?.({ type: "success", message: "Application submitted with status Applied." });
      navigate("/dashboard/jobseeker");
    } catch (error) {
      console.error("[JobDetailsPage] Failed to submit application:", error);
      setToast?.({ type: "error", message: "Unable to submit application." });
    }
  };

  return (
    <DashboardLayout title="Job Details">
      {loading ? (
        <Loader />
      ) : job ? (
        <JobDetails job={job} user={user} onApply={applyToJob} />
      ) : (
        <EmptyState icon="jobs" title="Job not found" description="The selected job could not be loaded from the backend." />
      )}
    </DashboardLayout>
  );
};

export default JobDetailsPage;

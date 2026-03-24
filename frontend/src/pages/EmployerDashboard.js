import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Loader from "../components/Loader";
import ModalForm from "../components/ModalForm";
import PageHero from "../components/PageHero";
import RecentActivityTable from "../components/RecentActivityTable";
import StatsWidget from "../components/StatsWidget";
import Icon from "../components/Icon";
import { getApplications, updateApplication } from "../services/applicationService";
import { createInterview, getInterviews } from "../services/interviewService";
import { createJob, getJobs } from "../services/jobService";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

const EmployerDashboard = ({ setToast }) => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openInterview, setOpenInterview] = useState(false);
  const [openJob, setOpenJob] = useState(false);
  const [interviewForm, setInterviewForm] = useState({ applicationId: "", interviewDate: "", interviewTime: "", meetingLink: "" });
  const [jobForm, setJobForm] = useState({
    title: "",
    companyName: "",
    location: "",
    jobType: "Full Time",
    shortDescription: "",
    description: "",
    requiredSkills: "",
    salaryRange: "",
    applicationDeadline: ""
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: appData }, { data: jobsData }, { data: interviewData }] = await Promise.all([
        getApplications(),
        getJobs(),
        getInterviews()
      ]);
      setApplications(appData);
      setJobs(jobsData);
      setInterviews(interviewData);
    } catch (error) {
      setToast({ type: "error", message: "Unable to load dashboard details." });
      setApplications([]);
      setJobs([]);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onStatusChange = async (id, status) => {
    try {
      const { data } = await updateApplication(id, { status });
      setApplications((prev) => prev.map((item) => (item.id === id ? { ...item, status: data.status } : item)));
      setToast({ type: "success", message: "Status updated" });
    } catch (error) {
      setToast({ type: "error", message: "Unable to update application status." });
    }
  };

  const schedule = async (event) => {
    event.preventDefault();
    try {
      await createInterview(interviewForm);
      setToast({ type: "success", message: "Interview scheduled" });
      setOpenInterview(false);
      setInterviewForm({ applicationId: "", interviewDate: "", interviewTime: "", meetingLink: "" });
      loadData();
    } catch (error) {
      setToast({ type: "error", message: "Unable to schedule interview." });
    }
  };

  const postJob = async (event) => {
    event.preventDefault();
    try {
      await createJob({
        ...jobForm,
        requiredSkills: jobForm.requiredSkills.split(",").map((skill) => skill.trim()).filter(Boolean)
      });
      setToast({ type: "success", message: "Job posted successfully" });
      setOpenJob(false);
      setJobForm({
        title: "",
        companyName: "",
        location: "",
        jobType: "Full Time",
        shortDescription: "",
        description: "",
        requiredSkills: "",
        salaryRange: "",
        applicationDeadline: ""
      });
      loadData();
    } catch (error) {
      setToast({ type: "error", message: "Unable to post job." });
    }
  };

  const shortlisted = applications.filter((item) => ["Under Review", "Interview Scheduled"].includes(item.status)).length;
  const activeJobs = jobs.filter((job) => job.status === "Active").length;

  return (
    <DashboardLayout title="Employer Dashboard">
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageHero
            badge="Hiring Workspace"
            title="Manage hiring flow with a clearer operational view."
            description="See job inventory, incoming applicants, and interview coordination through a more polished employer workspace."
            stats={[
              { label: "Active listings", value: activeJobs, helper: "Current live job posts" },
              { label: "Shortlisted candidates", value: shortlisted, helper: "Under review or interview stages" }
            ]}
            actions={
              <>
                <button className="btn" type="button" onClick={() => setOpenJob(true)}>Post new job</button>
                <button className="btn btn-outline" type="button" onClick={() => setOpenInterview(true)}>Schedule interview</button>
              </>
            }
            visual={
              <div className="hero-visual-card">
                <div className="hero-visual-row">
                  <div>
                    <strong>Candidate momentum</strong>
                    <p className="section-empty-text">Live activity pulled from applications and interviews.</p>
                  </div>
                  <span className="mini-badge">{applications.length} applications</span>
                </div>
                <div className="hero-mini-chart" />
              </div>
            }
          />
          <StatsWidget
            items={[
              { label: "Total Jobs Posted", value: jobs.length, helper: "All created listings", icon: "jobs", trend: `${activeJobs} active` },
              { label: "Applications Received", value: applications.length, helper: "Across all roles", icon: "document", trend: `${applications.length} candidates` },
              { label: "Interview Sessions", value: interviews.length, helper: "Planned interview slots", icon: "interviews", trend: `${interviews.length} planned` },
              { label: "Shortlisted", value: shortlisted, helper: "Review + interview stages", icon: "check", trend: `${shortlisted} in flow` }
            ]}
          />
          <RecentActivityTable
            title="Recent applicants"
            subtitle="Applicants ordered by submission date."
            columns={[
              { key: "company", label: "Company", type: "strong", secondaryKey: "role" },
              { key: "date", label: "Applied On" },
              { key: "status", label: "Status", type: "status" }
            ]}
            rows={applications
              .slice()
              .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
              .slice(0, 8)
              .map((item) => ({
                id: item.id,
                company: item.companyName,
                role: item.jobRole,
                date: item.applicationDate ? new Date(item.applicationDate).toLocaleDateString() : NO_AVAILABLE_DETAILS_MESSAGE,
                status: item.status
              }))}
            emptyTitle="No applicants yet"
            emptyMessage="Applicant records will appear here once job seekers begin submitting applications."
            emptyIcon="user"
          />
          <RecentActivityTable
            title="Interview schedule"
            subtitle="Upcoming interview sessions from the backend interview feed."
            columns={[
              { key: "company", label: "Company", type: "strong", secondaryKey: "role" },
              { key: "date", label: "Date" },
              { key: "time", label: "Time" },
              { key: "link", label: "Meeting", type: "link", linkLabel: "Join" }
            ]}
            rows={interviews.slice(0, 6).map((item) => ({
              id: item.id,
              company: item.company || item.companyName || NO_AVAILABLE_DETAILS_MESSAGE,
              role: item.jobRole || "Interview session",
              date: item.interviewDate ? new Date(item.interviewDate).toLocaleDateString() : NO_AVAILABLE_DETAILS_MESSAGE,
              time: item.interviewTime || NO_AVAILABLE_DETAILS_MESSAGE,
              link: item.meetingLink || ""
            }))}
            emptyTitle="No interviews planned"
            emptyMessage="Scheduled interviews will appear here when sessions are created."
            emptyIcon="calendar"
          />
          <RecentActivityTable
            title="Update applicant status"
            subtitle="Review and move candidates through the hiring stages."
            columns={[
              { key: "company", label: "Company", type: "strong", secondaryKey: "role" },
              { key: "status", label: "Current Status", type: "status" },
              { key: "control", label: "Change Status" }
            ]}
            rows={applications.map((item) => ({
              id: item.id,
              company: item.companyName,
              role: item.jobRole,
              status: item.status,
              control: (
                <select value={item.status} onChange={(event) => onStatusChange(item.id, event.target.value)} className="input">
                  <option>Applied</option>
                  <option>Under Review</option>
                  <option>Interview Scheduled</option>
                  <option>Selected</option>
                  <option>Rejected</option>
                </select>
              )
            }))}
            emptyTitle="No candidate statuses available"
            emptyMessage="Status controls will be available when applications exist."
            emptyIcon="tracking"
          />
        </>
      )}
      <ModalForm open={openInterview} title="Schedule interview" subtitle="Create an interview using the current backend workflow." onClose={() => setOpenInterview(false)}>
        <form className="stack" onSubmit={schedule}>
          <div className="field">
            <label htmlFor="interview-application">Application</label>
            <select id="interview-application" className="input" value={interviewForm.applicationId} onChange={(event) => setInterviewForm({ ...interviewForm, applicationId: event.target.value })} required>
              <option value="">Select application</option>
              {applications.map((item) => (
                <option key={item.id} value={item.id}>{item.companyName} - {item.jobRole}</option>
              ))}
            </select>
          </div>
          <div className="grid-form">
            <div className="field"><label htmlFor="interview-date">Date</label><input id="interview-date" className="input" type="date" value={interviewForm.interviewDate} onChange={(event) => setInterviewForm({ ...interviewForm, interviewDate: event.target.value })} required /></div>
            <div className="field"><label htmlFor="interview-time">Time</label><input id="interview-time" className="input" value={interviewForm.interviewTime} onChange={(event) => setInterviewForm({ ...interviewForm, interviewTime: event.target.value })} required /></div>
          </div>
          <div className="field"><label htmlFor="meeting-link">Meeting link</label><input id="meeting-link" className="input" value={interviewForm.meetingLink} onChange={(event) => setInterviewForm({ ...interviewForm, meetingLink: event.target.value })} required /></div>
          <div className="form-actions"><button className="btn" type="submit">Confirm schedule</button></div>
        </form>
      </ModalForm>
      <ModalForm open={openJob} title="Post new job" subtitle="Add a new listing without changing the existing API payload." onClose={() => setOpenJob(false)}>
        <form className="stack" onSubmit={postJob}>
          <div className="grid-form">
            <div className="field"><label htmlFor="job-title">Job title</label><input id="job-title" className="input" value={jobForm.title} onChange={(event) => setJobForm({ ...jobForm, title: event.target.value })} required /></div>
            <div className="field"><label htmlFor="job-company">Company name</label><input id="job-company" className="input" value={jobForm.companyName} onChange={(event) => setJobForm({ ...jobForm, companyName: event.target.value })} required /></div>
            <div className="field"><label htmlFor="job-location">Location</label><input id="job-location" className="input" value={jobForm.location} onChange={(event) => setJobForm({ ...jobForm, location: event.target.value })} required /></div>
            <div className="field"><label htmlFor="job-type">Job type</label><select id="job-type" className="input" value={jobForm.jobType} onChange={(event) => setJobForm({ ...jobForm, jobType: event.target.value })}><option value="Full Time">Full Time</option><option value="Internship">Internship</option><option value="Remote">Remote</option></select></div>
          </div>
          <div className="field"><label htmlFor="job-short">Short description</label><input id="job-short" className="input" value={jobForm.shortDescription} onChange={(event) => setJobForm({ ...jobForm, shortDescription: event.target.value })} /></div>
          <div className="field"><label htmlFor="job-description">Description</label><textarea id="job-description" className="input textarea-input" rows={4} value={jobForm.description} onChange={(event) => setJobForm({ ...jobForm, description: event.target.value })} /></div>
          <div className="grid-form">
            <div className="field"><label htmlFor="job-skills">Required skills</label><input id="job-skills" className="input" value={jobForm.requiredSkills} onChange={(event) => setJobForm({ ...jobForm, requiredSkills: event.target.value })} /></div>
            <div className="field"><label htmlFor="job-salary">Salary range</label><input id="job-salary" className="input" value={jobForm.salaryRange} onChange={(event) => setJobForm({ ...jobForm, salaryRange: event.target.value })} /></div>
            <div className="field"><label htmlFor="job-deadline">Application deadline</label><input id="job-deadline" className="input" type="date" value={jobForm.applicationDeadline} onChange={(event) => setJobForm({ ...jobForm, applicationDeadline: event.target.value })} /></div>
          </div>
          <div className="form-actions"><button className="btn" type="submit"><Icon name="jobs" />Post job</button></div>
        </form>
      </ModalForm>
    </DashboardLayout>
  );
};

export default EmployerDashboard;

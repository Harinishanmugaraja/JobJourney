import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatsWidget from "../components/StatsWidget";
import RecentActivityTable from "../components/RecentActivityTable";
import ModalForm from "../components/ModalForm";
import { getApplications, updateApplication } from "../services/applicationService";
import { createInterview, getInterviews } from "../services/interviewService";
import { createJob, getJobs } from "../services/jobService";
import Loader from "../components/Loader";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

const EmployerDashboard = ({ setToast }) => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openInterview, setOpenInterview] = useState(false);
  const [openJob, setOpenJob] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    applicationId: "",
    interviewDate: "",
    interviewTime: "",
    meetingLink: ""
  });
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
      console.log("[EmployerDashboard] Applications API response:", appData);
      console.log("[EmployerDashboard] Jobs API response:", jobsData);
      console.log("[EmployerDashboard] Interviews API response:", interviewData);
      setApplications(appData);
      setJobs(jobsData);
      setInterviews(interviewData);
      if (!appData.length) {
        console.warn("[EmployerDashboard] No applications returned from backend.");
      }
      if (!jobsData.length) {
        console.warn("[EmployerDashboard] No jobs returned from backend.");
      }
      if (!interviewData.length) {
        console.warn("[EmployerDashboard] No interviews returned from backend.");
      }
    } catch (error) {
      console.error("[EmployerDashboard] Failed to load dashboard data:", error);
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
      console.log("[EmployerDashboard] Updated application:", data);
      setApplications((prev) => prev.map((item) => (item.id === id ? { ...item, status: data.status } : item)));
      setToast({ type: "success", message: "Status updated" });
    } catch (error) {
      console.error("[EmployerDashboard] Failed to update application status:", error);
      setToast({ type: "error", message: "Unable to update application status." });
    }
  };

  const schedule = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createInterview(interviewForm);
      console.log("[EmployerDashboard] Interview created:", data);
      setToast({ type: "success", message: "Interview scheduled" });
      setOpenInterview(false);
      setInterviewForm({ applicationId: "", interviewDate: "", interviewTime: "", meetingLink: "" });
      loadData();
    } catch (error) {
      console.error("[EmployerDashboard] Failed to schedule interview:", error);
      setToast({ type: "error", message: "Unable to schedule interview." });
    }
  };

  const postJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...jobForm,
        requiredSkills: jobForm.requiredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      };
      const { data } = await createJob(payload);
      console.log("[EmployerDashboard] Job created:", data);
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
      console.error("[EmployerDashboard] Failed to create job:", error);
      setToast({ type: "error", message: "Unable to post job." });
    }
  };

  const cards = [
    { label: "Total Jobs Posted", value: jobs.length },
    { label: "Active Job Listings", value: jobs.filter((job) => job.status === "Active").length },
    { label: "Total Applications Received", value: applications.length },
    {
      label: "Shortlisted Candidates",
      value: applications.filter((a) => ["Under Review", "Interview Scheduled"].includes(a.status)).length
    }
  ];

  const recentApplicants = applications
    .slice()
    .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
    .slice(0, 8)
    .map((item) => ({
      id: item.id,
      company: item.companyName,
      role: item.jobRole,
      date: new Date(item.applicationDate).toLocaleDateString(),
      status: item.status
    }));

  const interviewSchedule = interviews
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      company: item.companyName,
      role: item.jobRole,
      date: item.interviewDate ? new Date(item.interviewDate).toLocaleDateString() : NO_AVAILABLE_DETAILS_MESSAGE,
      time: item.interviewTime || NO_AVAILABLE_DETAILS_MESSAGE,
      link: item.meetingLink || ""
    }));

  return (
    <DashboardLayout title="Employer Dashboard">
      {loading ? (
        <Loader />
      ) : (
        <>
          <StatsWidget items={cards} />
          <div className="actions-row">
            <button className="btn" onClick={() => setOpenJob(true)}>
              Post New Job
            </button>
            <button className="btn btn-outline" onClick={() => setOpenInterview(true)}>
              Schedule Interview
            </button>
          </div>
          <RecentActivityTable
            title="Recent Applicants"
            columns={[
              { key: "company", label: "Company" },
              { key: "role", label: "Role" },
              { key: "date", label: "Applied On" },
              { key: "status", label: "Status", type: "status" }
            ]}
            rows={recentApplicants}
            emptyMessage={NO_AVAILABLE_DETAILS_MESSAGE}
          />
          <RecentActivityTable
            title="Interview Schedule"
            columns={[
              { key: "company", label: "Company" },
              { key: "role", label: "Role" },
              { key: "date", label: "Date" },
              { key: "time", label: "Time" },
              { key: "link", label: "Meeting", type: "link", linkLabel: "Join" }
            ]}
            rows={interviewSchedule}
            emptyMessage={NO_AVAILABLE_DETAILS_MESSAGE}
          />
          <section className="panel">
            <h3>Update Applicant Status</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Current Status</th>
                    <th>Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((item) => (
                    <tr key={item.id}>
                      <td>{item.companyName}</td>
                      <td>{item.jobRole}</td>
                      <td>{item.status}</td>
                      <td>
                        <select
                          value={item.status}
                          onChange={(e) => onStatusChange(item.id, e.target.value)}
                          className="input"
                        >
                          <option>Applied</option>
                          <option>Under Review</option>
                          <option>Interview Scheduled</option>
                          <option>Selected</option>
                          <option>Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {!applications.length && (
                    <tr>
                      <td colSpan={4}>{NO_AVAILABLE_DETAILS_MESSAGE}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
      <ModalForm open={openInterview} title="Schedule Interview" onClose={() => setOpenInterview(false)}>
        <form className="stack" onSubmit={schedule}>
          <select
            className="input"
            value={interviewForm.applicationId}
            onChange={(e) => setInterviewForm({ ...interviewForm, applicationId: e.target.value })}
            required
          >
            <option value="">Select application</option>
            {applications.map((item) => (
              <option key={item.id} value={item.id}>
                {item.companyName} - {item.jobRole}
              </option>
            ))}
          </select>
          <input
            className="input"
            type="date"
            value={interviewForm.interviewDate}
            onChange={(e) => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Interview Time"
            value={interviewForm.interviewTime}
            onChange={(e) => setInterviewForm({ ...interviewForm, interviewTime: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Meeting Link"
            value={interviewForm.meetingLink}
            onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
            required
          />
          <button className="btn" type="submit">
            Confirm
          </button>
        </form>
      </ModalForm>
      <ModalForm open={openJob} title="Post New Job" onClose={() => setOpenJob(false)}>
        <form className="stack" onSubmit={postJob}>
          <input
            className="input"
            placeholder="Job Title"
            value={jobForm.title}
            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Company Name"
            value={jobForm.companyName}
            onChange={(e) => setJobForm({ ...jobForm, companyName: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Location"
            value={jobForm.location}
            onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
            required
          />
          <select
            className="input"
            value={jobForm.jobType}
            onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
          >
            <option value="Full Time">Full Time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
          <input
            className="input"
            placeholder="Short Description"
            value={jobForm.shortDescription}
            onChange={(e) => setJobForm({ ...jobForm, shortDescription: e.target.value })}
          />
          <textarea
            className="input"
            placeholder="Description"
            rows={4}
            value={jobForm.description}
            onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
          />
          <input
            className="input"
            placeholder="Required Skills (comma separated)"
            value={jobForm.requiredSkills}
            onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
          />
          <input
            className="input"
            placeholder="Salary Range"
            value={jobForm.salaryRange}
            onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
          />
          <input
            className="input"
            type="date"
            value={jobForm.applicationDeadline}
            onChange={(e) => setJobForm({ ...jobForm, applicationDeadline: e.target.value })}
          />
          <button className="btn" type="submit">
            Post Job
          </button>
        </form>
      </ModalForm>
    </DashboardLayout>
  );
};

export default EmployerDashboard;

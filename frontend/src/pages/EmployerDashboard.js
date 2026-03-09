import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatsWidget from "../components/StatsWidget";
import RecentActivityTable from "../components/RecentActivityTable";
import ModalForm from "../components/ModalForm";
import { getApplications, updateApplication } from "../services/applicationService";
import { createInterview } from "../services/interviewService";
import { createJob, getJobs } from "../services/jobService";
import Loader from "../components/Loader";

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
    location: ""
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: appData }, { data: jobsData }, { data: interviewData }] = await Promise.all([
        getApplications(),
        getJobs(),
        getApplications({ status: "Interview Scheduled" })
      ]);
      setApplications(appData);
      setJobs(jobsData);
      setInterviews(interviewData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onStatusChange = async (id, status) => {
    await updateApplication(id, { status });
    setApplications((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    setToast({ type: "success", message: "Status updated" });
  };

  const schedule = async (e) => {
    e.preventDefault();
    await createInterview(interviewForm);
    setToast({ type: "success", message: "Interview scheduled" });
    setOpenInterview(false);
    setInterviewForm({ applicationId: "", interviewDate: "", interviewTime: "", meetingLink: "" });
    loadData();
  };

  const postJob = async (e) => {
    e.preventDefault();
    await createJob(jobForm);
    setToast({ type: "success", message: "Job posted successfully" });
    setOpenJob(false);
    setJobForm({ title: "", companyName: "", location: "" });
    loadData();
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
      status: item.status
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
            emptyMessage="No recent applicants."
          />
          <RecentActivityTable
            title="Interview Schedule"
            columns={[
              { key: "company", label: "Company" },
              { key: "role", label: "Role" },
              { key: "status", label: "Status", type: "status" }
            ]}
            rows={interviewSchedule}
            emptyMessage="No interviews scheduled yet."
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
                      <td colSpan={4}>No applications available.</td>
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
          <button className="btn" type="submit">
            Post Job
          </button>
        </form>
      </ModalForm>
    </DashboardLayout>
  );
};

export default EmployerDashboard;

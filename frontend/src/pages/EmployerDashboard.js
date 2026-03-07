import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import DashboardCards from "../components/DashboardCards";
import ApplicationTable from "../components/ApplicationTable";
import ModalForm from "../components/ModalForm";
import { getApplications, updateApplication } from "../services/applicationService";
import { createInterview } from "../services/interviewService";
import Loader from "../components/Loader";

const EmployerDashboard = ({ setToast }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ applicationId: "", interviewDate: "", interviewTime: "", meetingLink: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await getApplications();
      setApplications(data);
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
    await createInterview(form);
    setToast({ type: "success", message: "Interview scheduled" });
    setOpen(false);
    setForm({ applicationId: "", interviewDate: "", interviewTime: "", meetingLink: "" });
    loadData();
  };

  const cards = [
    { label: "Total Applications", value: applications.length },
    { label: "Applied", value: applications.filter((a) => a.status === "Applied").length },
    { label: "Interview Scheduled", value: applications.filter((a) => a.status === "Interview Scheduled").length },
    { label: "Rejected", value: applications.filter((a) => a.status === "Rejected").length }
  ];

  return (
    <DashboardLayout title="Employer Dashboard">
      {loading ? (
        <Loader />
      ) : (
        <>
          <DashboardCards items={cards} />
          <div className="actions-row">
            <button className="btn" onClick={() => setOpen(true)}>
              Schedule Interview
            </button>
          </div>
          <ApplicationTable data={applications} onStatusChange={onStatusChange} canEditStatus />
        </>
      )}
      <ModalForm open={open} title="Schedule Interview" onClose={() => setOpen(false)}>
        <form className="stack" onSubmit={schedule}>
          <select
            className="input"
            value={form.applicationId}
            onChange={(e) => setForm({ ...form, applicationId: e.target.value })}
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
            value={form.interviewDate}
            onChange={(e) => setForm({ ...form, interviewDate: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Interview Time"
            value={form.interviewTime}
            onChange={(e) => setForm({ ...form, interviewTime: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Meeting Link"
            value={form.meetingLink}
            onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
            required
          />
          <button className="btn" type="submit">
            Confirm
          </button>
        </form>
      </ModalForm>
    </DashboardLayout>
  );
};

export default EmployerDashboard;

import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { createApplication, getApplications } from "../services/applicationService";
import ApplicationTable from "../components/ApplicationTable";
import Loader from "../components/Loader";

const ApplicationPage = ({ setToast }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    companyName: "",
    jobRole: "",
    resume: "",
    applicationDate: new Date().toISOString().slice(0, 10)
  });

  const [filters, setFilters] = useState({ status: "", company: "", date: "", role: "" });

  const load = async (params) => {
    setLoading(true);
    try {
      const { data } = await getApplications(params);
      console.log("[ApplicationPage] Applications API response:", data);
      setApplications(data);
      if (!data.length) {
        console.warn("[ApplicationPage] No applications returned from backend.");
      }
    } catch (error) {
      console.error("[ApplicationPage] Failed to load applications:", error);
      setToast({ type: "error", message: "Unable to load applications." });
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const lower = form.resume.toLowerCase();
    if (![".pdf", ".doc", ".docx"].some((ext) => lower.endsWith(ext))) {
      setToast({ type: "error", message: "Resume must be PDF/DOC/DOCX" });
      return;
    }

    try {
      const { data } = await createApplication(form);
      console.log("[ApplicationPage] Application created:", data);
      setToast({ type: "success", message: "Application submitted" });
      setForm({
        companyName: "",
        jobRole: "",
        resume: "",
        applicationDate: new Date().toISOString().slice(0, 10)
      });
      load(filters);
    } catch (error) {
      console.error("[ApplicationPage] Failed to create application:", error);
      setToast({ type: "error", message: "Unable to submit application." });
    }
  };

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );

  return (
    <DashboardLayout title="Job Application Page">
      <div className="panel">
        <h3>Submit Application</h3>
        <form className="grid-form" onSubmit={submit}>
          <input
            className="input"
            placeholder="Company Name"
            required
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />
          <input
            className="input"
            placeholder="Job Role"
            required
            value={form.jobRole}
            onChange={(e) => setForm({ ...form, jobRole: e.target.value })}
          />
          <input
            className="input"
            type="file"
            accept=".pdf,.doc,.docx"
            required
            onChange={(e) => setForm({ ...form, resume: e.target.files?.[0]?.name || "" })}
          />
          <input
            className="input"
            type="date"
            required
            value={form.applicationDate}
            onChange={(e) => setForm({ ...form, applicationDate: e.target.value })}
          />
          <button className="btn" type="submit">
            Submit Application
          </button>
        </form>
      </div>

      <div className="panel">
        <h3>Search & Filter ({activeFilterCount})</h3>
        <div className="grid-form">
          <select
            className="input"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option>Applied</option>
            <option>Under Review</option>
            <option>Interview Scheduled</option>
            <option>Selected</option>
            <option>Rejected</option>
          </select>
          <input
            className="input"
            placeholder="Company"
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          />
          <input
            className="input"
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
          <select
            className="input"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option value="">All Roles</option>
            <option value="jobseeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
          <button className="btn" onClick={() => load(filters)} type="button">
            Apply Filters
          </button>
        </div>
      </div>

      {loading ? <Loader /> : <ApplicationTable data={applications} />}
    </DashboardLayout>
  );
};

export default ApplicationPage;

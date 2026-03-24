import React, { useEffect, useMemo, useState } from "react";
import ApplicationTable from "../components/ApplicationTable";
import DashboardLayout from "../components/DashboardLayout";
import Icon from "../components/Icon";
import Loader from "../components/Loader";
import PageHero from "../components/PageHero";
import { createApplication, getApplications } from "../services/applicationService";

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
      setApplications(data);
    } catch (error) {
      setToast({ type: "error", message: "Unable to load applications." });
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const lower = form.resume.toLowerCase();
    if (![".pdf", ".doc", ".docx"].some((ext) => lower.endsWith(ext))) {
      setToast({ type: "error", message: "Resume must be PDF/DOC/DOCX" });
      return;
    }

    try {
      await createApplication(form);
      setToast({ type: "success", message: "Application submitted" });
      setForm({ companyName: "", jobRole: "", resume: "", applicationDate: new Date().toISOString().slice(0, 10) });
      load(filters);
    } catch (error) {
      setToast({ type: "error", message: "Unable to submit application." });
    }
  };

  const activeFilterCount = useMemo(() => Object.values(filters).filter(Boolean).length, [filters]);

  return (
    <DashboardLayout title="Applications">
      <PageHero
        badge="Submission Desk"
        title="Add and review applications in one structured workspace."
        description="This page keeps your manual application flow intact while giving the form, filters, and records a more production-ready layout."
        stats={[
          { label: "Tracked applications", value: applications.length, helper: "Loaded from backend" },
          { label: "Active filters", value: activeFilterCount, helper: "Current search conditions" }
        ]}
        visual={
          <div className="hero-visual-card">
            <div className="hero-visual-row">
              <div>
                <strong>Submission flow</strong>
                <p className="section-empty-text">Create, filter, and revisit your application history quickly.</p>
              </div>
              <span className="mini-badge">{applications.length} records</span>
            </div>
            <div className="hero-mini-chart" />
          </div>
        }
      />

      <section className="applications-grid">
        <section className="panel">
          <div className="panel-header">
            <div className="section-title-group">
              <h3>Submit application</h3>
              <p>Keep the current form behavior, but with clearer spacing and hierarchy.</p>
            </div>
          </div>
          <form className="stack" onSubmit={submit}>
            <div className="grid-form">
              <div className="field">
                <label htmlFor="application-company">Company name</label>
                <div className="input-wrap">
                  <span className="input-icon"><Icon name="building" /></span>
                  <input id="application-company" className="input with-icon" required value={form.companyName} onChange={(event) => setForm({ ...form, companyName: event.target.value })} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="application-role">Job role</label>
                <div className="input-wrap">
                  <span className="input-icon"><Icon name="jobs" /></span>
                  <input id="application-role" className="input with-icon" required value={form.jobRole} onChange={(event) => setForm({ ...form, jobRole: event.target.value })} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="application-resume">Resume</label>
                <div className="input-wrap">
                  <span className="input-icon"><Icon name="upload" /></span>
                  <input id="application-resume" className="input with-icon" type="file" accept=".pdf,.doc,.docx" required onChange={(event) => setForm({ ...form, resume: event.target.files?.[0]?.name || "" })} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="application-date">Application date</label>
                <div className="input-wrap">
                  <span className="input-icon"><Icon name="calendar" /></span>
                  <input id="application-date" className="input with-icon" type="date" required value={form.applicationDate} onChange={(event) => setForm({ ...form, applicationDate: event.target.value })} />
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn" type="submit">Submit application</button>
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div className="section-title-group">
              <h3>Search and filter</h3>
              <p>Refine the existing backend query without changing behavior.</p>
            </div>
            <span className="mini-badge">{activeFilterCount} active</span>
          </div>
          <div className="grid-form">
            <div className="field">
              <label htmlFor="filter-status">Status</label>
              <select id="filter-status" className="input" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
                <option value="">All Status</option>
                <option>Applied</option>
                <option>Under Review</option>
                <option>Interview Scheduled</option>
                <option>Selected</option>
                <option>Rejected</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="filter-company">Company</label>
              <input id="filter-company" className="input" value={filters.company} onChange={(event) => setFilters({ ...filters, company: event.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="filter-date">Date</label>
              <input id="filter-date" className="input" type="date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="filter-role">Role</label>
              <select id="filter-role" className="input" value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })}>
                <option value="">All Roles</option>
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-outline" type="button" onClick={() => load(filters)}>Apply filters</button>
          </div>
        </section>
      </section>

      {loading ? (
        <Loader />
      ) : (
        <ApplicationTable
          data={applications}
          title="Application records"
          subtitle="A refined view of all backend-driven application entries."
          emptyMessage="Application records from the backend will appear here once available."
        />
      )}
    </DashboardLayout>
  );
};

export default ApplicationPage;

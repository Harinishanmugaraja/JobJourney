import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Loader from "../components/Loader";
import PageHero from "../components/PageHero";
import RecentActivityTable from "../components/RecentActivityTable";
import StatsWidget from "../components/StatsWidget";
import { getApplications } from "../services/applicationService";
import { deleteJob, getJobs } from "../services/jobService";
import { deleteUser, getUsers, toggleUserStatus } from "../services/userService";

const AdminDashboard = ({ setToast }) => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: userData }, { data: jobData }, { data: appData }] = await Promise.all([
        getUsers(),
        getJobs(),
        getApplications()
      ]);
      setUsers(userData);
      setJobs(jobData);
      setApplications(appData);
    } catch (error) {
      setToast({ type: "error", message: "Unable to load admin dashboard details." });
      setUsers([]);
      setJobs([]);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onToggleUser = async (id) => {
    try {
      await toggleUserStatus(id);
      setToast({ type: "success", message: "User status updated" });
      load();
    } catch (error) {
      setToast({ type: "error", message: "Unable to update user status." });
    }
  };

  const onDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setToast({ type: "success", message: "User deleted" });
      load();
    } catch (error) {
      setToast({ type: "error", message: "Unable to delete user." });
    }
  };

  const onDeleteJob = async (id) => {
    try {
      await deleteJob(id);
      setToast({ type: "success", message: "Job deleted" });
      load();
    } catch (error) {
      setToast({ type: "error", message: "Unable to delete job." });
    }
  };

  const standardUsers = users.filter((user) => ["jobseeker", "employer"].includes(user.role));
  const disabledUsers = users.filter((user) => user.disabled).length;
  const interviews = applications.filter((item) => item.status === "Interview Scheduled").length;

  return (
    <DashboardLayout title="Admin Dashboard">
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageHero
            badge="Platform Oversight"
            title="Keep users, jobs, and hiring activity under control."
            description="The admin workspace now presents platform health, moderation actions, and reporting in a clearer production-style layout."
            stats={[
              { label: "Managed users", value: standardUsers.length, helper: "Job seekers and employers" },
              { label: "Interview activity", value: interviews, helper: "Applications marked for interview" }
            ]}
            visual={
              <div className="hero-visual-card">
                <div className="hero-visual-row">
                  <div>
                    <strong>System overview</strong>
                    <p className="section-empty-text">High-level activity from users, jobs, and applications.</p>
                  </div>
                  <span className="mini-badge">{disabledUsers} disabled</span>
                </div>
                <div className="hero-mini-chart" />
              </div>
            }
          />
          <StatsWidget
            items={[
              { label: "Total Users", value: standardUsers.length, helper: "Non-admin accounts", icon: "user", trend: `${disabledUsers} disabled` },
              { label: "Job Posts", value: jobs.length, helper: "Current platform listings", icon: "jobs", trend: `${jobs.length} live records` },
              { label: "Applications", value: applications.length, helper: "Tracked submissions", icon: "document", trend: `${interviews} interview stage` },
              { label: "Selected Candidates", value: applications.filter((item) => item.status === "Selected").length, helper: "Successful outcomes", icon: "check", trend: `${applications.filter((item) => item.status === "Rejected").length} rejected` }
            ]}
          />
          <RecentActivityTable
            title="Manage users"
            subtitle="Monitor role mix and account status at a glance."
            columns={[
              { key: "name", label: "Name", type: "strong", secondaryKey: "email" },
              { key: "role", label: "Role" },
              { key: "disabledLabel", label: "Status" }
            ]}
            rows={users.map((user) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              disabledLabel: user.disabled ? "Disabled" : "Active"
            }))}
            emptyTitle="No users available"
            emptyMessage="User records from the backend will appear here."
            emptyIcon="user"
          />
          <RecentActivityTable
            title="User controls"
            subtitle="Apply account moderation actions without leaving the dashboard."
            columns={[
              { key: "name", label: "User", type: "strong", secondaryKey: "role" },
              { key: "status", label: "Status" },
              { key: "action", label: "Actions" }
            ]}
            rows={users.filter((user) => user.role !== "admin").map((user) => ({
              id: user.id,
              name: user.name,
              role: user.role,
              status: user.disabled ? "Disabled" : "Active",
              action: (
                <div className="actions-row actions-row-start">
                  <button className="btn btn-outline" type="button" onClick={() => onToggleUser(user.id)}>
                    {user.disabled ? "Enable" : "Disable"}
                  </button>
                  <button className="btn btn-danger" type="button" onClick={() => onDeleteUser(user.id)}>
                    Delete
                  </button>
                </div>
              )
            }))}
            emptyTitle="No user actions available"
            emptyMessage="Moderation controls will appear when there are users to manage."
            emptyIcon="tracking"
          />
          <RecentActivityTable
            title="Manage job listings"
            subtitle="Review and remove job posts if needed."
            columns={[
              { key: "title", label: "Job", type: "strong", secondaryKey: "company" },
              { key: "location", label: "Location" },
              { key: "status", label: "Status" },
              { key: "action", label: "Action" }
            ]}
            rows={jobs.map((job) => ({
              id: job.id,
              title: job.title,
              company: job.companyName,
              location: job.location,
              status: job.status,
              action: (
                <button className="btn btn-danger" type="button" onClick={() => onDeleteJob(job.id)}>
                  Delete
                </button>
              )
            }))}
            emptyTitle="No job listings found"
            emptyMessage="Jobs from the backend will appear here when available."
            emptyIcon="jobs"
          />
          <RecentActivityTable
            title="Analytics snapshot"
            subtitle="A concise view of platform outcomes."
            columns={[
              { key: "metric", label: "Metric" },
              { key: "value", label: "Value" }
            ]}
            rows={[
              { id: "selected", metric: "Selected Candidates", value: applications.filter((item) => item.status === "Selected").length },
              { id: "rejected", metric: "Rejected Candidates", value: applications.filter((item) => item.status === "Rejected").length },
              { id: "disabled", metric: "Disabled Users", value: disabledUsers }
            ]}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;

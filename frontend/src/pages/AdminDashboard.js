import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatsWidget from "../components/StatsWidget";
import RecentActivityTable from "../components/RecentActivityTable";
import { getApplications } from "../services/applicationService";
import { getJobs, deleteJob } from "../services/jobService";
import { deleteUser, getUsers, toggleUserStatus } from "../services/userService";
import Loader from "../components/Loader";

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onToggleUser = async (id) => {
    await toggleUserStatus(id);
    setToast({ type: "success", message: "User status updated" });
    load();
  };

  const onDeleteUser = async (id) => {
    await deleteUser(id);
    setToast({ type: "success", message: "User deleted" });
    load();
  };

  const onDeleteJob = async (id) => {
    await deleteJob(id);
    setToast({ type: "success", message: "Job deleted" });
    load();
  };

  const cards = [
    {
      label: "Total Users",
      value: users.filter((user) => ["jobseeker", "employer"].includes(user.role)).length
    },
    { label: "Total Job Posts", value: jobs.length },
    { label: "Total Applications", value: applications.length },
    {
      label: "System Activity Overview",
      value: `${applications.filter((a) => a.status === "Interview Scheduled").length} Interviews`
    }
  ];

  const reports = [
    {
      id: "selected",
      metric: "Selected Candidates",
      value: applications.filter((a) => a.status === "Selected").length
    },
    {
      id: "rejected",
      metric: "Rejected Candidates",
      value: applications.filter((a) => a.status === "Rejected").length
    },
    {
      id: "disabled",
      metric: "Disabled Users",
      value: users.filter((user) => user.disabled).length
    }
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      {loading ? (
        <Loader />
      ) : (
        <>
          <StatsWidget items={cards} />
          <RecentActivityTable
            title="Manage Users"
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
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
            emptyMessage="No users found."
          />
          <section className="panel">
            <h3>User Controls</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((user) => user.role !== "admin")
                    .map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.role}</td>
                        <td>{user.disabled ? "Disabled" : "Active"}</td>
                        <td className="action-cell">
                          <button className="btn btn-outline" onClick={() => onToggleUser(user.id)}>
                            {user.disabled ? "Enable" : "Disable"}
                          </button>
                          <button className="btn btn-outline" onClick={() => onDeleteUser(user.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  {!users.filter((user) => user.role !== "admin").length && (
                    <tr>
                      <td colSpan={4}>No non-admin users available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <section className="panel">
            <h3>Manage Job Listings</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.title}</td>
                      <td>{job.companyName}</td>
                      <td>{job.location}</td>
                      <td>{job.status}</td>
                      <td>
                        <button className="btn btn-outline" onClick={() => onDeleteJob(job.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!jobs.length && (
                    <tr>
                      <td colSpan={5}>No job listings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <RecentActivityTable
            title="Reports / Analytics"
            columns={[
              { key: "metric", label: "Metric" },
              { key: "value", label: "Value" }
            ]}
            rows={reports}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;

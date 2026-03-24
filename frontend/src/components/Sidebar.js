import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatRole } from "../utils/roles";
import BrandHeader from "./BrandHeader";
import Icon from "./Icon";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
};

const menuByRole = {
  jobseeker: [
    { to: "/dashboard/jobseeker", label: "Dashboard", icon: "dashboard", hint: "Overview" },
    { to: "/jobs", label: "Apply for Jobs", icon: "jobs", hint: "Discover roles" },
    { to: "/tracking", label: "Application Tracking", icon: "tracking", hint: "Follow outcomes" },
    { to: "/interviews", label: "Upcoming Interviews", icon: "interviews", hint: "Scheduled meetings" },
    { to: "/notifications", label: "Notifications", icon: "notifications", hint: "Recent alerts" }
  ],
  employer: [
    { to: "/dashboard/employer", label: "Dashboard", icon: "dashboard", hint: "Hiring overview" },
    { to: "/interviews", label: "Interview Schedule", icon: "interviews", hint: "Coordinate meetings" },
    { to: "/notifications", label: "Notifications", icon: "notifications", hint: "Team updates" }
  ],
  admin: [
    { to: "/dashboard/admin", label: "Dashboard", icon: "dashboard", hint: "System health" },
    { to: "/notifications", label: "Notifications", icon: "notifications", hint: "Platform alerts" }
  ]
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = menuByRole[user?.role] || [];

  return (
    <aside className="sidebar">
      <BrandHeader className="sidebar-brand" />
      <div className="sidebar-nav-section">
        <span className="sidebar-section-label">Workspace</span>
        <nav>
          {menuItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
              <Icon name={item.icon} />
              <span className="sidebar-link-copy">
                <strong>{item.label}</strong>
                <span>{item.hint}</span>
              </span>
            </NavLink>
          ))}
          <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
            <Icon name="profile" />
            <span className="sidebar-link-copy">
              <strong>Profile</strong>
              <span>Personal settings</span>
            </span>
          </NavLink>
        </nav>
      </div>
      <section className="sidebar-user-card">
        <div className="sidebar-user-row">
          {user?.avatar ? (
            <img className="profile-avatar" src={user.avatar} alt={user.name || "User"} />
          ) : (
            <div className="profile-avatar profile-fallback">{getInitials(user?.name || "User")}</div>
          )}
          <div className="sidebar-user-meta">
            <strong>{user?.name || "User"}</strong>
            <span>{formatRole(user?.role)}</span>
          </div>
        </div>
        <button className="btn btn-outline" onClick={handleLogout} type="button">
          <Icon name="logout" />
          Logout
        </button>
      </section>
    </aside>
  );
};

export default Sidebar;

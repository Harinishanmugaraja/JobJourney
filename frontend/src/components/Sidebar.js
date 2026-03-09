import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandHeader from "./BrandHeader";

const menuByRole = {
  jobseeker: [
    { to: "/dashboard/jobseeker", label: "Dashboard" },
    { to: "/applications", label: "Apply for Job" },
    { to: "/tracking", label: "Application Tracking" },
    { to: "/interviews", label: "Upcoming Interviews" }
  ],
  employer: [
    { to: "/dashboard/employer", label: "Dashboard" },
    { to: "/interviews", label: "Interview Schedule" }
  ],
  admin: [{ to: "/dashboard/admin", label: "Dashboard" }]
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
      <nav>
        {menuItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button className="btn btn-outline" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;

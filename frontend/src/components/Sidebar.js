import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h1>Job Tracker</h1>
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/applications">Applications</NavLink>
        <NavLink to="/interviews">Interviews</NavLink>
        <NavLink to="/tracking">Tracking</NavLink>
      </nav>
      <button className="btn btn-outline" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;

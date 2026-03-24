import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = ({ title, children }) => {
  const { user } = useAuth();

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Navbar title={title} user={user} />
        <div className="dashboard-shell">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;

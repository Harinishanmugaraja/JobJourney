import React from "react";

const DashboardCard = ({ label, value }) => (
  <div className="dash-card">
    <p>{label}</p>
    <h3>{value}</h3>
  </div>
);

export default DashboardCard;

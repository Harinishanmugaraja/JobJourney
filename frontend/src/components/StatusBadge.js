import React from "react";

const statusClass = {
  Applied: "status-applied",
  "Under Review": "status-review",
  "Interview Scheduled": "status-interview",
  Selected: "status-selected",
  Rejected: "status-rejected"
};

const StatusBadge = ({ status }) => <span className={`status-badge ${statusClass[status] || ""}`}>{status}</span>;

export default StatusBadge;

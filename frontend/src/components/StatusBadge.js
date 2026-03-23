import React from "react";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

const statusClass = {
  Applied: "status-applied",
  "Under Review": "status-review",
  "Interview Scheduled": "status-interview",
  Selected: "status-selected",
  Rejected: "status-rejected"
};

const StatusBadge = ({ status }) => (
  <span className={`status-badge ${statusClass[status] || ""}`}>{status || NO_AVAILABLE_DETAILS_MESSAGE}</span>
);

export default StatusBadge;

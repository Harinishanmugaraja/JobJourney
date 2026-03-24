import React from "react";
import Icon from "./Icon";
import StatusBadge from "./StatusBadge";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

const getInitials = (name = "") => name.trim().charAt(0).toUpperCase() || "J";

const formatDeadline = (value) => (value ? new Date(value).toLocaleDateString() : NO_AVAILABLE_DETAILS_MESSAGE);

const JobCard = ({ job, onOpen }) => {
  const handleOpen = () => onOpen(job.id);

  return (
    <article
      className="job-card"
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="job-card-head">
        <div className="job-logo" aria-hidden="true">
          {job.logo ? <img className="profile-avatar" src={job.logo} alt="" /> : getInitials(job.companyName)}
        </div>
        <div className="job-card-title">
          <small>{job.companyName || NO_AVAILABLE_DETAILS_MESSAGE}</small>
          <h3>{job.title || NO_AVAILABLE_DETAILS_MESSAGE}</h3>
          <p>{job.shortDescription || "Role details will appear when provided by the backend."}</p>
        </div>
      </div>
      <div className="job-meta">
        <span className="tag">
          <Icon name="location" />
          {job.location || NO_AVAILABLE_DETAILS_MESSAGE}
        </span>
        <span className="tag">
          <Icon name="jobs" />
          {job.jobType || NO_AVAILABLE_DETAILS_MESSAGE}
        </span>
        {job.status ? <StatusBadge status={job.status} /> : null}
      </div>
      <p className="job-short">{job.description || job.shortDescription || NO_AVAILABLE_DETAILS_MESSAGE}</p>
      <div className="job-card-footer">
        <div className="job-card-metrics">
          <div className="job-card-metric">
            <span>Salary</span>
            <strong>{job.salaryRange || "Competitive"}</strong>
          </div>
          <div className="job-card-metric">
            <span>Deadline</span>
            <strong>{formatDeadline(job.applicationDeadline)}</strong>
          </div>
        </div>
        <button
          className="btn"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleOpen();
          }}
        >
          View details
        </button>
      </div>
    </article>
  );
};

export default JobCard;

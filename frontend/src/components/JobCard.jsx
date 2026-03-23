import React from "react";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

const JobCard = ({ job, onOpen }) => {
  return (
    <article className="job-card" onClick={() => onOpen(job.id)} role="button" tabIndex={0} onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") onOpen(job.id);
    }}>
      <div className="job-card-head">
        <div className="job-logo">{job.logo || job.companyName?.[0] || "J"}</div>
        <div>
          <h3>{job.companyName || NO_AVAILABLE_DETAILS_MESSAGE}</h3>
          <p>{job.title || NO_AVAILABLE_DETAILS_MESSAGE}</p>
        </div>
      </div>
      <div className="job-meta">
        <span>{job.location || NO_AVAILABLE_DETAILS_MESSAGE}</span>
        <span>{job.jobType || NO_AVAILABLE_DETAILS_MESSAGE}</span>
      </div>
      <p className="job-short">{job.shortDescription || NO_AVAILABLE_DETAILS_MESSAGE}</p>
      <button className="btn" type="button" onClick={(e) => {
        e.stopPropagation();
        onOpen(job.id);
      }}>
        Apply Now
      </button>
    </article>
  );
};

export default JobCard;

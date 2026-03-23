import React from "react";
import JobCard from "./JobCard";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

const JobGrid = ({ jobs, onOpen }) => {
  if (!jobs.length) {
    return (
      <section className="panel">
        <p>{NO_AVAILABLE_DETAILS_MESSAGE}</p>
      </section>
    );
  }

  return (
    <section className="job-grid">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onOpen={onOpen} />
      ))}
    </section>
  );
};

export default JobGrid;

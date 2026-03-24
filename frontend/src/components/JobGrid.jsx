import React from "react";
import JobCard from "./JobCard";
import EmptyState from "./EmptyState";

const JobGrid = ({ jobs, onOpen }) => {
  if (!jobs.length) {
    return <EmptyState icon="jobs" title="No active job listings" description="Active roles from your backend will appear here when they become available." />;
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

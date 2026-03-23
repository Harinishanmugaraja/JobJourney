import React, { useState } from "react";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

const renderValue = (value) => {
  if (typeof value === "string") {
    return value.trim() || NO_AVAILABLE_DETAILS_MESSAGE;
  }

  return value ?? NO_AVAILABLE_DETAILS_MESSAGE;
};

const JobDetails = ({ job, user, onApply }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    applicantName: user?.name || "",
    applicantEmail: user?.email || "",
    resume: "",
    coverLetter: ""
  });

  const submit = (e) => {
    e.preventDefault();
    onApply(form);
  };

  return (
    <section className="panel job-details">
      <div className="job-details-head">
        <div className="job-logo job-logo-large">{job.logo || job.companyName?.[0] || "J"}</div>
        <div>
          <h2>{job.title}</h2>
          <p>
            {job.companyName} | {job.location} | {job.jobType}
          </p>
        </div>
      </div>

      <div className="job-details-grid">
        <div>
          <h4>Full Description</h4>
          <p>{renderValue(job.description)}</p>
        </div>
        <div>
          <h4>Required Skills</h4>
          {job.requiredSkills?.length ? (
            <div className="skills-row">
              {job.requiredSkills.map((skill) => (
                <span key={skill} className="skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p>{NO_AVAILABLE_DETAILS_MESSAGE}</p>
          )}
        </div>
        <div>
          <h4>Salary Range</h4>
          <p>{renderValue(job.salaryRange)}</p>
        </div>
        <div>
          <h4>Application Deadline</h4>
          <p>
            {job.applicationDeadline
              ? new Date(job.applicationDeadline).toLocaleDateString()
              : NO_AVAILABLE_DETAILS_MESSAGE}
          </p>
        </div>
      </div>

      {!showForm ? (
        <button className="btn" type="button" onClick={() => setShowForm(true)}>
          Apply
        </button>
      ) : (
        <form className="stack job-apply-form" onSubmit={submit}>
          <input
            className="input"
            placeholder="Applicant Name"
            value={form.applicantName}
            onChange={(e) => setForm({ ...form, applicantName: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={form.applicantEmail}
            onChange={(e) => setForm({ ...form, applicantEmail: e.target.value })}
            required
          />
          <input
            className="input"
            type="file"
            accept=".pdf,.doc,.docx"
            required
            onChange={(e) => setForm({ ...form, resume: e.target.files?.[0]?.name || "" })}
          />
          <textarea
            className="input"
            rows={5}
            placeholder="Cover Letter"
            value={form.coverLetter}
            onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
            required
          />
          <div className="actions-row">
            <button className="btn btn-outline" type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button className="btn" type="submit">
              Submit Application
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default JobDetails;

import React, { useState } from "react";
import Icon from "./Icon";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

const renderValue = (value) => {
  if (typeof value === "string") {
    return value.trim() || NO_AVAILABLE_DETAILS_MESSAGE;
  }
  return value ?? NO_AVAILABLE_DETAILS_MESSAGE;
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : NO_AVAILABLE_DETAILS_MESSAGE);

const JobDetails = ({ job, user, onApply }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    applicantName: user?.name || "",
    applicantEmail: user?.email || "",
    resume: "",
    coverLetter: ""
  });

  const submit = (event) => {
    event.preventDefault();
    onApply(form);
  };

  return (
    <section className="split-layout">
      <section className="panel job-details">
        <div className="job-details-head">
          <div className="job-logo job-logo-large">{job.companyName?.charAt(0) || "J"}</div>
          <div>
            <span className="hero-badge">{job.companyName || NO_AVAILABLE_DETAILS_MESSAGE}</span>
            <h2>{job.title || NO_AVAILABLE_DETAILS_MESSAGE}</h2>
            <p>
              {renderValue(job.location)} · {renderValue(job.jobType)} · {renderValue(job.salaryRange)}
            </p>
          </div>
        </div>

        <div className="job-meta">
          <span className="tag">
            <Icon name="location" />
            {renderValue(job.location)}
          </span>
          <span className="tag">
            <Icon name="calendar" />
            Deadline {formatDate(job.applicationDeadline)}
          </span>
          <span className="tag">
            <Icon name="building" />
            {renderValue(job.companyName)}
          </span>
        </div>

        <div className="job-details-grid">
          <div className="detail-card">
            <h4>About the role</h4>
            <p>{renderValue(job.description || job.shortDescription)}</p>
          </div>
          <div className="detail-card">
            <h4>Required skills</h4>
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
          <div className="detail-card">
            <h4>Highlights</h4>
            <p>{renderValue(job.shortDescription || "This job is ready for application from your backend listing.")}</p>
          </div>
          <div className="detail-card">
            <h4>Application window</h4>
            <p>{formatDate(job.applicationDeadline)}</p>
          </div>
        </div>
      </section>

      <aside className="panel application-side-card">
        <div className="section-title-group">
          <h3>Application brief</h3>
          <p>Use your current account details and submit directly to the existing application flow.</p>
        </div>
        <div className="application-side-list">
          <div className="application-side-item">
            <span className="list-icon">
              <Icon name="user" />
            </span>
            <div>
              <strong>{form.applicantName || "Your name"}</strong>
              <span>Applicant profile</span>
            </div>
          </div>
          <div className="application-side-item">
            <span className="list-icon">
              <Icon name="mail" />
            </span>
            <div>
              <strong>{form.applicantEmail || "Email address"}</strong>
              <span>Contact email</span>
            </div>
          </div>
          <div className="application-side-item">
            <span className="list-icon">
              <Icon name="document" />
            </span>
            <div>
              <strong>{job.title || "Selected role"}</strong>
              <span>{job.companyName || "Selected company"}</span>
            </div>
          </div>
        </div>

        {!showForm ? (
          <button className="btn" type="button" onClick={() => setShowForm(true)}>
            Apply now
          </button>
        ) : (
          <form className="stack job-apply-form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="applicant-name">Applicant name</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <Icon name="user" />
                </span>
                <input
                  id="applicant-name"
                  className="input with-icon"
                  value={form.applicantName}
                  onChange={(event) => setForm({ ...form, applicantName: event.target.value })}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="applicant-email">Email</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <Icon name="mail" />
                </span>
                <input
                  id="applicant-email"
                  className="input with-icon"
                  type="email"
                  value={form.applicantEmail}
                  onChange={(event) => setForm({ ...form, applicantEmail: event.target.value })}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="resume-file">Resume</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <Icon name="upload" />
                </span>
                <input
                  id="resume-file"
                  className="input with-icon"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  onChange={(event) => setForm({ ...form, resume: event.target.files?.[0]?.name || "" })}
                />
              </div>
              <span className="field-hint">Accepted formats: PDF, DOC, DOCX</span>
            </div>
            <div className="field">
              <label htmlFor="cover-letter">Cover letter</label>
              <textarea
                id="cover-letter"
                className="input textarea-input"
                rows={5}
                value={form.coverLetter}
                onChange={(event) => setForm({ ...form, coverLetter: event.target.value })}
                required
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-outline" type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="btn" type="submit">
                Submit application
              </button>
            </div>
          </form>
        )}
      </aside>
    </section>
  );
};

export default JobDetails;

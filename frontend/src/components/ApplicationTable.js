import React from "react";
import EmptyState from "./EmptyState";
import StatusBadge from "./StatusBadge";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : NO_AVAILABLE_DETAILS_MESSAGE);

const ApplicationTable = ({
  data,
  title = "Applications",
  subtitle,
  onStatusChange,
  canEditStatus,
  emptyTitle = "No applications yet",
  emptyMessage = "Applications from the backend will appear here as soon as they are available."
}) => {
  if (!data.length) {
    return <EmptyState icon="document" title={emptyTitle} description={emptyMessage} />;
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="section-title-group">
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Resume</th>
                <th>Date</th>
                <th>Status</th>
                {canEditStatus ? <th>Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="table-cell-strong">
                      <strong>{item.companyName || NO_AVAILABLE_DETAILS_MESSAGE}</strong>
                      <span>{item.applicantName || item.applicantEmail || "Application record"}</span>
                    </div>
                  </td>
                  <td>{item.jobRole || NO_AVAILABLE_DETAILS_MESSAGE}</td>
                  <td>{item.resume || NO_AVAILABLE_DETAILS_MESSAGE}</td>
                  <td>{formatDate(item.applicationDate)}</td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  {canEditStatus ? (
                    <td>
                      <select
                        value={item.status}
                        onChange={(event) => onStatusChange(item.id, event.target.value)}
                        className="input"
                      >
                        <option>Applied</option>
                        <option>Under Review</option>
                        <option>Interview Scheduled</option>
                        <option>Selected</option>
                        <option>Rejected</option>
                      </select>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-row-cards">
          {data.map((item) => (
            <article key={`${item.id}-mobile`} className="table-row-card">
              <div className="table-cell-strong">
                <strong>{item.companyName || NO_AVAILABLE_DETAILS_MESSAGE}</strong>
                <span>{item.jobRole || NO_AVAILABLE_DETAILS_MESSAGE}</span>
              </div>
              <div className="table-row-card-grid">
                <div className="table-row-card-item">
                  <span>Resume</span>
                  <p>{item.resume || NO_AVAILABLE_DETAILS_MESSAGE}</p>
                </div>
                <div className="table-row-card-item">
                  <span>Date</span>
                  <p>{formatDate(item.applicationDate)}</p>
                </div>
                <div className="table-row-card-item">
                  <span>Status</span>
                  <StatusBadge status={item.status} />
                </div>
                {canEditStatus ? (
                  <div className="table-row-card-item">
                    <span>Change status</span>
                    <select
                      value={item.status}
                      onChange={(event) => onStatusChange(item.id, event.target.value)}
                      className="input"
                    >
                      <option>Applied</option>
                      <option>Under Review</option>
                      <option>Interview Scheduled</option>
                      <option>Selected</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApplicationTable;

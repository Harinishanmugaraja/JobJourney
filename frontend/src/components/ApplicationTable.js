import React from "react";
import StatusBadge from "./StatusBadge";

const ApplicationTable = ({ data, onStatusChange, canEditStatus }) => {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Resume</th>
            <th>Date</th>
            <th>Status</th>
            {canEditStatus && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.companyName}</td>
              <td>{item.jobRole}</td>
              <td>{item.resume}</td>
              <td>{new Date(item.applicationDate).toLocaleDateString()}</td>
              <td>
                <StatusBadge status={item.status} />
              </td>
              {canEditStatus && (
                <td>
                  <select
                    value={item.status}
                    onChange={(e) => onStatusChange(item.id, e.target.value)}
                    className="input"
                  >
                    <option>Applied</option>
                    <option>Under Review</option>
                    <option>Interview Scheduled</option>
                    <option>Selected</option>
                    <option>Rejected</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
          {!data.length && (
            <tr>
              <td colSpan={canEditStatus ? 6 : 5}>No applications found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;

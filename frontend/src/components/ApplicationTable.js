import React from "react";
import StatusBadge from "./StatusBadge";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

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
              <td>{item.companyName || NO_AVAILABLE_DETAILS_MESSAGE}</td>
              <td>{item.jobRole || NO_AVAILABLE_DETAILS_MESSAGE}</td>
              <td>{item.resume || NO_AVAILABLE_DETAILS_MESSAGE}</td>
              <td>
                {item.applicationDate
                  ? new Date(item.applicationDate).toLocaleDateString()
                  : NO_AVAILABLE_DETAILS_MESSAGE}
              </td>
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
              <td colSpan={canEditStatus ? 6 : 5}>{NO_AVAILABLE_DETAILS_MESSAGE}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;

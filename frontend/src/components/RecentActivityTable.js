import React from "react";
import StatusBadge from "./StatusBadge";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

const renderValue = (value) => {
  if (typeof value === "string") {
    return value.trim() || NO_AVAILABLE_DETAILS_MESSAGE;
  }

  return value ?? NO_AVAILABLE_DETAILS_MESSAGE;
};

const RecentActivityTable = ({ title, columns, rows, emptyMessage = NO_AVAILABLE_DETAILS_MESSAGE }) => (
  <section className="panel">
    <h3>{title}</h3>
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => {
                const value = row[column.key];
                if (column.type === "status") {
                  return (
                    <td key={`${row.id}-${column.key}`}>
                      <StatusBadge status={value} />
                    </td>
                  );
                }
                if (column.type === "link") {
                  return (
                    <td key={`${row.id}-${column.key}`}>
                      {typeof value === "string" && value.trim() ? (
                        <a href={value} target="_blank" rel="noreferrer">
                          {column.linkLabel || "Open"}
                        </a>
                      ) : (
                        NO_AVAILABLE_DETAILS_MESSAGE
                      )}
                    </td>
                  );
                }
                return <td key={`${row.id}-${column.key}`}>{renderValue(value)}</td>;
              })}
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
);

export default RecentActivityTable;

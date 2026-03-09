import React from "react";
import StatusBadge from "./StatusBadge";

const RecentActivityTable = ({ title, columns, rows, emptyMessage = "No data available." }) => (
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
                      <a href={value} target="_blank" rel="noreferrer">
                        {column.linkLabel || "Open"}
                      </a>
                    </td>
                  );
                }
                return <td key={`${row.id}-${column.key}`}>{value}</td>;
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

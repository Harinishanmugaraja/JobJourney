import React from "react";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";
import Icon from "./Icon";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

const renderValue = (value) => {
  if (typeof value === "string") {
    return value.trim() || NO_AVAILABLE_DETAILS_MESSAGE;
  }
  return value ?? NO_AVAILABLE_DETAILS_MESSAGE;
};

const renderCell = (row, column) => {
  const value = row[column.key];

  if (column.type === "status") {
    return <StatusBadge status={value} />;
  }

  if (column.type === "link") {
    return typeof value === "string" && value.trim() ? (
      <a className="auth-link" href={value} target="_blank" rel="noreferrer">
        {column.linkLabel || "Open"}
      </a>
    ) : (
      NO_AVAILABLE_DETAILS_MESSAGE
    );
  }

  if (column.type === "strong") {
    return (
      <div className="table-cell-strong">
        <strong>{renderValue(value)}</strong>
        {column.secondaryKey ? <span>{renderValue(row[column.secondaryKey])}</span> : null}
      </div>
    );
  }

  return renderValue(value);
};

const RecentActivityTable = ({
  title,
  subtitle,
  columns,
  rows,
  emptyMessage = NO_AVAILABLE_DETAILS_MESSAGE,
  emptyTitle = "Nothing to show yet",
  emptyIcon = "spark",
  action
}) => (
  <section className="panel">
    <div className="panel-header">
      <div className="section-title-group">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action || null}
    </div>
    {rows.length ? (
      <div className="table-wrap">
        <div className="table-scroll">
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
                  {columns.map((column) => (
                    <td key={`${row.id}-${column.key}`}>{renderCell(row, column)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-row-cards">
          {rows.map((row) => (
            <article key={`${row.id}-card`} className="table-row-card">
              <div className="split-card-footer">
                <div className="table-cell-strong">
                  <strong>{renderValue(row[columns[0]?.key])}</strong>
                  <span>{columns[1] ? renderValue(row[columns[1].key]) : ""}</span>
                </div>
                <Icon name="arrowRight" />
              </div>
              <div className="table-row-card-grid">
                {columns.slice(1).map((column) => (
                  <div key={`${row.id}-${column.key}-mobile`} className="table-row-card-item">
                    <span>{column.label}</span>
                    <div>{renderCell(row, column)}</div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    ) : (
      <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyMessage} />
    )}
  </section>
);

export default RecentActivityTable;

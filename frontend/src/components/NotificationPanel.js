import React from "react";
import EmptyState from "./EmptyState";
import Icon from "./Icon";

const notificationTypeMeta = {
  job_posted: {
    icon: "jobs",
    label: "New job",
    className: "notification-type-job"
  },
  status_update: {
    icon: "pulse",
    label: "Status update",
    className: "notification-type-status"
  },
  interview: {
    icon: "calendar",
    label: "Interview",
    className: "notification-type-interview"
  }
};

const NotificationPanel = ({
  items,
  onMarkRead,
  onDelete,
  onClearAll,
  canClearAll,
  filter = "all",
  onFilterChange,
  title = "Notifications",
  description = "Stay on top of recent updates without losing context.",
  compact = false
}) => {
  const panelClassName = `panel notification-panel${compact ? " is-compact" : ""}`;

  return (
    <section className={panelClassName}>
      <div className="panel-header">
        <div className="section-title-group">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="notification-toolbar">
          {onFilterChange ? (
            <div className="notification-filter">
              <button
                className={`filter-chip${filter === "all" ? " active" : ""}`}
                type="button"
                onClick={() => onFilterChange("all")}
              >
                All
              </button>
              <button
                className={`filter-chip${filter === "unread" ? " active" : ""}`}
                type="button"
                onClick={() => onFilterChange("unread")}
              >
                Unread
              </button>
            </div>
          ) : null}
          {onClearAll && (canClearAll ?? items.length > 0) ? (
            <button className="btn btn-ghost" type="button" onClick={onClearAll}>
              Clear all
            </button>
          ) : null}
        </div>
      </div>
      {!items.length ? (
        <EmptyState
          icon="notifications"
          title="No notifications available"
          description="Notifications from MongoDB will appear here as soon as employers post jobs or update applications."
        />
      ) : (
        <ul className="notifications">
          {items.map((item) => {
            const typeMeta = notificationTypeMeta[item.type] || notificationTypeMeta.status_update;

            return (
              <li key={item.id} className={`notification-item${item.isRead ? "" : " is-unread"}`}>
                <span className={`empty-state-icon notification-type-badge ${typeMeta.className}`} aria-hidden="true">
                  <Icon name={typeMeta.icon} />
                </span>
                <div className="notification-copy">
                  <div className="notification-meta">
                    <span className="mini-badge">{typeMeta.label}</span>
                    <span>{item.time}</span>
                  </div>
                  <p>{item.message}</p>
                </div>
                <div className="notification-actions">
                  {!item.isRead && onMarkRead ? (
                    <button className="btn btn-outline" type="button" onClick={() => onMarkRead(item.id)}>
                      Mark as read
                    </button>
                  ) : null}
                  {onDelete ? (
                    <button className="btn btn-ghost" type="button" onClick={() => onDelete(item.id)}>
                      Dismiss
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default NotificationPanel;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import Icon from "./Icon";
import NotificationPanel from "./NotificationPanel";

const formatTime = (value) => {
  if (!value) return "Recently";
  return new Date(value).toLocaleString();
};

const NotificationBell = () => {
  const bellRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markNotificationAsRead, dismissNotification, clearAll } = useNotifications();

  useEffect(() => {
    if (!open) return undefined;

    const handleOutsideClick = (event) => {
      if (!bellRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const previewItems = useMemo(
    () =>
      notifications.slice(0, 6).map((item) => ({
        ...item,
        time: formatTime(item.createdAt)
      })),
    [notifications]
  );

  return (
    <div ref={bellRef} className="notification-bell-wrap">
      <button
        className="icon-button notification-trigger"
        type="button"
        aria-label="Open notifications"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name="notifications" />
        {unreadCount ? <span className="notification-count-badge">{unreadCount}</span> : null}
      </button>

      <div className={`notification-dropdown${open ? " is-open" : ""}`}>
        <NotificationPanel
          compact
          items={previewItems}
          onMarkRead={markNotificationAsRead}
          onDelete={dismissNotification}
          onClearAll={clearAll}
          canClearAll={notifications.length > 0}
          title="Notifications"
          description="Real-time updates from jobs, applications, and interviews."
        />
        <div className="notification-dropdown-footer">
          <Link className="btn btn-outline" to="/notifications" onClick={() => setOpen(false)}>
            View all
            <Icon name="arrowRight" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;

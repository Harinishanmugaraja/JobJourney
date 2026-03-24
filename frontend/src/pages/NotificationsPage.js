import React, { useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Loader from "../components/Loader";
import NotificationPanel from "../components/NotificationPanel";
import PageHero from "../components/PageHero";
import { useNotifications } from "../context/NotificationContext";

const formatTime = (value) => {
  if (!value) return "Recently";
  return new Date(value).toLocaleString();
};

const NotificationsPage = ({ setToast }) => {
  const [filter, setFilter] = useState("all");
  const {
    notifications,
    loading,
    unreadCount,
    markNotificationAsRead,
    dismissNotification,
    clearAll
  } = useNotifications();

  const visibleNotifications = useMemo(() => {
    const filtered = filter === "unread" ? notifications.filter((item) => !item.isRead) : notifications;
    return filtered.map((item) => ({ ...item, time: formatTime(item.createdAt) }));
  }, [filter, notifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setToast?.({ type: "success", message: "Notification marked as read." });
    } catch (_error) {
      setToast?.({ type: "error", message: "Unable to update notification." });
    }
  };

  const dismiss = async (id) => {
    try {
      await dismissNotification(id);
      setToast?.({ type: "success", message: "Notification dismissed." });
    } catch (_error) {
      setToast?.({ type: "error", message: "Unable to dismiss notification." });
    }
  };

  const clearAllNotifications = async () => {
    try {
      await clearAll();
      setToast?.({ type: "success", message: "Notifications cleared." });
    } catch (_error) {
      setToast?.({ type: "error", message: "Unable to clear notifications." });
    }
  };

  return (
    <DashboardLayout title="Notifications">
      <PageHero
        badge="Inbox"
        title="Keep important updates visible without visual clutter."
        description="This notification center uses the existing backend route and turns plain alerts into a cleaner review queue."
        stats={[
          { label: "Total notifications", value: notifications.length, helper: "Fetched from backend" },
          { label: "Unread", value: unreadCount, helper: "Needs attention" }
        ]}
        visual={<div className="hero-visual-card"><div className="hero-visual-row"><div><strong>Attention queue</strong><p className="section-empty-text">Read and dismiss backend notifications in one place.</p></div><span className="mini-badge">{unreadCount} unread</span></div><div className="hero-mini-chart" /></div>}
      />
      {loading ? (
        <Loader />
      ) : (
        <NotificationPanel
          items={visibleNotifications}
          filter={filter}
          onFilterChange={setFilter}
          onMarkRead={handleMarkAsRead}
          onDelete={dismiss}
          onClearAll={clearAllNotifications}
          canClearAll={notifications.length > 0}
        />
      )}
    </DashboardLayout>
  );
};

export default NotificationsPage;

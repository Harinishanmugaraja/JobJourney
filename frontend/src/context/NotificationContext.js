import React, { createContext, startTransition, useContext, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import {
  clearNotifications as clearNotificationsRequest,
  deleteNotification,
  getNotifications,
  markNotificationAsRead
} from "../services/notificationService";

const NotificationContext = createContext(null);

const getSocketUrl = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  return (process.env.REACT_APP_SOCKET_URL || apiUrl).replace(/\/api\/?$/, "");
};

const sortNotifications = (items) =>
  [...items].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

const mergeNotifications = (current, incoming) => {
  const next = new Map(current.map((item) => [item.id, item]));
  next.set(incoming.id, { ...next.get(incoming.id), ...incoming });
  return sortNotifications(Array.from(next.values()));
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      socketRef.current?.disconnect();
      socketRef.current = null;
      return undefined;
    }

    let isMounted = true;

    const loadNotifications = async () => {
      setLoading(true);
      try {
        const { data } = await getNotifications();
        if (isMounted) {
          setNotifications(sortNotifications(data));
        }
      } catch (_error) {
        if (isMounted) {
          setNotifications([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNotifications();

    const token = localStorage.getItem("token");
    if (token) {
      const socket = io(getSocketUrl(), {
        auth: { token },
        transports: ["websocket"]
      });

      socket.on("notification:new", (payload) => {
        startTransition(() => {
          setNotifications((current) => mergeNotifications(current, payload));
        });
      });

      socket.on("notification:updated", (payload) => {
        startTransition(() => {
          setNotifications((current) => mergeNotifications(current, payload));
        });
      });

      socket.on("notification:cleared", () => {
        startTransition(() => {
          setNotifications([]);
        });
      });

      socketRef.current = socket;
    }

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const unreadCount = useMemo(
    () => notifications.reduce((count, item) => count + (item.isRead ? 0 : 1), 0),
    [notifications]
  );

  const refreshNotifications = async (filter) => {
    const params = filter && filter !== "all" ? { filter } : undefined;
    const { data } = await getNotifications(params);
    setNotifications(sortNotifications(data));
    return data;
  };

  const markAsRead = async (id) => {
    const { data } = await markNotificationAsRead(id);
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, ...data } : item)));
    return data;
  };

  const dismissNotification = async (id) => {
    await deleteNotification(id);
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  const clearAll = async () => {
    await clearNotificationsRequest();
    setNotifications([]);
  };

  const value = useMemo(
    () => ({
      notifications,
      loading,
      unreadCount,
      refreshNotifications,
      markNotificationAsRead: markAsRead,
      dismissNotification,
      clearAll
    }),
    [clearAll, dismissNotification, loading, notifications, refreshNotifications, unreadCount, markAsRead]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => useContext(NotificationContext);

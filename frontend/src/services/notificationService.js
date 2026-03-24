import api from "./api";

export const getNotifications = (params) => api.get("/notifications", { params });
export const getUserNotifications = (userId, params) => api.get(`/notifications/${userId}`, { params });
export const createNotification = (payload) => api.post("/notifications", payload);
export const markNotificationAsRead = (id) => api.patch(`/notifications/${id}/read`);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
export const clearNotifications = (params) => api.delete("/notifications", { params });

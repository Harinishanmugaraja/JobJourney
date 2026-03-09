import api from "./api";

export const getUsers = () => api.get("/users");
export const toggleUserStatus = (id) => api.patch(`/users/${id}/toggle-status`);
export const deleteUser = (id) => api.delete(`/users/${id}`);

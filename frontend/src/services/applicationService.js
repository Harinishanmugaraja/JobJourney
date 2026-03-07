import api from "./api";

export const getApplications = (params) => api.get("/applications", { params });
export const createApplication = (payload) => api.post("/applications", payload);
export const updateApplication = (id, payload) => api.put(`/applications/${id}`, payload);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

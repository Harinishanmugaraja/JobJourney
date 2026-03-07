import api from "./api";

export const getInterviews = () => api.get("/interviews");
export const createInterview = (payload) => api.post("/interviews", payload);
export const updateInterview = (id, payload) => api.put(`/interviews/${id}`, payload);

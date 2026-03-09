export const ROLE_PATHS = {
  jobseeker: "/dashboard/jobseeker",
  employer: "/dashboard/employer",
  admin: "/dashboard/admin"
};

export const getDashboardPathByRole = (role) => ROLE_PATHS[role] || ROLE_PATHS.jobseeker;

export const formatRole = (role = "") => {
  if (role === "jobseeker") return "Job Seeker";
  if (role === "employer") return "Employer";
  if (role === "admin") return "Administrator";
  return "Guest";
};

import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ApplicationPage from "./pages/ApplicationPage";
import TrackingPage from "./pages/TrackingPage";
import InterviewPage from "./pages/InterviewPage";
import Toast from "./components/Toast";
import { getDashboardPathByRole } from "./utils/roles";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to={getDashboardPathByRole(user.role)} replace />;
  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={getDashboardPathByRole(user.role)} replace />;
};

const AppRoutes = () => {
  const [toast, setToast] = useState(null);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage setToast={setToast} />} />
        <Route path="/register" element={<RegistrationPage setToast={setToast} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/jobseeker"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["jobseeker"]}>
                <JobSeekerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employer"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["employer"]}>
                <EmployerDashboard setToast={setToast} />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <AdminDashboard setToast={setToast} />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["jobseeker"]}>
                <ApplicationPage setToast={setToast} />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracking"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["jobseeker"]}>
                <TrackingPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interviews"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["jobseeker", "employer"]}>
                <InterviewPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;

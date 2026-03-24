import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ApplicationPage from "./pages/ApplicationPage";
import TrackingPage from "./pages/TrackingPage";
import InterviewPage from "./pages/InterviewPage";
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import Toast from "./components/Toast";
import ThemeToggleButton from "./components/ThemeToggleButton";
import { getDashboardPathByRole } from "./utils/roles";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import { NotificationProvider } from "./context/NotificationContext";

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

const AuthPageRoute = ({ children, blockAdmin = false }) => {
  const { user } = useAuth();

  if (!user) return children;
  if (blockAdmin && user.role === "admin") return <Navigate to="/dashboard/admin" replace />;

  return <Navigate to={getDashboardPathByRole(user.role)} replace />;
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
        <Route
          path="/login"
          element={
            <AuthPageRoute>
              <LoginPage setToast={setToast} />
            </AuthPageRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthPageRoute blockAdmin>
              <RegistrationPage setToast={setToast} />
            </AuthPageRoute>
          }
        />
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
                <JobSeekerDashboard setToast={setToast} />
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
          path="/jobs"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["jobseeker"]}>
                <JobsPage setToast={setToast} />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:jobId"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["jobseeker"]}>
                <JobDetailsPage setToast={setToast} />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracking"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["jobseeker"]}>
                <TrackingPage setToast={setToast} />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interviews"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["jobseeker", "employer"]}>
                <InterviewPage setToast={setToast} />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage setToast={setToast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage setToast={setToast} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ThemeToggleButton />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;

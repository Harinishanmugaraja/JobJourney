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

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const RoleDashboard = ({ setToast }) => {
  const { user } = useAuth();
  if (user.role === "jobseeker") return <JobSeekerDashboard />;
  if (user.role === "employer") return <EmployerDashboard setToast={setToast} />;
  return <AdminDashboard setToast={setToast} />;
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
              <RoleDashboard setToast={setToast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <ApplicationPage setToast={setToast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracking"
          element={
            <ProtectedRoute>
              <TrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interviews"
          element={
            <ProtectedRoute>
              <InterviewPage />
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

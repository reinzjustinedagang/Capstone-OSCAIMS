import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/partials/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/partials/PublicRoute.jsx";

import NotFoundPage from "./pages/NotFoundPage.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
// Public Pages
import { LoginPage } from "./pages/public/LoginPage";
import { HomePage } from "./pages/public/HomePage";
import { RegisterPage } from "./pages/public/RegisterPage";
import { ForgotPasswordPage } from "./pages/public/ForgotPasswordPage";
import { VerifyOTPPage } from "./pages/public/VerifyOTPPage";
import { ResetPasswordPage } from "./pages/public/ResetPasswordPage";

// Admin Pages
import { DashboardPage } from "./pages/admin/DashboardPage";
import { SeniorCitizenPage } from "./pages/admin/SeniorCitizenPage";
import { OfficialsPage } from "./pages/admin/OfficialsPage";
import { PensionListPage } from "./pages/admin/PensionListPage";
import { BenefitsPage } from "./pages/admin/BenefitsPage";
import { SmsPage } from "./pages/admin/SmsPage";
import { ReportPage } from "./pages/admin/ReportPage";
import { SettingsPage } from "./pages/admin/SettingsPage";
import { UserManagementPage } from "./pages/admin/UserManagementPage.jsx";
import { MyProfilePage } from "./pages/admin/MyProfilePage.jsx";
import { AuditLogsPage } from "./pages/admin/AuditLogsPage.jsx";
import { BarangayManagementPage } from "./pages/admin/BarangayManagementPage.jsx";
import { LoginTrailPage } from "./pages/admin/LoginTrailPage.jsx";

// Staff Pages
import { UserDashboard } from "./pages/user/UserDashboard";
import { NotificationPage } from "./pages/admin/NotificationPage.jsx";
import { RecycleBinPage } from "./pages/admin/RecycleBinPage.jsx";
import { EventPage } from "./pages/admin/EventPage.jsx";

function App() {
  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <HomePage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <PublicOnlyRoute>
            <VerifyOTPPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicOnlyRoute>
            <ResetPasswordPage />
          </PublicOnlyRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="Admin">
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/senior-citizen-list"
        element={
          <ProtectedRoute role="Admin">
            <SeniorCitizenPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/osca-officials"
        element={
          <ProtectedRoute role="Admin">
            <OfficialsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pension-list"
        element={
          <ProtectedRoute role="Admin">
            <PensionListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/benefits"
        element={
          <ProtectedRoute role="Admin">
            <BenefitsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/sms-management"
        element={
          <ProtectedRoute role="Admin">
            <SmsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute role="Admin">
            <ReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute role="Admin">
            <AuditLogsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/my-profile"
        element={
          <ProtectedRoute role="Admin">
            <MyProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/user-management"
        element={
          <ProtectedRoute role="Admin">
            <UserManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute role="Admin">
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/barangays"
        element={
          <ProtectedRoute role="Admin">
            <BarangayManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute role="Admin">
            <NotificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/recycle-bin"
        element={
          <ProtectedRoute role="Admin">
            <RecycleBinPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/login-trail/:userId"
        element={
          <ProtectedRoute role="Admin">
            <LoginTrailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute role="Admin">
            <EventPage />
          </ProtectedRoute>
        }
      />

      {/* Staff Routes */}
      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute role="Staff">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
  );
}

export default App;

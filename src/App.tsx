import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, getDashboardPathByRole } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { OrganizationPage } from './pages/OrganizationPage';
import { NewsPage } from './pages/NewsPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AspirationsPage } from './pages/AspirationsPage';
import { AspirationTrackPage } from './pages/AspirationTrackPage';
import { LegalDocumentsPage } from './pages/LegalDocumentsPage';
import { DocumentDetailPage } from './pages/DocumentDetailPage';

// Authentication & Admin Dashboard Pages
import { LoginPage } from './pages/LoginPage';
import { SuperAdminLayout } from './pages/dashboard/SuperAdminLayout';
import { SuperAdminOverview } from './pages/dashboard/SuperAdminOverview';
import {
  SuperAdminUsersPage,
  SuperAdminRolesPage,
  SuperAdminAspirationsPage,
  SuperAdminNewsPage,
  SuperAdminDocumentsPage,
  SuperAdminOrganizationPage,
  SuperAdminAuditLogsPage,
  SuperAdminSettingsPage,
} from './pages/dashboard/modules/SuperAdminModules';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { EditorDashboard } from './pages/dashboard/EditorDashboard';

/**
 * Intelligent redirect for generic /dashboard path
 * Sends user directly to their respective role dashboard based on verified account
 */
const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={getDashboardPathByRole(user.role)} replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <Routes>
            {/* 1. Public Portal Routes wrapped in MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="organization" element={<OrganizationPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="news/:slug" element={<ArticleDetailPage />} />
              <Route path="aspirations" element={<AspirationsPage />} />
              <Route path="aspirations/track" element={<AspirationTrackPage />} />
              <Route path="legal-documents" element={<LegalDocumentsPage />} />
              <Route path="legal-documents/:id" element={<DocumentDetailPage />} />
            </Route>

            {/* 2. Unified Admin Authentication Route (No role dropdown) */}
            <Route path="/login" element={<LoginPage />} />

            {/* 3. Generic /dashboard redirect */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />

            {/* 4. Role-Protected Admin Dashboards */}
            <Route
              path="/dashboard/super-admin"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <SuperAdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<SuperAdminOverview />} />
              <Route path="users" element={<SuperAdminUsersPage />} />
              <Route path="roles" element={<SuperAdminRolesPage />} />
              <Route path="aspirations" element={<SuperAdminAspirationsPage />} />
              <Route path="news" element={<SuperAdminNewsPage />} />
              <Route path="documents" element={<SuperAdminDocumentsPage />} />
              <Route path="organization" element={<SuperAdminOrganizationPage />} />
              <Route path="audit-logs" element={<SuperAdminAuditLogsPage />} />
              <Route path="settings" element={<SuperAdminSettingsPage />} />
            </Route>

            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/editor"
              element={
                <ProtectedRoute allowedRoles={['editor']}>
                  <EditorDashboard />
                </ProtectedRoute>
              }
            />

            {/* 5. Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

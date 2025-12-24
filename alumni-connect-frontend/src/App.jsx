import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProfilePage from './pages/dashboard/ProfilePage';
import AlumniCardPage from './pages/dashboard/AlumniCardPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import ForumPage from './pages/dashboard/ForumPage';
import CreatePostPage from './pages/dashboard/CreatePostPage';
import PostDetailPage from './pages/dashboard/PostDetailPage';
import JobsPage from './pages/dashboard/JobsPage';
import JobDetailPage from './pages/dashboard/JobDetailPage';
import CreateJobPage from './pages/dashboard/CreateJobPage';
import MyApplicationsPage from './pages/dashboard/MyApplicationsPage';
import EventsPage from './pages/dashboard/EventsPage';
import EventDetailPage from './pages/dashboard/EventDetailPage';
import CreateEventPage from './pages/dashboard/CreateEventPage';
import MyEventsPage from './pages/dashboard/MyEventsPage';
import FundingPage from './pages/dashboard/FundingPage';
import CampaignDetailPage from './pages/dashboard/CampaignDetailPage';
import CreateCampaignPage from './pages/dashboard/CreateCampaignPage';
import MyDonationsPage from './pages/dashboard/MyDonationsPage';
import useAuthStore from './features/auth/store/authStore';
import ConnectionStatus from './components/ui/ConnectionStatus';

// Admin Imports
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import EventApproval from './pages/Admin/EventApproval';
import FundingApproval from './pages/Admin/FundingApproval';



function App() {
  const { isAuthenticated, user } = useAuthStore();

  // Helper to get redirect path based on user role
  const getRedirectPath = () => {
    if (!user) return '/dashboard';
    return user.role === 'super_admin' ? '/admin' : '/dashboard';
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to={getRedirectPath()} replace /> : <LandingPage />
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to={getRedirectPath()} replace /> : <LoginPage />
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to={getRedirectPath()} replace /> : <RegisterPage />
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="card" element={<AlumniCardPage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Forum Routes */}
          <Route path="forum" element={<ForumPage />} />
          <Route path="forum/create" element={<CreatePostPage />} />
          <Route path="forum/post/:id" element={<PostDetailPage />} />

          {/* Jobs Routes */}
          <Route path="jobs" element={<JobsPage />} />
          <Route path="jobs/create" element={<CreateJobPage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
          <Route path="my-applications" element={<MyApplicationsPage />} />

          {/* Events Routes */}
          <Route path="events" element={<EventsPage />} />
          <Route path="events/create" element={<CreateEventPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="my-events" element={<MyEventsPage />} />

          {/* Funding Routes */}
          <Route path="funding" element={<FundingPage />} />
          <Route path="funding/create" element={<CreateCampaignPage />} />
          <Route path="funding/:id" element={<CampaignDetailPage />} />
          <Route path="my-donations" element={<MyDonationsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="events" element={<EventApproval />} />
          <Route path="funding" element={<FundingApproval />} />
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ConnectionStatus />
    </Router>
  );
}

export default App;
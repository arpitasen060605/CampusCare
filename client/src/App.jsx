import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import StudentDashboard from './pages/StudentDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import MyComplaints from './pages/MyComplaints';
import ComplaintDetails from './pages/ComplaintDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaints from './pages/AdminComplaints';
import StaffDashboard from './pages/StaffDashboard';
import Analytics from './pages/Analytics';
import CampusMap from './pages/CampusMap';

function AppContent() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname === '/reset-password';

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navbar Header */}
      <Navbar
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        showToast={showToast}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Render Sidebar on authenticated app routes */}
        {isAuthenticated && !isPublicPage && (
          <Sidebar
            role={user?.role || 'student'}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Dynamic Route Content */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all ${
          !isPublicPage ? 'max-w-7xl mx-auto w-full' : ''
        }`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login showToast={showToast} />} />
            <Route path="/register" element={<Register showToast={showToast} />} />
            <Route path="/forgot-password" element={<ForgotPassword showToast={showToast} />} />
            <Route path="/reset-password" element={<ResetPassword showToast={showToast} />} />

            {/* Student Protected Routes */}
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/submit-complaint" 
              element={
                <ProtectedRoute allowedRoles={['student', 'staff', 'admin']}>
                  <SubmitComplaint showToast={showToast} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-complaints" 
              element={
                <ProtectedRoute allowedRoles={['student', 'staff', 'admin']}>
                  <MyComplaints />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/complaint/:id" 
              element={
                <ProtectedRoute allowedRoles={['student', 'staff', 'admin']}>
                  <ComplaintDetails showToast={showToast} />
                </ProtectedRoute>
              } 
            />

            {/* Admin Protected Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/complaints" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminComplaints showToast={showToast} />
                </ProtectedRoute>
              } 
            />

            {/* Staff Protected Routes */}
            <Route 
              path="/staff/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <StaffDashboard showToast={showToast} />
                </ProtectedRoute>
              } 
            />

            {/* General App Routes */}
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute allowedRoles={['student', 'staff', 'admin']}>
                  <Analytics showToast={showToast} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/map" 
              element={
                <ProtectedRoute allowedRoles={['student', 'staff', 'admin']}>
                  <CampusMap />
                </ProtectedRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
      </div>

      {/* Footer on Public Landing Page */}
      {isPublicPage && <Footer />}

      {/* Global Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

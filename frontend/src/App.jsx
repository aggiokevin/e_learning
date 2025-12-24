import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ChatbotWidget from './components/Chatbot/ChatbotWidget';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CourseCatalog from './pages/Courses/CourseCatalog';
import CourseDetails from './pages/Courses/CourseDetails';
import CourseLesson from './pages/Courses/CourseLesson';
import StudentDashboard from './pages/Student/StudentDashboard';
import MyCourses from './pages/Student/MyCourses';
import TrainerDashboard from './pages/Trainer/TrainerDashboard';
import CreateCourse from './pages/Trainer/CreateCourse';
import ManageCourse from './pages/Trainer/ManageCourse';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Dashboard Router - redirects to appropriate dashboard based on role
const DashboardRouter = () => {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'TRAINER':
      return <Navigate to="/trainer/dashboard" replace />;
    case 'TRAINEE':
    default:
      return <StudentDashboard />;
  }
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          
          {/* Protected Routes - All authenticated users */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/courses/:id/learn" 
            element={
              <ProtectedRoute>
                <CourseLesson />
              </ProtectedRoute>
            } 
          />

          {/* Student Routes */}
          <Route 
            path="/my-courses" 
            element={
              <ProtectedRoute allowedRoles={['TRAINEE']}>
                <MyCourses />
              </ProtectedRoute>
            } 
          />

          {/* Trainer Routes */}
          <Route 
            path="/trainer/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['TRAINER', 'ADMIN']}>
                <TrainerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trainer/create-course" 
            element={
              <ProtectedRoute allowedRoles={['TRAINER', 'ADMIN']}>
                <CreateCourse />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trainer/courses/:id" 
            element={
              <ProtectedRoute allowedRoles={['TRAINER', 'ADMIN']}>
                <ManageCourse />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      {isAuthenticated && <ChatbotWidget />}
      <Toaster position="top-right" />
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

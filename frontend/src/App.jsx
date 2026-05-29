import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PlannerPage from './pages/PlannerPage';
import ItineraryPage from './pages/ItineraryPage';
import SharedItineraryPage from './pages/SharedItineraryPage';
import Loader from './components/Loader';

// Helper component to secure dashboards from unauthenticated users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loader message="Verifying Travel Credentials..." />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Glowing floating ambient stars in CSS */}
        <Navbar />
        
        <Routes>
          {/* Public Landing Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/share/itinerary/:shareId" element={<SharedItineraryPage />} />

          {/* Protected Dashboard Editor Pages */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/planner" 
            element={
              <ProtectedRoute>
                <PlannerPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/itinerary/:id" 
            element={
              <ProtectedRoute>
                <ItineraryPage />
              </ProtectedRoute>
            } 
          />

          {/* Fallback redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

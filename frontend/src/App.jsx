// src/App.jsx - Root application component with Routing and Lazy Loading
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Standard Route Components
import LoginPage from './pages/LoginPage';
import FleetPage from './pages/FleetPage';
import MyBookingsPage from './pages/MyBookingsPage';

// WHY: React.lazy dynamically splits and imports AdminPanel on-demand only when user visits /admin, reducing initial bundle size
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Login Route */}
              <Route path="/" element={<LoginPage />} />

              {/* Protected Customer Routes */}
              <Route
                path="/fleet"
                element={
                  <ProtectedRoute>
                    <FleetPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Lazy-Loaded Admin Route wrapped in Suspense with fallback */}
              <Route
                path="/admin"
                element={
                  <Suspense
                    fallback={
                      <div className="spinner-container">
                        <div className="spinner"></div>
                        <p style={{ color: 'var(--text-muted)' }}>Loading Admin Panel...</p>
                      </div>
                    }
                  >
                    <AdminPanel />
                  </Suspense>
                }
              />

              {/* Fallback route redirects unmatched URLs to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

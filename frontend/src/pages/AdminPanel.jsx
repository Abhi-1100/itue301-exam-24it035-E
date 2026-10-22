// src/pages/AdminPanel.jsx - Lazy-loaded Admin/Fleet Manager placeholder dashboard
// WHY: Must be DEFAULT EXPORTED so React.lazy(() => import('./pages/AdminPanel')) works properly
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const AdminPanel = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // WHY: Compute real fleet analytics on the client to demonstrate dynamic live stats
  useEffect(() => {
    const fetchFleetData = async () => {
      try {
        const res = await axios.get(`${API_URL}/vehicles`);
        setVehicles(res.data.data || []);
      } catch (err) {
        console.error('Failed to load fleet analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFleetData();
  }, []);

  // Compute metrics
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.available).length;
  const bookedVehicles = totalVehicles - availableVehicles;
  const utilizationRate = totalVehicles > 0 ? Math.round((bookedVehicles / totalVehicles) * 100) : 0;

  // Breakdown by category
  const hatchbackCount = vehicles.filter((v) => v.type === 'Hatchback').length;
  const sedanCount = vehicles.filter((v) => v.type === 'Sedan').length;
  const suvCount = vehicles.filter((v) => v.type === 'SUV').length;

  return (
    <div className="container">
      {/* Role explanation banner */}
      <div className="admin-badge-banner">
        <span style={{ fontSize: '2rem' }}>🛡️</span>
        <div>
          <h3 style={{ margin: 0, color: '#ffffff' }}>Fleet Manager & Admin Console</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#c084fc' }}>
            Note: This route is lazy-loaded with React.lazy + Suspense to optimize initial bundle size.
          </p>
        </div>
      </div>

      <h1 className="page-title" style={{ marginBottom: '1.5rem' }}>
        Fleet Overview & Analytics
      </h1>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Calculating fleet metrics...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Fleet Size</span>
              <span className="stat-value">{totalVehicles}</span>
              <span className="stat-note">Cars in system</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Ready for Rental</span>
              <span className="stat-value" style={{ color: '#34d399' }}>
                {availableVehicles}
              </span>
              <span className="stat-note">Available right now</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Currently Reserved</span>
              <span className="stat-value" style={{ color: '#f87171' }}>
                {bookedVehicles}
              </span>
              <span className="stat-note">Assigned / In transit</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Fleet Utilization</span>
              <span className="stat-value" style={{ color: 'var(--accent-cyan)' }}>
                {utilizationRate}%
              </span>
              <span className="stat-note">Active capacity</span>
            </div>
          </div>

          {/* Fleet Distribution breakdown */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '1.75rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#ffffff' }}>Fleet Distribution by Category</h3>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <span className="type-badge type-hatchback">Hatchback</span>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0 0' }}>
                  {hatchbackCount} Units
                </p>
              </div>
              <div>
                <span className="type-badge type-sedan">Sedan</span>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0 0' }}>
                  {sedanCount} Units
                </p>
              </div>
              <div>
                <span className="type-badge type-suv">SUV</span>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0 0' }}>
                  {suvCount} Units
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// WHY: Default export is mandatory for dynamic React.lazy() importing
export default AdminPanel;

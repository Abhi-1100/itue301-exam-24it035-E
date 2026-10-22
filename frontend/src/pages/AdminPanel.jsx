// src/pages/AdminPanel.jsx - Lazy-loaded Admin/Fleet Manager dashboard (UI/UX Pro Max Enhanced)
// WHY: Must be DEFAULT EXPORTED so React.lazy(() => import('./pages/AdminPanel')) works properly
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconShield, IconTrendingUp, IconCarLogo } from '../components/Icons';

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
        <div className="admin-banner-icon">
          <IconShield size={32} />
        </div>
        <div>
          <h3>Fleet Manager & Admin Console</h3>
          <p>
            Note: This route is lazy-loaded with React.lazy + Suspense to optimize initial bundle size.
          </p>
        </div>
      </div>

      <div className="page-header-row">
        <div>
          <h1 className="page-title">Fleet Overview & Analytics</h1>
          <p className="page-subtitle">Real-time capacity tracking across all rental hubs</p>
        </div>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="spinner-caption">Calculating fleet metrics...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-label">Total Fleet Size</span>
                <IconCarLogo size={18} className="text-muted" />
              </div>
              <span className="stat-value tabular-num">{totalVehicles}</span>
              <span className="stat-note">Verified vehicles on platform</span>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-label">Ready for Rental</span>
                <span className="status-dot dot-green"></span>
              </div>
              <span className="stat-value text-emerald tabular-num">
                {availableVehicles}
              </span>
              <span className="stat-note">Instant book available</span>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-label">Currently Reserved</span>
                <span className="status-dot dot-rose"></span>
              </div>
              <span className="stat-value text-rose tabular-num">
                {bookedVehicles}
              </span>
              <span className="stat-note">Assigned / In transit</span>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-label">Fleet Utilization</span>
                <IconTrendingUp size={18} className="text-cyan" />
              </div>
              <span className="stat-value text-cyan tabular-num">
                {utilizationRate}%
              </span>
              <span className="stat-note">Active fleet deployment</span>
            </div>
          </div>

          {/* Fleet Distribution breakdown */}
          <div className="distribution-card">
            <h3 className="distribution-title">Fleet Distribution by Category</h3>
            <div className="distribution-row">
              <div className="distribution-item">
                <span className="type-badge type-hatchback">Hatchback</span>
                <p className="distribution-count tabular-num">
                  {hatchbackCount} <span>Units</span>
                </p>
              </div>
              <div className="distribution-item">
                <span className="type-badge type-sedan">Sedan</span>
                <p className="distribution-count tabular-num">
                  {sedanCount} <span>Units</span>
                </p>
              </div>
              <div className="distribution-item">
                <span className="type-badge type-suv">SUV</span>
                <p className="distribution-count tabular-num">
                  {suvCount} <span>Units</span>
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

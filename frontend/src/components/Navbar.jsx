// src/components/Navbar.jsx - Glassmorphism navigation bar (UI/UX Pro Max Enhanced)
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconCarLogo, IconUser } from './Icons';

const Navbar = () => {
  const { customer, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      {/* WHY: React Router <Link> performs client-side routing without triggering browser page reload */}
      <Link to={isAuthenticated ? '/fleet' : '/'} className="nav-brand">
        <span className="brand-icon-wrapper">
          <IconCarLogo size={22} className="brand-svg" />
        </span>
        <span>
          Drive<span className="brand-accent">Easy</span>
        </span>
      </Link>

      <ul className="nav-links">
        {isAuthenticated ? (
          <>
            <li>
              <Link
                to="/fleet"
                className={`nav-link ${location.pathname === '/fleet' ? 'active' : ''}`}
              >
                Fleet
              </Link>
            </li>
            <li>
              <Link
                to="/my-bookings"
                className={`nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`}
              >
                My Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
              >
                Admin
              </Link>
            </li>
            <li>
              <div className="nav-user-pill">
                <IconUser size={15} />
                <span>{customer?.name || 'Customer'}</span>
              </div>
            </li>
            <li>
              <button onClick={logout} className="btn-logout" title="Log out of DriveEasy">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
              >
                Admin (Lazy Preview)
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

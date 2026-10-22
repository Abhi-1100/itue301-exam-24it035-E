// src/pages/LoginPage.jsx - Customer login screen (UI/UX Pro Max Enhanced)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { IconCarLogo, IconKey, IconAlert } from '../components/Icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // WHY: Quick fill helper allows examiners to test authentication with a single click during viva
  const fillCredentials = (demoEmail, demoLicense) => {
    setEmail(demoEmail);
    setLicenseNumber(demoLicense);
    setErrorMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // WHY: Client-side validation prevents empty form submission
    if (!email || !licenseNumber) {
      setErrorMessage('Please enter both your email address and driving license number.');
      return;
    }

    try {
      setLoading(true);
      // Send login request to backend
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        licenseNumber
      });

      // WHY: Save token and customer profile into global AuthContext and localStorage
      login(response.data);

      // WHY: Navigate customer directly to fleet browsing page upon successful authentication
      navigate('/fleet');
    } catch (error) {
      // WHY: Distinguish between backend validation/credential error vs server offline error
      let message = 'Login failed. Please check your credentials.';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.request && !error.response) {
        message = `Cannot reach backend API at ${API_URL}. Please ensure the server is running on port 5000.`;
      }
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-emblem">
            <IconCarLogo size={36} className="login-emblem-svg" />
          </div>
          <h1>Welcome to DriveEasy</h1>
          <p>India's Premium Self-Drive Car Rental Platform</p>
        </div>

        {/* Demo Credentials Box for Examiner / Viva Demonstration */}
        <div className="demo-credentials-box">
          <div className="demo-title">
            <IconKey size={16} />
            <span>Demo Examiner Credentials (1-Click Fill)</span>
          </div>
          <div className="demo-item">
            <div>
              <strong>Rahul Sharma:</strong> <code>rahul@example.com</code> (<code>DL-0420110012345</code>)
            </div>
            <button
              type="button"
              className="btn-quickfill"
              onClick={() => fillCredentials('rahul@example.com', 'DL-0420110012345')}
            >
              Fill Rahul
            </button>
          </div>
          <div className="demo-item">
            <div>
              <strong>Priya Patel:</strong> <code>priya@example.com</code> (<code>MH-0220190098765</code>)
            </div>
            <button
              type="button"
              className="btn-quickfill"
              onClick={() => fillCredentials('priya@example.com', 'MH-0220190098765')}
            >
              Fill Priya
            </button>
          </div>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="login-alert-error" role="alert">
            <IconAlert size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-email">Registered Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="e.g. rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-license">Driving License Number</label>
            <input
              id="login-license"
              type="text"
              className="form-input font-mono"
              placeholder="e.g. DL-0420110012345"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading-flex">
                <span className="btn-spinner"></span>
                <span>Authenticating...</span>
              </span>
            ) : (
              'Sign In to DriveEasy'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

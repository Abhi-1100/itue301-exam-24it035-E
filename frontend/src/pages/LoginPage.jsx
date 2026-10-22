// src/pages/LoginPage.jsx - Customer login screen using email and driving license number
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
      // WHY: Extract backend error message or provide fallback
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-badge">🚗</div>
          <h1>Welcome to DriveEasy</h1>
          <p>India's Premium Self-Drive Car Rental Service</p>
        </div>

        {/* Demo Credentials Box for Examiner / Viva Demonstration */}
        <div className="demo-credentials-box">
          <div className="demo-title">
            <span>🔑</span>
            <span>Demo Examiner Credentials (1-Click Fill)</span>
          </div>
          <div className="demo-item">
            <strong>Rahul Sharma:</strong> rahul@example.com (DL-0420110012345)
            <br />
            <button
              type="button"
              className="btn-quickfill"
              onClick={() => fillCredentials('rahul@example.com', 'DL-0420110012345')}
            >
              Fill Rahul
            </button>
          </div>
          <div className="demo-item">
            <strong>Priya Patel:</strong> priya@example.com (MH-0220190098765)
            <br />
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
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.88rem',
            marginBottom: '1.25rem'
          }}>
            ⚠️ {errorMessage}
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
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-license">Driving License Number</label>
            <input
              id="login-license"
              type="text"
              className="form-input"
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
            {loading ? 'Authenticating...' : 'Sign In to DriveEasy'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

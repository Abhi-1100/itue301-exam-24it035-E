// src/pages/MyBookingsPage.jsx - Displays customer's reservations with status badges and cancellation
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const MyBookingsPage = () => {
  const { token, customer } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // WHY: Fetches only the bookings associated with the authenticated customer via Bearer token
  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/bookings/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBookings(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  // WHY: Allow customer to cancel reservation; backend automatically sets vehicle.available back to true
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const response = await axios.patch(
        `${API_URL}/bookings/${bookingId}/status`,
        { status: 'cancelled' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      showToast(response.data.message || 'Booking cancelled successfully', 'success');

      // Update the booking status in local state without full reload
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel booking';
      showToast(msg, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="container">
      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="page-header-row">
        <div>
          <h1 className="page-title">My Bookings</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Active and past rental reservations for {customer?.name}
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Retrieving your booking history...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="state-box">
          <div className="state-icon">⚠️</div>
          <h3>Failed to Load Bookings</h3>
          <p>{error}</p>
          <button onClick={fetchMyBookings} className="btn-retry">
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && bookings.length === 0 && (
        <div className="state-box">
          <div className="state-icon">🏷️</div>
          <h3>No Bookings Found</h3>
          <p>You haven't reserved any vehicles yet. Explore our fleet and take a test drive!</p>
          <Link to="/fleet" className="btn-retry" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Browse Fleet
          </Link>
        </div>
      )}

      {/* Bookings Grid */}
      {!loading && !error && bookings.length > 0 && (
        <div className="bookings-grid">
          {bookings.map((booking) => {
            const vehicle = booking.vehicleId || {};
            return (
              <div key={booking._id} className="booking-card">
                <div className="booking-top">
                  <div>
                    <h3 className="booking-vehicle-name">
                      {vehicle.model || 'Rental Vehicle'}
                    </h3>
                    <span className="booking-id-tag">ID: {booking._id}</span>
                  </div>
                  {/* Colored status chip */}
                  <span className={`status-chip status-${booking.status}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-dates-box">
                  <div className="date-line">
                    <span>Category:</span>
                    <strong>{vehicle.type || 'N/A'}</strong>
                  </div>
                  <div className="date-line">
                    <span>Pickup Date:</span>
                    <strong>{formatDate(booking.pickupDate)}</strong>
                  </div>
                  <div className="date-line">
                    <span>Return Date:</span>
                    <strong>{formatDate(booking.returnDate)}</strong>
                  </div>
                  <div className="date-line">
                    <span>Booked On:</span>
                    <strong>{formatDate(booking.createdAt)}</strong>
                  </div>
                </div>

                <div className="booking-actions">
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Customer: {customer?.name}
                  </span>

                  {/* WHY: Allow cancellation only when status is 'reserved' */}
                  {booking.status === 'reserved' ? (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="btn-cancel-booking"
                    >
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      No actions available
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;

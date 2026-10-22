// src/pages/MyBookingsPage.jsx - Customer reservations dashboard (UI/UX Pro Max Enhanced)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { IconCheck, IconAlert, IconCalendar, IconCarLogo } from '../components/Icons';

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
        <div className="toast-container" role="status" aria-live="polite">
          <div className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' ? <IconCheck size={18} /> : <IconAlert size={18} />}
            </span>
            <span className="toast-text">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="page-header-row">
        <div>
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">
            Active and past rental reservations for {customer?.name}
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="spinner-caption">Retrieving your booking history...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="state-box">
          <div className="state-icon-wrapper">
            <IconAlert size={36} className="text-rose" />
          </div>
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
          <div className="state-icon-wrapper">
            <IconCarLogo size={36} className="text-cyan" />
          </div>
          <h3>No Bookings Found</h3>
          <p>You haven't reserved any vehicles yet. Explore our fleet and take a test drive!</p>
          <Link to="/fleet" className="btn-retry inline-block">
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
                    <span className="booking-id-tag">REF: {booking._id}</span>
                  </div>
                  {/* Colored status chip with pulse dot */}
                  <span className={`status-chip status-${booking.status}`}>
                    <span className="status-dot"></span>
                    <span>{booking.status}</span>
                  </span>
                </div>

                <div className="booking-dates-box">
                  <div className="date-line">
                    <span>Category:</span>
                    <strong className="text-highlight">{vehicle.type || 'N/A'}</strong>
                  </div>
                  <div className="date-line">
                    <span className="flex-center-gap">
                      <IconCalendar size={13} />
                      <span>Pickup:</span>
                    </span>
                    <strong className="tabular-num">{formatDate(booking.pickupDate)}</strong>
                  </div>
                  <div className="date-line">
                    <span className="flex-center-gap">
                      <IconCalendar size={13} />
                      <span>Return:</span>
                    </span>
                    <strong className="tabular-num">{formatDate(booking.returnDate)}</strong>
                  </div>
                  <div className="date-line">
                    <span>Reserved On:</span>
                    <strong className="tabular-num text-muted-subtle">{formatDate(booking.createdAt)}</strong>
                  </div>
                </div>

                <div className="booking-actions">
                  <span className="customer-info-tag">
                    Customer: {customer?.name}
                  </span>

                  {/* WHY: Allow cancellation only when status is 'reserved' */}
                  {booking.status === 'reserved' ? (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="btn-cancel-booking"
                      aria-label="Cancel this reservation"
                    >
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  ) : (
                    <span className="action-closed-tag">
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

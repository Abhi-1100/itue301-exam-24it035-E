// src/pages/FleetPage.jsx - Fleet browsing, client-side filtering, and booking drawer (UI/UX Pro Max Enhanced)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VehicleCard from '../components/VehicleCard';
import { useAuth } from '../context/AuthContext';
import { IconCheck, IconAlert, IconCalendar, IconCarLogo } from '../components/Icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const FleetPage = () => {
  const { token } = useAuth();

  // Task 4 States: Fleet list, loading, error, and client-side filter
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('All');

  // Task 2 States: Booking modal drawer, selected vehicle, dates, and submitting status
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Toast Notification state
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  // WHY: Helper function to show self-dismissing toast notifications
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // WHY: Task 4 - Fetch fleet vehicles from backend API on component mount
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/vehicles`);
      setVehicles(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicle fleet. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // WHY: Task 4 - Client-side filter using JavaScript array .filter() on already-fetched vehicles (no new API call)
  const filteredVehicles = vehicles.filter((v) => {
    if (selectedType === 'All') return true;
    return v.type === selectedType;
  });

  // Calculate rental days and estimated cost preview
  const calculateDaysAndCost = () => {
    if (!pickupDate || !returnDate || !selectedVehicle) return { days: 0, totalCost: 0 };
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return { days: 0, totalCost: 0 };
    return {
      days: diffDays,
      totalCost: diffDays * selectedVehicle.pricePerDay
    };
  };

  const { days, totalCost } = calculateDaysAndCost();

  // WHY: Open slide-in drawer when user clicks "Book Now" on an available vehicle card
  const handleOpenBooking = (vehicle) => {
    setSelectedVehicle(vehicle);
    // Set default pickup date as today and return date as tomorrow
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    setPickupDate(today);
    setReturnDate(tomorrow);
  };

  const handleCloseBooking = () => {
    setSelectedVehicle(null);
    setPickupDate('');
    setReturnDate('');
  };

  // WHY: Task 2 - Handle booking submission to POST /api/v1/bookings with Bearer token
  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    // Client-side date validation
    if (!pickupDate || !returnDate) {
      showToast('Please select both pickup and return dates', 'error');
      return;
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      showToast('Return date must be strictly after pickup date', 'error');
      return;
    }

    try {
      setBookingLoading(true);

      const response = await axios.post(
        `${API_URL}/bookings`,
        {
          vehicleId: selectedVehicle._id,
          pickupDate,
          returnDate
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // WHY: Bearer token is verified by backend authGuard
          }
        }
      );

      // Display backend success message
      showToast(response.data.message || 'Vehicle booked successfully!', 'success');

      // Close slide-in drawer
      handleCloseBooking();

      // WHY: Refetch fleet so the booked vehicle immediately shows "Not Available" badge
      fetchVehicles();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Booking failed. Please try again.';
      showToast(errorMsg, 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div>
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

      {/* Hero Header */}
      <section className="hero-header">
        <div className="hero-pill">
          <IconCarLogo size={14} />
          <span>Self-Drive Freedom Across India</span>
        </div>
        <h1 className="hero-title">Experience Pure Driving Pleasure</h1>
        <p className="hero-subtitle">
          Choose from our pristine fleet of verified hatchbacks, sedans, and SUVs. Transparent
          rates, zero hidden fees, and instant online confirmation.
        </p>

        {/* Task 4: Client-side filter pills */}
        <div className="filter-bar" role="toolbar" aria-label="Vehicle type filters">
          {['All', 'Hatchback', 'Sedan', 'SUV'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`filter-pill ${selectedType === type ? 'active' : ''}`}
              aria-pressed={selectedType === type}
            >
              {type === 'All' ? 'All Vehicles' : type}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container">
        {/* Loading Spinner */}
        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p className="spinner-caption">Loading premium fleet...</p>
          </div>
        )}

        {/* Error State with Retry Button */}
        {error && !loading && (
          <div className="state-box">
            <div className="state-icon-wrapper">
              <IconAlert size={36} className="text-rose" />
            </div>
            <h3>Unable to Load Vehicles</h3>
            <p>{error}</p>
            <button onClick={fetchVehicles} className="btn-retry">
              Retry Connection
            </button>
          </div>
        )}

        {/* Vehicles Grid */}
        {!loading && !error && (
          <>
            {filteredVehicles.length === 0 ? (
              <div className="state-box">
                <div className="state-icon-wrapper">
                  <IconCarLogo size={36} className="text-cyan" />
                </div>
                <h3>No vehicles found</h3>
                <p>No vehicles match the "{selectedType}" category at the moment.</p>
                <button onClick={() => setSelectedType('All')} className="btn-retry">
                  Show All Vehicles
                </button>
              </div>
            ) : (
              <div className="fleet-grid">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle._id}
                    model={vehicle.model}
                    type={vehicle.type}
                    pricePerDay={vehicle.pricePerDay}
                    available={vehicle.available}
                    onBook={() => handleOpenBooking(vehicle)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Task 2: Slide-in Booking Drawer */}
      {selectedVehicle && (
        <div className="drawer-overlay" onClick={handleCloseBooking}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="drawer-header">
              <h2>Reserve Vehicle</h2>
              <button onClick={handleCloseBooking} className="btn-close" aria-label="Close booking drawer">
                &times;
              </button>
            </div>

            {/* Selected Vehicle Summary Banner */}
            <div className="selected-car-banner">
              <div className="model-name">{selectedVehicle.model}</div>
              <div className="meta-row">
                <span className={`type-badge type-${selectedVehicle.type.toLowerCase()}`}>
                  {selectedVehicle.type}
                </span>
                <span className="price-tag-highlight">
                  ₹{selectedVehicle.pricePerDay?.toLocaleString('en-IN')}/day
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking}>
              <div className="form-group">
                <label htmlFor="pickup-date">
                  <IconCalendar size={14} />
                  <span>Pickup Date</span>
                </label>
                <input
                  id="pickup-date"
                  type="date"
                  className="form-input font-mono"
                  min={new Date().toISOString().split('T')[0]}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="return-date">
                  <IconCalendar size={14} />
                  <span>Return Date</span>
                </label>
                <input
                  id="return-date"
                  type="date"
                  className="form-input font-mono"
                  min={pickupDate || new Date().toISOString().split('T')[0]}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                />
              </div>

              {/* Live Cost Estimation Preview */}
              <div className="cost-preview-box">
                <div className="cost-row">
                  <span>Daily Rate:</span>
                  <span className="tabular-num">₹{selectedVehicle.pricePerDay?.toLocaleString('en-IN')}</span>
                </div>
                <div className="cost-row">
                  <span>Rental Duration:</span>
                  <span className="tabular-num">{days > 0 ? `${days} day${days > 1 ? 's' : ''}` : 'Select dates'}</span>
                </div>
                <div className="cost-total">
                  <span>Estimated Total:</span>
                  <span className="total-highlight tabular-num">
                    ₹{totalCost.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-confirm-booking"
                disabled={bookingLoading || days <= 0}
              >
                {bookingLoading ? (
                  <span className="btn-loading-flex">
                    <span className="btn-spinner"></span>
                    <span>Processing Reservation...</span>
                  </span>
                ) : (
                  'Confirm & Reserve Vehicle'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetPage;

// src/components/VehicleCard.jsx - Reusable vehicle presentation card
import React from 'react';

// WHY: Reusable functional component accepting vehicle properties and an onBook action callback
const VehicleCard = ({ model, type, pricePerDay, available, onBook }) => {
  // Helper to display appropriate emoji icon based on car segment
  const getCarIcon = (carType) => {
    switch (carType) {
      case 'SUV':
        return '🚙';
      case 'Sedan':
        return '🚗';
      case 'Hatchback':
      default:
        return '🏎️';
    }
  };

  return (
    <div className="vehicle-card">
      {/* Visual illustration top header */}
      <div className="card-visual">
        <span className="car-avatar">{getCarIcon(type)}</span>
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-title">{model}</h3>
          {/* Segment badge with type-specific color styling */}
          <span className={`type-badge type-${type.toLowerCase()}`}>{type}</span>
        </div>

        <div className="card-pricing">
          <div className="price-box">
            <span className="price-label">Daily Rental</span>
            <div className="price-amount">
              ₹{pricePerDay?.toLocaleString('en-IN')} <span>/ day</span>
            </div>
          </div>

          {/* WHY: Ternary expression renders green "Book Now" button if available, or red "Not Available" badge */}
          {available ? (
            <button
              onClick={onBook}
              className="btn-book"
              aria-label={`Book ${model}`}
            >
              Book Now
            </button>
          ) : (
            <span className="badge-unavailable">Not Available</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;

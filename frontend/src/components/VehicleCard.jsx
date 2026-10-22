// src/components/VehicleCard.jsx - Reusable vehicle presentation card (UI/UX Pro Max Enhanced)
import React from 'react';
import { IconHatchback, IconSedan, IconSUV } from './Icons';

// WHY: Reusable functional component accepting vehicle properties and an onBook action callback
const VehicleCard = ({ model, type, pricePerDay, available, onBook }) => {
  // Render high-fidelity SVG vehicle silhouettes per segment
  const renderVehicleGraphic = (carType) => {
    switch (carType) {
      case 'SUV':
        return <IconSUV size={80} className="vehicle-svg" />;
      case 'Sedan':
        return <IconSedan size={80} className="vehicle-svg" />;
      case 'Hatchback':
      default:
        return <IconHatchback size={80} className="vehicle-svg" />;
    }
  };

  return (
    <div className={`vehicle-card ${!available ? 'is-unavailable' : ''}`}>
      {/* Visual illustration top header with ambient glow */}
      <div className={`card-visual visual-${type.toLowerCase()}`}>
        <div className="card-visual-glow"></div>
        {renderVehicleGraphic(type)}
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-title">{model}</h3>
          {/* Segment badge with type-specific color styling */}
          <span className={`type-badge type-${type.toLowerCase()}`}>{type}</span>
        </div>

        <div className="card-spec-tags">
          <span className="spec-tag">Automatic / Manual</span>
          <span className="spec-tag">Unlimited KMs</span>
        </div>

        <div className="card-pricing">
          <div className="price-box">
            <span className="price-label">Daily Rental</span>
            <div className="price-amount">
              ₹{pricePerDay?.toLocaleString('en-IN')} <span className="price-unit">/ day</span>
            </div>
          </div>

          {/* WHY: Ternary expression renders green "Book Now" button if available, or red "Not Available" badge */}
          {available ? (
            <button
              onClick={onBook}
              className="btn-book"
              aria-label={`Reserve ${model}`}
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

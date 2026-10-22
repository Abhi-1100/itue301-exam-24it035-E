// models/Vehicle.js - Mongoose model representing cars available in the rental fleet
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Vehicle type is required'],
      enum: {
        values: ['Hatchback', 'Sedan', 'SUV'], // WHY: Restricts categories to business-supported car segments
        message: '{VALUE} is not a valid vehicle type'
      }
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Daily rental price is required'],
      min: [0, 'Daily price cannot be negative'] // WHY: Prevents incorrect negative billing values
    },
    available: {
      type: Boolean,
      default: true // WHY: New vehicles added to the fleet are available for booking by default
    }
  },
  {
    // WHY: Tracks vehicle record creation and modification dates
    timestamps: true
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);

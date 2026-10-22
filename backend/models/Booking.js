// models/Booking.js - Mongoose model managing vehicle rental reservations
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer', // WHY: References Customer document to enable population of customer details
      required: [true, 'Customer ID is required']
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle', // WHY: References Vehicle document to enable population of car model/type
      required: [true, 'Vehicle ID is required']
    },
    pickupDate: {
      type: Date,
      required: [true, 'Pickup date is required']
    },
    returnDate: {
      type: Date,
      required: [true, 'Return date is required'],
      // WHY: Custom schema-level validator prevents logically invalid bookings where return is before or equal to pickup
      validate: {
        validator: function (value) {
          // 'this' refers to the booking document being validated
          return value > this.pickupDate;
        },
        message: 'Return date must be strictly after pickup date'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['reserved', 'ongoing', 'completed', 'cancelled'], // WHY: Controls lifecycle of rental reservation
        message: '{VALUE} is not a valid booking status'
      },
      default: 'reserved' // WHY: New bookings start as reserved upon confirmation
    }
  },
  {
    // WHY: Provides createdAt timestamp for sorting newest bookings first
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);

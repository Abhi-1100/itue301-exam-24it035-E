// models/Customer.js - Mongoose model for customer registration and authentication
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Customer email is required'],
      unique: true,
      lowercase: true, // WHY: Normalizes email to avoid duplicate accounts differing only in casing
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    licenseNumber: {
      type: String,
      required: [true, 'Driving license number is required'],
      unique: true, // WHY: Enforces one rental account per verified driving license
      trim: true,
      uppercase: true // WHY: Ensures uniform format for license numbers (e.g., DL-0420110012345)
    }
  },
  {
    // WHY: Automatically tracks creation and update timestamps for auditing
    timestamps: true
  }
);

module.exports = mongoose.model('Customer', customerSchema);

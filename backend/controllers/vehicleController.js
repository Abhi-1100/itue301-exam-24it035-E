// controllers/vehicleController.js - Handles fleet queries
const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles in the fleet
// @route   GET /api/v1/vehicles
// @access  Public
const getAllVehicles = async (req, res, next) => {
  try {
    // WHY: Fetch all vehicles sorted by most recently added so users see the latest fleet
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVehicles
};

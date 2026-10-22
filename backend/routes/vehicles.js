// routes/vehicles.js - Public vehicle browsing routes
const express = require('express');
const router = express.Router();
const { getAllVehicles } = require('../controllers/vehicleController');

// WHY: Public endpoint - anyone can browse available rental vehicles without logging in
router.get('/', getAllVehicles);

module.exports = router;

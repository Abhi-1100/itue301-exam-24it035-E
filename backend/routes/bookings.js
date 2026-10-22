// routes/bookings.js - Protected booking routes
const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authGuard');
const {
  createBooking,
  getMyBookings,
  updateBookingStatus
} = require('../controllers/bookingController');

// WHY: All booking operations require an authenticated customer identity, so authGuard is applied globally to this router
router.use(authGuard);

// POST /api/v1/bookings - Create new vehicle reservation
router.post('/', createBooking);

// GET /api/v1/bookings/my - Fetch customer's own reservations
router.get('/my', getMyBookings);

// PATCH /api/v1/bookings/:id/status - Update reservation status (cancel/complete)
router.patch('/:id/status', updateBookingStatus);

module.exports = router;

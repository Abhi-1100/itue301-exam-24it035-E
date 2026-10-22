// controllers/bookingController.js - Handles booking creation, user booking queries, and status updates
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

/**
 * Separate clearly named helper function to execute booking workflow:
 * Step 1: Find vehicle (404 if missing)
 * Step 2: Check vehicle.available === true (400 if unavailable)
 * Step 3: Create Booking with customerId
 * Step 4: Set vehicle.available = false via findByIdAndUpdate
 */
const executeVehicleReservation = async ({ customerId, vehicleId, pickupDate, returnDate }) => {
  // WHY Step 1: Verify the vehicle exists in database before creating any booking reference
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  // WHY Step 2: Prevent double-booking race condition; only available vehicles can be reserved
  if (vehicle.available !== true) {
    const error = new Error('Vehicle is not available');
    error.statusCode = 400;
    throw error;
  }

  // WHY Step 3: Insert the booking record referencing the authenticated customer and vehicle
  const newBooking = await Booking.create({
    customerId,
    vehicleId,
    pickupDate,
    returnDate
  });

  // WHY Step 4: Immediately mark the vehicle as unavailable so subsequent customer requests cannot book it
  await Vehicle.findByIdAndUpdate(vehicleId, { available: false });

  return newBooking;
};

// @desc    Create a new vehicle booking
// @route   POST /api/v1/bookings
// @access  Protected (Requires authGuard)
const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, pickupDate, returnDate } = req.body;

    // WHY: Basic validation to ensure required parameters are passed before processing
    if (!vehicleId || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vehicleId, pickupDate, and returnDate'
      });
    }

    // Call the dedicated reservation helper function
    const booking = await executeVehicleReservation({
      customerId: req.customer.id,
      vehicleId,
      pickupDate,
      returnDate
    });

    // WHY: HTTP 201 Created signifies successful resource creation
    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for the currently authenticated customer
// @route   GET /api/v1/bookings/my
// @access  Protected (Requires authGuard)
const getMyBookings = async (req, res, next) => {
  try {
    // WHY: Filter by customerId from decoded JWT token so customers only view their own reservations
    // WHY: .populate() performs Mongoose joins to replace IDs with readable customer and vehicle details
    // WHY: .sort({ createdAt: -1 }) guarantees newest bookings are displayed at the top
    const bookings = await Booking.find({ customerId: req.customer.id })
      .populate('customerId', 'name email')
      .populate('vehicleId', 'model type pricePerDay')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update status of an existing booking (e.g. cancel or complete)
// @route   PATCH /api/v1/bookings/:id/status
// @access  Protected (Requires authGuard)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['reserved', 'ongoing', 'completed', 'cancelled'];

    // WHY: Validate against allowed enum statuses before hitting the database
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status '${status}'. Allowed statuses are: ${allowedStatuses.join(', ')}`
      });
    }

    // Find the booking
    const booking = await Booking.findById(id);

    // WHY: Return 404 if booking does not exist
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // WHY: Enforce authorization: only the customer who booked the vehicle can modify its status
    if (booking.customerId.toString() !== req.customer.id) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: You can only update your own bookings'
      });
    }

    // Update the booking status
    booking.status = status;
    await booking.save();

    // WHY: If reservation is completed or cancelled, release the car back to the fleet by setting available = true
    if (status === 'completed' || status === 'cancelled') {
      await Vehicle.findByIdAndUpdate(booking.vehicleId, { available: true });
    }

    return res.status(200).json({
      success: true,
      message: `Booking status successfully updated to '${status}'`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  executeVehicleReservation,
  createBooking,
  getMyBookings,
  updateBookingStatus
};

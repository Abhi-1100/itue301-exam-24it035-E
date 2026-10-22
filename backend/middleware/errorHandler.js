// middleware/errorHandler.js - Global error handler and 404 route catcher
// Catches unhandled errors and normalizes Mongoose validation/cast/duplicate errors into clean JSON

// 404 Not Found Middleware - Registered just before the global error handler
const notFoundHandler = (req, res, next) => {
  // WHY: Any request that didn't match an API route falls through to this handler
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
};

// Global Error Handler Middleware - Registered LAST in the Express pipeline
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // WHY: Handle Mongoose Schema Validation errors (e.g., missing required fields, date validator failures)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // WHY: Handle invalid MongoDB ObjectId formatting (e.g., passing invalid hex string as ID)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource ID: ${err.value}`;
  }

  // WHY: Handle MongoDB duplicate key errors (code 11000, e.g. duplicate email or licenseNumber)
  if (err.code === 11000) {
    statusCode = 400;
    const fields = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate value entered for field(s): ${fields}. Value must be unique.`;
  }

  // WHY: Send structured JSON response with NO stack trace to prevent security/schema leakage
  res.status(statusCode).json({
    success: false,
    message: message
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};

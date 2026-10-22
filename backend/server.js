// server.js - Main entry point for the DriveEasy Express backend API
const path = require('path');
// WHY: Explicitly resolve .env path using __dirname so it works whether run from root or backend directory
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Middlewares
const requestLogger = require('./middleware/requestLogger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Import Routes
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const bookingRoutes = require('./routes/bookings');

// Initialize Express App
const app = express();

// ==========================================
// MIDDLEWARE PIPELINE (Order is critical!)
// ==========================================

// 1. WHY FIRST: Request Logger must capture every incoming request before any routing or filtering
app.use(requestLogger);

// 2. WHY: CORS middleware permits the Vite React frontend (http://localhost:5173) to communicate with this backend
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  })
);

// 3. WHY: Parses incoming application/json request bodies and attaches them to req.body
app.use(express.json());

// ==========================================
// API ROUTES (/api/v1 prefix)
// ==========================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/bookings', bookingRoutes);

// Health check endpoint for sanity check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'DriveEasy API is healthy and operational' });
});

// ==========================================
// ERROR HANDLING PIPELINE (Must be at the end)
// ==========================================

// 4. WHY: Catches any unmatched route and returns structured 404 JSON response
app.use(notFoundHandler);

// 5. WHY LAST: Express recognizes 4-argument functions as error handlers; catches all unhandled exceptions
app.use(errorHandler);

// ==========================================
// SERVER INITIALIZATION
// ==========================================
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[DriveEasy API] Server running in development mode on http://localhost:${PORT}`);
  });
});

// routes/auth.js - Authentication routes
const express = require('express');
const router = express.Router();
const { loginCustomer } = require('../controllers/authController');

// WHY: Public endpoint - customer provides email and license number to receive a JWT token
router.post('/login', loginCustomer);

module.exports = router;

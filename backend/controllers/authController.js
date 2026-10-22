// controllers/authController.js - Handles customer authentication and JWT generation
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

// @desc    Authenticate customer via email & driving license number
// @route   POST /api/v1/auth/login
// @access  Public
const loginCustomer = async (req, res, next) => {
  try {
    const { email, licenseNumber } = req.body;

    // WHY: Early validation prevents unnecessary database lookups if required fields are missing
    if (!email || !licenseNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and license number'
      });
    }

    // WHY: License number acts as the secret credential since our schema focuses on verified driver identities
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedLicense = licenseNumber.trim().toUpperCase();

    const customer = await Customer.findOne({
      email: normalizedEmail,
      licenseNumber: normalizedLicense
    });

    // WHY: Return 401 Unauthorized if no customer matches the credential pair
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No customer found with matching email and license number.'
      });
    }

    // WHY: Issue a signed JWT token containing customer id and email with 1-day expiration
    const token = jwt.sign(
      { id: customer._id, email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // WHY: Return structured response containing JWT and safe customer profile
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        licenseNumber: customer.licenseNumber
      }
    });
  } catch (error) {
    // Pass to global error handler
    next(error);
  }
};

module.exports = {
  loginCustomer
};

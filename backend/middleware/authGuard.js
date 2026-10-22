// middleware/authGuard.js - Custom JWT authentication guard for protected routes
const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
  // WHY: Authorization tokens are traditionally passed in the HTTP Authorization header as Bearer tokens
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // WHY: Immediate 401 response prevents unauthenticated access before executing business logic
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided in Authorization header.'
    });
  }

  // Extract the token after 'Bearer '
  const token = authHeader.split(' ')[1];

  try {
    // WHY: Verifies token integrity and signature using secret key; throws error if token expired or tampered
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // WHY: Attach decoded customer credentials (id, email) to the request object so downstream controllers can identify the user
    req.customer = decoded;

    next();
  } catch (error) {
    // WHY: Return 401 if JWT verification fails without revealing internal token engine errors
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.'
    });
  }
};

module.exports = authGuard;

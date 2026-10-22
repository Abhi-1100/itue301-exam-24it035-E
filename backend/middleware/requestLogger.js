// middleware/requestLogger.js - Logs every incoming HTTP request for observability
const requestLogger = (req, res, next) => {
  // WHY: Provides real-time visibility into incoming API traffic with exact HTTP method, path, and timestamp
  const method = req.method;
  const path = req.originalUrl || req.url;
  const timestamp = new Date().toISOString();

  console.log(`[${method}] [${path}] [${timestamp}]`);

  // WHY: Calls next() to pass control to the subsequent middleware or route handler in the chain
  next();
};

module.exports = requestLogger;

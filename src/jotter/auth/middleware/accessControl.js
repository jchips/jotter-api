'use strict';

// Add Access Control Allow Origin headers
// Only have localhost origin on local copy (not production)
// Code inspired from https://stackoverflow.com/questions/24897801/enable-access-control-allow-origin-for-multiple-domains-in-node-js
module.exports = (req, res, next) => {
  const allowedOrigins = ['https://jottermd.netlify.app', 'http://localhost:5173']; // add localhost for testing
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies)
  }
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  // Handle preflight requests for CORS
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // End preflight requests with success
  }
  next();
};

'use strict';

// Code inspired from https://stackoverflow.com/questions/24897801/enable-access-control-allow-origin-for-multiple-domains-in-node-js
module.exports = (req, res, next) => {
  const allowedOrigins = ['http://localhost:5173']; // localhost for testing
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow cookies
  }
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

  // Handle preflight requests for CORS
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
};

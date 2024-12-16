'use strict';

// Add Access Control Allow Origin headers
// Only have localhost origin on local copy
// Code from https://stackoverflow.com/questions/24897801/enable-access-control-allow-origin-for-multiple-domains-in-node-js
module.exports = (req, res, next) => {
  const allowedOrigins = ['http://localhost:5173/']; // add localhost for testing
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
};

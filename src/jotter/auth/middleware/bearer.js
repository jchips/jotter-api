'use strict';

const { User } = require('../../models');

/**
 * Authenticates a user using bearer auth.
 * If user is authenticated, stores user (object) in `req.user`
 * and stores the user's token in `req.token`.
 * Otherwise, sends error.
 */
async function bearerAuth(req, res, next) {
  try {
    if (!req.headers.authorization) {
      next('Invalid login');
    }
    const bearer = req.headers.authorization.split(' '); // [ 'Bearer', 'token' ]
    const token = bearer.pop(); // 'token'
    let user = await User.bearerAuth(token);
    req.user = user;
    req.token = user.token;
    next();
  } catch (err) {
    console.error('bearer.js:', err.message);
    next(err.message);
  }
}

module.exports = bearerAuth;

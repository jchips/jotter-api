'use strict';

const base64 = require('base-64');
const { User } = require('../../models');

/**
 * Middleware that authenticates a user using basic auth.
 * If the user is authenticated, it stores the user (object) in `req.user`
 * Otherwise, sends error.
 */
async function basicAuth(req, res, next) {
  try {
    if (!req.headers.authorization) {
      next('Invalid login');
    }
    let basic = req.headers.authorization.split(' '); // [ 'Basic', 'am9objpmb28=' ]
    let encodedLogin = basic.pop(); // 'am9objpmb28='
    let decodedLogin = base64.decode(encodedLogin); // 'username:password'
    let [email, password] = decodedLogin.split(':');
    let user = await User.basicAuth(email, password);
    req.user = user;
    next();
  } catch (err) {
    console.error('basic.js:', err.message);
    res.status(403).send('Invalid login');
  }
}

module.exports = basicAuth;

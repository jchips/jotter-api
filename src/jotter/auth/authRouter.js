'use strict';

const express = require('express');
const { User, Config } = require('../models');
const db = require('../db');
const basicAuth = require('./middleware/basic');
const bearerAuth = require('./middleware/bearer');

const router = express.Router();

// ROUTES====================
router.get('/', bearerAuth, checkAuthentication);
router.post('/signup', signup);
router.post('/login', basicAuth, login);
router.post('/logout', logout);

// HANDLERS==================
// Sign up
async function signup(req, res, next) {
  let transaction;
  try {
    transaction = await db.transaction();
    let signupInfo = req.body;
    let emailTaken = await checkForEmail(req.body.email);
    if (emailTaken) {
      return res.json({ message: 'email is already being used' });
    }
    let newUser = await User.create(signupInfo, { transaction });
    let newConfigs = { userId: newUser.id };
    await Config.create(newConfigs, { transaction });
    await transaction.commit();
    res.status(201).json(newUser);
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error(err);
    next(err);
  }
}

// Check for user
async function checkForEmail(email) {
  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return user;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Log in
async function login(req, res, next) {
  try {
    const user = {
      user: req.user,
      token: req.user.token,
    };
    res.cookie('jwt', user.token, {
      httpOnly: true, // Prevent access via JavaScript
      secure: false, // Use HTTPS
      sameSite: 'None', // Prevent CSRF
      maxAge: 60 * 60 * 24 * 1000, // Token expiration time (1 day (in miliseconds))
    });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function checkAuthentication(req, res, next) {
  try {
    if (req.user.token) {
      res.cookie('jwt', req.user.token, {
        httpOnly: true, // Prevent access via JavaScript
        secure: false, // Use HTTPS
        sameSite: 'None', // Prevent CSRF
        maxAge: 60 * 30 * 1000, // Token expiration time (30min (in miliseconds))
      });
      res.status(200).json(req.user);
    } else {
      res.status(403).json({ message: 'not authorized' });
    }
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    res.clearCookie('jwt'); // Clear the HTTP-only cookie
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = router;

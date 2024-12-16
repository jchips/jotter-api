'use strict';

const express = require('express');
const { User } = require('../models');
const basicAuth = require('./middleware/basic');
const bearerAuth = require('./middleware/bearer');

const router = express.Router();

// ROUTES====================
router.post('/signup', signup);
router.post('/login', basicAuth, login);
router.get('/', bearerAuth, checkAuthentication);

// HANDLERS==================
// Sign up
async function signup(req, res, next) {
  try {
    let signupInfo = req.body;
    let emailTaken = await checkForEmail(req.body.email);
    if (emailTaken) {
      return res.json({ message: 'email is already being used' });
    }
    let newUser = await User.create(signupInfo);
    res.status(201).json(newUser);
  } catch (err) {
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
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function checkAuthentication(req, res, next) {
  try {
    res.json({ message: 'User is logged in' });
  } catch (err) {
    next(err);
  }
}

module.exports = router;

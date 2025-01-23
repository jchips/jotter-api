'use strict';

const express = require('express');
const { Config } = require('../models');
const bearerAuth = require('../auth/middleware/bearer');

const router = express.Router();

// ROUTES====================
router.get('/', bearerAuth, getConfigs);
router.post('/', addNewUserConfigs); // not using
router.patch('/', bearerAuth, updateConfigs);

// HANDLERS==================
async function getConfigs(req, res, next) {
  try {
    let uConfigs = await Config.findOne({ where: { userId: req.user.id } });
    res.status(200).json(uConfigs);
  } catch (err) {
    next(err);
  }
}

// not using
async function addNewUserConfigs(req, res, next) {
  try {
    let userId = req.body; // { userId: 1 }
    let newUserConfigs = await Config.create({ userId });
    res.status(201).json(newUserConfigs);
  } catch (err) {
    next(err);
  }
}

async function updateConfigs(req, res, next) {
  try {
    let configs = req.body;
    let user = await Config.findOne({ where: { userId: req.user.dataValues.id } });
    let update = await user.update(configs); // { sort: '1' }
    res.status(200).json(update);
  } catch (err) {
    next(err);
  }
}

module.exports = router;

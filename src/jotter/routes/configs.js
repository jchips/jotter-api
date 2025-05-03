'use strict';

const express = require('express');
const { Config } = require('../models');
const bearerAuth = require('../auth/middleware/bearer');

const router = express.Router();

// ROUTES====================
router.get('/', bearerAuth, getConfigs);
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

async function updateConfigs(req, res, next) {
  try {
    let configs = req.body;
    let userConfigs = await Config.findOne({ where: { userId: req.user.dataValues.id } });
    if (!userConfigs) {
      return res.status(404).json({ message: 'User configurations not found' });
    }
    let update = await userConfigs.update(configs); // { sort: '1' }
    res.status(200).json(update);
  } catch (err) {
    next(err);
  }
}

module.exports = router;

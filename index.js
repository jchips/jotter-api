'use strict';

require('dotenv').config();
const { start } = require('./src/server');
const jotterDB = require('./src/jotter/db');

jotterDB.sync()
  .then(() => console.log('jotter database is running'))
  .then(() => start());

module.exports = jotterDB;

'use strict';

require('dotenv').config();
const { start } = require('./src/server');
const jotterDB = require('./src/jotter/db');

// const jotterDB = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//   host: process.env.DB_HOST,
//   dialect: 'mysql',
// });

jotterDB.sync()
  .then(() => console.log('jotter database is running'))
  .then(() => start());

module.exports = jotterDB;

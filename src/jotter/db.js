'use strict';
const { Sequelize } = require('sequelize');

const jotterDB = process.env.NODE_ENV === 'test' ? new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
}) : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

module.exports = jotterDB;

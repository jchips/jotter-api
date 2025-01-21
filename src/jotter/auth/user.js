'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET;

const userModel = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ email: this.email }, SECRET, { expiresIn: '1 day' });
      },
    },
  });

  // hashes the user's password
  model.beforeCreate(async (user) => {
    const hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  // basic auth for user login
  model.basicAuth = async function (email, password) {
    try {
      let user = await this.findOne({ where: { email } });
      const validateUser = await bcrypt.compare(password, user.password);
      if (validateUser) {
        return user;
      }
      throw new Error('Invalid login');
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // bearer auth
  model.bearerAuth = async function (token) {
    try {
      const decodedPayload = jwt.verify(token, SECRET);
      let user = await this.findOne({ where: { email: decodedPayload.email } });
      if (user) {
        return user;
      }
      throw new Error('Invalid login');
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return model;
};

module.exports = userModel;

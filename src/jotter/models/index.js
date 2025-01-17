'use strict';

const db = require('../db');
const { DataTypes } = require('sequelize');
const userModel = require('../auth/user');
const folderModel = require('./folder');
const noteModel = require('./note');
const configModel = require('./config');

const User = userModel(db, DataTypes);
const Folder = folderModel(db, DataTypes);
const Note = noteModel(db, DataTypes);
const Config = configModel(db, DataTypes);

//  ONE-TO-MANY RELATIONS==================

// User-Folder
User.hasMany(Folder, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Folder.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Note-Folder
Folder.hasMany(Note, {
  foreignKey: 'folderId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Note.belongsTo(Folder, {
  foreignKey: 'folderId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Note-User
User.hasMany(Note, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Note.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// User-Config
User.hasMany(Config, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Config.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = {
  User,
  Folder,
  Note,
  Config,
};

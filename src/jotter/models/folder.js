'use strict';

const folderModel = (sequelize, DataTypes) => {
  return sequelize.define('Folder', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'untitled' + DataTypes.NOW,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      foreignKey: true,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    path: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  });
};

module.exports = folderModel;

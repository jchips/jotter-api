'use strict';

const noteModel = (sequelize, DataTypes) => {
  return sequelize.define('Note', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'untitled' + DataTypes.NOW,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
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
    folderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      foreignKey: true,
      references: {
        model: 'Folders',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });
};

module.exports = noteModel;

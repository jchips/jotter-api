'use strict';

const ConfigModel = (sequelize, DataTypes) => {
  return sequelize.define('Config', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      foreignKey: true,
      unique: true,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    theme: { // not using
      type: DataTypes.ENUM('light', 'dark', 'system'),
      allowNull: false,
      defaultValue: 'system',
    },
    highlightActiveLine: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    hideWordCount: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sort: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1',
    },
    hidePreview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    font: { // TODO
      type: DataTypes.ENUM('Inter'),
      allowNull: false,
      defaultValue: 'Inter',
    },
    fontSize: { // TODO
      type: DataTypes.ENUM('12', '13', '14', '15', '16'),
      allowNull: false,
      defaultValue: '14',
    },
    gridSize: {
      type: DataTypes.ENUM('1', '2'),
      allowNull: false,
      defaultValue: '1',
    },
  });
};

module.exports = ConfigModel;

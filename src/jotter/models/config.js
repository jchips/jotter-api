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
    theme: {
      type: DataTypes.ENUM('light', 'dark', 'auto'),
      allowNull: false,
      defaultValue: 'auto',
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
    font: {
      type: DataTypes.ENUM('Inter'),
      allowNull: false,
      defaultValue: 'Inter',
    },
    fontSize: {
      type: DataTypes.ENUM('12', '13', '14', '15', '16'),
      allowNull: false,
      defaultValue: '14',
    },
    gridSize: {
      type: DataTypes.ENUM('1', '2', '3', '4'),
      allowNull: false,
      defaultValue: '3',
    },
  });
};

module.exports = ConfigModel;

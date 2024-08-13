const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Classifier = sequelize.define('Classifier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
}, {
  tableName: 'classifiers',
  timestamps: false,
});

module.exports = Classifier;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Nationality = sequelize.define('Nationality', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descriptor: DataTypes.STRING,
}, {
  tableName: 'nationalities',
  timestamps: false,
});

module.exports = Nationality;

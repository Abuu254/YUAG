const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Place = sequelize.define('Place', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  label: DataTypes.STRING,
  part_of: DataTypes.STRING,
  longitude: DataTypes.FLOAT,
  latitude: DataTypes.FLOAT,
  url: DataTypes.STRING,
}, {
  tableName: 'places',
  timestamps: false,
});

module.exports = Place;

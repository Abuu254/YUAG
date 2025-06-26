const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ArtObject = sequelize.define('ArtObject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  label: DataTypes.STRING,
  accession_no: DataTypes.STRING,
  date: DataTypes.STRING,
}, {
  tableName: 'objects',
  timestamps: false,
});

module.exports = ArtObject;

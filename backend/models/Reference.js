const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Object = require('./Object');

const Reference = sequelize.define('Reference', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  obj_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Object,
      key: 'id',
    },
  },
  type: DataTypes.STRING,
  content: DataTypes.STRING,
}, {
  tableName: 'references',
  timestamps: false,
});

module.exports = Reference;

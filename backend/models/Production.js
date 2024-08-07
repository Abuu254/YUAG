const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Object = require('./Object');
const Agent = require('./Agent');

const Production = sequelize.define('Production', {
  obj_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Object,
      key: 'id',
    },
    primaryKey: true,
  },
  agt_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Agent,
      key: 'id',
    },
    primaryKey: true,
  },
  part: DataTypes.STRING,
}, {
  tableName: 'productions',
  timestamps: false,
});

module.exports = Production;

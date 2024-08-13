const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Agent = require('./Agent');
const Nationality = require('./Nationality');

const AgentsNationality = sequelize.define('AgentsNationality', {
  agt_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Agent,
      key: 'id',
    },
    primaryKey: true,
  },
  nat_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Nationality,
      key: 'id',
    },
    primaryKey: true,
  },
}, {
  tableName: 'agents_nationalities',
  timestamps: false,
});

module.exports = AgentsNationality;

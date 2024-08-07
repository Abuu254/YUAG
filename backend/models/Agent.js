const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Place = require('./Place');

const Agent = sequelize.define('Agent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  type: DataTypes.STRING,
  begin_date: DataTypes.STRING,
  begin_bce: DataTypes.BOOLEAN,
  end_date: DataTypes.STRING,
  end_bce: DataTypes.BOOLEAN,
  begin_place_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Place,
      key: 'id',
    },
  },
  end_place_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Place,
      key: 'id',
    },
  },
}, {
  tableName: 'agents',
  timestamps: false,
});

// Define relationships
Agent.belongsToMany(require('./Object'), { through: 'productions', foreignKey: 'agt_id' });
module.exports = Agent;

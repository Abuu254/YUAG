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

Nationality.belongsToMany(require('./Agent'), { through: 'agents_nationalities', foreignKey: 'nat_id' });

module.exports = Nationality;

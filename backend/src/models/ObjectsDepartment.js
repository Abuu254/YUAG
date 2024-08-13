const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Object = require('./Object');
const Department = require('./Department');

const ObjectsDepartment = sequelize.define('ObjectsDepartment', {
  obj_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Object,
      key: 'id',
    },
    primaryKey: true,
  },
  dep_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Department,
      key: 'id',
    },
    primaryKey: true,
  },
}, {
  tableName: 'objects_departments',
  timestamps: false,
});

module.exports = ObjectsDepartment;

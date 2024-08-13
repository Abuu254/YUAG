const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Object = require('./Object');
const Place = require('./Place');

const ObjectsPlace = sequelize.define('ObjectsPlace', {
  obj_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Object,
      key: 'id',
    },
    primaryKey: true,
  },
  pl_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Place,
      key: 'id',
    },
    primaryKey: true,
  },
}, {
  tableName: 'objects_places',
  timestamps: false,
});

module.exports = ObjectsPlace;

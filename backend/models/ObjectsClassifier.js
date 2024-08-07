const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Object = require('./Object');
const Classifier = require('./Classifier');

const ObjectsClassifier = sequelize.define('ObjectsClassifier', {
  obj_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Object,
      key: 'id',
    },
    primaryKey: true,
  },
  cls_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Classifier,
      key: 'id',
    },
    primaryKey: true,
  },
}, {
  tableName: 'objects_classifiers',
  timestamps: false,
});

module.exports = ObjectsClassifier;

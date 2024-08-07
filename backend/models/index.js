const sequelize = require('../config/database');
const Object = require('./Object');
const Place = require('./Place');
const Agent = require('./Agent');
const Department = require('./Department');
const Classifier = require('./Classifier');
const Reference = require('./Reference');
const Nationality = require('./Nationality');
const Production = require('./Production');
const ObjectsClassifier = require('./ObjectsClassifier');
const ObjectsDepartment = require('./ObjectsDepartment');
const ObjectsPlace = require('./ObjectsPlace');
const AgentsNationality = require('./AgentsNationality');

// Define relationships
Object.belongsToMany(Agent, { through: Production, foreignKey: 'obj_id' });
Agent.belongsToMany(Object, { through: Production, foreignKey: 'agt_id' });

Object.belongsToMany(Classifier, { through: ObjectsClassifier, foreignKey: 'obj_id' });
Classifier.belongsToMany(Object, { through: ObjectsClassifier, foreignKey: 'cls_id' });

Object.belongsToMany(Department, { through: ObjectsDepartment, foreignKey: 'obj_id' });
Department.belongsToMany(Object, { through: ObjectsDepartment, foreignKey: 'dep_id' });

Object.belongsToMany(Place, { through: ObjectsPlace, foreignKey: 'obj_id' });
Place.belongsToMany(Object, { through: ObjectsPlace, foreignKey: 'pl_id' });

Agent.belongsToMany(Nationality, { through: AgentsNationality, foreignKey: 'agt_id' });
Nationality.belongsToMany(Agent, { through: AgentsNationality, foreignKey: 'nat_id' });

Agent.belongsTo(Place, { as: 'beginPlace', foreignKey: 'begin_place_id' });
Agent.belongsTo(Place, { as: 'endPlace', foreignKey: 'end_place_id' });

sequelize.sync();

module.exports = {
  Object,
  Place,
  Agent,
  Department,
  Classifier,
  Reference,
  Nationality,
  Production,
  ObjectsClassifier,
  ObjectsDepartment,
  ObjectsPlace,
  AgentsNationality,
  sequelize,
};

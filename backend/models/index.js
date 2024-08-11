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

// Object - Agent many-to-many relationship via Production
Object.belongsToMany(Agent, { through: Production, foreignKey: 'obj_id', as: 'Agents' });
Agent.belongsToMany(Object, { through: Production, foreignKey: 'agt_id', as: 'Objects' });

// Object - Classifier many-to-many relationship via ObjectsClassifier
Object.belongsToMany(Classifier, { through: ObjectsClassifier, foreignKey: 'obj_id', as: 'Classifiers' });
Classifier.belongsToMany(Object, { through: ObjectsClassifier, foreignKey: 'cls_id', as: 'Objects' });

// Object - Department many-to-many relationship via ObjectsDepartment
Object.belongsToMany(Department, { through: ObjectsDepartment, foreignKey: 'obj_id', as: 'Departments' });
Department.belongsToMany(Object, { through: ObjectsDepartment, foreignKey: 'dep_id', as: 'Objects' });

// Object - Place many-to-many relationship via ObjectsPlace
Object.belongsToMany(Place, { through: ObjectsPlace, foreignKey: 'obj_id', as: 'Places' });
Place.belongsToMany(Object, { through: ObjectsPlace, foreignKey: 'pl_id', as: 'Objects' });

// Agent - Nationality many-to-many relationship via AgentsNationality
Agent.belongsToMany(Nationality, { through: AgentsNationality, foreignKey: 'agt_id', as: 'Nationalities' });
Nationality.belongsToMany(Agent, { through: AgentsNationality, foreignKey: 'nat_id', as: 'Agents' });

// Agent - Place one-to-one relationships
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

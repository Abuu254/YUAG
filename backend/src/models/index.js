const sequelize = require('../config/database');
const ArtObject = require('./Object');
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

// ArtObject - Agent many-to-many relationship via Production
ArtObject.belongsToMany(Agent, { through: Production, foreignKey: 'obj_id', as: 'Agents' });
Agent.belongsToMany(ArtObject, { through: Production, foreignKey: 'agt_id', as: 'Objects' });

// ArtObject - Classifier many-to-many relationship via ObjectsClassifier
ArtObject.belongsToMany(Classifier, { through: ObjectsClassifier, foreignKey: 'obj_id', as: 'Classifiers' });
Classifier.belongsToMany(ArtObject, { through: ObjectsClassifier, foreignKey: 'cls_id', as: 'Objects' });

// ArtObject - Department many-to-many relationship via ObjectsDepartment
ArtObject.belongsToMany(Department, { through: ObjectsDepartment, foreignKey: 'obj_id', as: 'Departments' });
Department.belongsToMany(ArtObject, { through: ObjectsDepartment, foreignKey: 'dep_id', as: 'Objects' });

// ArtObject - Place many-to-many relationship via ObjectsPlace
ArtObject.belongsToMany(Place, { through: ObjectsPlace, foreignKey: 'obj_id', as: 'Places' });
Place.belongsToMany(ArtObject, { through: ObjectsPlace, foreignKey: 'pl_id', as: 'Objects' });

// Agent - Nationality many-to-many relationship via AgentsNationality
Agent.belongsToMany(Nationality, { through: AgentsNationality, foreignKey: 'agt_id', as: 'Nationalities' });
Nationality.belongsToMany(Agent, { through: AgentsNationality, foreignKey: 'nat_id', as: 'Agents' });

// Agent - Place one-to-one relationships
Agent.belongsTo(Place, { as: 'beginPlace', foreignKey: 'begin_place_id' });
Agent.belongsTo(Place, { as: 'endPlace', foreignKey: 'end_place_id' });

sequelize.sync();

module.exports = {
  Object: ArtObject,
  ArtObject,
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

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './src/lux.sqlite',
  // Add performance optimizations
  logging: false, // Disable logging in production
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // SQLite specific optimizations
  dialectOptions: {
    // Enable WAL mode for better concurrency
    pragma: {
      journal_mode: 'WAL',
      synchronous: 'NORMAL',
      cache_size: 10000,
      temp_store: 'MEMORY'
    }
  }
});

// Function to create database indexes for better performance
const createIndexes = async () => {
  try {
    // Create indexes for frequently queried columns
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_objects_id ON objects(id);
      CREATE INDEX IF NOT EXISTS idx_objects_label ON objects(label);
      CREATE INDEX IF NOT EXISTS idx_objects_accession_no ON objects(accession_no);

      CREATE INDEX IF NOT EXISTS idx_agents_id ON agents(id);
      CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name);
      CREATE INDEX IF NOT EXISTS idx_agents_type ON agents(type);

      CREATE INDEX IF NOT EXISTS idx_production_obj_id ON production(obj_id);
      CREATE INDEX IF NOT EXISTS idx_production_agt_id ON production(agt_id);

      CREATE INDEX IF NOT EXISTS idx_objects_classifier_obj_id ON objects_classifier(obj_id);
      CREATE INDEX IF NOT EXISTS idx_objects_classifier_cls_id ON objects_classifier(cls_id);

      CREATE INDEX IF NOT EXISTS idx_objects_department_obj_id ON objects_department(obj_id);
      CREATE INDEX IF NOT EXISTS idx_objects_department_dep_id ON objects_department(dep_id);

      CREATE INDEX IF NOT EXISTS idx_objects_place_obj_id ON objects_place(obj_id);
      CREATE INDEX IF NOT EXISTS idx_objects_place_pl_id ON objects_place(pl_id);

      CREATE INDEX IF NOT EXISTS idx_agents_nationality_agt_id ON agents_nationality(agt_id);
      CREATE INDEX IF NOT EXISTS idx_agents_nationality_nat_id ON agents_nationality(nat_id);
    `);

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

// Initialize database with indexes
sequelize.afterConnect(async (connection) => {
  await createIndexes();
});

module.exports = sequelize;
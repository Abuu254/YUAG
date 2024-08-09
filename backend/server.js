const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const objectRoutes = require('./routes/objects');
const { logToFile } = require('./log');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', objectRoutes);

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    logToFile('Database connected successfully.');
  } catch (error) {
    logToFile('An error occurred', error);
  }
});

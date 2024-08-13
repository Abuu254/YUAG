const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const objectRoutes = require('./routes/objects');
const { logToFile } = require('./log');

const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = ['https://yuag-frontend-ramadhan-abdis-projects.vercel.app', 'https://yuag-frontend.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This is required to allow credentials in requests
}));

// Routes
app.use('/api', objectRoutes);

const startServer = async () => {
  try {
    await sequelize.sync();
    await sequelize.authenticate();
    logToFile('Database connected successfully.');
    console.log('Database connected successfully.');
  } catch (error) {
    logToFile('Unable to connect to the database:', error);
    console.error('Unable to connect to the database:', error);
  }
};

// Start the server (for local development)
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, async () => {
    await startServer();
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// Export the app for Firebase Functions
module.exports = app;

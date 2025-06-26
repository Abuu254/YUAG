const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const objectRoutes = require('./routes/objects');
const { logToFile } = require('./log');
const { performanceMiddleware } = require('./utils/performanceMonitor');

const app = express();

// Middleware
app.use(express.json());
app.use(performanceMiddleware); // Add performance monitoring

// CORS configuration - allow both production and development URLs
const allowedOrigins = [
  // Production URLs
  'https://yuag-frontend-ramadhan-abdis-projects.vercel.app',
  'https://yuag-frontend.vercel.app',
  // Development URLs
  'http://localhost:3000',
  'http://localhost:5173', // Vite default port
  'http://localhost:4173', // Vite preview port
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
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

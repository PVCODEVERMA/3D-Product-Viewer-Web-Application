const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Import Routes
const modelRoutes = require('./src/routes/modelRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');

app.use('/api/models', modelRoutes);
app.use('/api/settings', settingsRoutes);

// 404 Route
// app.all('*', (req, res) => {
//   res.status(404).json({ message: `Route ${req.originalUrl} not found` });
// });

// Error Handler
const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

module.exports = app;

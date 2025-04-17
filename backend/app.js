// backend/app.js
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const runeRoutes = require('./routes/runes');
app.use('/api/runes', runeRoutes);

module.exports = app;

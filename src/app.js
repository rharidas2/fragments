// src/app.js
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');

// Import the authentication functions correctly
const { strategy, authenticate } = require('./auth');

// Create an Express application
const app = express();

// Use gzip/deflate compression middleware
app.use(compression());

// Use helmet for security middleware
app.use(helmet());

// Use CORS middleware
app.use(cors());

// Use express.json middleware to parse JSON bodies
app.use(express.json());

// Use express.urlencoded middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Set up our passport authentication middleware
passport.use(strategy());  // Use the strategy function directly
app.use(passport.initialize());

// Define our routes
app.use('/', require('./routes'));

module.exports = app;

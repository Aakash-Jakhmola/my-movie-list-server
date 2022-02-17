const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const router = require('./interface');
const { errorHandler } = require('./interface/middlewares');
const config = require('../config');
require('./database');
// const auth = require('./utils/auth');

// Express App
const app = express() ;

app.use(express.json()) ;
app.use(cookieParser());
// app.use(cors({ origin: config.CLIENT_URL, credentials: true }));

// app.use(auth.verifyToken);
app.use('/', router);
app.use(errorHandler);

module.exports = app;
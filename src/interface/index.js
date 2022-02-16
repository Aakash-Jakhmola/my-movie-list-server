const express = require('express');
const router = express.Router();

const user = require('./user');
const movie = require('./movie');

router.use('/account', user);
// router.use('/movie', movie);

module.exports = router;
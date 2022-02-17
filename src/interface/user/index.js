const express = require('express');
const router = express.Router();
const { asyncHandler, asyncHandlerArray } = require('./../../utils/asyncHandler');

const createAccount = require('./createAccount');
const getAccount = require('./getAccount');
const getFollowing = require('./getFollowing');
const login = require('./login');

router.post('/create', asyncHandlerArray(createAccount));
router.post('/login', asyncHandlerArray(login));
router.get('/', asyncHandlerArray(getAccount));
router.get('/:username/following', getFollowing);

module.exports = router;
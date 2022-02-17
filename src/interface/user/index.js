const express = require('express');
const router = express.Router();
const { asyncHandler, asyncHandlerArray } = require('./../../utils/asyncHandler');

const createAccount = require('./createAccount');
const getFollowing = require('./getFollowing');

router.get('/create', asyncHandlerArray(createAccount));
router.get('/:username/following', getFollowing);

module.exports = router;
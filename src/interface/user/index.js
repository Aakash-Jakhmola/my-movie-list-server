const express = require('express');
const router = express.Router();
const { asyncHandler, asyncHandlerArray } = require('./../../utils/asyncHandler');

const getFollowing = require('./getFollowing');

router.get('/:username/following', getFollowing);

module.exports = router;
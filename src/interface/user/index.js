const express = require('express');
const router = express.Router();
const { asyncHandler, asyncHandlerArray } = require('./../../utils/asyncHandler');

const createAccount = require('./createAccount');
const followUser = require('./followUser');
const getAccount = require('./getAccount');
const getFollowing = require('./getFollowing');
const login = require('./login');
const unfollowUser = require('./unfollowUser');

router.post('/create', asyncHandlerArray(createAccount));
router.post('/login', asyncHandlerArray(login));
router.get('/', asyncHandlerArray(getAccount));
router.get('/:username/following', asyncHandlerArray(getFollowing));
// router.get('/:username/followers', asyncHandlerArray());
router.post('/follow', asyncHandlerArray(followUser));
router.delete('/unfollow', asyncHandlerArray(unfollowUser));

module.exports = router;
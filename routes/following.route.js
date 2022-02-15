const express = require('express');
const router = express.Router();
const FollowingController = require('./../controllers/following.controller');

router.get('/', FollowingController.getFollowing);

module.exports = router;
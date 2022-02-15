const express = require('express');
const router = express.Router();
const FollowController = require('./../controllers/follow.controller');

router.get('/', FollowController.getFollowers);
router.post('/', FollowController.followUser);
router.delete('/', FollowController.unfollowUser);

module.exports = router;
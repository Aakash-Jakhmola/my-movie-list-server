const express = require("express");
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const AuthMiddleware = require("../middleware/auth.middleware");


router.post('/register',AuthMiddleware.register, AuthController.register);
router.post('/login',AuthMiddleware.login, AuthController.login);
router.delete('/logout',AuthMiddleware.logout, AuthController.logout);

module.exports = router;
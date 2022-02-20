const jwt = require('jsonwebtoken');
const config = require('../../config');

async function verifyToken(req, res, next) {
  const token = req.cookies['jwt'];
  req.isAuthenticated = false;
  if (token) {
    try {
      const decoded = await jwt.verify(token, config.JWT_SECRET);
      req.userId = decoded.userId;
      req.isAuthenticated = true;
      req.username = decoded.username;
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        message: 'Token is not valid',
      });
    }
  } else {
    next();
  }
}

module.exports = verifyToken;

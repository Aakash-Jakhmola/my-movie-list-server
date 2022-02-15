const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller.js');

router.get('/:username', UserController.getUser);
router.get('/search', UserController.searchUser);

router.get('/loadUser', (req, res) => {
  const token = req.cookies['jwt']
  if (!token) {
    return res.send({ error: 'Unauthorized' })
  }
  try {
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken)
    return res.status(200).send(decodedToken)
  } catch (err) {
    console.log(err)
    return res.status(401).send({ error: "Unauthorized" })
  }
})

router.get('/isAuthenticated', RequireAuth, (req, res) => {
  console.log(req.cookies);
  console.log('from here', req.cookies['jwt'])
  return res.status(200).send({ msg: 'Authenticated' })
})

module.exports = router;
const router = require('express').Router();
const {authenticateUser} = require('./../../utils/auth')

router.get('/search_movie', async(req, res) => {
  const user = await authenticateUser(req.cookies.jwt);


})
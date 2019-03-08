const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res, next) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    const promise = new User({
      username,
      password: hash
    }).save();

    promise.then((data) => {
      next({ statusCode: res.statusCode, message: `${username} registered!` });
    }).catch((err) => {
      res.json(err);
    });
  });
});

router.post('/authenticate', (req, res) => {
  const { username, password } = req.body;
  User.findOne({
    username
  }, (err, user) => {
    if (err)
      throw err;
    if (!user) {
      res.json({
        status: false,
        message: 'Authentication failed. User not found.'
      });
    } else {
      bcrypt.compare(password, user.password).then((result) => {
        if (!result) {
          res.json({
            status: false,
            message: 'Authentication failed. Wrong password!'
          });
        } else {
          const payload = {
            username
          };
          const token = jwt.sign(payload, req.app.get('api_secret_key'), {
            expiresIn: 120 // 120 mins
          });
          res.json({
            status: true,
            token
          });
        }
      });
    }
  })
})
module.exports = router;

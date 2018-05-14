var express = require('express');
var router = express.Router();
var passport = require("passport");

let authController = require('./controllers/authController');

router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.get('/isLoggedIn', passport.authenticate('jwt', { session: false }),authController.isLoggedIn);

module.exports = router;

var express = require('express');
var router = express.Router();
const auth = require('../controllers/auth.controller')


// user to register
router.post('/register', auth.register)
//user to login
router.post('/login', auth.login)
module.exports = router;

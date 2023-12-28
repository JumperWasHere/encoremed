var express = require('express');
var router = express.Router();
const auth = require('../controllers/auth.controller')



router.post('/register', auth.register)
router.post('/login', (req, res) => {
    auth.login(req, res)

})
module.exports = router;

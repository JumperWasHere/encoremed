var express = require('express');
var router = express.Router();
const appointment = require('../controllers/appointment.controller')
const { isPatientAuthunticated } = require('../middleware/auth.middleware')


router.post('/booking',appointment.booking)
router.post('/getAvailableTimeslot', isPatientAuthunticated, appointment.getAvailableTimeslot)

module.exports = router;

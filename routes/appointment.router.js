var express = require('express');
var router = express.Router();
const appointment = require('../controllers/appointment.controller')
const { isPatientAuthunticated } = require('../middleware/auth.middleware')

// patient booking appointment routing
router.post('/booking',isPatientAuthunticated,appointment.booking)
// patient get availablity doctor timeslot
router.post('/getAvailableTimeslot', isPatientAuthunticated, appointment.getAvailableTimeslot)

module.exports = router;

var express = require('express');
var router = express.Router();
const doctor = require('../controllers/doctor.controller')
const { isDocAuthunticated } = require('../middleware/auth.middleware')


// doctor to generate timeslot
router.post('/generateTimeSlot', isDocAuthunticated, doctor.generateTimeSlotByEvent)
// doctor update column minuteperslot value
router.post('/changeMinute', isDocAuthunticated, doctor.changedRangeTimeSlot)



module.exports = router;
var express = require('express');
var router = express.Router();
const doctor = require('../controllers/doctor.controller')
const { isDocAuthunticated } = require('../middleware/auth.middleware')



// router.post('/getAvailableTimeslot', isDocAuthunticated, doctor.getAvailableTimeslot)
router.post('/generateTimeSlot', isDocAuthunticated, doctor.generateTimeSlotByEvent)
router.post('/changeMinute', isDocAuthunticated, doctor.changedRangeTimeSlot)



module.exports = router;
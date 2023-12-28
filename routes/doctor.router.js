var express = require('express');
var router = express.Router();
const doctor = require('../controllers/doctor.controller')
const { isDocAuthunticated } = require('../middleware/auth.middleware')



// router.post('/getAvailableTimeslot', isDocAuthunticated, doctor.getAvailableTimeslot)
router.post('/generateTimeSlot', isDocAuthunticated, doctor.generateTimeSlotByEvent)
router.post('/customized', doctor.customizedRangeTimeSlot)



module.exports = router;
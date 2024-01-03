const dotenv = require('dotenv');
const appointmentService = require('../services/appointment.service')
const { validateInputBooking, validateInputgetTimeslot } = require('../utils/requestValidator')

dotenv.config();
exports.booking = async (req, res) => {
    try {
        let isValidate = await validateInputBooking(req.body);
        if (!isValidate.status) {
            return res.status(400).json({
                success: false,
                data: null,
                error: {
                    code: 400,
                    message: ('bad Request', isValidate.message)
                }
            });
        }
        isbooked = await appointmentService.checkTImeSlot(isValidate.value);// retrun false is timeslot is avaiable
        if (isbooked) {
            return res.status(500).json({
                success: false,
                data: null,
                error: {
                    code: 500,
                    message: 'the time slot is already book'
                }
            });
        }
        let createAppointment = await appointmentService.createAppoitment(isValidate.value);
        if (!createAppointment) {
            return res.status(500).json({
                success: false,
                data: null,
                error: {
                    code: 500,
                    message: 'Fail create booking'
                }
            });
        }
        await appointmentService.updateTimeSlot(isValidate.value.timeslotId);// update status time slot
        return res.status(201).json({
            success: true,
            data: createAppointment,
            error: {
                code: 201,
                message: 'Success create booking'
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            data: null,
            error: {
                code: 500,
                message: error
            }
        });
    }
}


exports.getAvailableTimeslot = async (req, res) => {

    let isValidate = await validateInputgetTimeslot(req.body);
    if (!isValidate.status) {
        return res.status(400).json({
            success: false,
            data: null,
            error: {
                code: 400,
                message: ('bad Request', isValidate.message)
            }
        });
    }
    let timeslot = await appointmentService.getTImeSlotByDocId(isValidate.value);
    return res.status(200).json({
        success: true,
        data: timeslot,
        error: {
            code: 200,
            message: 'Success get Available Timeslot'
        }
    });



}



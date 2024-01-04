const dotenv = require('dotenv');
const appointmentService = require('../services/appointment.service')
const { validateInputBooking, validateInputgetTimeslot } = require('../utils/requestValidator')
dotenv.config();

exports.booking = async (req, res) => {
    try {
        // step 1: input validation
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
        // step 2: check is selected avaibility time slot, return value false or true
        isbooked = await appointmentService.checkTImeSlot(isValidate.value);
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
        // step 3: create an appointment
        let createAppointment = await appointmentService.createAppointment(isValidate.value);
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
        // step 4: update the time slot avaibility
        await appointmentService.updateTimeSlot(isValidate.value.timeslotId);
        // step 5: send response to client with code 201, appointment is created
        return res.status(201).json({
            success: true,
            data: createAppointment,
            error: {
                code: 201,
                message: 'Success create booking'
            }
        });
    } catch (error) {
        // catch error if there problem 
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
    // step 1: request validation
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
    // step 2: get all avaiable time slot by start and end date, and by doctor id
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



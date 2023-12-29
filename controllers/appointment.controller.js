const dotenv = require('dotenv');
const db = require('../dbConnection/db');
const Joi = require('joi');
const appointmentService = require('../services/appointment.service')
const Queue = require('bull');

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

async function validateInputgetTimeslot(data) {
    let validate = {
        status: true,
        message: "all is validate",

    };
    const schema = Joi.object({
        doctorId: Joi.number().integer().required(),
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
    });
    try {
        let value = await schema.validateAsync({
            doctorId: data.doctorId,
            startDate: data.startDate,
            endDate: data.endDate,
        });
        validate.value = value;
    }
    catch (err) {
        validate.message = err
        validate.status = false

    }

    return validate
}
async function validateInputBooking(data) {
    let validate = {
        status: true,
        message: "all is validate",

    };
    const schema = Joi.object({
        patientId: Joi.number().integer().required(),
        doctorId: Joi.number().integer().required(),
        timeslotId: Joi.number().integer().required(),
        purpose: Joi.string().min(0).max(30),
    });
    try {
        let value = await schema.validateAsync({
            patientId: data.patientId,
            doctorId: data.doctorId,
            timeslotId: data.timeslotId,
            purpose: data.purpose,
        });
        validate.value = value;
    }
    catch (err) {
        validate.message = err
        validate.status = false

    }

    return validate
}
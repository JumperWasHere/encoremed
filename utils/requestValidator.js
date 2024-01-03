const Joi = require('joi');

async function validateInputLogin(data) {
    let validate = {
        status: true,
        message: "all is validate",

    };
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(12).required(),
    });
    try {
        let value = await schema.validateAsync({
            email: data.email,
            password: data.password,
        });
        validate.value = value;
    }
    catch (err) {
        validate.message = err
        validate.status = false

    }

    return validate
}

async function validateInputRegister(data) {
    let validate = {
        status: true,
        message: "all is validate",
        value: {}
    };
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(12).required(),
        confirm_password: Joi.ref('password'),
        username: Joi.string().min(3).max(30).required(),
        fullname: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        address: Joi.string(),
        role: Joi.string().valid('Patient', 'Doctor').required(),
        specialities: Joi.string(),
        clinicName: Joi.string(),

    });
    try {
        let value = await schema.validateAsync({
            email: data.email,
            password: data.password,
            confirm_password: data.confirm_password,
            username: data.username,
            fullname: data.fullname,
            phoneNumber: data.phoneNumber,
            address: data.address,
            role: data.role,
            specialities: data.specialities,
            clinicName: data.clinicName,
        });
        validate.value = value;
    }
    catch (err) {
        console.log('err', err);
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
async function validateCustomTimeSlot(data) {
    let validate = {
        status: true,
        message: "all is validate",

    };
    const schema = Joi.object({
        userId: Joi.number().integer().required(),
        minutePerSlot: Joi.number().integer().required(),
    });
    try {
        let value = await schema.validateAsync({
            userId: data.userId,
            minutePerSlot: data.minutePerSlot,
        });
        validate.value = value;
    }
    catch (err) {
        validate.message = err
        validate.status = false

    }

    return validate
}
async function validateGenerateTimeslot(data) {
    let validate = {
        status: true,
        message: "all is validate",

    };
    const schema = Joi.object({
        doctorId: Joi.number().integer().required(),
        type: Joi.string().valid('Specific', 'Alternate', 'Repeat').required(),
        startDate: Joi.string().required(),
        endDate: Joi.string(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
        target: Joi.string().valid('day', 'month', 'week'),
        value: Joi.number().integer(),
    });
    try {
        let value = await schema.validateAsync({
            doctorId: data.doctorId,
            type: data.type,
            startDate: data.startDate,
            endDate: data.endDate,
            startTime: data.startTime,
            endTime: data.endTime,
            target: data.target,
            value: data.value
        });
        validate.value = value;
    }
    catch (err) {
        validate.message = err
        validate.status = false

    }

    return validate
}
module.exports = { validateInputLogin, validateInputRegister, validateInputBooking, validateInputgetTimeslot, validateCustomTimeSlot, validateGenerateTimeslot };

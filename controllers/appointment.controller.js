const dotenv = require('dotenv');
const db = require('../dbConnection/db');
const Joi = require('joi');
const appointmentService = require('../services/appointment.service')

dotenv.config();

// access config var
// process.env.TOKEN_SECRET;


exports.booking = async (req, res) => {
    const { patientId, doctorId, appointmentDate, purpose, events, timeslotId } = req.body;
    //validate value
    // console.log('appoitmentTime',appoitmentTime);
    // if (!validateInputType(req.body)){
    //     return res.status(500).json({
    //         success: false,
    //         data: null,
    //         error: {
    //             code: 500,
    //             message: 'Invalide type'
    //         }
    //     });
    // }
    //check if selected time exist at booking slot
    isbooked = await checkTImeSlot(timeslotId);// retrun false is timeslot is avaiable
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
    let createAppointment = await createAppoitment(req.body);
    if (!createAppointment){
        return res.status(500).json({
            success: false,
            data: null,
            error: {
                code: 500,
                message: 'Fail create booking'
            }
        });
    }
    await updateTimeSlot(timeslotId);// update status time slot
    // let insertEventStatus = await insertEvent(req.body);//insert data to event table
    // if (!insertEventStatus){
    //     return res.status(500).json({
    //         success: false,
    //         data: null,
    //         error: {
    //             code: 500,
    //             message: 'Fail create booking'
    //         }
    //     });
    // }
    //insert event data
    return res.status(201).json({
        success: true,
        data: createAppointment,
        error: {
            code: 201,
            message: 'Success create booking'
        }
    });
    //insert to appoitment and timeslot if, avaiable 

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
async function createAppoitment(data){
    let idInsert = false;
    let query = `INSERT INTO [Appoitments] ([patientId], [doctorId],[timeslotId], [appointmentDate],[startTime], [endTime],[purpose],[status],[createdAt]) 
    VALUES (@patientId, @doctorId, @timeslotId, @appointmentDate, @startTime,@endTime, @purpose,@status,@createdAt )`;

    let inputParams = {
        patientId: data.patientId,
        doctorId: data.doctorId,
        timeslotId: data.timeslotId,
        appointmentDate: data.appointmentDate,
        startTime: data.startTime,
        endTime: data.endTime,
        purpose: data.purpose,
        status: "Booking",
        createdAt: new Date()
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);

        if (result.recordset.length > 0) {
            idInsert = true;
        }
    })
    return idInsert;
}
async function checkTImeSlot(timeslotId){
    let isbooked = true;
    let query = 'Select id FROM [TimeSlot] where id= @timeslotId AND isBooked = @isBooked';
    let inputParams = {
        timeslotId: timeslotId,
        isBooked:'false'
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);

        if (result.recordsets[0].length > 0) {
            console.log('result.recordset', result.recordset);
            isbooked = false;//not book yet
        }
        // console.log('result', result.recordsets[0].length);
    })
    return isbooked;
}
async function updateTimeSlot(timeslotId){
    let query = `UPDATE  [TimeSlot] SET isBooked= @isBooked where id=@timeslotId`;

    let inputParams = {
        timeslotId: timeslotId,
        isBooked: 'true',
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);

      
    })
}
async function insertEvent(data){
    let idInsert = false;
    let query = `INSERT INTO [Event] ([type], [startDate], [endDate],[startTime], [endTime],[target],[value],[createdAt]) 
    VALUES (@type, @startDate, @endDate, @startTime,@endTime, @target,@value,@createdAt )`;

    let inputParams = {
        type: data.event,
        startDate: data.startDate,
        endDate: data.endDate,
        startTime: data.startTime,
        endTime: data.endTime,
        target: data.target,
        value: data.value,
        createdAt: new Date()
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);

        if (result.recordset.length > 0) {
            idInsert = true;
        }
    })
    return idInsert; 
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
        value = await schema.validateAsync({
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
//create appoitment
//get all appoitment
//get appoitment
//delete app
//update appointment
//get appointment via id doctor and patient
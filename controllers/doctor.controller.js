const dotenv = require('dotenv');
const Joi = require('joi');
const doctorService = require('../services/doctor.service')
dotenv.config();



exports.generateTimeSlotByEvent = async (req, res) => {
    // let value;
    let isValidate = await validateGenerateTimeslot(req.body);

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

            
    const minutePerSlot = await doctorService.getMinutePerSlotByDoctor(isValidate.value.doctorId);
    const generatedTimeslots = await generateTimeslotsFromEvents(isValidate.value, minutePerSlot);
    // let isEventSave = await doctorService.saveEvent(value);
    // if (isEventSave === 0){
    //     return res.status(500).json({
    //         success: false,
    //         data: null,
    //         error: {
    //             code: 500,
    //             message: 'Fail to save event, please contact system admin'
    //         }
    //     });
    // }
    try{

    //     for (const querydata of generatedTimeslots){
    //         // async () => {
    //             console.log(querydata);
    //         let isTimeSlotSave = await doctorService.generateTimeSlot(value.doctorId, querydata, isEventSave);
           
    //             if (isTimeSlotSave === 0) {
    //             throw new Error('Forcing catch block based on a condition');
    //         }

    // }
    }catch(err){
        return res.status(500).json({
                success: false,
                data: null,
                error: {
                    code: 500,
                    message: 'Fail to save time slot, please contact system admin'
                }
            });
    }
    return res.status(200).json({
        success: true,
        data: generatedTimeslots,
        error: {
            code: 200,
            message: 'Success getAvailableTimeslot'
        }
    });
}
const events = [
    // {
    //     eventType: 'specific',
    //     startDate: '2023-01-05',
    //     startTime: '10:00',
    //     endTime: '11:00',
    //     doctorId: 1 // Doctor ID for this event
    // },
    {
        eventType: 'alternate',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        startTime: '08:00',
        endTime: '17:00',
        target: 'month',
        value: 2,
        doctorId: 2 // Doctor ID for this event
    }
];
const doctorTimeslotDurations = {
    1: 30, // Timeslot duration for Doctor 1 (in minutes)
    2: 45, // Timeslot duration for Doctor 2 (in minutes)
    3: 20 // Timeslot duration for Doctor 3 (in minutes)
};
exports.customizedRangeTimeSlot = async (req, res) => {
    const timeslotDurationPerDoctor = 40; // Specify the timeslot duration in minutes for this doctor

    const generatedTimeslots = generateTimeslotsWithCustomDuration(events, doctorTimeslotDurations);
    return res.status(200).json({
        success: true,
        data: generatedTimeslots,
        error: {
            code: 200,
            message: 'Success getAvailableTimeslot'
        }
    });
}

function generateTimeslotsFromEvents(event, minutePerSlot) {
    const timeslotDuration = minutePerSlot;
    let generatedTimeslots = [];

    // events.forEach(event => {
        switch (event.type) {
            case 'Specific':
                // For specific events, mark the timeslot within the event's time range as booked
                generatedTimeslots.push({
                    date: event.startDate,
                    startTime: event.startTime,
                    endTime: event.endTime,
                    isBooked: true
                });
                break;

            case 'Alternate':
                // For alternate events, generate timeslots based on the specified pattern
                const alternateStartDate = new Date(event.startDate);
                const alternateEndDate = new Date(event.endDate);
                const alternateStartTime = event.startTime;
                const alternateEndTime = event.endTime;
                const target = event.target; // e.g., 'week'
                const value = event.value; // e.g., 1

                let currentDate = new Date(alternateStartDate);
                while (currentDate <= alternateEndDate) {
                    let isAlternateDate = false;

                    switch (target) {
                        case 'day':
                            isAlternateDate = currentDate.getDate() % value === 1;
                            break;
                        case 'week':
                            isAlternateDate = ((currentDate.getDate() - 1) / 7) % value === 0;

                            break;
                        case 'month':

                            isAlternateDate = (currentDate.getMonth() % value === 0) && (currentDate.getDate() === alternateStartDate.getDate());
                            break;
                        default:
                            break;
                    }
                    // Generate timeslots based on the alternating pattern (e.g., weekly)
                    if (isAlternateDate) {
                        generatedTimeslots.push(generateTimeslot(currentDate, alternateStartTime, alternateEndTime, timeslotDuration));
                    }
                    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
                }
                break;

            case 'Repeat':
                // For repeat events, generate timeslots based on the repeat pattern
                const repeatStartDate = new Date(event.startDate);
                const repeatEndDate = new Date(event.endDate);
                const repeatStartTime = event.startTime;
                const repeatEndTime = event.endTime;
                const repeatTarget = event.target; // e.g., 'month'
                const repeatValue = event.value; // e.g., 2
                let currentRepeatDate = new Date(repeatStartDate);
                while (currentRepeatDate <= repeatEndDate) {
                    let isRepeatingDate = false;
                    switch (repeatTarget) {
                        case 'day':
                            isRepeatingDate = currentRepeatDate.getDate() >= repeatValue;
                            break;
                        case 'week':
                            isRepeatingDate = currentRepeatDate.getDay() === repeatValue; //0-> sunday
                            break;
                        case 'month':
                            isRepeatingDate = (currentRepeatDate.getMonth()+1) % repeatValue === 0;
                            break;
                        default:
                            break;
                    }
                    if (isRepeatingDate) {
                        generatedTimeslots.push(generateTimeslot(currentRepeatDate, repeatStartTime, repeatEndTime, timeslotDuration));

                        // generatedTimeslots.push({
                        //     date: currentRepeatDate.toISOString().split('T')[0],
                        //     startTime: repeatStartTime,
                        //     endTime: repeatEndTime,
                        //     isBooked: false // Adjust as needed based on logic
                        // });
                    }
                    currentRepeatDate.setDate(currentRepeatDate.getDate() + 1); // Move to the next day
                }
                break;

            default:
                // Handle other event types if needed
                break;
        }

    return generatedTimeslots;
}
function generateTimeslot(currentDate, startTime, endTime, timeslotDuration) {
    if (timeslotDuration !== 0) {
        return customeTimeBasePerDoctor(currentDate, startTime, endTime, timeslotDuration);
    } else {
        return {
            date: currentDate.toISOString().split('T')[0],
            startTime: startTime,
            endTime: endTime,
            isBooked: false // Adjust as needed based on logic
        };
    }
}
function customeTimeBasePerDoctor(currentDate, startTime, endTime, timeslotDuration){
    let Timeslots = []
    let currentTime = new Date(currentDate);
    while (currentTime < new Date(currentDate).setHours(endTime.split(':')[0], endTime.split(':')[1])) {
        // Generate timeslot with the specified duration
        const timeslotEndTime = new Date(currentTime.getTime() + (timeslotDuration * 60000)); // Convert minutes to milliseconds
        if (timeslotEndTime <= new Date(currentDate).setHours(endTime.split(':')[0], endTime.split(':')[1])) {
            Timeslots.push({
                date: currentTime.toISOString().split('T')[0],
                startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                endTime: timeslotEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                isBooked: false // Adjust as needed based on logic
            });
        }
        currentTime = timeslotEndTime;
    }
    console.log('Timeslots', Timeslots);
    return [...Timeslots];
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
        target: Joi.string().valid('day', 'month', 'year'),
        value: Joi.number().integer(),
    });
    try {
        value = await schema.validateAsync({
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
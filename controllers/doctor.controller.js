const dotenv = require('dotenv');
const Joi = require('joi');
const doctorService = require('../services/doctor.service')
const { validateCustomTimeSlot, validateGenerateTimeslot } = require('../utils/requestValidator')
dotenv.config();



exports.generateTimeSlotByEvent = async (req, res) => {
    // Step 1: input validation
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
    // step 2: get custom minute per doctor at doctor table
    const minutePerSlot = await doctorService.getMinutePerSlotByDoctor(isValidate.value.doctorId);
    // step 3: generate object array for time slot data, via event details and custom minute per doctor
    const generatedTimeslots = await generateTimeslotsFromEvents(isValidate.value, minutePerSlot);
    
    try {
    // step 4: save event details to event table   
    let isEventSave = await doctorService.saveEvent(isValidate.value);
    if (isEventSave === 0){
        return res.status(500).json({
            success: false,
            data: null,
            error: {
                code: 500,
                message: 'Fail to save event, please contact system admin'
            }
        });
    }
    
        for (const querydata of generatedTimeslots){
            // step 5: save all generated time slot to timeslot table
            let isTimeSlotSave = await doctorService.generateTimeSlot(isValidate.value.doctorId, querydata, isEventSave);
                // if fail to insert 
                if (isTimeSlotSave === 0) {
                throw new Error('Forcing catch block based on a condition');
            }

    }
    }catch(err){
        console.log(err);
        return res.status(500).json({
                success: false,
                data: null,
                error: {
                    code: 500,
                    message: 'Fail to save time slot, please contact system admin'
                }
            });
    }
    // step 6: send response success message  
    return res.status(200).json({
        success: true,
        data: generatedTimeslots,
        error: {
            code: 200,
            message: 'Success generate Time Slot'
        }
    });
}

exports.changedRangeTimeSlot = async (req, res) => {
    // step 1: input validation
    let isValidate = await validateCustomTimeSlot(req.body);
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
    // step 2: update column minuteperslot at doctor table 
    const updateDrTimeSlot = await doctorService.updateTimeSlotDr(isValidate.value);
    if (!updateDrTimeSlot){
        return res.status(500).json({
            success: false,
            data: null,
            error: {
                code: 500,
                message: "Fail to Update Timeslot Doctor"
            }
        });
    }
    // step 3: send success response
    return res.status(200).json({
        success: true,
        data: isValidate.value,
        error: {
            code: 200,
            message: 'Success getAvailableTimeslot'
        }
    });
}
// generate time slot base on event and minute per slot
async function generateTimeslotsFromEvents(event, minutePerSlot) {
    const timeslotDuration = minutePerSlot;
    let generatedTimeslots = [];

        switch (event.type) {
            case 'Specific':
                // function to generate multiple time slot per day, base on minute per time slot
                let tempArray = await generateTimeslot(new Date(event.startDate), event.startTime, event.endTime, timeslotDuration);
                tempArray.forEach(item => generatedTimeslots.push(item))
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
                // loop all date from star to end date on event details
                while (currentDate <= alternateEndDate) {
                    let isAlternateDate = false;
                    // if condition for target value
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
                    if (isAlternateDate) {
                        // function to generate multiple time slot per day, base on minute per time slot
                        let tempArray = await generateTimeslot(currentDate, alternateStartTime, alternateEndTime, timeslotDuration);
                        tempArray.forEach(item => generatedTimeslots.push(item))
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
                            console.log('repeat', (currentRepeatDate.getMonth() + 1) % repeatValue === 0);

                            break;
                        default:
                            break;
                    }
                    if (isRepeatingDate) {
                        // function to generate multiple time slot per day, base on minute per time slot
                        let tempArray = await generateTimeslot(currentRepeatDate, repeatStartTime, repeatEndTime, timeslotDuration);
                        tempArray.forEach(item => generatedTimeslots.push(item))

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
async function generateTimeslot(currentDate, startTime, endTime, timeslotDuration) {
    // check is doctor have state specific minute per slot
    if (timeslotDuration !== 0) {
        return await customeTimeBasePerDoctor(currentDate, startTime, endTime, timeslotDuration);
    } else {
        return [{
            date: currentDate.toISOString().split('T')[0],
            startTime: startTime,
            endTime: endTime,
            isBooked: false // Adjust as needed based on logic
        }];
    }
}
// function to generate slot time by minute
async function customeTimeBasePerDoctor(currentDate, startTime, endTime, timeslotDuration){
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
    return [...Timeslots]; 
}




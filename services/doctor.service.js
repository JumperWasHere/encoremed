const { func } = require('joi');
const db = require('../dbConnection/db');

async function saveEvent(data){
    let insertId = 0
    let query = `INSERT INTO [Event] ([type], [startDate], [endDate],[startTime],[endTime],[target],[value],[createdAt]) 
    VALUES (@type, @startDate, @endDate, @startTime, @endTime, @target, @value, @createdAt)`;

    let inputParams = {
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        startTime: data.startTime,
        endTime: data.endTime,
        target: data.target,
        value: data.value,
        createdAt: new Date(),
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);

        insertId = result.recordset[0].insertID;
        // console.log('userId', userId);
    })
    return insertId;
}

async function generateTimeSlot(doctorId, data, isEventSave){
    let insertId = 0
    let query = `INSERT INTO [TimeSlot] ([doctorId],[eventId],[date],[startTime],[endTime],[isBooked],[createdAt],[updatedAt],[createdById],[updatedById]) 
    VALUES (@doctorId, @eventId, @date, @startTime, @endTime, @isBooked, @createdAt, @updatedAt, @createdById, @updatedById)`;

    let inputParams = {
        doctorId: doctorId,
        eventId: isEventSave,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        isBooked: 'false',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: doctorId,
        updatedById: doctorId,
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);

        insertId = result.recordset[0].insertID;
        // console.log('userId', userId);
    })
    return insertId;
}
async function getDoctorTImeSlot(data) {
    let collection = [];
    let query = `Select [id],[doctorId],[eventId],[date],CONVERT(VARCHAR, startTime, 108) AS startTime ,CONVERT(VARCHAR, endTime, 108) AS endTime ,[isBooked]
      FROM [TimeSlot] 
      where  doctorId = @doctorId AND date between @startDate AND @endDate AND isBooked = @isBooked`
    let inputParams = {
        doctorId: data.doctorId,
        startDate: data.startDate,
        endDate: data.endDate,
        isBooked: 'false'
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);

        if (result.recordsets[0].length > 0) {
            collection = result.recordsets[0];
        }
    })
    return collection;
}
async function getMinutePerSlotByDoctor(doctorId){
    let totalMinute = 0;
    let query = `Select minutePerSlot FROM [Doctor] where  userId = @doctorId`
    let inputParams = {
        doctorId: doctorId,
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);

        if (result.recordsets[0].length > 0) {
            totalMinute = result.recordsets[0][0].minutePerSlot;
        }
    })
    return totalMinute;
}


module.exports = { saveEvent, generateTimeSlot, getDoctorTImeSlot, getMinutePerSlotByDoctor }
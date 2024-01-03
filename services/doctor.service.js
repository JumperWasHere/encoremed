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
    })
    return insertId;
}

async function generateTimeSlot(doctorId, data, isEventSave){
    let insertId = 0
    let query = `
    If Not Exists (SELECT 1 FROM [TimeSlot] WHERE doctorId = @doctorId AND date = @date AND startTime = @startTime AND endTime = @endTime)
    Begin
    INSERT INTO [TimeSlot] ([doctorId],[eventId],[date],[startTime],[endTime],[isBooked],[createdAt],[updatedAt],[createdById],[updatedById]) 
    VALUES (@doctorId, @eventId, @date, @startTime, @endTime, @isBooked, @createdAt, @updatedAt, @createdById, @updatedById)
    End
    `;

    let inputParams = {
        doctorId: doctorId,
        eventId: isEventSave,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        // date2: data.date,
        // startTime2: data.startTime,
        // endTime2: data.endTime,
        isBooked: 'false',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: doctorId,
        updatedById: doctorId,
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);

        insertId = result.recordset[0].insertID;
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
    let query = `Select minutePerSlot FROM [Doctor] where  id = @doctorId`
    let inputParams = {
        doctorId: doctorId,
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);

        if (result.recordsets[0].length > 0) {
            totalMinute = result.recordsets[0][0].minutePerSlot;
            totalMinute = Number.isInteger(totalMinute) ? totalMinute : 0;
        }
    })
    return totalMinute;
}
async function updateTimeSlotDr(data) {
    let updateStatus = true;
    let query = `UPDATE Doctor SET minutePerSlot= @minutePerSlot where  id = @doctorId`
    let inputParams = {
        minutePerSlot: data.minutePerSlot,
        doctorId: data.doctorId
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) {
        console.log(err)
        updateStatus = false
    };

    })
    return updateStatus;
}

module.exports = { saveEvent, generateTimeSlot, getDoctorTImeSlot, getMinutePerSlotByDoctor, updateTimeSlotDr }
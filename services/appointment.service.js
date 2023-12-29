
const db = require('../dbConnection/db');

async function getTImeSlotByDocId(data) {
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
async function checkTImeSlot(data) {
    let isbooked = true;
    let query = 'Select id FROM [TimeSlot] where id= @timeslotId AND isBooked = @isBooked AND doctorId = @doctorId';
    let inputParams = {
        timeslotId: data.timeslotId,
        isBooked: 'false',
        doctorId: data.doctorId
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
async function createAppoitment(data) {
    let idInsert = false;
    try {
        let query = `INSERT INTO [Appoitments] ([patientId], [doctorId],[timeslotId], [purpose],[status],[createdAt],[updatedAt]) 
        VALUES (@patientId, @doctorId, @timeslotId, @purpose,@status,@createdAt, @updatedAt )`;

        let inputParams = {
            patientId: data.patientId,
            doctorId: data.doctorId,
            timeslotId: data.timeslotId,
            purpose: data.purpose,
            status: "Booking",
            createdAt: new Date(),
            updatedAt: new Date()
        }
        await db.executeSql2(query, inputParams, async (result, err) => {
            if (err) { console.log(err) };
            console.log(result);
            if (result !== null && result.recordset.length > 0) {
                idInsert = true;
            }
        })
    } catch (err) {
        console.log('error:-', err.message);
    }
    return idInsert;
}
async function updateTimeSlot(timeslotId) {
    let query = `UPDATE  [TimeSlot] SET isBooked= @isBooked where id=@timeslotId`;

    let inputParams = {
        timeslotId: timeslotId,
        isBooked: 'true',
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);


    })
}
module.exports = { getTImeSlotByDocId, checkTImeSlot, createAppoitment, updateTimeSlot }

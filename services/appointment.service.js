
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


module.exports = {  getTImeSlotByDocId }

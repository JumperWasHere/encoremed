var sqlDb = require("mssql");
var settings = require("../config/server.config");
var req,req2,retryTimes=0,retryLimit=5,queryRetryTimes=0,queryRetryLimit=5;




// async function getUser(userId) {
//   const pool = await sql.connect(config);
//   const result = await pool.request()
//     .input('userId', sql.Int, userId)
//     .query('SELECT * FROM users WHERE userId = @userId');
//   return result.recordset[0];
// }

exports.executeSql2 = async function (sql, inputParams,callback) {

    var conn = new sqlDb.ConnectionPool(settings.dbConfig);

     var ins = sql + ';select @@IDENTITY AS \'insertID\'';
    // await getConnection(conn, 'calc')  
    await conn.connect();
    try{
    const request = await conn.request();
      Object.keys(inputParams).forEach((key) => {
        request.input(key, inputParams[key]);
      });

    await request.query(ins)
    .then((recordSet) => {
        queryRetryTimes=0;
        callback(recordSet)
    })
    .catch((err) => {
       callback(null, err)

    })
  }catch(ex){
    console.log(ex)
    callback(null, ex)
  }
    
}





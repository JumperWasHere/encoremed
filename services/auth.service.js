const db = require('../dbConnection/db');

async function getUserByEmail(email) {
    let user = [];
    let query = 'SELECT * FROM [Users] WHERE [email] = @email  ';
    let inputParams = {
        email: email
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);

        if (result.recordset.length > 0) {
            user = result.recordset[0];
        }

    })
    return user;
}
async function registerUser(password, data) {
    let userId = 0
    let query = `INSERT INTO [Users] ([email], [password], [role],[createdAt],[updatedAt]) 
    VALUES (@email, @password, @role, @createdAt, @updatedAt)`;

    let inputParams = {
        email: data.email,
        password: password,
        role: data.role === "Doctor" ? data.role : "Patient",
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);

        userId = result.recordset[0].insertID;
        console.log('userId', userId);
    })
    return userId;
}
async function registerDoctorDetails(userId, data) {
    let drId = 0
    let query = `INSERT INTO [Doctor] ([userId],[username], [fullname], [specialities],[clinicName],[phoneNumber],[address],[createdAt],[updatedAt]) 
    VALUES (@userId, @username, @fullname, @specialities, @clinicName, @phoneNumber, @address, @createdAt, @updatedAt)`;

    let inputParams = {
        userId: userId,
        username: data.username,
        fullname: data.fullname,
        specialities: data.specialities,
        clinicName: data.clinicName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);
        if (result.recordsets[0].length > 0) {
            // idInsert = true;
            drId = result.recordsets[0].insertID;
        }
        console.log(result.recordsets[0]);
    })
    return drId;
}
async function registerPatientDetails(userId, data) {
    let drId = 0
    let query = `INSERT INTO [Patient] ([userId],[username], [fullname], [phoneNumber],[address],[createdAt],[updatedAt]) 
    VALUES (@userId, @username, @fullname, @phoneNumber, @address, @createdAt, @updatedAt)`;

    let inputParams = {
        userId: userId,
        username: data.username,
        fullname: data.fullname,
        phoneNumber: data.phoneNumber,
        address: data.address,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);
        console.log(result);
        if (result.recordsets[0].length > 0) {
            // idInsert = true;
            drId = result.recordsets[0].insertID;
        }
    })
    return drId;
}
async function checkUserEmail(email) {
    let isExist = false
    const query = 'SELECT ID FROM [Users] WHERE Email = @email';
    const inputParams = {
        email: email
    };
    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);

        if (result.recordset.length > 0) {
            isExist = true

        }
    })

    return isExist;
}
module.exports = { getUserByEmail, registerUser, registerDoctorDetails, registerPatientDetails, checkUserEmail }

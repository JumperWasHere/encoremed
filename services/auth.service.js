const db = require('../dbConnection/db');
//get user by email
async function getUserByEmail(email) {
    let user = [];
    let query = 'SELECT * FROM [UsersAccess] WHERE [email] = @email  ';
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
// register user account
async function registerUser(password, data) {
    let UsersAccessId = 0
    let query = `INSERT INTO [UsersAccess] ([email], [password], [role],[createdAt],[updatedAt]) 
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

        UsersAccessId = result.recordset[0].insertID;
        console.log('UsersAccessId', UsersAccessId);
    })
    return UsersAccessId;
}
// create data for doctor table
async function registerDoctorDetails(userAccessId, data) {
    let drId = 0
    let query = `INSERT INTO [Doctor] ([userAccessId],[username], [fullname], [specialities],[clinicName],[phoneNumber],[address],[createdAt],[updatedAt]) 
    VALUES (@userAccessId, @username, @fullname, @specialities, @clinicName, @phoneNumber, @address, @createdAt, @updatedAt)`;

    let inputParams = {
        userAccessId: userAccessId,
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
// create data for patient table
async function registerPatientDetails(userAccessId, data) {
    let drId = 0
    let query = `INSERT INTO [Patient] ([userAccessId],[username], [fullname], [phoneNumber],[address],[createdAt],[updatedAt]) 
    VALUES (@userAccessId, @username, @fullname, @phoneNumber, @address, @createdAt, @updatedAt)`;

    let inputParams = {
        userAccessId: userAccessId,
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
// check if email is exist
async function checkUserEmail(email) {
    let isExist = false
    const query = 'SELECT ID FROM [UsersAccess] WHERE Email = @email';
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

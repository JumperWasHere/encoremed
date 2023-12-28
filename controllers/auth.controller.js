'use strict'
var hash = require('pbkdf2-password')()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../dbConnection/db');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// get config vars
dotenv.config();

// access config var
// process.env.TOKEN_SECRET;


exports.login = async (req, res) => {
    await handleLogin(req, res)

}
exports.register = async (req, res, next) => {
    const { email, confirm_password, username, fullname, role } = req.body;
    let password = req.body.password;
    let passwordEncrpt = '';
    try {
        if (password !== confirm_password) {
            return res.status(500).json({
                success: false,
                data: null,
                error: {
                    code: 500,
                    message: 'Password and confirm password doesnt match'
                }
            });

        }
        let validEmail = await checkUserEmail(email);
        if (validEmail === true) {
            return res.status(403).json({
                success: false,
                data: null,
                error: {
                    code: 403,
                    message: 'Email already exist'
                }
            });
            
        }
        await bcrypt.hash(password, saltRounds).then(function (hash) {
            // Store hash in your password DB.
            passwordEncrpt = hash;
        });
        password = passwordEncrpt;

        

        let userId = await registerUser(password,req.body);
            if (userId == 0) {
                return res.status(500).json({
                    success: false,
                    data: null,
                    error: {
                        code: 500,
                        message: 'Fail insert user, please check with system admin'
                    }
                });
            }
        if (role === "Doctor") {

            let doctorId = await registerDoctorDetails(userId,req.body);
            if (doctorId == 0) {
                return res.status(500).json({
                    success: false,
                    data: null,
                    error: {
                        code: 500,
                        message: 'Fail insert doctor details, please check with system admin'
                    }
                });
            }
        } else {
            let patientId = await registerPatientDetails(userId, req.body);
            if (patientId == 0) {
                return res.status(500).json({
                    success: false,
                    data: null,
                    error: {
                        code: 500,
                        message: 'Fail insert patient details, please check with system admin'
                    }
                });
            }
        }
        return res.status(201).json({
            success: true,
            data: null,
            error: {
                code: 201,
                message: 'Success Register User'
            }
        });



  
    } catch (err) {
        return next(err);
    }




}

async function checkUserEmail(email){
    let isExist = false
    const query = 'SELECT ID FROM [Users] WHERE Email = @email'; 
    const inputParams = {
        email: email
    };
    await db.executeSql2(query, inputParams, async  (result, err) => {
        if (err) console.log(err);

        if (result.recordset.length > 0){
            isExist = true

        }
    })

    return isExist;
}
async function registerPatientDetails(userId, data){
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
async function registerDoctorDetails(userId,data){
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
async function registerUser(password,data) {
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

async function storeUserDetails(inputParams) {
    let idInsert = false;
    let query = 'INSERT INTO [Users_Details] ([User_Id], [Role_Id], [First_Name], [Last_Name]) VALUES (@userId, @roleId, @firstname, @lastName)';

    await db.executeSql2(query, inputParams, async (result, err) => {
        if (err) console.log(err);

        if (result.recordset.length > 0) {
            idInsert = true;
        }

        console.log('idInsert storeUserDetails', idInsert);
        console.log('result', result);
    })
    return idInsert;
}

async function handleLogin(req, res) {
    const { email, password } = req.body;
   
    let user = await getUserByEmail(email);
    // let user;
    // user = await User.find({ email: email });

    if (!user) {
        return res.status(500).json({
            success: false,
            data: null,
            error: {
                code: 500,
                message: 'User not exist'
            }
        });
    }
    if (Array.isArray(user) && user.length === 0){
        res.send('invalid email');
        return
    }
    console.log('user', user);
    let isMatch = await comparePassword(user.password, password);
    if (isMatch) {
        return res.status(200).json({
            success: false,
            data: user,
            token: await generateAccessToken({ username: email, role: user.role }),
            error: {
                code: 200,
                message: 'User authorization successful'
            }
        });
    } else {
        //invalid
        res.send('invalid password');
    }

}
async function getUserByEmail(email){
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
async function comparePassword(passwordHash, password) {
    let isMatch = false;

    const match = await bcrypt.compare(password, passwordHash);

    if (match) {
        //login
        isMatch = true;
    }
    return isMatch;
}
async function generateAccessToken(user,role) {
    return jwt.sign(user, process.env.TOKEN_SECRET);
}
// middleware
















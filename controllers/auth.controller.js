'use strict'
const bcrypt = require('bcrypt');
const saltRounds = 10;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const authService = require('../services/auth.service')
dotenv.config();



exports.login = async (req, res) => {
    await handleLogin(req, res)

}
exports.register = async (req, res, next) => {
    // const { email, confirm_password, username, fullname, role } = req.body;
    let password = req.body.password;
    let passwordEncrpt = '';
    let isValidate = await validateInputRegister(req.body);
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
    try {
        let validEmail = await authService.checkUserEmail(isValidate.value.email);
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

        

        let userId = await authService.registerUser(password,req.body);
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
        if (isValidate.value.role === "Doctor") {

            let doctorId = await authService.registerDoctorDetails(userId,req.body);
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
            let patientId = await authService.registerPatientDetails(userId, req.body);
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


async function handleLogin(req, res) {
    const { email, password } = req.body;
   
    let user = await authService.getUserByEmail(email);

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
async function validateInputLogin(data) {
    let validate = {
        status: true,
        message: "all is validate",

    };
    const schema = Joi.object({
        patientId: Joi.number().integer().required(),
        doctorId: Joi.number().integer().required(),
        timeslotId: Joi.number().integer().required(),
        purpose: Joi.string().min(0).max(30),
    });
    try {
        let value = await schema.validateAsync({
            patientId: data.patientId,
            doctorId: data.doctorId,
            timeslotId: data.timeslotId,
            purpose: data.purpose,
        });
        validate.value = value;
    }
    catch (err) {
        validate.message = err
        validate.status = false

    }

    return validate
}
async function validateInputRegister(data) {
    let validate = {
        status: true,
        message: "all is validate",
        value:{}
    };
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(12).required(),
        confirm_password: Joi.ref('password'),
        username: Joi.string().min(3).max(30).required(),
        fullname: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        address: Joi.string(),
        role: Joi.string().valid('Patient', 'Doctor').required(),
        specialities: Joi.string(),
        clinicName: Joi.string(),

    });
    try {
        let value = await schema.validateAsync({
            email: data.email,
            password: data.password,
            confirm_password: data.confirm_password,
            username: data.username,
            fullname: data.fullname,
            phoneNumber: data.phoneNumber,
            address: data.address,
            role: data.role,
            specialities: data.specialities,
            clinicName: data.clinicName,
        });
        validate.value = value;
    }
    catch (err) {
        console.log('err', err);
        validate.message = err
        validate.status = false

    }

    return validate
}















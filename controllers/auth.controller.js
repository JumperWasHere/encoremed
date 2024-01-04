'use strict'
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service')
const { hashPassword, comparePassword } = require('../utils/helpers')
const { validateInputLogin, validateInputRegister } = require('../utils/requestValidator')
dotenv.config();


exports.login = async (req, res) => {
  
    await handleLogin(req, res)

}
exports.register = async (req, res) => {
    let password = req.body.password;
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
        if (validEmail) {
            return res.status(403).json({
                success: false,
                data: null,
                error: {
                    code: 403,
                    message: 'Email already exist'
                }
            });
            
        }
        password = hashPassword(password);

        let userAccessId = await authService.registerUser(password,isValidate.value);
            if (userAccessId == 0) {
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

            let doctorId = await authService.registerDoctorDetails(userAccessId, isValidate.value);
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
            let patientId = await authService.registerPatientDetails(userAccessId, isValidate.value);
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
        return res.status(500).json({
            success: false,
            data: null,
            error: {
                code: 500,
                message: err
            }
        });
    }




}


async function handleLogin(req, res) {
    // step 1: validate input
    let isValidate = await validateInputLogin(req.body);
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
   // step 2: get user data by email
    let user = await authService.getUserByEmail(isValidate.value.email);

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
    //check is user exist
    if (Array.isArray(user) && user.length === 0){
        res.send('invalid email');
        return
    }
    // step 3: compare user password with request password, return true or false
    let isMatch = await comparePassword(isValidate.value.password,user.password);
    if (isMatch) {
        // step 4: send response to user with token access
        return res.status(200).json({
            success: true,
            data: user,
            token: await generateAccessToken({ username: isValidate.value.email, role: user.role }),
            error: {
                code: 200,
                message: 'User authorization successful'
            }
        });
    } else {
        //invalid
        return res.status(400).json({
            success: false,
            data: null,
            error: {
                code: 400,
                message: 'invalid password'
            }
        });
    }

}
// function to generate token
async function generateAccessToken(user) {
    return jwt.sign(user, process.env.TOKEN_SECRET);
}

















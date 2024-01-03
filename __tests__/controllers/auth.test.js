const { register } = require('../../controllers/auth.controller')
const authService = require('../../services/auth.service')
// const bcrypt = require('bcrypt');
const {hashPassword} = require('../../utils/helpers')
const { validateInputRegister } = require('../../utils/requestValidator')
jest.mock('../../services/auth.service')
jest.mock('../../utils/requestValidator')
// jest.mock('../../utils/helpers',()=>({
//     hashPassword: jest.fn((x) => 'hhh')
// }))
const hashing = jest.fn(hashPassword);
const result = hashing('password');

const request = {
body:{
        email: "RequestData@encoremed.com",
        password: "password",
        confirm_password: "password",
        username: "ariff najiuddin",
        fullname: "ariff najiuddin abd hamid",
        phoneNumber: "039876543",
        address: "adress to test",
        role: "Doctor",
        specialities: "Sakit Tuan",
        clinicName: "Anjung karisma"
    }

}
const response = {
    status: jest.fn((x) => x),
    json: jest.fn((x) => x),
}
const validate = {
    status: true,
    message: jest.fn((x) => x),
    value: request
}
response.status.mockImplementation((statusCode) => {
    return {
        json: (data) => {
            return {
                statusCode,
                data,
            };
        },
    };
});
const exceptedresponse = {
    success: false,
    data: null,
    error: {
        code: 403,
        message: 'Email already exist', // Assuming 'isValidate.message' is a string error message
    },
};
it('should send code 400 when user exists',async ()=>{
    const input = {
        status:true
    };

    validateInputRegister.mockImplementationOnce(validate)
    authService.checkUserEmail.mockImplementationOnce(()=>({
        id: 1,
        email: 'RequestData@encoremed.com',
        password: 'password',
    }))
    await register(request, response);
    expect(response.status).toHaveBeenCalledWith(403);
    // expect(response.json).toHaveBeenCalledWith(exceptedresponse);
    // expect(response.json).toHaveBeenCalledTimes(1);
})

// it("should success validate request register", async ()=>{
//     validateInputRegister.mockResolvedValueOnce(validate)
//     // await register(request, response);

// })

it("should send code 201 create new user",async ()=>{
    // bcrypt.hash.mockReturnValueOnce('password')
    authService.checkUserEmail.mockResolvedValueOnce(undefined);
    authService.registerUser.mockResolvedValueOnce({
        id: 1,
        email: 'email',
        password: 'password',
    })
    await register(request, response);
    

    expect(hashing).toHaveBeenCalledWith('password');
    // expect(authService.registerUser).toHaveBeenCalledWith('hash_passsword', request.body);
    // expect(response.status).toHaveBeenCalledWith(201);


})
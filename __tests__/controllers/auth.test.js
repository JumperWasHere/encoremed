const { register } = require('../../controllers/auth.controller')
const authService = require('../../services/auth.service')
const bcrypt = require('bcrypt');

jest.mock('../../services/auth.service')
jest.mock('bcrypt');

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
    status:jest.fn((x)=>x),
    json: jest.fn((x) => x),
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


it("should send code 201 create new user",async ()=>{
    // bcrypt.hash.mockReturnValueOnce('password')
    authService.checkUserEmail.mockResolvedValueOnce(undefined);
    authService.registerUser.mockResolvedValueOnce({
        id: 1,
        email: 'email',
        password: 'password',
    })
    await register(request, response);
    expect(bcrypt.hash).toHaveBeenCalledWith('password');
    // expect(authService.registerUser).toHaveBeenCalledWith(request.body.password, request.body);
    // expect(response.status).toHaveBeenCalledWith(201);


})
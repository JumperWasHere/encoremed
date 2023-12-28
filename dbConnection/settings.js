const dotenv = require('dotenv');
dotenv.config();





exports.dbConfig = {
    server: 'DESKTOP-AA0B2D3',
    database: 'Ecomed',
    user: 'jumper2',
    password: "abc123",
    connectionTimeout: 160000,
    requestTimeout: 160000,
    port: 1433,
    pool: {
        max: 10,
        min: 1,
        idleTimeoutMillis: 160000
    },
    options: {
        trustServerCertificate: true,
        encrypt: false
      }
}



// exports.emailTransporter = {
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// }

// exports.maraTransporter = {
//     host: 'smtp.office365.com',
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.EMAIL_MARA_USER,
//         pass: process.env.EMAIL_MARA_PASS
//     }
// }

// exports.emailTransporterTesting = {
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//         user: "fe6f097947d2de",
//         pass: "44d180e9f4e6a5"
//     }
// }
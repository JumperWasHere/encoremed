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



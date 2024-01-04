const dotenv = require('dotenv');
dotenv.config();

// connection configuration setting
exports.dbConfig = {
    server: process.env.CON_SERVER,
    database: process.env.CON_DATABASE,
    user: process.env.CON_USER,
    password: process.env.CON_PASSWORD,
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



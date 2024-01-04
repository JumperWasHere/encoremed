var createError = require('http-errors');
var express = require('express');
var app = express();
const cors = require('cors');
var path = require('path');
const helmet = require('helmet');
var authRoute = require('./routes/auth.router');
var appoitmentRouter = require('./routes/appointment.router');
var doctorRouter = require('./routes/doctor.router');
// whitelist all origin
app.use(cors({
    origin: '*'
}));
// allow to accept request in json
app.use(express.json());
// implement security header
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "script-src": ["'self'", "example.com"],
            "style-src": null,
        },
    },
    xFrameOptions: { action: "deny" },
}));
// node 18, still need to use this,  to be able use .env
require('dotenv').config({ path: __dirname + '/.env' });
// path view declaration
app.set('views', path.join(__dirname, 'views'));
// view using jade
app.set('view engine', 'jade');

// ##route declaration --
app.use('/auth', authRoute)
app.use('/appointment', appoitmentRouter)
app.use('/doctor', doctorRouter)
// ##end route declaration 

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
var createError = require('http-errors');
var express = require('express');
var app = express();
const cors = require('cors');
var path = require('path');
var authRoute = require('./routes/auth.router');
var appoitmentRouter = require('./routes/appointment.router');
var doctorRouter = require('./routes/doctor.router');

app.use(cors({
    origin: '*'
}));
app.use(express.json());
require('dotenv').config({ path: __dirname + '/.env' });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//route
app.use('/auth', authRoute)
app.use('/appointment', appoitmentRouter)
app.use('/doctor', doctorRouter)

app.use(function (err, req, res, next) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
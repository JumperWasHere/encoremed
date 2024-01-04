const jwt = require('jsonwebtoken');
//middleware to authhenticate user doctor
function authenticateTokenDoctor(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

        if (err || user.role !== "Doctor") return res.sendStatus(403)

        req.user = user


        next()
    })
}
//middleware to authhenticate user pattient
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}


module.exports = { isDocAuthunticated: authenticateTokenDoctor, isPatientAuthunticated: authenticateToken};

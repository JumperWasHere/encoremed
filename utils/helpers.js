const bcrypt = require('bcrypt');

const saltRounds = 10;
// hashing the password
 const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
};
// for validate hashing pass with request password
 const comparePassword = (plain, hashed) =>
    bcrypt.compareSync(plain, hashed);

module.exports = { hashPassword, comparePassword };
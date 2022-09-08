const bcrypt = require('bcrypt');
const saltRounds = 10;

async function encryptPassword(password) {
    return bcrypt.hashSync(password, saltRounds);
}

function comparePasswords(plain, encrypted) {
    return bcrypt.compareSync(plain, encrypted);
}

module.exports = {
    encryptPassword,
    comparePasswords
};
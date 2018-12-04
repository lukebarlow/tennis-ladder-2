const md5 = require('MD5')

const salt = process.env.SALT

function hashPassword (password, _salt) {
  const s = _salt || salt
  return md5(password + s)
}

module.exports = hashPassword

let { _, name, password } = require('minimist')(process.argv.slice(2))

name = name || _[0]
password = password || _[1]

if (!name || !password) {
  console.log('usage: node setPassword.js <name> <password>')
  process.exit()
}

require('dotenv').config()

const db = require('../src/server/getDb')()

db.setPassword(name, password).then(() => {
  console.log(`set new password for ${name}`)
  process.exit()
})

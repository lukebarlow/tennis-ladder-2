let { _, name, password, email } = require('minimist')(process.argv.slice(2))

name = name || _[0]
password = password || _[1]
email = email || _[2]

if (!name || !password || !email) {
  console.log('usage: node addPlayer.js <name> <password> <email>')
  process.exit()
}

require('dotenv').config()

const db = require('../src/server/getDb')()

db.addPlayer(name, password, email).then(() => {
  process.exit()
})

let { _, name } = require('minimist')(process.argv.slice(2))

name = name || _[0]

if (!name) {
  console.log('usage: node removeAdmin.js <name>')
  process.exit()
}

require('dotenv').config()

const db = require('../src/server/getDb')()

db.setIsAdmin(name, false).then(() => {
  process.exit()
})

let { _, name } = require('minimist')(process.argv.slice(2))

name = name || _[0]

if (!name) {
  console.log('usage: node makeAdmin.js <name>')
  process.exit()
}

require('dotenv').config()

const db = require('../src/server/getDb')()

db.setIsAdmin(name, true).then(() => {
  console.log(`set ${name} to be an administrator`)
  process.exit()
})

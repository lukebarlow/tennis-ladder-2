const hashPassword = require('./src/server/hashPassword')

const result = hashPassword(process.argv[2], process.argv[3])
console.log(result)

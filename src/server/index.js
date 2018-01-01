const express = require('express')
const app = express()

const ladder = require('./ladder')

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/../../public'))

app.use('/ladder', ladder.ladder)
app.use('/addPlayer', ladder.addPlayer)

var server = app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
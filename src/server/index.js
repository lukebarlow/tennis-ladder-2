const express = require('express')
const app = express()
const ladder = require('./ladder')

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/../../public'))

// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

// app.get('/', function(request, response) {
//   response.render('pages/index');
// });


app.use('/ladder', ladder.ladder)
app.use('/addPlayer', ladder.addPlayer)
app.get('/challenges', ladder.getChallenges)

var server = app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})

//socketServer(server)

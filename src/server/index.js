const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

const ladder = require('./ladder')
const auth = require('./auth')

app.use(bodyParser.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'production') {
  const webpackMiddleware = require('webpack-dev-middleware')
  const webpack = require('webpack')
  const compiler = webpack(require('../../webpack.config'))
  app.use('/js', webpackMiddleware(compiler))
  console.log('Using the webpack dev middleware')
} else {
  console.log('Not using the dev middlware')
}

app.use(session({
  secret: 'pregumption',
  resave: false,
  saveUninitialized: true,
  cookie: { }
}))

app.set('port', (process.env.PORT || 5000))
app.use(express.static(path.join(__dirname, '/../../public')))

app.use('/config', (req, res) => {
  res.send(JSON.stringify({
    daysSincePlayedCutoffSingles: parseInt(process.env.DAYS_SINCE_PLAYED_CUTOFF_SINGLES),
    daysSincePlayedCutoffDoubles: parseInt(process.env.DAYS_SINCE_PLAYED_CUTOFF_DOUBLES)
  }))
})

app.use('/userId', auth.userId)
app.use('/userDetails', auth.userDetails)
app.use('/players', ladder.players)

// app.use('/addPlayer', ladder.addPlayer)
app.get('/singlesChallenges', ladder.singlesChallenges)

app.use('/recentSinglesMatches', ladder.recentSinglesMatches)
app.use('/recentDoublesMatches', ladder.recentDoublesMatches)

// app.get('/addSinglesMatch', auth.checkAuth, ladder.addSinglesMatch)
// app.get('/addDoublesMatch', auth.checkAuth, ladder.addDoublesMatch)
// app.get('/invite', auth.checkAuth, ladder.invite)

app.get('/addSinglesMatch', ladder.addSinglesMatch)
app.get('/addDoublesMatch', ladder.addDoublesMatch)

app.get('/addSinglesChallenge', auth.checkAuth, ladder.addSinglesChallenge)

app.post('/login', auth.login)
app.post('/changePassword', auth.checkAuth, auth.changePassword)
app.post('/saveSettings', auth.checkAuth, auth.saveSettings)
app.use('/logout', auth.logout)

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})

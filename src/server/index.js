const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

const ladder = require('./ladder')
const auth = require('./auth')

app.use(bodyParser.urlencoded({ extended: true }))

// app.configure(function(){
//     app.use(express.bodyParser());
//     app.use(express.cookieParser());
//     app.use(express.cookieSession({ secret: 'tupperware', cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }}));
// })

// the webpack middleware for development

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

app.use('/userId', auth.userId)
app.use('/ladder', ladder.ladder)
app.use('/addPlayer', ladder.addPlayer)
app.get('/challenges', ladder.getChallenges)
app.use('/recentMatches', ladder.recentMatches)

app.get('/addMatch', auth.checkAuth, ladder.addMatch)
app.get('/addChallenge', auth.checkAuth, ladder.addChallenge)
app.get('/invite', auth.checkAuth, ladder.invite)
app.post('/login', auth.login)
app.post('/changePassword', auth.checkAuth, auth.changePassword)
app.get('/settings', auth.checkAuth, auth.getSettings)
app.post('/saveSettings', auth.checkAuth, auth.saveSettings)
app.use('/logout', auth.logout)

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})

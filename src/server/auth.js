var db = require('./db')

// largely based on http://stackoverflow.com/questions/7990890/how-to-implement-login-auth-in-node-js/8003291#8003291

module.exports = {
  userId: userId,
  checkAuth: checkAuth,
  login: login,
  logout: logout,
  changePassword: changePassword,
  getSettings: getSettings,
  saveSettings: saveSettings
}

function userId (req, res) {
  console.log('******** GOT A REQUEST FOR THE USER ID ********')
  console.log('which is ', req.session.userId)

  res.send(req.session.userId || '')
}

function checkAuth (req, res, next) {
  if (!req.session.userId) {
    res.send('You are not authorized to view this page')
  } else {
    next()
  }
}

function login (req, res) {
  var post = req.body

  console.log('body is', req.body)
  console.log('logging in with name', post.name, post.password)

  db.authenticate(post.name, post.password, function (error, result) {
    req.session.userId = result
    res.send(result)
  })
};

function logout (req, res) {
  delete req.session.userId
  res.send('true')
};

function changePassword (req, res) {
  var post = req.body
  db.changePassword(req.session.userId, post.old, post.new, function (error, result) {
    res.send(result)
  })
}

function getSettings (req, res) {
  db.getSettings(req.session.userId, function (error, result) {
    res.send(JSON.stringify(result || {}))
  })
}

function saveSettings (req, res) {
  var settings = JSON.parse(req.body.settings)
  db.saveSettings(req.session.userId, settings, function (error, result) {
    res.send(true)
  })
}

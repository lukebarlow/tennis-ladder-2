var db = require('./getDb')()

// largely based on http://stackoverflow.com/questions/7990890/how-to-implement-login-auth-in-node-js/8003291#8003291

module.exports = {
  userId: userId,
  userDetails: userDetails,
  checkAuth: checkAuth,
  login: login,
  logout: logout,
  changePassword: changePassword,
  getSettings: getSettings,
  saveSettings: saveSettings
}

function userId (req, res) {
  res.send(req.session.userId || '')
}

async function userDetails (req, res) {
  const userId = req.session.userId
  const isAdmin = await db.getIsAdmin(userId)
  res.send({ userId, isAdmin })
}

function checkAuth (req, res, next) {
  if (!req.session.userId) {
    res.send('You are not authorized to view this page')
  } else {
    next()
  }
}

async function login (req, res) {
  var post = req.body
  const result = await db.authenticate(post.name, post.password)
  req.session.userId = result
  res.send(result)
}

function logout (req, res) {
  delete req.session.userId
  res.send('true')
}

async function changePassword (req, res) {
  var post = req.body
  const result = await db.changePassword(req.session.userId, post.oldPassword, post.newPassword)
  res.send(result)
}

async function getSettings (req, res) {
  const result = db.getSettings(req.session.userId)
  res.send(JSON.stringify(result || {}))
}

async function saveSettings (req, res) {
  var settings = JSON.parse(req.body.settings)
  await db.saveSettings(req.session.userId, settings)
  res.send(true)
}

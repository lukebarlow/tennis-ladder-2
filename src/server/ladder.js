const db = require('./db')
const email = require('./email')
const url = require('url')

module.exports = {
  ladder: ladder,
  addMatch: addMatch,
  addPlayer: addPlayer,
  recentMatches: recentMatches,
  addChallenge: addChallenge,
  getChallenges: getChallenges,
  invite: invite
}

//
async function ladder (req, res) {
  try {
    await db.checkForExpiredChallenges()
  } catch (e) {
    console.warn('Error checking expired challenges')
    res.statusCode = 503
    res.send()
  }

  try {
    console.log('getting players')
    const players = await db.getPlayers()
    res.send(JSON.stringify(players))
  } catch (e) {
    // throw e
    console.warn('Error getting ladder')
    res.statusCode = 503
    res.send()
    throw e
  }
}

// adds a game, and returns the new ladder in order
function addMatch (req, res) {
  var match = JSON.parse(url.parse(req.url, true).query.match)
  db.addMatch(match, function (error, callback) {
    ladder(req, res)
  })
}

async function recentMatches (req, res) {
  try {
    console.log('start of trying')
    const matches = await db.getRecentMatches()
    console.log('matches', matches)
    console.log('got the matches, going to JSONify them')
    res.send(JSON.stringify(matches))
  } catch (e) {
    console.warn('Error trying to get recent matches')
    res.statusCode = 503
    res.send()
  }
}

function addChallenge (req, res) {
  var challenge = JSON.parse(url.parse(req.url, true).query.challenge)
  db.addChallenge(challenge, function (error, callback) {
    res.send('true')
  })
}

function addPlayer (req, res) {
  var { name, password, position, email } = url.parse(req.url, true).query

  console.log('adding')
  console.log('ame', name)
  console.log('password', password)
  console.log('position', position)
  console.log('email', email)

  db.addPlayer(name, password, position, email, function (error, callback) {
    res.send('true')
  })
}

function getChallenges (req, res) {
  db.getOutstandingChallenges(function (error, challenges) {
    res.send(JSON.stringify(challenges))
  })
}

function invite (req, res) {
  var invitation = JSON.parse(url.parse(req.url, true).query.invitation)
  email.sendInvitationEmails(invitation, function () {
    res.send('true')
  })
}

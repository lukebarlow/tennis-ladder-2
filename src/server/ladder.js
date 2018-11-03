var db = require('./getDb')()
const email = require('./email')
const url = require('url')

module.exports = {
  players: players,
  addPlayer: addPlayer,
  addSinglesMatch: addSinglesMatch,
  addDoublesMatch: addDoublesMatch,
  recentSinglesMatches: recentSinglesMatches,
  recentDoublesMatches: recentDoublesMatches
  // addChallenge: addChallenge,
  // getChallenges: getChallenges,
  // invite: invite
}

async function players (req, res) {
  // try {
  //   await db.checkForExpiredChallenges()
  // } catch (e) {
  //   console.warn('Error checking expired challenges')
  //   res.statusCode = 503
  //   res.send()
  //   return
  // }

  try {
    console.log('getting players')
    const players = await db.getPlayers()
    res.send(JSON.stringify(players))
  } catch (e) {
    console.warn('Error getting ladder')
    res.statusCode = 503
    res.send()
    throw e
  }
}

// adds a game, and returns the new ladder in order
async function addSinglesMatch (req, res) {
  var match = JSON.parse(url.parse(req.url, true).query.match)
  await db.addSinglesMatch(match)
  res.send('true')
}

async function addDoublesMatch (req, res) {
  var match = JSON.parse(url.parse(req.url, true).query.match)

  console.log('match is ', JSON.stringify(match, null, 2))

  await db.addDoublesMatch(match)
  res.send('true')
}

async function recentSinglesMatches (req, res) {
  try {
    const matches = await db.getRecentSinglesMatches()
    res.send(JSON.stringify(matches))
  } catch (e) {
    console.warn('Error trying to get recent matches')
    console.warn(e)
    res.statusCode = 503
    res.send()
  }
}

async function recentDoublesMatches (req, res) {
  try {
    const matches = await db.getRecentDoublesMatches()
    res.send(JSON.stringify(matches))
  } catch (e) {
    console.warn('Error trying to get recent matches')
    res.statusCode = 503
    res.send()
  }
}

// function addChallenge (req, res) {
//   var challenge = JSON.parse(url.parse(req.url, true).query.challenge)
//   db.addChallenge(challenge, function (error, callback) {
//     res.send('true')
//   })
// }

async function addPlayer (req, res) {
  var { name, password, position, email } = url.parse(req.url, true).query

  console.log('adding')
  console.log('ame', name)
  console.log('password', password)
  console.log('position', position)
  console.log('email', email)

  await db.addPlayer(name, password, position, email)
  res.send('true')
}

// function getChallenges (req, res) {
//   db.getOutstandingChallenges(function (error, challenges) {
//     res.send(JSON.stringify(challenges))
//   })
// }

// function invite (req, res) {
//   var invitation = JSON.parse(url.parse(req.url, true).query.invitation)
//   email.sendInvitationEmails(invitation, function () {
//     res.send('true')
//   })
// }

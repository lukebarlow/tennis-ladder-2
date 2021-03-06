var db = require('./getDb')()
const url = require('url')

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
  await db.addDoublesMatch(match)
  res.send('true')
}

async function singlesMatches (req, res) {
  try {
    const matches = await db.getSinglesMatches()
    res.send(JSON.stringify(matches))
  } catch (e) {
    console.warn('Error trying to get recent matches')
    console.warn(e)
    res.statusCode = 503
    res.send()
  }
}

async function doublesMatches (req, res) {
  try {
    const matches = await db.getDoublesMatches()
    res.send(JSON.stringify(matches))
  } catch (e) {
    console.warn('Error trying to get recent matches')
    res.statusCode = 503
    res.send()
  }
}

async function addSinglesChallenge (req, res) {
  var challenge = JSON.parse(url.parse(req.url, true).query.challenge)
  await db.addSinglesChallenge(challenge)
  res.send('true')
}

async function singlesChallenges (req, res) {
  const challenges = await db.getOutstandingSinglesChallenges()
  res.send(JSON.stringify(challenges || []))
}

// function invite (req, res) {
//   var invitation = JSON.parse(url.parse(req.url, true).query.invitation)
//   email.sendInvitationEmails(invitation, function () {
//     res.send('true')
//   })
// }

module.exports = {
  players,
  // addPlayer: addPlayer,
  addSinglesMatch,
  addDoublesMatch,
  singlesMatches,
  doublesMatches,
  addSinglesChallenge,
  singlesChallenges
  // invite: invite
}

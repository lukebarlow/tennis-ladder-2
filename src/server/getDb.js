const mongoist = require('mongoist')
const { mean } = require('d3-array')
const md5 = require('MD5')
const email = require('./email')
const salt = 'guacamole'

const eloScoring = require('./eloScoring')
const matchWinnerAndLoser = require('./matchWinnerAndLoser')

// the db layer object for tenn16

module.exports = (connectionString) => {
  if (!connectionString) {
    connectionString = require('./config').mongoDbName
  }

  const db = mongoist(connectionString, { useNewUrlParser: true })

  async function close () {
    return db.close()
  }

  // private fn. Fills in player info, adding the player if necessary
  async function getPlayer (player) {
    if ('_id' in player && typeof (player._id) !== 'object') {
      player._id = mongoist.ObjectId(player._id)
    }
    return db.player.findOne(player, { password: 0 })
  }

  // moves the player to the right position, and moves everyone below down
  // one place. The player argument should be a dictionary containing
  // a name or id key sufficient to uniquely identify the player
  async function moveToSinglesPosition (playerDetails, position) {
    // get current position
    const player = await db.player.findOne(playerDetails)

    // everything inbetween moves up or down one step
    // var move = position > player.ladderPosition ? +1 : -1

    if (position > player.ladderPosition) {
      await db.player.update(
        {
          ladderPosition: {
            $gt: player.ladderPosition,
            $lte: position
          }
        },
        { $inc: { ladderPosition: -1 } },
        { multi: true }
      )
    } else {
      await db.player.update(
        {
          ladderPosition: {
            $gte: position,
            $lt: player.ladderPosition
          }
        },
        { $inc: { ladderPosition: 1 } },
        { multi: true }
      )
    }

    // finally move the player to the right position
    await db.player.update(
      { _id: player._id },
      { $set: { ladderPosition: position } }
    )
  }

  async function addPlayer (name, password, position, email, otherDetails) {
    // check name is unique
    const existingPlayer = await db.player.findOne({ name: name })
    if (existingPlayer) {
      console.log('name already exists')
      return existingPlayer
    }

    let playerDetails = {
      name: name,
      password: hashPassword(password),
      ladderPosition: Infinity,
      singlesRating: 1200,
      doublesRating: 1200,
      settings: {
        email: email,
        emailMyChallenge: true,
        emailAnyChallenge: true,
        emailMyMatch: true,
        emailAnyMatch: true
      }
    }

    if (otherDetails) {
      playerDetails = Object.assign(playerDetails, otherDetails)
    }

    // now insert the player
    const result = await db.player.insert(playerDetails)
    await moveToSinglesPosition({ name: name }, position)
    return result
  }

  async function getSinglesMatchDetails (match) {
    var { winner, loser, wonBy } = matchWinnerAndLoser(match)
    if (!winner) {
      console.log('no clear winner, so no movement')
      return
    }

    const winnerDetails = await getPlayer({ _id: winner })
    const loserDetails = await getPlayer({ _id: loser })

    // update the singles ratings
    const { newRatingA, newRatingB, ratingsMoveBy } = eloScoring(
      winnerDetails.singlesRating, loserDetails.singlesRating, 1)

    return {
      winner: winnerDetails,
      loser: loserDetails,
      wonBy,
      winnerNewRating: newRatingA,
      loserNewRating: newRatingB,
      ratingsMoveBy
    }
  }

  /* adjust the ladder positions of players according to match results */
  async function adjustSinglesLadder (winner, loser, winnerNewRating, loserNewRating) {
    // var { winner, loser } = matchWinnerAndLoser(match)
    // // greater ladder position means lower down the ladder

    // if (!winner) {
    //   console.log('no clear winner, so no movement')
    //   return
    // }

    // const winnerDetails = await getPlayer({ _id: winner })
    // const loserDetails = await getPlayer({ _id: loser })

    // change the ladder position
    if (winner.ladderPosition > loser.ladderPosition) {
      await moveToSinglesPosition({ _id: winner._id }, loser.ladderPosition)
    }

    await db.player.update({ _id: winner._id },
      { $set: { singlesRating: winnerNewRating } })

    await db.player.update({ _id: loser._id },
      { $set: { singlesRating: loserNewRating } })
  }

  async function changeDoublesRating (_id, rankingDelta) {
    await db.player.update({ _id }, { $inc: { doublesRating: rankingDelta } })
  }

  async function getDoublesMatchDetails (match) {
    var { winner, loser, wonBy } = matchWinnerAndLoser(match)
    // greater ladder position means lower down the ladder

    if (!winner) {
      console.log('no clear winner, so no change to doubles scores')
      return
    }

    const winners = await Promise.all(winner.map((id) => getPlayer({ _id: id })))
    const losers = await Promise.all(loser.map((id) => getPlayer({ _id: id })))

    const winnersMeanRating = mean(winners, w => w.doublesRating)
    const losersMeanRating = mean(losers, l => l.doublesRating)

    const { ratingsMoveBy } = eloScoring(winnersMeanRating, losersMeanRating, 1)

    return { winners, losers, ratingsMoveBy, wonBy }
  }

  /*
    the doubles ladder is determined by the doublesScore for
    each player
  */
  async function adjustDoublesLadder (winners, losers, ratingsMoveBy) {
    for (let winner of winners) {
      // console.log('goint to change winner', winner._id)
      await changeDoublesRating(winner._id, ratingsMoveBy)
    }

    for (let loser of losers) {
      await changeDoublesRating(loser._id, -ratingsMoveBy)
    }
  }

  async function lastPlayed (playerId) {
    const result = await db.singlesMatch.aggregate([
      { $match: { $or: [{ 'sideA._id': playerId }, { 'sideB._id': playerId }] } },
      { $group: { _id: null, total: { $max: '$date' } } },
      { $sort: { total: -1 } }
    ])
    return result.length ? result[0].total : null
  }

  // gets the players, sorted by ladder position
  async function getPlayers () {
    const players = await db.player.findAsCursor({}, { password: 0 })
      .sort({ ladderPosition: 1 })
      .toArray()

    for (let player of players) {
      player.lastPlayed = await lastPlayed(player._id)
      player.daysSincePlayed = player.lastPlayed ? Math.round((new Date() - new Date(player.lastPlayed)) / (1000 * 60 * 60 * 24)) : null
    }

    return players
  }

  async function getRecentSinglesMatches () {
    return db.singlesMatch.findAsCursor().sort({ date: -1 }).limit(50).toArray()
  }

  async function getRecentDoublesMatches () {
    return db.doublesMatch.findAsCursor().sort({ date: -1 }).limit(50).toArray()
  }

  const firstIfArray = (a) => Array.isArray(a) ? a[0] : a

  // the format of score is an array of two element arrays. For example
  // a scoreline of 6-4 3-6 2-6 would be [[6,4],[3-6],[2-6]]
  // the sideA and sideB parameters can be names or ids. Date is
  // optional and will default to now
  // we store an entire copy of the player object each time. This gives
  // us a record of the ladder positions of each player as they went
  // into the match. May result in bloat - we will see
  async function addSinglesMatch (match) {
    match.date = match.date || Date.now()

    match.sideA = mongoist.ObjectId(firstIfArray(match.sideA))
    match.sideB = mongoist.ObjectId(firstIfArray(match.sideB))
    match.recordedBy = mongoist.ObjectId(match.recordedBy)

    const {
      winner,
      loser,
      wonBy,
      ratingsMoveBy,
      winnerNewRating,
      loserNewRating
    } = await getSinglesMatchDetails(match)

    match.wonBy = wonBy
    match.ratingsMoveBy = ratingsMoveBy

    await db.singlesMatch.insert(match)

    // resolve any matching challenges
    // await resolveChallengesBetween(a._id, b._id)

    await adjustSinglesLadder(winner, loser, winnerNewRating, loserNewRating)

    // TODO. maybe return the function before sending emails
    const players = await getPlayers()
    email.sendEmailsAboutMatch(players, match)
  }

  async function addDoublesMatch (match) {
    match.date = match.date || Date.now()

    match.sideA = match.sideA.map((id) => mongoist.ObjectId(id))
    match.sideB = match.sideB.map((id) => mongoist.ObjectId(id))

    match.recordedBy = mongoist.ObjectId(match.recordedBy)

    const { winners, losers, ratingsMoveBy, wonBy } = await getDoublesMatchDetails(match)

    match.ratingsMoveBy = ratingsMoveBy
    match.wonBy = wonBy

    await db.doublesMatch.insert(match)

    // // resolve any matching challenges
    // // await resolveChallengesBetween(a._id, b._id)

    if (winners && losers) {
      await adjustDoublesLadder(winners, losers, ratingsMoveBy)
    }

    // TODO. maybe return the function before sending emails

    const players = await getPlayers()
    email.sendEmailsAboutMatch(players, match)
  }

  function hashPassword (password) {
    return md5(password + salt)
  }

  // returns user id if successful, otherwise false
  async function authenticate (name, password) {
    const result = await db.player.find({ name: name, password: hashPassword(password) })
    return result.length > 0 ? result[0]._id.toString() : false
  }

  async function changePassword (userId, oldPassword, newPassword) {
    // first we check the auth
    userId = mongoist.ObjectId(userId)
    var check = { _id: userId, password: hashPassword(oldPassword) }
    const result = await db.player.findOne(check) //, function (error, result) {
    if (!result) {
      console.log('incorrect attempt to change password')
      return false
    }

    // if auth checks out, then reset the password
    await db.player.update(
      { _id: userId },
      { $set: { password: hashPassword(newPassword) } }
    )
    return true
  }

  async function setPassword (name, password) {
    return db.player.update({ name: name }, { $set: { password: hashPassword(password) } })
  }

  // function getSettings (userId, callback) {
  //   userId = mongoist.ObjectId(userId)
  //   db.player.find({ _id: userId }, function (error, result) {
  //     callback(null, result && result[0] && result[0].settings || {})
  //   })
  // }

  async function saveSettings (userId, settings) {
    userId = mongoist.ObjectId(userId)
    return db.player.update({ _id: userId },
      { $set: { settings: settings }
      })
  }

  function dropDatabase () {
    db.dropDatabase()
  }

  return {
    getPlayer,
    getPlayers,
    addPlayer,
    moveToSinglesPosition,
    addSinglesMatch,
    addDoublesMatch,
    setPassword,
    authenticate,
    getRecentSinglesMatches,
    getRecentDoublesMatches,
    changePassword,
    saveSettings,
    // getSettings,
    // checkForExpiredChallenges,
    // addChallenge,
    // getOutstandingChallenges,
    dropDatabase,
    close
  }
}

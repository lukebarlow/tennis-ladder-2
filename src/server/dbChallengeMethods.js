// doesn't write anything to the database, but looks up names from ids
// in the database
// function invite (invitation, callback) {
//   invitation.inviter = mongoist.ObjectId(invitation.inviter)
//   invitation.invited = mongoist.ObjectId(invitation.invited)
// }

// check the database if any challenges have expired, and if they are then
// create the forfeit match
// async function checkForExpiredChallenges () {
//   // check for any challenge over 28 days which is not resolved
//   var expiryPeriod = 1000 * 60 * 60 * 24 * 28
//   const expiredChallenges = await db.challenge.find({
//     'date': { '$lt': Date.now() - expiryPeriod },
//     'resolved': false
//   })

//   console.log('challenges', expiredChallenges)

//   for (let challenge of expiredChallenges) {
//     var match = {
//       playerA: challenge.challenger,
//       playerB: challenge.challenged,
//       date: challenge.date + expiryPeriod,
//       score: [ [ 1, 0 ] ]
//     }
//     await addMatch(match)
//   }
//   // async.eachSeries(expiredChallenges, function (challenge, cb) {
//   //   // for each expired challenge, record a 1-0 match with cahllenger winning
//   //   console.log('adding match')
//   //   console.log(match)
//   //   addMatch(match, cb)
// }


// function resolveChallengesBetween (idA, idB, callback) {
//   findChallengesBetween(idA, idB, function (error, result) {
//     if (result.length == 0) {
//       callback(error, result)
//     } else {
//       var i = 0
//       function resolveNext () {
//         var id = result[i]._id
//         db.challenge.update({ _id: id }, { $set: { resolved: true } }, function () {
//           i++
//           if (i < result.length) {
//             resolveNext()
//           } else {
//             callback(error, result)
//           }
//         })
//       }
//       resolveNext()
//     }
//   })
// }

// looks for any challenge between players with ids a and b
// function findChallengesBetween (idA, idB, callback) {
//   db.challenge.find({ $or:
//     [
//       {
//         challenger: idA,
//         challenged: idB,
//         resolved: false
//       },
//       {
//         challenger: idB,
//         challenged: idA,
//         resolved: false
//       }
//     ]
//   }, callback)
// }

// function addChallenge (challenge, callback) {
//   challenge.challenger = mongoist.ObjectId(challenge.challenger)
//   challenge.challenged = mongoist.ObjectId(challenge.challenged)
//   // if an unresolved challenge exists between these two, then we do nothing
//   findChallengesBetween(challenge.challenger, challenge.challenged,
//     function (error, result) {
//       if (result.length == 0) {
//         challenge.date = challenge.date || Date.now()
//         challenge.resolved = false
//         db.challenge.insert(challenge, callback)

//         email.sendEmailsAboutChallenge(challenge.challenger, challenge.challenged)
//       } else {
//         callback(null, {})
//       }
//     })
// }

// function getOutstandingChallenges (callback) {
//   db.challenge.find({ resolved: false }, callback)
// }
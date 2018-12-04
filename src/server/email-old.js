// var nodemailer = require('nodemailer')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

var config = require('./config')

// var transport

// lazy building of the transport object
// function getTransport () {
//   if (!transport) {
//     transport = nodemailer.createTransport('SMTP', {
//       service: 'Gmail',
//       auth: {
//         user: config.email.user,
//         pass: config.email.password
//       }
//     })
//   }
//   return transport
// }

// function closeTransport () {
//   if (transport) transport.close()
//   transport = null
// }

// figures out which players need an email about a new challenge, and sends
// that email. Challenger and challenged arguments should be ObjectIds of
// the players involved in the challenge
// function sendEmailsAboutChallenge (challengerId, challengedId, callback) {
//   var db = require('./getDb')

//   db.getPlayers(function (error, players) {
//     var challenger, challenged
//     players.forEach(function (player) {
//       if (player._id.equals(challengerId)) {
//         challenger = player
//       }
//       if (player._id.equals(challengedId)) {
//         challenged = player
//       }
//     })

//     var emailsSent = 0

//     var callbacksCounted = 0

//     players.forEach(function (player, i) {
//       player.settings = player.settings || {}
//       // player gets an email if they're involved in the challenge and
//       // have 'emailMyChallenge' preference, or they have 'emailAnyChallenge'

//       var isChallenger = player._id.equals(challengerId)

//       var isChallenged = player._id.equals(challengedId)

//       var isParticipant = isChallenger || isChallenged
//       replyTo = null

//       if ((player.settings.emailMyChallenge && isParticipant) || player.settings.emailAnyChallenge) {
//         emailsSent++
//         sendChallenge(player, challenger, challenged, isParticipant, function () {
//           callbacksCounted++
//           if (callbacksCounted >= emailsSent) {
//             console.log('all emails sent')
//             closeTransport()
//             if (callback) callback()
//           };
//         })
//       }
//     })
//   })
// }

// function sendInvitationEmails (invitation, callback) {
//   var db = require('./getDb')

//   db.getPlayer({ _id: invitation.inviter }, function (error, inviter) {
//     db.getPlayer({ _id: invitation.invited }, function (error, invited) {
//       var sent = 0
//       function sentHandler (error, result) {
//         if (error) {
//           console.log('EMAIL ERROR!')
//           console.log(error)
//         }
//         sent++
//         if (sent >= 2 && callback) {
//           callback()
//         }
//       }

//       // the email to the invited
//       var emailDetails = {
//         from: config.email.user,
//         to: invited.settings.email,
//         replyTo: inviter.settings.email,
//         subject: config.siteName + ' : ' + inviter.name + ' has invited you to play',
//         text: ' ',
//         html: invitationBody(invited, inviter)
//       }

//       getTransport().sendMail(emailDetails, sentHandler)

//       // email to the inviter
//       var emailDetails = {
//         from: config.email.user,
//         to: inviter.settings.email,
//         replyTo: invited.settings.email,
//         subject: config.siteName + ' : You have invited ' + invited.name + ' to play',
//         text: ' ',
//         html: invitationBody(inviter, invited)
//       }

//       getTransport().sendMail(emailDetails, sentHandler)
//     })
//   })
// }

async function sendEmailsAboutMatch (players, match) {
  // var db = require('./getDb')
  // db.getPlayers(function (error, players) {

  // var emailsSent = 0
  // var callbacksCounted = 0

  const playersToSendTo = players.filter((player) => (
    player.settings.emailAnyMatch ||
    (player.settings.emailMyMatch && (player._id.equals(match.playerA._id) || player._id.equals(match.playerB._id)))
  ))

  console.log('sending all the emails')

  await Promise.all(playersToSendTo.map((player) => (
    sendMatchReport(player, match)
  )))

  console.log('all the emails sent')

  // players.forEach(function (player) {
  //   console.log('sending email to player', player)

  //   player.settings = player.settings || {}
  //   // player gets an email if they're involved in the challenge and
  //   // have 'emailMyChallenge' preference, or they have 'emailAnyChallenge'
  //   if ((player.settings.emailMyMatch && (player._id.equals(match.playerA._id) || player._id.equals(match.playerB._id))) ||
  //       player.settings.emailAnyMatch) {
  //     emailsSent++

  // await 
  // callbacksCounted++
  //   }
  // })
  // })
}

// // challenger and challenged are names Player is the whole dict of the player
// // we want to send the email to
// function sendChallenge (player, challenger, challenged, isParticipant, callback) {
//   if (!player.settings.email) {
//     console.log('No email address, so cannot send challenge to ' + player.name)
//     console.log(player)
//     if (callback) callback('No email')
//     return
//   }

//   var replyTo

//   var isChallenger = player._id == challenger._id

//   // if you're in the game, then the reply to will reply to the opponent
//   if (isParticipant) {
//     replyTo = isChallenger ? challenged.settings.email : challenger.settings.email
//   }

//   console.log('sending an email to ' + player.name + '(' + player.settings.email + ')')
//   console.log(challenger.name + ' challenged ' + challenged.name)

//   var emailDetails = {
//     from: config.email.user,
//     to: player.settings.email,
//     subject: config.siteName + ' : ' + challenger.name + ' challenged ' + challenged.name,
//     text: ' ',
//     html: isParticipant
//       ? challengeEmailBody(isChallenger ? challenged : challenger, replyTo)
//       : body()
//   }

//   if (replyTo) emailDetails.replyTo = replyTo

//   getTransport().sendMail(emailDetails, function (error, result) {
//     if (error) {
//       console.log('EMAIL ERROR!')
//       console.log(error)
//     } else {
//       console.log('email result', result)
//       if (callback) callback()
//     }
//   })
// }

// function invitationBody (me, opponent) {
//   html = '<br /><b>' + me.name + '</b><br />'
//   html += contactDetailsHtml(me)
//   html += '<br /><b>' + opponent.name + '</b><br />'
//   html += contactDetailsHtml(opponent)
//   html += '<br><br>'
//   html += 'Hit reply to email ' + opponent.name
//   return html
// }

// function challengeEmailBody (opponent, includeReplyMessage) {
//   var html = '<html><body><a href="http://' + config.domainName + '">' + config.domainName + '</a><br />'
//   html += '<br /><b>' + opponent.name + '</b><br />'
//   html += contactDetailsHtml(opponent)
//   if (includeReplyMessage) html += '<br ><br />Hit reply to email ' + opponent.name + '.'
//   html += '</body></html>'
//   return html
// }

// function contactDetailsHtml (player) {
//   var html = ''
//   if (player.settings.email) {
//     html += 'email : ' + player.settings.email + '<br />'
//   }
//   if (player.settings.phoneNumber) {
//     html += 'phone number : ' + player.settings.phoneNumber + '<br />'
//   }
//   return html
// }

// converts a match to a string
function matchString (match) {
  var score = match.score.map(function (match) { return match[0] + '-' + match[1] }).join(', ')
  return match.playerA.name + ' v ' + match.playerB.name + ' : ' + score
}

async function sendMatchReport (player, match) {
  if (!player.settings.email) {
    console.log('No email address, so cannot send match report to ' + player.name)
    console.log(player)
  }

  console.log('sending a match report to ' + player.name)
  console.log(match)

  var emailDetails = {
    from: config.email.sender,
    to: player.settings.email,
    subject: config.siteName + ' : ' + matchString(match),
    text: ' ',
    html: body()
  }

  await sgMail.send(emailDetails)

  // getTransport().sendMail(emailDetails)
}

// just for testing the SMTP is all working
// function sendTestEmail (to, subject, message) {
//   var emailDetails = {
//     from: config.email.user,
//     to: to,
//     subject: subject || 'test email from tenn16.co.uk',
//     text: message || 'test'
//   }
//   getTransport().sendMail(emailDetails, function (error, result) {
//     console.log('----- error ------')
//     console.log(error)
//     console.log('------result ------')
//     console.log(result)
//   })
// }

function body () {
  return '<html><body><a href="http://' + config.domainName + '">' + config.domainName + '</a></body></html>'
}

module.exports = {
  // sendEmailsAboutChallenge: sendEmailsAboutChallenge,
  sendEmailsAboutMatch: sendEmailsAboutMatch
  // sendInvitationEmails: sendInvitationEmails
}

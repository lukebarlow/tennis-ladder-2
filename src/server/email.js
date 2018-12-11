const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

var config = require('./config')

async function sendEmailsAboutMatch (players, match) {
  const playersToSendTo = players.filter((player) => (
    player.settings.emailAnyMatch ||
    (player.settings.emailMyMatch && (player._id.equals(match.playerA._id) || player._id.equals(match.playerB._id)))
  ))
  await Promise.all(playersToSendTo.map((player) => (
    sendMatchReport(player, match, players)
  )))
}

function playerName (id, players) {
  const player = players.find((player) => player._id.toString() === id.toString())
  return player ? player.name : '[missing player!]'
}

function sideName (side, players) {
  if (!Array.isArray(side)) {
    side = [ side ]
  }
  return side.map((id) => playerName(id, players)).join(' and ')
}

// converts a match to a string
function matchString (match, players) {
  var score = match.score.map(function (match) { return match[0] + '-' + match[1] }).join(', ')
  return sideName(match.sideA, players) + ' v ' + sideName(match.sideB, players) + ' : ' + score
}

async function sendMatchReport (player, match, players) {
  if (!player.settings.email) {
    console.log('No email address, so cannot send match report to ' + player.name)
    console.log(player)
  }

  var emailDetails = {
    from: config.email.sender,
    to: player.settings.email,
    subject: config.siteName + ' : ' + matchString(match, players),
    text: ' ',
    html: body()
  }

  try {
    await sgMail.send(emailDetails)
  } catch (e) {
    console.log('failed to send email', e)
  }
}

function body () {
  return '<html><body><a href="http://' + config.domainName + '">' + config.domainName + '</a></body></html>'
}

// figures out which players need an email about a new challenge, and sends
// that email. Challenger and challenged arguments should be ObjectIds of
// the players involved in the challenge
async function sendEmailsAboutChallenge (challenger, challenged, players) {
  // const otherPlayers = players.filter((p) => p._id !== challenger._id && p._id !== challenged._id)
  // var emailsSent = 0
  // var callbacksCounted = 0

  players.forEach(async function (player, i) {
    player.settings = player.settings || {}
    // player gets an email if they're involved in the challenge and
    // have 'emailMyChallenge' preference, or they have 'emailAnyChallenge'
    var isChallenger = player._id.equals(challenger._id)
    var isChallenged = player._id.equals(challenged._id)
    var isParticipant = isChallenger || isChallenged

    if ((player.settings.emailMyChallenge && isParticipant) || player.settings.emailAnyChallenge) {
      await sendChallenge(player, challenger, challenged, isParticipant)
    }
  })
}

async function sendChallenge (player, challenger, challenged, isParticipant) {
  if (!player.settings.email) {
    console.log('No email address, so cannot send challenge to ' + player.name)
    return
  }

  var replyTo
  var isChallenger = player._id.equals(challenger._id)

  // if you're in the game, then the reply to will reply to the opponent
  if (isParticipant) {
    replyTo = isChallenger ? challenged.settings.email : challenger.settings.email
  }

  console.log('sending an email to ' + player.name + '(' + player.settings.email + ')')
  console.log(challenger.name + ' challenged ' + challenged.name)

  var emailDetails = {
    from: config.email.sender,
    to: player.settings.email,
    subject: config.siteName + ' : ' + challenger.name + ' challenged ' + challenged.name,
    text: ' ',
    html: isParticipant
      ? challengeEmailBody(isChallenger ? challenged : challenger, replyTo)
      : body()
  }

  if (replyTo) emailDetails.reply_to = replyTo

  try {
    await sgMail.send(emailDetails)
  } catch (e) {
    console.log('failed to send challenge email', e)
  }
}

function challengeEmailBody (opponent, includeReplyMessage) {
  var html = '<html><body><a href="http://' + config.domainName + '">' + config.domainName + '</a><br />'
  html += '<br /><b>' + opponent.name + '</b><br />'
  html += contactDetailsHtml(opponent)
  if (includeReplyMessage) html += '<br ><br />Hit reply to email ' + opponent.name + '.'
  html += '</body></html>'
  return html
}

function contactDetailsHtml (player) {
  var html = ''
  if (player.settings.email) {
    html += 'email : ' + player.settings.email + '<br />'
  }
  if (player.settings.phoneNumber) {
    html += 'phone number : ' + player.settings.phoneNumber + '<br />'
  }
  return html
}

module.exports = {
  sendEmailsAboutChallenge: sendEmailsAboutChallenge,
  sendEmailsAboutMatch: sendEmailsAboutMatch
  // sendInvitationEmails: sendInvitationEmails
}

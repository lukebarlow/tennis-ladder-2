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
    // console.log('failed to send email', emailDetails.subject)
  }
}

function body () {
  return '<html><body><a href="http://' + config.domainName + '">' + config.domainName + '</a></body></html>'
}

module.exports = {
  // sendEmailsAboutChallenge: sendEmailsAboutChallenge,
  sendEmailsAboutMatch: sendEmailsAboutMatch
  // sendInvitationEmails: sendInvitationEmails
}

const db = require('./db')
const email = require('./email')
const url = require('url')

module.exports = {
  ladder : ladder,
  addMatch : addMatch,
  addPlayer : addPlayer,
  recentMatches : recentMatches,
  addChallenge : addChallenge,
  getChallenges : getChallenges,
  invite : invite
}

//
function ladder(req, res){
  db.checkForExpiredChallenges(function(){
    db.getPlayers(function(error, players){
      res.send(JSON.stringify(players));
    })
  })
}

// adds a game, and returns the new ladder in order
function addMatch(req, res){
  var match = JSON.parse(url.parse(req.url,true).query.match)
  db.addMatch(match, function(error, callback){
    ladder(req, res)
  })
}

function recentMatches(req, res){
  db.getRecentMatches(function(error, matches){
    res.send(JSON.stringify(matches));
  })
}

function addChallenge(req, res){
  var challenge = JSON.parse(url.parse(req.url,true).query.challenge)
  db.addChallenge(challenge, function(error, callback){
    res.send('true')
  })
}

function addPlayer(req, res) {
  var { name, password, position, email } = url.parse(req.url,true).query
  
  console.log('adding')
  console.log('ame', name)
  console.log('password', password)
  console.log('position', position)
  console.log('email', email)

  db.addPlayer(name, password, position, email, function(error, callback){
    res.send('true')
  })
}

function getChallenges(req, res){
  db.getOutstandingChallenges(function(error, challenges){
    res.send(JSON.stringify(challenges))
  })
}

function invite(req, res){
  var invitation = JSON.parse(url.parse(req.url,true).query.invitation);
  email.sendInvitationEmails(invitation, function(){
    res.send('true');
  })
}
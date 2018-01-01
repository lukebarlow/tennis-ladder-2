const dbUrl = require('./config').mongoDbName
const collections = ['player','match','challenge']
const db = require('mongojs')(dbUrl, collections)
const async = require('async')
const md5 = require('MD5')
const email = require('./email')
const salt = 'guacamole'

// the db layer object for tenn16
module.exports = {
  getPlayer : getPlayer,
  getPlayers : getPlayers,
  addPlayer : addPlayer,
  moveToPosition : moveToPosition,
  addMatch : addMatch,
  setPassword : setPassword,
  authenticate : authenticate,
  getRecentMatches : getRecentMatches,
  addChallenge : addChallenge,
  getOutstandingChallenges : getOutstandingChallenges,
  changePassword : changePassword,
  saveSettings : saveSettings,
  getSettings : getSettings,
  checkForExpiredChallenges : checkForExpiredChallenges
}


// private fn. Fills in player info, adding the player if necessary
function getPlayer(player, callback){

  console.log('......')
  console.log(player)
  console.log(typeof(player))
  console.log(typeof(player._id))

  if ('_id' in player && typeof(player._id) != 'object'){
    player._id = db.ObjectId(player._id)
  }

  db.player.find(player, {password:0}, function(err,result){
    if (callback) callback(null, result[0])
  })
}

// moves the player to the right position, and moves everyone below down
// one place. The player argument should be a dictionary containing
// a name or id key sufficient to uniquely identify the player
function moveToPosition(playerDetails, position, callback){
  // get current position
  db.player.find(playerDetails, function(err, players){
    // everything inbetween moves up or down one step
    var player = players[0];
    var move = position > player.ladderPosition ? +1 : -1;

    if (position > player.ladderPosition){
      db.player.update(
        {
          ladderPosition :{
            $gt : player.ladderPosition,
            $lte : position
          }
        },
        {$inc : {ladderPosition : -1}},
        {multi : true},
        afterBulkMove
      )
    }else{
      db.player.update(
        {
          ladderPosition :{
            $gte : position,
            $lt : player.ladderPosition
          }
        },
        {$inc : {ladderPosition : 1}},
        {multi : true},
        afterBulkMove
      )
    }

    function afterBulkMove(err, result){
      // finally move the player to the right position
      db.player.update(
        {_id : player._id}, 
        {$set : {ladderPosition : position}}, 
        callback)
    }

  })
}

function addPlayer(name, password, position, email, callback){
  // check name is unique
  db.player.find({name : name}, function(err, result){
    if (result.length){
      console.log('name already exists');
      if (callback) callback('name already exists');
      return;
    }

    // now insert the player
    db.player.insert(
      {
        name : name, 
        password : hashPassword(password), 
        ladderPosition : Infinity,
        settings : {
          email : email,
          emailMyChallenge : true,
          emailAnyChallenge : true,
          emailMyMatch : true,
          emailAnyMatch : true
        }
      },
       function(){
        // then set the position
        moveToPosition({name : name}, position, callback)
      }
    )
  })
}

// returns player who won the match (returns a full dictionary).
// For now, the rules are just that the winner for the sake of 
// the ladder is the winner of the first set
function winnerAndLoser(match){
  var firstSet = match.score[0];
  return parseInt(firstSet[0]) > parseInt(firstSet[1]) ? 
    { winner : match.playerA, loser : match.playerB }
  :   { winner : match.playerB, loser : match.playerA }
}

// adjust the ladder positions of players according to match results
function adjustLadder(match, callback){
  var result = winnerAndLoser(match)
  // greater ladder position means lower down the ladder
  if (result.winner.ladderPosition > result.loser.ladderPosition){
    moveToPosition(result.winner, result.loser.ladderPosition, callback);
  }else{
    callback()
  }
}

function lastPlayed(playerId, callback){
  db.match.aggregate([
           { $match: { $or : [{"playerA._id" : playerId}, {"playerB._id" : playerId}]} },
           { $group: { _id: null, total: { $max: "$date" } } },
           { $sort: { total: -1 } }
           ], function(error, result){
            callback(result.length ? result[0].total : null)
           })
}


// gets the players, sorted by ladder position
function getPlayers(callback){
  db.player.find({},{password:0}).sort({ladderPosition:1}, function(error, players){
    async.each(players, function(player, cb){
      lastPlayed(player._id, function(_lastPlayed){
        player.lastPlayed = _lastPlayed;
        player.daysSincePlayed = _lastPlayed ? Math.round((new Date() - new Date(_lastPlayed)) / (1000 * 60 * 60 * 24)) : null
        cb();
      })
    }, function(){
      callback(error, players)
    })
  });
}


function getRecentMatches(callback){
  db.match.find().sort({date:-1}).limit(50, callback)
}

// the format of score is an array of two element arrays. For example
// a scoreline of 6-4 3-6 2-6 would be [[6,4],[3-6],[2-6]]
// the playerA and playerB parameters can be names or ids. Date is
// optional and will default to now
// we store an entire copy of the player object each time. This gives
// us a record of the ladder positions of each player as they went
// into the match. May result in bloat - we will see
function addMatch(match, callback){
  match.date = match.date || Date.now();
  getPlayer({_id : match.playerA}, function(error, a){
    getPlayer({_id : match.playerB}, function(error, b){
      match.playerA = a;
      match.playerB = b;
      match.recordedBy = new db.ObjectId(match.recordedBy);
      db.match.insert(match, function(err, result){
        // resolve any matching challenges
        resolveChallengesBetween(a._id, b._id, function(error, result){
          adjustLadder(match, callback);
        })
        email.sendEmailsAboutMatch(match)
      })
    })
  })
}

function hashPassword(password){
  return md5(password + salt)
}

// returns user id if successful, otherwise false
function authenticate(name, password, callback){
  var check = {name : name, password : hashPassword(password)}
  db.player.find(check, function(error, result){
    callback(null, result.length > 0 ? result[0]._id.toString() : false);
  })
}

function changePassword(userId, oldPassword, newPassword, callback){
  // first we check the auth
  userId = db.ObjectId(userId)
  var check = {_id : userId, password : hashPassword(oldPassword)}
  db.player.find(check, function(error, result){
    if (!result.length){
      callback(null, false)
      return;
    }

    // if auth checks out, then reset the password
    db.player.update({_id : userId}, 
      {$set : {password : hashPassword(newPassword)}}, 
      function(error, result){
      callback(null, true)
    })
  })
}

function setPassword(name, password){
  db.player.update({name : name}, {$set : {password : hashPassword(password)}})
}

function resolveChallengesBetween(idA, idB, callback){
  findChallengesBetween(idA, idB, function(error, result){
    if (result.length == 0){
      callback(error, result)
    }else{
      var i = 0;
      function resolveNext(){
        var id = result[i]._id
        db.challenge.update({_id : id}, {$set : {resolved : true}}, function(){
          i++;
          if (i < result.length){
            resolveNext()
          }else{
            callback(error, result)
          }
        })
      }
      resolveNext();
    }
  })
}

// looks for any challenge between players with ids a and b
function findChallengesBetween(idA, idB, callback){
  db.challenge.find( {$or :
    [
      { 
        challenger : idA,
        challenged : idB,
        resolved : false
      },
      { 
        challenger : idB,
        challenged : idA,
        resolved : false
      },
    ]
  }, callback );
}

function addChallenge(challenge, callback){
  challenge.challenger = db.ObjectId(challenge.challenger);
  challenge.challenged = db.ObjectId(challenge.challenged);
  // if an unresolved challenge exists between these two, then we do nothing
  findChallengesBetween(challenge.challenger, challenge.challenged,
    function(error, result){
      if (result.length == 0){
        challenge.date = challenge.date || Date.now();
        challenge.resolved = false;
        db.challenge.insert(challenge, callback)

        email.sendEmailsAboutChallenge(challenge.challenger, challenge.challenged)

      }else{
        callback(null, {})
      }
    })
}

function getOutstandingChallenges(callback){
  db.challenge.find({resolved : false}, callback)
}

function getSettings(userId, callback){
  userId = db.ObjectId(userId);
  db.player.find({_id : userId}, function(error, result){
    callback(null, result && result[0] && result[0].settings || {})
  })
}

function saveSettings(userId, settings, callback){
  userId = db.ObjectId(userId);
  db.player.update({_id : userId},
    { $set : {settings : settings}
  }, callback)
}

// doesn't write anything to the database, but looks up names from ids
// in the database
function invite(invitation, callback){
  invitation.inviter = db.ObjectId(invitation.inviter);
  invitation.invited = db.ObjectId(invitation.invited);
}

// check the database if any challenges have expired, and if they are then
// create the forfeit match
function checkForExpiredChallenges(callback){
  // check for any challenge over 28 days which is not resolved
  var expiryPeriod = 1000 * 60 * 60 * 24 * 28;
  db.challenge.find(
    {
      "date" : {"$lt" : Date.now() - expiryPeriod}, 
      "resolved" : false
    }, function(error, expiredChallenges){
      async.eachSeries(expiredChallenges, function(challenge, cb){
        // for each expired challenge, record a 1-0 match with cahllenger winning
        var match = {
          playerA : challenge.challenger,
          playerB : challenge.challenged,
          date : challenge.date + expiryPeriod,
          score : [  [  1,  0 ] ]
        }
        console.log('adding match')
        console.log(match)
        addMatch(match, cb);
      },callback)

    });

}

// compilation of methods for leaderboard project

Meteor.methods({
  'sendLogMessage': function(){
    console.log(Meteor.user() + Meteor.userId())
  },

  'insertPlayerData': function(playerNameVar, playerScore){
    if (playerNameVar) {  // only run if string is NOT empty
      if (isNaN(playerScore)) {playerScore = 0}  // change score to 0 if no score was set
      var currentUserID = Meteor.userId();
      PlayersList.insert({
        name: playerNameVar,
        score: playerScore,
        createdBy: currentUserID
      })
    }
  },

  'removePlayerData': function(selectedPlayer) {
    var currentUserID = Meteor.userId();
    PlayersList.remove({_id: selectedPlayer, createdBy: currentUserID});
  },

  'modPlayerScore': function(selectedPlayer, newScore) {
    var currentUserID=Meteor.userId();
    PlayersList.update({_id: selectedPlayer, createdBy: currentUserID}, {$inc: {score: newScore}});
  }

})

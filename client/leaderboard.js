

  Meteor.subscribe('thePlayers');  // see alo Meteor.publish for making data available to client

  Template.leaderboard.helpers({
    'player': function(){
      //var currentUserID = Meteor.user();
      return PlayersList.find({}, {sort: {score: -1, name: 1}}); // make available PlayersList to template
      // the first curly braces are the first argument, saying to return all data
      //
      // note that sort does not require $ as for $set and $inc operators
    },

    'stuff': function(){
      return "just making sure this works";
    },

    'totalPlayers': function(){ // returns the number of players stored in the collection
      return PlayersList.find().count();
    },

    'selectedClass': function(){  // applies yellow background for selected items
      // compares current selectedID with PlayerID to determine whether to apply a special class

      var playerID = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if(playerID == selectedPlayer){
        return "selected";
      }
    },

    'showSelectedPlayer': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne(selectedPlayer);
    }
  });

  Template.leaderboard.events({
    'click .player': function(){
      var playerID = this._id;  // 'this' works by selecting the last DOM touched
        // interestingly, this would return any other property saved into Mongo,
        // since Meteor effectively attaches all these properties here. e.g. this.score works
      Session.set('selectedPlayer', playerID); // save playerID into the current session cache
        // it's an useful way of keeping track of what has been selected

    },

    'click .increment': function(){
      // similar to jQuery's $(.increment).click(function(){...})

      var selectedPlayer = Session.get('selectedPlayer');
      // PlayersList.update(selectedPlayer, {$set: {score: 10}});
      //   // this Mongo update function requires $set, otherwise it will delete the other fields
      // PlayersList.update(selectedPlayer, {$inc: {score: 5} });
        // the $inc operator adds to the existing field

      Meteor.call('modPlayerScore', selectedPlayer, 5);
    },

    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      //PlayersList.update(selectedPlayer, {$inc: {score: -5}});
      Meteor.call('modPlayerScore', selectedPlayer, -5);
    },

    'click .delete': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      var confirm = window.confirm("Are you sure you want to remove " + PlayersList.findOne(selectedPlayer).name + " ?");
      if(confirm){
        Meteor.call('removePlayerData',selectedPlayer);
      }
    }


  });

  Template.addPlayerForm.events({
    'submit form': function(event){
      event.preventDefault();
        // prevents default form behaviour, namely webpage refresh

      var playerNameVar = event.target.newPlayerName.value;
      var playerScore = parseInt(event.target.newScore.value); // needs conversion into an integer otherwise throws error
        // obtains the value inside the form

      Meteor.call('insertPlayerData', playerNameVar, playerScore);

      // Resetting the form
      event.target.newPlayerName.value = ""; // resets form to blank
      event.target.newScore.value = "";

    }
  });

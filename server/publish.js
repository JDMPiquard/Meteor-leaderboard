// Make database available to users with the correct credentials

Meteor.publish("thePlayers", function(){

  var currentUserID = this.userId;
  return(PlayersList.find({createdBy: currentUserID}));
});

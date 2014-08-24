Meteor.publish('files',
  function (clientId) {

//    if (this.userId() && this.userId() === clientId) {
        var user = Meteor.users.findOne({_id: clientId});
      if (user) {
          return Files.find({
              $or: [
                  {
                      'metadata.owner': user.username
                  },
                  {
                      'metadata.access' : 'public'
                  }
              ]
          });
      } else {
          return null;
      }

//    } else {        // Prevent client race condition:
//      return null;  // This is triggered when publish is rerun with a new
//      // userId before client has resubscribed with that userId
//    }
  }
);

//Meteor.publish('allFiles', function(){
//    return Files.find();
//})
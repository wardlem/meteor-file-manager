Meteor.publish('users', function(){
  Meteor.users.find({})
});
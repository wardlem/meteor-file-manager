Template['header'].helpers({
  loggedIn: function(){
    return Meteor.user() !== null;
  }
});

Template['header'].events({
  "click #logout": function(){
    Meteor.logout(function(){
      Router.go('login')
    });

  }
});


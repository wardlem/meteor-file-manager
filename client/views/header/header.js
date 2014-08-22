Template['header'].helpers({
  loggedIn: function(){
    return Meteor.user() !== null;
  },
  notCurrentCrumb: function(crumb){
      return crumb.active !== 'active';
  }
});

Template['header'].events({
  "click #logout": function(){
    Meteor.logout(function(){
      Router.go('login')
    });

  }
});


Meteor.publish('directory', function () {
    //if (Accounts.userId){
      var user = Users.findOne({_id: this.userId});
        var userName = user.username;
        return Directory.find({
            $or : [
//                {path: {$regex: 'shared*'}},
                {owner: {$in: [userName, 'Shared']}}
            ]
        });
//    }
//    else {
//        return null;
//    }

});



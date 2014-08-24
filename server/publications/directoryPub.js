Meteor.publish('directory', function () {
    if (this.userId){

        var user = Users.findOne({_id: this.userId});
        var userName = user.username;
        return Directories.find({

            owner: {$in: [userName, 'Shared']}

        });
    }
    else {
        return null;
    }

});



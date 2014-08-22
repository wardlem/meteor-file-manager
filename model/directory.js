Directory = new Meteor.Collection('directory', {
  schema: new SimpleSchema({
    path: {
      type: String // The full path of the directory

    },
    up: {
      type: String // The path of the parent directory for this directory
                   // An up value of "" means that it is a
    },
    owner: {
        type: String
    }
  })
});

// Collection2 already does schema checking
// Add custom permission rules if needed
Directory.allow({
  insert : function (user, dir) {
    return !Directory.findOne({path: dir.path});
  },
  update : function (dir) {
    return !Directory.findOne({path: dir.path});
  },
  remove : function (dir) {
    return dir.owner === Meteor.user().username;
    // and has no files
  }
});

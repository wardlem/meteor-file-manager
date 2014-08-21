Directory = new Meteor.Collection('directory', {
  schema: new SimpleSchema({
    path: {
      type: String // The full path of the directory
    },
    up: {
      type: String // The path of the parent directory for this directory
                   // An up value of "" means that it is a
    }
  })
});

// Collection2 already does schema checking
// Add custom permission rules if needed
Directory.allow({
  insert : function () {
    return true;
  },
  update : function () {
    return true;
  },
  remove : function () {
    return true;
  }
});

Meteor.publish('directory', function (path) {
  return Directory.find({path: path});
});

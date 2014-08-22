Meteor.publish('files',
  function () {
    if (this.userId) {
      return files.find({
        'metadata._Resumable': { $exists: false },
        $or: [
          {
            'metadata.owner': this.user().username
          },
          {
            'metadata.access' : {$not: 'private'}
          }
        ]
      });
    } else {        // Prevent client race condition:
      return null;  // This is triggered when publish is rerun with a new
      // userId before client has resubscribed with that userId
    }
  }
);
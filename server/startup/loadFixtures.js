function loadFixture(fixtures, collection) {
  var i;

  for (i = 0; i < fixtures.length; i+= 1) {
    //collection.remove({ });
    collection.insert(fixtures[i]);
  }
}


Meteor.startup(function () {
    if (!Directories.findOne({path: '/'})){
        Directories.insert({
            up: 'NONE',
            path: '/',
            owner: 'Shared'
        })
    }
    if (!Directories.findOne({path: '/Shared'})){
        Directories.insert({
            up: '/',
            path: '/Shared',
            owner: 'Shared'
        })
    }
  //loadFixture(Fixtures['dummyFixture'], DummyCollection);
});

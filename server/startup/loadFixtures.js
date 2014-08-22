function loadFixture(fixtures, collection) {
  var i;

  for (i = 0; i < fixtures.length; i+= 1) {
    //collection.remove({ });
    collection.insert(fixtures[i]);
  }
}


Meteor.startup(function () {
    if (!Directory.findOne({path: '/Shared'})){
        Directory.insert({
            up: '/',
            path: '/Shared',
            owner: 'Shared'
        })
    }
  //loadFixture(Fixtures['dummyFixture'], DummyCollection);
});

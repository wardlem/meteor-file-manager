function loadUser(user) {
    var userAlreadyExists = typeof Meteor.users.findOne({ username : user.username }) === 'object';
    if (!userAlreadyExists) {
        Accounts.createUser(user);
    }
}

function loadHomeDirectory(user) {
    var directoryExists = typeof Directory.findOne({up: '/', path: '/' + user.username}) === 'object';

    if (!directoryExists) {
        Directory.insert({
            up: '/',
            path: '/' + user.username,
            owner: user.username
        })
    }
}

Meteor.startup(function () {
    var users = YAML.eval(Assets.getText('users.yml'));

    for (var key in users) if (users.hasOwnProperty(key)) {
        loadUser(users[key]);
        loadHomeDirectory(users[key]);
    }
});
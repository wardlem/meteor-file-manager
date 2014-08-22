var newDir = null;
var newDirDep = new Deps.Dependency;
var statusDep = new Deps.Dependency;
var getNewDir = function() {
    newDirDep.depend();
    return newDir;
};

var getNewDirStatus = function(){
    statusDep.depend();
    return newDir.status
};

var newDirIsValid = function() {
    if (newDir.name === '') {
        return false;
    }
    var path = newDir.up + '/' + newDir.name;
    return !Directory.findOne({path: path});
};

var setNewDirStatus = function() {
    var current = newDir.status;
    newDir.status = newDirIsValid() ? 'ok' : 'error';

    if (current != newDir.status) {
        statusDep.changed();
    }
};

var setNewDir = function(data){
    newDir = data;
    newDirDep.changed();
};

function saveNewDir() {
    console.log('saving');
    if (newDirIsValid()){
        var insert = {
            up: newDir.up,
            path: (newDir.up === '/' ? '' : newDir.up ) + '/' + newDir.name,
            owner: newDir.owner
        };
        Directory.insert(insert);
        console.log(insert);
        setNewDir(null);
    }

}

function cancelNewDir() {
    setNewDir(null)
}

Template.files.helpers({
    dirName: function(dir){
        return dir.path.split('/').pop();
    },
    canDeleteDir: function(dir){
        return !Directory.findOne({up: dir.path})
            && !Files.findOne({directory: dir.path})
            && dir.up != '/'
            && dir.owner === Meteor.user().username

    },
    creatingDir: function(){
        return getNewDir() !== null;
    },
    newDir: function(){
        return getNewDir()
    },
    newDirIsValid: function() {
        return getNewDirStatus();
    }
});

Template.files.events({
    "click .directory": function() {
        Router.go("directory", {path: this.path});
        setNewDir(null);

    },
    "mouseover .directory": function() {
        $("#directory-" + this._id).find('.folder.icon').addClass('open')
    },
    "mouseout .directory": function(){
        $("#directory-" + this._id).find('.folder.icon').removeClass('open')
    },
    "click #add-directory": function(){
        setNewDir({owner: Meteor.user().username, up: currentDirectory, name: '', status: 'error'});
        window.setTimeout(function(){
            $("#new-directory-name").focus();
        }, 50);
    },
    "keyup #new-directory-name": function(e){
        if (e.keyCode === 13) { // enter
            saveNewDir();
        } else if (e.keyCode === 27){ // escape
            cancelNewDir();
        } else {
            newDir.name = $("#new-directory-name").val();
            setNewDirStatus();
        }
    },
    "click #save-new-directory": saveNewDir,
    "click #cancel-new-directory": cancelNewDir
});
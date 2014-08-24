// Creating a new directory
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
    return !Directories.findOne({path: path});
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
        if (insert.path.substring(0,7) === '/Shared'){
            insert.owner = 'Shared';
        }
        Directories.insert(insert);
        console.log(insert);
        setNewDir(null);
    }

}

function cancelNewDir() {
    setNewDir(null)
}

// New file
function createFile(event, dir){
    FS.Utility.eachFile(event, function(file) {
        if (!file.size){
            return;
        }
        var fsFile = new FS.File(file);
        fsFile.metadata = {
            owner: Meteor.user().username,
            directory: dir,
            name: file.name,
            access: dir.substring(0, 7) === '/Shared' ? 'public' : 'private'
        };
        console.log(fsFile);

        Files.insert(fsFile, function (err, fileObj) {
            //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
            if (err){
                console.log(err)
            } else {
                console.log('file successfully saved??');
            }
        });
    });
}


Template.files.helpers({
    canDeleteDir: function(dir){
        return !Directories.findOne({up: dir.path})
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
    },
    fileIconClass: function(file) {
        switch(true){
            case file.isImage():
                return 'photo';
            case file.isAudio():
                return 'music';
            case file.isVideo():
                return 'video';
            default:
                return 'text file'
        }

    },
    formatSize: function(size) {
        if (size < 1000) {
            return size + " bytes"
        }
        size = size / 1000;
        if (size < 1000) {
            return (Math.round(size * 10) / 10.0)  + " kB"
        }
        size = size / 1000;
        return (Math.round(size * 10) / 10.0) + " MB"
    }
});

Template.files.events({
    "click .directory": function() {
        setNewDir(null);
        if (this.isRoot()) {
            Router.go('home');
        } else {
            Router.go("directory", {path: this.path});
        }

    },
    "mouseover .directory": function() {
        $("#directory-" + this._id).find('.folder.icon').addClass('open')
    },
    "mouseout .directory": function(){
        $("#directory-" + this._id).find('.folder.icon').removeClass('open')
    },
    "click #add-directory": function(){
        console.log(this);
        setNewDir({owner: Meteor.user().username, up: this.path, name: '', status: 'error'});
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
    "click #cancel-new-directory": cancelNewDir,

    // functionality for dropped events
    "dropped .directory": function(event, temp){
        console.log(this);
        createFile(event, this.path);
    },

    "click .file": function(e) {
        window.location = this.url({download: true});
    },
    "dropped .files": function(e) {
        console.log(this);
        createFile(event, this.path);
    },
    "click .delete-directory": function(e){
        console.log(this);
        Directories.remove(this._id);
    },
    "click .delete-file": function(e){
        var file = this;
        SemanticModal.confirmModal(
            {
                header: "Confirm Delete",
                message: "Are you sure you want to permanently delete " + file.metadata.name + "?",
                callback: function() {
                    Files.remove(file._id)
                }
            }
        );

    }
});
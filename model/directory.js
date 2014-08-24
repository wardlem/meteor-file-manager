var Directory = {
    parent: function() {
        if (this.isRoot()){
            return null;
        }
        var path = this.path.split('/').slice(0, -1).join('/');
        return Directories.findOne(path ? {path: path} : {path: '/'});
    },
    name: function(){
        if (this.isRoot()){
            return 'Home';
        }
        return this.path.split('/').pop();
    },
    sub: function(){
        return Directories.find({up: this.path}, {sort: ['path', 'asc']})
    },
    files: function(){
        return Files.find({"metadata.directory": this.path})
    },
    isRoot: function(){
        return this.path === '/';
    },
    crumbs: function(inactive){
        inactive = !!inactive;
        var parent = this.parent();
        var crumb = {path: this.path, name: this.name(), active: inactive ? 'inactive' : 'active'};
        if (!parent){
            return [crumb]
        }

        var result = parent.crumbs(true);
        result.push(crumb);
        return result;
    },
    canDelete: function(){
        return !Directories.findOne({up: this.path})
            && !Files.findOne({"metadata.directory": this.path})
            && this.up != '/'
            && (this.owner === Meteor.user().username
            || this.owner === 'Shared')
    },
    size: function(){
        var size = 0;
        _.each(this.files().fetch(), function(file){
            size += file.size();
        });
        _.each(this.sub().fetch(), function(dir){
            size += dir.size();
        });
        return size;
    }
};

Directories = new Meteor.Collection('directory', {
    schema: new SimpleSchema({
        path: {
            type: String // The full path of the directory

        },
        up: {
            type: String // The path of the parent directory for this directory
        },
        owner: {
            type: String
        }
    }),
    transform: function(doc) {
        var newInstance = Object.create(Directory);
        return _.extend(newInstance, doc);
    }

});

// Collection2 already does schema checking
// Add custom permission rules if needed
Directories.allow({
    insert : function (userId, dir) {

        return !Directories.findOne({path: dir.path});
    },
    update : function (userId, doc, fieldNames, modifier) {
        return !Directories.findOne({path: dir.path});
    },
    remove : function (userId, dir) {
        return dir.canDelete();
    }
});


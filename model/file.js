var fileStore = new FS.Store.GridFS("images", {
//        mongoUrl: 'mongodb://127.0.0.1:27017/test/', // optional, defaults to Meteor's local MongoDB
//        mongoOptions: {...},  // optional, see note below
//    transformWrite: myTransformWriteFunction, //optional
//    transformRead: myTransformReadFunction, //optional
//    maxTries: 1, // optional, default 5
//    chunkSize: 1024*1024  // optional, default GridFS chunk size in bytes (can be overridden per file).
// Default: 2MB. Reasonable range: 512KB - 4MB
});

Files = new FS.Collection('files', {
    stores: [fileStore]
});

Files.allow({
    insert: function(userId, file){
        var path = file.metadata.directory[0] === '/' ? file.metadata.directory.substring(1) : file.metadata.directory;
        var root = path.split('/').shift();
        file.metadata.access = root === 'Shared' ? 'public' : 'private';
        return file.original.size > 0 && (root === 'Shared' || root === file.metadata.owner);
    },
    update: function(){
        return true;
    },
    download: function(){
        return true;
    },
    remove: function(userId, file){
        var user = Users.findOne(userId);
        return user && user.username === file.metadata.owner;
    }

});

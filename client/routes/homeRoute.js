currentDirectory = '/';

Router.onBeforeAction(function() {
    if (!Meteor.userId()){
        this.redirect('login');
    }
}, {except: ['login']});

var HomeController = RouteController.extend({
    template: 'files',
    data: function(){
        var path = '/';
        return {
            currentDir: path,
            dirs: Directory.find({up: path}, {sort: ['path', 'asc']}),
            files: Files.find({"metadata.directory": path}),
            crumbs: [{path: '', name: 'Home', active: 'active'}]
        }
    }
});

var FilesController = RouteController.extend({
    template: 'files',
    data: function(){
        var params = this.params;
        var crumbs = [];
        var pathParts = (params.path || '').split('/');
        var first = true;
        var path = "/" + params.path;
        currentDirectory = path;

        while(pathParts.length > 0){
            var name = pathParts.pop();
            crumbs.push({
                name: name,
                path: (pathParts.length ? '/' + pathParts.join('/') : "") + '/' + name,
                active: first ? 'active' : 'inactive'
            });
            first = false;
        }
        crumbs.push({path: '', name: 'Home', active: 'inactive'});
        return {
            currentDir: params.path,
            crumbs: crumbs.reverse(),
            dirs: Directory.find({up: path}, {sort: ['path', 'asc']}),
            files: Files.find({"metadata.directory": path})
        }

    }
});


var BoilerplateController = RouteController.extend({
    template: 'boilerplate'
});

var LoginController = RouteController.extend({
    template: 'login',
    onBeforeAction: function() {
        if (Meteor.userId()){
            this.redirect('home')
        }
    }
});

Router.map(function () {
    this.route('home', {
        path :  '/',
        controller :  HomeController
    });
    this.route('root', {
        path: '/files',
        controller: HomeController
    });
    this.route('directory', {
        path: '/files/:path(*)',
        controller: FilesController
    });
    this.route('boilerplate', {
        path :  '/boilerplate',
        controller :  BoilerplateController
    });

    this.route('login', {
        path: '/login',
        controller: LoginController
    })

});





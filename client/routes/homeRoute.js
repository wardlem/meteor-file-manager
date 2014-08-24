Router.onBeforeAction(function() {
    if (!Meteor.userId()){
        this.redirect('login');
    }
}, {except: ['login']});

var HomeController = RouteController.extend({
    template: 'files',
    data: function(){
        return {
            currentDir: Directories.findOne({path: '/'})
        }
    }
});

var FilesController = RouteController.extend({
    template: 'files',
    data: function(){
        var params = this.params;
        var path = "/" + (params.path || '');
        return {
            currentDir: Directories.findOne({path: path})
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
        controller: FilesController
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






Router.onBeforeAction(function() {
  if (!Meteor.userId()){
    this.redirect('login');
  }
}, {except: ['login']});

var HomeController = RouteController.extend({
  template: 'home',
  data: function(){
    var params = this.params;
    var path = params.path || '';
    return {
      currentDir: Directory.findOne({name: path}),
      dirs: Directory.find({up: path}),
      files: Files.find({"metadata.directory": path})
    }
  }
});

var FilesController = RouteController.extend({
  template: 'files'
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





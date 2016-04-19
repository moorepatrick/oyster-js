angular.module('app.routes', ['ngRoute'])
.config(function($routeProvider, $locationProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'app/views/pages/home.html'
  })

  .when('/login', {
    templateUrl: 'app/views/pages/login.html',
    controller: 'MainController',
    controllerAs: 'login'
  })

  .when('/profile', {
    templateUrl: 'app/views/pages/profile.html',
    controller: 'ProfileController',
    controllerAs: 'profile'
  })

  .when('/feeds/',{
    templateUrl: 'app/views/pages/feeds/output/all.html',
    controller: 'OutputFeedController',
    controllerAs: 'outputFeed'
  })

  .when('/feeds/add', {
    templateUrl: 'app/views/pages/feeds/output/add.html',
    controller: 'OutputFeedAddController',
    controllerAs: 'outputFeed'
  })

  .when('/feeds/:feed_id', {
    templateUrl: 'app/views/pages/feeds/output/detail.html',
    controller: 'OutputFeedDetailController',
    controllerAs: 'outputFeed'
  })

  .when('/admin',{
    templateUrl: 'app/views/pages/admin.html',
    controller: 'AdminController',
    controllerAs: 'admin'
  })

  .when('/subscriptions/', {
    templateUrl: 'app/views/pages/feeds/source/all.html',
    controller: 'SourceFeedController',
    controllerAs: 'sourceFeed'
  })

  .when('/subscriptions/add', {
    templateUrl: 'app/views/pages/feeds/source/add.html',
    controller: 'SourceFeedAddController',
    controllerAs: 'sourceFeed'
  })

  .when('/subscriptions/:feed_id', {
    templateUrl: 'app/views/pages/feeds/source/detail.html',
    controller: 'SourceFeedDetailController',
    controllerAs: 'sourceFeed'
  })

  .when('/users', {
    templateUrl: 'app/views/pages/users/all.html',
    controller: 'UserController',
    controllerAs: 'user'
  })

  .when('/users/create', {
    templateUrl: 'app/views/pages/users/single.html',
    controller: 'UserCreateController',
    controllerAs: 'user'
  })

  .when('/users/:user_id', {
    templateUrl: 'app/views/pages/users/single.html',
    controller: 'UserEditController',
    controllerAs: 'user'
  })

  .otherwise('/');

  $locationProvider.html5Mode(true);
});

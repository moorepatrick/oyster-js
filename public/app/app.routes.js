angular.module('app.routes', ['ngRoute'])
.config(function($routeProvider, $locationProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'app/views/pages/home.html'
  })

  .when('/login', {
    templateUrl: 'app/views/pages/login.html',
    controller: 'mainController',
    controllerAs: 'login'
  })

  .when('/profile', {
    templateUrl: 'app/views/pages/profile.html',
    controller: 'profileController',
    controllerAs: 'profile'
  })

  .when('/feeds',{
    templateUrl: 'app/views/pages/feeds/all.html',
    controller: 'feedController',
    controllerAs: 'feed'
  })

  .when('/feeds/add', {
    templateUrl: 'app/views/pages/feeds/add.html',
    controller: 'feedAddController',
    controllerAs: 'feed'
  })

  .when('/feeds/:feed_id', {
    templateUrl: 'app/views/pages/feeds/detail.html',
    controller: 'feedDetailController',
    controllerAs: 'feed'
  })

  .when('/admin',{
    templateUrl: 'app/views/pages/admin.html',
    controller: 'adminController',
    controllerAs: 'admin'
  })

  .when('/subscriptions/', {
    templateUrl: 'app/views/pages/subscriptions/all.html',
    controller: 'subscriptionController',
    controllerAs: 'subscription'
  })

  .when('/subscriptions/add', {
    templateUrl: 'app/views/pages/subscriptions/add.html',
    controller: 'subscriptionAddController',
    controllerAs: 'subscription'
  })

  .when('/subscriptions/:feed_id', {
    templateUrl: 'app/views/pages/subscriptions/detail.html',
    controller: 'subscriptionDetailController',
    controllerAs: 'subscription'
  })

  .when('/users', {
    templateUrl: 'app/views/pages/users/all.html',
    controller: 'userController',
    controllerAs: 'user'
  })

  .when('/users/create', {
    templateUrl: 'app/views/pages/users/single.html',
    controller: 'userCreateController',
    controllerAs: 'user'
  })

  .when('/users/:user_id', {
    templateUrl: 'app/views/pages/users/single.html',
    controller: 'userEditController',
    controllerAs: 'user'
  })

  .otherwise('/');

  $locationProvider.html5Mode(true);
});

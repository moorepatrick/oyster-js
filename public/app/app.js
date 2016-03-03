angular.module('userApp', ['ngAnimate', 'app.routes', 'authService', 'profileCtrl', 'mainCtrl', 'userCtrl', 'feedCtrl', 'adminCtrl', 'userService'])
  .config(function($httpProvider) {
    // Attach intercpetor to http requests
    $httpProvider.interceptors.push('AuthInterceptor');
  });

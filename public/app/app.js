angular.module('userApp', ['ngAnimate', 'app.routes', 'authService', 'mainCtrl', 'userCtrl', 'userService'])
  .config(function($httpProvider) {
    // Attach intercpetor to http requests
    $httpProvider.interceptors.push('AuthInterceptor');
  });

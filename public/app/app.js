angular.module('userApp', ['ngAnimate', 'ngSanitize', 'app.routes', 'authService', 'profileCtrl', 'mainCtrl', 'userCtrl', 'feedCtrl', 'adminCtrl', 'userService', 'subscriptionService', 'subscriptionCtrl'])
  .config(function($httpProvider) {
    // Attach intercpetor to http requests
    $httpProvider.interceptors.push('AuthInterceptor');
  });

angular.module('userApp', ['ngAnimate', 'ngSanitize','ui.bootstrap', 'app.routes', 'authService', 'profileCtrl', 'mainCtrl', 'userCtrl', 'subscriptionCtrl', 'feedCtrl', 'adminCtrl', 'userService', 'subscriptionService', 'subscriptionCtrl'])
  .config(function($httpProvider) {
    // Attach intercpetor to http requests
    $httpProvider.interceptors.push('AuthInterceptor');
  });

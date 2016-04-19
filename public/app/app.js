angular.module('Oyster', ['ngAnimate', 'ngSanitize','ui.bootstrap', 'app.routes', 'AuthService', 'AdminCtrl', 'MainCtrl', 'UserCtrl', 'UserService', 'ProfileCtrl', 'SourceFeedCtrl', 'SourceFeedService', 'OutputFeedCtrl', 'OutputFeedService', ])
  .config(function($httpProvider) {
    // Attach intercpetor to http requests
    $httpProvider.interceptors.push('AuthInterceptor');
  });

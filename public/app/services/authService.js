var api = '/api/v1';

angular.module('authService', [])

// Login and get user information
.factory('Auth', function($http, $q, AuthToken) {
  var authFactory = {};

  // Login user
  authFactory.login = function(username, password) {
    return $http.post(api + '/authenticate', {
        username: username,
        password: password
      })
      .success(function(data) {
        AuthToken.setToken(data.token);
        return data;
      });
  };

  // Logout user
  authFactory.logout = function() {
    AuthToken.setToken();
  };

  // Check if user is logged in via local token
  authFactory.isLoggedIn = function() {
    if (AuthToken.getToken()) {
      return true;
    } else {
      return false;
    }
  };

  // Get the logged in user
  authFactory.getUser = function() {
    if (AuthToken.getToken()) {
      return $http.get(api + '/me', { cache: true });
    } else {
      return $q.reject({
        message: 'User has no token.'
      });
    }
  };

  return authFactory;
})

// Getting and setting token
.factory('AuthToken', function($window) {
  var authTokenFactory = {};

  // get token out of local storage
  authTokenFactory.getToken = function() {
    return $window.localStorage.getItem('token');
  };

  // Set and clear token

  authTokenFactory.setToken = function(token) {
    if (token) {
      $window.localStorage.setItem('token', token);
    } else {
      $window.localStorage.removeItem('token');
    }
  };

  return authTokenFactory;
})

// Integrate token into requests
.factory('AuthInterceptor', function($q, $location, AuthToken) {
  var interceptorFactory = {};

  interceptorFactory.request = function(config) {
    var token = AuthToken.getToken();

    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  };

  interceptorFactory.responseError = function(response) {
    if (response.status == 403) {
      AuthToken.setToken();
      $location.path('/login');
    }

    return $q.reject(response);
  };

  return interceptorFactory;
});

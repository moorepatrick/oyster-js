angular.module('mainCtrl', [])
  .controller('mainController', function($rootScope, $location, Auth, $scope, $cacheFactory) {
    var vm = this;

    // Get login status
    vm.loggedIn = Auth.isLoggedIn();

    // Get login status on every request
    $rootScope.$on('$routeChangeStart', function() {
      vm.loggedIn = Auth.isLoggedIn();

      Auth.getUser()
        .then(function(data) {
          vm.user = data.data;
        });
    });

    // Handle login form
    vm.doLogin = function() {
      vm.processing = true;
      vm.error = '';

      Auth.login(vm.loginData.username, vm.loginData.password)
        .success(function(data) {
          vm.processing = false;

          // Redirect to users page
          if (data.success) {
            $location.path('/users');
          } else {
            vm.error = data.message;
          }
        });
    };

    // Logout
    vm.doLogout = function() {
      Auth.logout();
      vm.user = '';
      $location.path('/login');
      $cacheFactory.get('$http').remove('/api/me');
    };
  });

angular.module('profileCtrl', ['authService'])
  .controller('profileController', function($routeParams, Auth) {
    var vm = this;

    Auth.getUser()
      .then(function(data) {
        vm.user = data.data;
        console.log(vm.user)
      });
  });

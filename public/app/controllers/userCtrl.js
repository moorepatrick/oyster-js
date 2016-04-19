angular.module('UserCtrl', ['UserService'])
  .controller('UserController', function(User) {
    var vm = this;
    vm.processing = true;

    // Grab all users
    User.all()
      .success(function(data) {
        vm.processing = false;

        vm.users = data;
      });

    // Delete a user
    vm.deleteUser = function(id) {
      vm.processing = true;

      User.delete(id)
        .success(function(data) {

          // Refresh users
          User.all()
            .success(function(data) {
              vm.processing = false;
              vm.users = data;
            });
        });
    };
  })

// User Creation
.controller('UserCreateController', function(User) {
  var vm = this;
  vm.type = 'create';

  vm.saveUser = function() {
    vm.proccessing = true;
    vm.message = '';

    // Create User
    User.create(vm.userData)
      .success(function(data) {
        vm.processing = false;
        vm.userData = {};
        vm.message = data.message;
      });
  };
})

// Edit user
.controller('UserEditController', function($routeParams, User) {
  var vm = this;
  vm.type = 'edit';

  User.get($routeParams.user_id)
    .success(function(data) {
      vm.userData = data;
    });

  vm.saveUser = function() {
    vm.processing = true;
    vm.message = '';

    User.update($routeParams.user_id, vm.userData)
      .success(function(data) {
        vm.processing = false;

        vm.userData = {};

        vm.message = data.message;
      });
  };
});

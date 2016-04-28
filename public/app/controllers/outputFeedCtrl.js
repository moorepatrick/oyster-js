angular.module('OutputFeedCtrl', ['OutputFeedService', 'SourceFeedService', 'AuthService'])
  .controller('OutputFeedController', function(OutputFeed, Auth) {
    var vm = this;
    vm.processing = true;

    Auth.getUser()
      .then(function(data) {
        vm.user = data.data;

        OutputFeed.all(vm.user.username)
          .success(function(data) {
            vm.processing = false;
            vm.outputFeeds = data.outputFeeds;
          });
      });

    vm.deleteFeed = function(id) {
      vm.proccessing = true;

      OutputFeed.delete(vm.user.username, id)
        .success(function(data) {
          vm.message = data.message;
          console.log(vm.message);
          OutputFeed.all(vm.user.username)
            .success(function(data) {
              vm.processing = false;
              vm.outputFeeds = data.outputFeeds;
            });
        });
    };
  })
  .controller('OutputFeedAddController', function(OutputFeed, SourceFeed, Auth) {
    var vm = this;
    vm.processing = true;

    // Get get all user subscriptions and set false selection status
    Auth.getUser()
      .then(function(data) {
        vm.user = data.data;

        SourceFeed.all(vm.user.username)
          .success(function(data) {
            vm.title = "";
            vm.sourceFeeds = data.sourceFeeds;
            vm.sourceFeeds.forEach(function(item) {
              item.selected = false;
            });
            vm.processing = false;
          });
      });

    // Add new output feed
    vm.addFeed = function() {
      vm.processing = true;
      vm.message = '';
      var selections = [];

      // Collect selected source feed ids
      vm.sourceFeeds.forEach(function(item) {
        if (item.selected) {
          selections.push(item._id);
        }
      });

      // Create and save output feed in DB
      OutputFeed.create(vm.user.username, { feedData: { title: vm.title, sourceFeeds: selections } }).success(function(data) {
        vm.message = data.message;
        if(data.success){
          vm.title = "";
          // Clear Checkboxes
          vm.sourceFeeds.forEach(function(item) {
            item.selected = false;
          });
          vm.feedData = {};
        }
        vm.processing = false;
      });
    };
  })
  .controller('OutputFeedDetailController', function($routeParams, OutputFeed, Auth) {
    var vm = this;
    vm.processing = true;
    Auth.getUser()
      .then(function(data) {
        vm.user = data.data;

        OutputFeed.get(vm.user.username, $routeParams.feed_id)
          .success(function(data) {
            vm.feedData = data;
            vm.processing = false;
            console.log(data);
          });
      });
  });

angular.module('SourceFeedCtrl', ['SourceFeedService', 'AuthService'])
  .controller('SourceFeedController', function(SourceFeed, Auth) {
    var vm = this;
    vm.processing = true;

    Auth.getUser()
      .then(function(data) {
        vm.user = data.data;

        // Get all source feeds
        SourceFeed.all(vm.user.username)
          .success(function(data) {
            vm.processing = false;

            vm.sourceFeeds = data.sourceFeeds;
          });
      });

    // Remove SourceFeed
    vm.deleteFeed = function(id) {
      vm.processing = true;

      console.log(id)

      SourceFeed.delete(vm.user.username, id)
        .success(function(data) {
          vm.message = data.message;
          console.log(vm.message);
          SourceFeed.all(vm.user.username)
            .success(function(data) {
              vm.processing = false;
              vm.sourceFeeds = data.sourceFeeds;
            });
        });
    };
  })

// SourceFeed Creation
.controller('SourceFeedAddController', function(SourceFeed, Auth) {
  var vm = this;

  Auth.getUser()
    .then(function(data) {
      vm.user = data.data;
      vm.addSourceFeed = function() {
        console.log("Data: " + encodeURIComponent(vm.feedData.url))
        console.log("Data: " + encodeURI(vm.feedData.url))
        vm.processing = true;
        vm.message = '';

        // Create saveSourceFeed
        SourceFeed.create(vm.user.username, vm.feedData)
          .success(function(data) {
            vm.processing = false;
            vm.feedData = {};
            vm.message = data.message;
          });
      };
    })
})

// View full Source Feed Data
.controller('SourceFeedDetailController', function($routeParams, SourceFeed, Auth) {
  var vm = this;
  vm.processing = true;

  Auth.getUser()
    .then(function(data) {
      vm.user = data.data;
      console.log($routeParams.feed_id)
      SourceFeed.get(vm.user.username, $routeParams.feed_id)
        .success(function(data) {
          console.log(data)
          vm.processing = false;
          vm.feedData = data;
        });
    })
});

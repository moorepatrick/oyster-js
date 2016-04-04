angular.module('feedCtrl', ['feedService', 'subscriptionService'])
  .controller('feedController', function(Feed) {
    var vm = this;
    vm.processing = true;

    Feed.all()
      .success(function(data) {
        vm.processing = false;
        vm.feeds = data[0].feeds;
      });

    vm.deleteFeed = function(id) {
      vm.proccessing = true;

      Feed.delete(id)
        .success(function(data) {
          vm.message = data.message;
          console.log(vm.message);
          Feed.all()
            .success(function(data) {
              vm.processing = false;
              vm.feeds = data[0].feeds;
            });
        });
    };
  })
  .controller('feedAddController', function(Feed, Subscription) {
    var vm = this;
    vm.processing = true;

    // Get get all user subscriptions and set false selection status
    Subscription.all()
      .success(function(data) {
        vm.title = "";
        vm.subscriptions = data[0].subscriptions;
        vm.subscriptions.forEach(function(item) {
          item.selected = false;
        });
        vm.processing = false;
      });

    // Add new user feed
    vm.addFeed = function() {
      vm.processing = true;
      vm.message = '';
      var selections = [];

      // Collect selected subscription feed ids
      vm.subscriptions.forEach(function(item) {
        if (item.selected) {
          selections.push(item._id);
        }
      });

      // Create and save feed in DB
      Feed.create({ feedData: { title: vm.title, feeds: selections } }).success(function(data) {
        vm.processing = false;
        vm.feedData = {};
        vm.message = data.message;
      });

      // Clear Checkboxes
      vm.title = "";
      vm.subscriptions.forEach(function(item) {
        item.selected = false;
      });
      vm.processing = false;
    };
  })
  .controller('feedDetailController', function($routeParams, Feed) {
    var vm = this;

    Feed.get($routeParams.feed_id)
      .success(function(data) {
        vm.feedData = data;
        console.log(data);
      });
  });

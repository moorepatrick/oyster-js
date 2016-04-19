angular.module('OutputFeedCtrl', ['OutputFeedService', 'SourceFeedService'])
  .controller('OutputFeedController', function(OutputFeed) {
    var vm = this;
    vm.processing = true;

    OutputFeed.all()
      .success(function(data) {
        vm.processing = false;
        vm.outputFeeds = data[0].outputFeeds;
      });

    vm.deleteFeed = function(id) {
      vm.proccessing = true;

      OutputFeed.delete(id)
        .success(function(data) {
          vm.message = data.message;
          console.log(vm.message);
          OutputFeed.all()
            .success(function(data) {
              vm.processing = false;
              vm.outputFeeds = data[0].outputFeeds;
            });
        });
    };
  })
  .controller('OutputFeedAddController', function(OutputFeed, SourceFeed) {
    var vm = this;
    vm.processing = true;

    // Get get all user subscriptions and set false selection status
    SourceFeed.all()
      .success(function(data) {
        vm.title = "";
        vm.sourceFeeds = data[0].sourceFeeds;
        vm.sourceFeeds.forEach(function(item) {
          item.selected = false;
        });
        vm.processing = false;
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
      OutputFeed.create({ feedData: { title: vm.title, sourceFeeds: selections } }).success(function(data) {
        vm.processing = false;
        vm.feedData = {};
        vm.message = data.message;
      });

      // Clear Checkboxes
      vm.title = "";
      vm.sourceFeeds.forEach(function(item) {
        item.selected = false;
      });
      vm.processing = false;
    };
  })
  .controller('OutputFeedDetailController', function($routeParams, OutputFeed) {
    var vm = this;

    OutputFeed.get($routeParams.feed_id)
      .success(function(data) {
        vm.feedData = data;
        console.log(data);
      });
  });

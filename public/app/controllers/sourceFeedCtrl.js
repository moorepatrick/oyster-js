angular.module('SourceFeedCtrl', ['SourceFeedService'])
  .controller('SourceFeedController', function(SourceFeed) {
      var vm = this;
      vm.processing = true;

      // Get all source feeds
      SourceFeed.all()
        .success(function(data) {
          vm.processing = false;

          vm.sourceFeeds = data[0].sourceFeeds;
        });

      // Remove SourceFeed
      vm.deleteFeed = function(id) {
        vm.processing = true;

        console.log(id)

        SourceFeed.delete(id)
          .success(function(data) {
            vm.message = data.message;
            console.log(vm.message);
            SourceFeed.all()
              .success(function(data) {
                vm.processing = false;
                vm.sourceFeeds = data[0].sourceFeeds;
              });
          });
      };
    })

    // SourceFeed Creation
    .controller('SourceFeedAddController', function(SourceFeed){
      var vm = this;

      vm.addSourceFeed = function(){
        console.log("Data: " + encodeURIComponent(vm.feedData.url))
        console.log("Data: " + encodeURI(vm.feedData.url))
        vm.processing = true;
        vm.message = '';

        // Create saveSourceFeed
        SourceFeed.create(vm.feedData)
        .success(function(data){
          vm.processing = false;
          vm.feedData = {};
          vm.message = data.message;
        });
      };
    })

    // View full Source Feed Data
    .controller('SourceFeedDetailController', function($routeParams, SourceFeed){
      var vm = this;
      vm.processing = true;
      console.log($routeParams.feed_id)
      SourceFeed.get($routeParams.feed_id)
      .success(function(data){
        console.log(data)
        vm.processing = false;
        vm.feedData = data;
      });
    });

angular.module('subscriptionCtrl', ['subscriptionService'])
  .controller('subscriptionController', function(Subscription) {
      var vm = this;

      vm.processing = true;

      // Get all subscriptions
      Subscription.all()
        .success(function(data) {
          vm.processing = false;

          vm.subscriptions = data[0].subscriptions;
        });

      // Remove Subscription
      vm.deleteSubscription = function(id) {
        vm.processing = true;

        console.log(id)

        Subscription.delete(id)
          .success(function(data) {
            vm.message = data.message;
            console.log(vm.message);
            Subscription.all()
              .success(function(data) {
                vm.processing = false;
                vm.subscriptions = data[0].subscriptions;
              });
          });
      };
    })

    // Subscription Creation
    .controller('subscriptionAddController', function(Subscription){
      var vm = this;

      vm.addSubscription = function(){
        console.log("Data: " + encodeURIComponent(vm.subscriptionData.url))
        console.log("Data: " + encodeURI(vm.subscriptionData.url))
        vm.processing = true;
        vm.message = '';

        // Create saveSubscription
        Subscription.create(vm.subscriptionData)
        .success(function(data){
          vm.processing = false;
          vm.subscriptionData = {};
          vm.message = data.message;
        });
      };
    })

    // View full SubscriptionData
    .controller('subscriptionDetailController', function($routeParams, Subscription){
      var vm = this;
      console.log($routeParams.feed_id)
      Subscription.get($routeParams.feed_id)
      .success(function(data){
        console.log(data)
        vm.subscriptionData = data;
      });
    });

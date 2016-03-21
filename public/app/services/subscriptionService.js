var api = '/api/v1';

angular.module('subscriptionService', [])
.factory('Subscription', function($http){
  var subscriptionFactory = {};

  subscriptionFactory.get = function(id){
    return $http.get(api + '/subscriptions/' + id);
  };

  subscriptionFactory.all = function(){
    return $http.get(api + '/subscriptions/');
  };

  subscriptionFactory.create = function(subscriptionData){
    return $http.post(api + '/subscriptions/', subscriptionData);
  };

  // subscriptionFactory.update = function(id, subscriptionData){
  //   return $http.put(api + '/subscriptions/' + id, subscriptionData);
  // };

  subscriptionFactory.delete = function(id){
    return $http.delete(api + '/subscriptions/' + id);
  };

  return subscriptionFactory;
});

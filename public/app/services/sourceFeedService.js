var api = '/api/v1';

angular.module('SourceFeedService', [])
.factory('SourceFeed', function($http){
  var sourceFeedFactory = {};

  sourceFeedFactory.get = function(id){
    return $http.get(api + '/source_feeds/' + id);
  };

  sourceFeedFactory.all = function(){
    return $http.get(api + '/source_feeds/');
  };

  sourceFeedFactory.create = function(subscriptionData){
    return $http.post(api + '/source_feeds/', subscriptionData);
  };

  // sourceFeedFactory.update = function(id, subscriptionData){
  //   return $http.put(api + '/subscriptions/' + id, subscriptionData);
  // };

  sourceFeedFactory.delete = function(id){
    return $http.delete(api + '/source_feeds/' + id);
  };

  return sourceFeedFactory;
});

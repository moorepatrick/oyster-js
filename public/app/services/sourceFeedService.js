var api = '/api/v1';

angular.module('SourceFeedService', [])
  .factory('SourceFeed', function($http) {
    var sourceFeedFactory = {};

    sourceFeedFactory.get = function(username, id) {
      return $http.get(api + '/source_feeds/' + username + '/' + id);
    };

    sourceFeedFactory.all = function(username) {
      return $http.get(api + '/source_feeds/' + username);
    };

    sourceFeedFactory.create = function(username, subscriptionData) {
      return $http.post(api + '/source_feeds/' + username, subscriptionData);
    };

    // sourceFeedFactory.update = function(id, subscriptionData){
    //   return $http.put(api + '/subscriptions/' + id, subscriptionData);
    // };

    sourceFeedFactory.delete = function(username, id) {
      return $http.delete(api + '/source_feeds/' + username + '/' + id);
    };

    return sourceFeedFactory;
  });

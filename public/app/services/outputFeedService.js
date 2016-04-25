var api = '/api/v1';

angular.module('OutputFeedService', [])
.factory('OutputFeed', function($http){
  var outputFeedFactory = {};

  outputFeedFactory.get = function(username, id){
    return $http.get(api + '/output_feeds/' + username + '/' + id);
  };

  outputFeedFactory.all = function(username){
    return $http.get(api + '/output_feeds/' + username);
  };

  outputFeedFactory.create = function(username, feedData){
    return $http.post(api + '/output_feeds/' + username, feedData);
  };

  // outputFeedFactory.update = function(id, feedData){
  //   return $http.put(api + '/feeds/' + id, feedData);
  // };

  outputFeedFactory.delete = function(username, id){
    return $http.delete(api + '/output_feeds/' + username + '/' + id);
  };

  return outputFeedFactory;
});

var api = '/api/v1';

angular.module('OutputFeedService', [])
.factory('OutputFeed', function($http){
  var outputFeedFactory = {};

  outputFeedFactory.get = function(id){
    return $http.get(api + '/output_feeds/' + id);
  };

  outputFeedFactory.all = function(){
    return $http.get(api + '/output_feeds/');
  };

  outputFeedFactory.create = function(feedData){
    return $http.post(api + '/output_feeds/', feedData);
  };

  // outputFeedFactory.update = function(id, feedData){
  //   return $http.put(api + '/feeds/' + id, feedData);
  // };

  outputFeedFactory.delete = function(id){
    return $http.delete(api + '/output_feeds/' + id);
  };

  return outputFeedFactory;
});

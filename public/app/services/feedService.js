var api = '/api/v1';

angular.module('feedService', [])
.factory('Feed', function($http){
  var feedFactory = {};

  feedFactory.get = function(id){
    return $http.get(api + '/feeds/' + id);
  };

  feedFactory.all = function(){
    return $http.get(api + '/feeds/');
  };

  feedFactory.create = function(feedData){
    return $http.post(api + '/feeds/', feedData);
  };

  // feedFactory.update = function(id, feedData){
  //   return $http.put(api + '/feeds/' + id, feedData);
  // };

  feedFactory.delete = function(id){
    return $http.delete(api + '/feeds/' + id);
  };

  return feedFactory;
});

angular.module('feud.services', [])

.factory('Query', function ($http, $location, $window) {
  var addSearch = function(search) {

    return $http({
      method: 'POST',
      url: 'api/queries',
      data: {
        query: search
      }
    })
  }
  return {
    addSearch: addSearch
  }
 })
.factory('Game', function($http, $window, $location) {
  var getCount = function() {
    return $http({
      method: "GET",
      url: 'api/game/count'
    }).then (function (response) {
      return response;
    });
  }
  var startRound = function(queryId) {
    var url = 'api/game/query/' + queryId
    return $http({
      method: "GET",
      url: url
    }).then(function (response) {
      return response;
    })
  }
  return {
    getCount: getCount,
    startRound: startRound
  }

})
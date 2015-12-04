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
      var parsedResponses = function (response, count, query) {
        if(!query) {
          var query = {
            title: response.data.title,
            responses: []
          }
        }
        count = count || 1
        var queryResponse = "response" + count;
        if (response.data[queryResponse]) {
          query.responses.push(response.data[queryResponse])
          return parsedResponses (response, count+1, query)
        } else {
          return query;
        }
      }
      return parsedResponses(response)
    })
  }
  return {
    getCount: getCount,
    startRound: startRound
  }

})
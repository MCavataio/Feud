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
  var startRound = function() {
    console.log('in factory SR')
  }
  return {
    startRound: startRound
  }
})
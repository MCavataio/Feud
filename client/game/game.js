angular.module('feud.game', [])

.controller('GameController', function($scope, $window, $location, Game){
  $scope.data = {};
  var dataSize;

  $scope.getCount = function() {
    Game.getCount()
    .then(function(size) {
      dataSize = size.data.count
    }).catch(function(error) {
      console.log("Error in retrieving size", error)
    })
  };

  $scope.startRound = function() {
    console.log(dataSize)
    var queryId = Math.ceil(Math.random() * dataSize)
    console.log(queryId)
    Game.startRound(queryId).then(function (query) {
      console.log(query)
    }).catch(function (error) {
      console.log("Error in retrieving query", error)
    })
  }

  $scope.makeGuess = function() {
    console.log('in GC for makeGuess')
  }
  $scope.getCount();
})
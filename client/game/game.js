angular.module('feud.game', [])

.controller('GameController', function($scope, $window, $location, Game){
  $scope.data = {};
  $scope.query = {};
  $scope.queryAnswer = {};
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
    var queryId = Math.ceil(Math.random() * dataSize)
    Game.startRound(queryId).then(function (query) {
      $scope.query.title = query.title;
      $scope.query.responses = query.responses;
      $scope.data.guess = query.title + " ";
      $scope.queryAnswer = {};
      console.log($scope.query.responses);
    }).catch(function (error) {
      console.log("Error in retrieving query", error)
    })
  }

  $scope.makeGuess = function() {
    var index = $scope.query.responses.indexOf($scope.data.guess)
    console.log(index)
    console.log($scope.data.guess);
    console.log($scope.query.responses)
    if (index > -1) {
      $scope.queryAnswer[index] = $scope.query.responses[index]
      $scope.data.guess = $scope.query.title + " ";
    }
    else {
      $scope.data.guess = $scope.query.title + " ";
    }
  }
  $scope.getCount();
})
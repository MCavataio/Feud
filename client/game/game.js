angular.module('feud.game', [])

.controller('GameController', function($scope, $window, $location, Game){
  $scope.data = {};

  $scope.startRound = function() {
    Game.startRound();
    console.log("in GC for Startround")
  }

  $scope.makeGuess = function() {
    console.log('in GC for makeGuess')
  }
})
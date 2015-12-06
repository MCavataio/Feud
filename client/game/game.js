angular.module('feud.game', [])

.controller('GameController', function($scope, $window, $location, Game, socketio){
  $scope.data = {};
  $scope.query = {};
  $scope.queryAnswer = {};
  var dataSize;
  // need to optimize calls to database
  // possibly retrieve 3 unique queries to use for each round
  $scope.getCount = function() {
    Game.getCount()
    .then(function(size) {
      dataSize = size.data.count
    }).catch(function(error) {
      console.log("Error in retrieving size", error)
    })
  };
  
  socketio.on('playRound', function(query) {
    console.log('in socket')
      $scope.query.title = query.title;
      $scope.query.responses = query.responses;
      $scope.data.guess = query.title + " ";
      $scope.queryAnswer = {};
      timer();
  })


  //change to angular directive to optimize speed and reliablility
  function timer() {
    $scope.counter = 30;
    $scope.onTimeout = function(){
      if($scope.counter !==0) {
        $scope.counter--;
        mytimeout = $timeout($scope.onTimeout,1000);
      }
    }
    var mytimeout = $timeout($scope.onTimeout,1000);

    var stop = function(){
      $timeout.cancel(mytimeout);
    }
  }

  $scope.startRound = function() {
    var queryId = Math.ceil(Math.random() * dataSize)
    Game.startRound(queryId).then(function (query) {
      $scope.query.title = query.title;
      $scope.query.responses = query.responses;
      $scope.data.guess = query.title + " ";
      $scope.queryAnswer = {};
      timer();
      console.log($scope.query.responses);
    }).catch(function (error) {
      console.log("Error in retrieving query", error)
    })
  }
  var scoreValues = {
    1: 500,
    2: 400,
    3: 300,
    4: 200,
    5: 100
  }

  $scope.makeGuess = function() {
    var index = $scope.query.responses.indexOf($scope.data.guess)
    console.log(index)
    console.log($scope.data.guess);
    console.log($scope.query.responses)
    if (index > -1) {
      $scope.queryAnswer[index] = $scope.query.responses[index]
      $scope.data.guess = $scope.query.title + " ";
      index++;
      $scope.data.score = $scope.data.score || 0;
      $scope.data.score += scoreValues[index];
    }
    else {
      $scope.data.guess = $scope.query.title + " ";
    }
  }
  $scope.getCount();
})
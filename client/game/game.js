angular.module('feud.game', [])

.controller('GameController', function($rootScope, $scope, $window, $location, Game, socket, $timeout){
  $scope.data = {};
  $scope.query = {};
  $scope.questions = {};
  $scope.data.opponentScore = 0;
  $scope.queryAnswer = {};
  var gameTimer = 25; 
  
  $scope.toLobby = function() {
    $location.path('/home')
  }
  var init = function() {
    socket.emit('initGame', "hello")
  }
  /////////////////////////////////////////////////////
  ////////// Game Logic
  /////////////////////////////////////////////////////
  var startRound = function(query) {
    $scope.questions = parsedResponses(query)
    $scope.data.round = 1;
    $scope.data.total = 0;
    gameInfo($scope.questions, 1);
    timer();
  }

  var nextRound = function() {
    var round = Number($scope.data.round);
    var roundScore = $scope.data.roundScore;
    $scope.data.score = 0;
    // $scope.data.total = $scope.data.total + roundScore || 0;
    socket.emit('updateScore', $scope.data.total);
    if (round <= 3) {
      console.log('in nextRound')
      gameInfo($scope.questions, round)
      timer()
    }
  }
  
  $scope.makeGuess = function() {
    var roundScore = $scope.data.roundScore;
    var index = $scope.query.responses.indexOf($scope.data.guess)
    // if guess is correct
    if (index > -1) {
      // set the answer on view to correct response
      $scope.queryAnswer[index] = $scope.query.responses[index]
      $scope.data.guess = $scope.query.title + " ";
      // increment index to correct value in scoreValues
      index++;
      // figure out whether or not to keep one score or continue to add to total
      // initialize round score
      roundScore = roundScore || 0;
      roundScore += scoreValues[index];
      // add to total score
      $scope.data.total += scoreValues[index];
    }
    else {
      $scope.data.guess = $scope.query.title + " ";
    }
  }

////////////////////////////////////////////////
//////////////  Game Helpers
////////////////////////////////////////////////

  var scoreValues = {
    1: 500,
    2: 400,
    3: 300,
    4: 200,
    5: 100
  }

  var parsedResponses = function (data) {
    var questions = {}
    _.each(data, function(query, qNum) {
    if(query) {
      questions[qNum] = {
        title: query.title,
        responses: []
      }
      for (var i = 0; i < 5; i++) {
        var queryResponse = "response" + (i + 1);
        if (query[queryResponse]) {
          questions[qNum].responses.push(query[queryResponse])
        }
      }
    }
    })
    console.log(questions)
    return questions
  }

  // need to refactor angular timer
  var timer = function () {
    $scope.counter = gameTimer;
    $scope.onTimeout = function(){
      if($scope.counter !==0) {
        $scope.counter--;
        mytimeout = $timeout($scope.onTimeout,1000);
      }
      if($scope.counter === 0) {
        stop()
        console.log('reaching here')
        if ($scope.data.round !== 3) {
          $scope.data.round++
          nextRound();
          $scope.counter = gameTimer;
        } else {
          socket.emit('updateScore', $scope.data.total)
        }
      }
    }
    var mytimeout = $timeout($scope.onTimeout,1000);

    var stop = function(){
      $timeout.cancel(mytimeout);
    }
  }
  

  var gameInfo = function(query, number) {
    number = number - 1
     $scope.query.title = query[number].title;
    $scope.query.responses = query[number].responses;
    $scope.data.guess = query[number].title + " ";
    $scope.queryAnswer = {};
  }

////////////////////////////////////////
//////////// Socket
////////////////////////////////////////

  socket.on('startRound', function(query) {
    room = query.room;
    socket.emit('getQueries')
    startRound(query);
  })

  socket.on('updateScore', function(data) {
    console.log(data.score)
    $scope.data.opponentScore = $scope.data.opponentScore || 0
    if (data.score > 0 && data.score !== $scope.data.opponentScore) {
        $scope.data.opponentScore = $scope.data.opponentScore + data.score;
      }
    })
  init()
})


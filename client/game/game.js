angular.module('feud.game', [])
  // john pappas styling guide
.controller('GameController', function($scope, $location, Game, Socket, $timeout){
  $scope.scoreBoard = {};
  $scope.query = {};
  $scope.questions = {};
  $scope.data = {};
  $scope.gameBoard;
  $scope.scoreBoard.opponentScore = 0;
  $scope.queryAnswer = {};
  var gameTimer = 30; 
  
  $scope.toLobby = function() {
    Socket.emit('leaveRoom')
    $location.path('/home')
  }
  var init = function() {
    Socket.emit('initGame', "hello")
  }
  /////////////////////////////////////////////////////
  ////////// Game Logic
  /////////////////////////////////////////////////////
  var startRound = function(query) {
    $scope.gameBoard = true;
    $scope.questions = parsedResponses(query);
    $scope.scoreBoard.round = 1;
    $scope.scoreBoard.total = 0;
    $scope.scoreBoard.roundScore = 0;
    gameInfo($scope.questions, 1);
    timer(10, nextRound);
  }

  var nextRound = function() {
    
    // $scope.scoreBoard.total = $scope.scoreBoard.total + roundScore || 0;
    Socket.emit('updateScore', $scope.scoreBoard.roundScore);
    $scope.scoreBoard.roundScore = 0;
    if ($scope.scoreBoard.round <= 3) {
      $scope.scoreBoard.round++
      console.log('in nextRound')
      gameInfo($scope.questions, $scope.scoreBoard.round)
      timer(10, nextRound)
    } else {
      $scope.gameBoard = true;
    }
  }


  
  $scope.makeGuess = function() {

    var guess = $scope.data.guess;
    var foundIndex = $scope.query.responses.indexOf(guess);
    var responses = $scope.query.responses;
    // if guess is correct
    if (foundIndex > -1) {
      updateBoard(foundIndex)
      $scope.data.guess = "";
    }
    else {
      var data = {responses: responses, guess: guess};
      Game.fuzzyCheck(data)
      .then(function(response) {
        var value = response.data.value;
        var index = response.data.index;
        if (value > .85) {
          updateBoard(index)
        }
      })
    } $scope.data.guess = "";
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
  var updateBoard = function(index) {
    var guess = $scope.guess;
    var responses = $scope.query.responses;
      // set the answer on view to correct response
   $scope.queryAnswer[index] = $scope.query.responses[index]
    // $scope.guess = $scope.query.title + " ";
    $scope.guess = "";
    // increment index to correct value in scoreValues
    index++;
    // figure out whether or not to keep one score or continue to add to total
    // initialize round score
    $scope.scoreBoard.roundScore += scoreValues[index];
    // add to total score
    $scope.scoreBoard.total += scoreValues[index];
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
  // var timer = function (time, cb) {
  //   $scope.counter = gameTimer;
  //   $scope.onTimeout = function(){
  //     if($scope.counter !==0) {
  //       $scope.counter--;
  //       mytimeout = $timeout($scope.onTimeout,1000);
  //     }
  //     if($scope.counter === 0) {
  //       stop()
    
  //       ///move logic set up callback
  //       if ($scope.scoreBoard.round !== 3) {
  //         $scope.scoreBoard.round++
  //         nextRound();
  //         $scope.counter = gameTimer;
  //       } else {
  //         Socket.emit('updateScore', $scope.scoreBoard.total)
  //       }
  //     }
  //   }
  //   var mytimeout = $timeout($scope.onTimeout,1000);

  //   var stop = function(){
  //     $timeout.cancel(mytimeout);
  //   }
  // }

  var timer = function (time, cb) {
    $scope.counter = time;
    $scope.onTimeout = function() {
      if($scope.counter !==0) {
        $scope.counter--;
        mytimeout = $timeout($scope.onTimeout, 1000);
      }if($scope.counter === 0) {
        stop()
        cb();
      }
    }
    var mytimeout = $timeout($scope.onTimeout, 1000);
    var stop = function() {
      $timeout.cancel(mytimeout);
    }
  }
  

  var gameInfo = function(query, number) {
    number = number - 1
    $scope.query.title = query[number].title;
    $scope.query.responses = query[number].responses;
    // $scope.guess = query[number].title + " ";
    $scope.queryAnswer = {};
  }

////////////////////////////////////////
//////////// Socket
////////////////////////////////////////

  Socket.on('startRound', function(query) {
    // room = query.room;
    // Socket.emit('getQueries')
    console.log(query)
    startRound(query);
  })

  Socket.on('updateScore', function(data) {
    $scope.scoreBoard.opponentScore = $scope.scoreBoard.opponentScore || 0
    console.log(data.score)
    $scope.scoreBoard.opponentScore += data.score;
    // if (data.score > 0 && data.score !== $scope.scoreBoard.opponentScore) {
    //     console.log('inside here');
    //     $scope.scoreBoard.opponentScore = $scope.scoreBoard.opponentScore + data.score;
    //   }
    })
  init()
})


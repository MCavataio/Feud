angular.module('feud.game', [])

.controller('GameController', function($rootScope, $scope, $window, $location, Game, socket, $timeout){
  $scope.data = {};
  $scope.query = {};
  $scope.questions = {};
  var query;
  var questions = {}
  $scope.queryAnswer = {};
  var dataSize;
  var room;
  // need to optimize calls to database
  // possibly retrieve 3 unique queries to use for each round
  // $scope.getCount = function() {
  //   console.log(room, "before calling function")
  //   Game.getCount(room)
  //   .then(function(response) {
  //     queries = response;
  //     console.log(queries)
  //   }).catch(function(error) {
  //     console.log("Error in retrieving size", error)
  //   })
  // }

  // way to share data between controllers
  $rootScope.room = function(data) {
    room = data;
  }

  socket.on('startRound', function(query) {
    room = query.room;
    console.log(query.room)
    console.log("query", query)
    socket.emit('getQueries')
    $scope.questions = parsedResponses(query)
    $scope.data.round = 1;
    gameInfo($scope.questions, 1);
    timer();
  })

  var gameInfo = function(query, number) {
    number = number - 1
     $scope.query.title = query[number].title;
    $scope.query.responses = query[number].responses;
    $scope.data.guess = query[number].title + " ";
    $scope.queryAnswer = {};
  }

  var nextRound = function() {
    var round = Number($scope.data.round);
    console.log(round)
    console.log('in next round', $scope.data.round <= 3)
    if (round <= 3) {
      console.log('in nextRound')
      // $timeout.cancel(myTimeout)
      gameInfo($scope.questions, round)
      timer()
    }
  }
  
  // socket.on('playRound', function(query) {
  //   // console.log(query, "query, room: ", room);
  // })


  //change to angular directive to optimize speed and reliablility
  function timer() {
    $scope.counter = 5;
    $scope.onTimeout = function(){
      if($scope.counter !==0) {
        $scope.counter--;
        mytimeout = $timeout($scope.onTimeout,1000);
      }
      if($scope.counter === 0) {
        stop()
        console.log('reaching here')
        if ($scope.data.round !==3) {
          $scope.data.round++
          nextRound();
          $scope.counter = 5;
        }
      }
    }

    var mytimeout = $timeout($scope.onTimeout,1000);

    var stop = function(){
      $timeout.cancel(mytimeout);
    }
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

  // var parsedResponses = function(data, count, query, response) {}
  //   response = response || 0;
  //         if(!query) {
  //           var query = {
  //             title: data.title,
  //             responses: []
  //           }
  //         }
  //         count = count || 1
  //         if(count > 5) {
  //           console.log(query);
  //           return query;
  //         }
  //         var queryResponse = "response" + count;
  //         if (data[queryResponse]) {
  //           query.responses.push(data[queryResponse])
  //           return parsedResponses (response, count+1, query, response+1)
  //         } else if (response === 2) {
  //           return query;
  //         }
  //       }

  socket.on('playRound', function() { 
    // socket.emit('startRound');
      if (!$scope.data.round) {
        $scope.data.round = 1;
      }
     _.each(queries.data, function(query, index) {
        console.log(query.title, index)
        questions[index] = parsedResponses(query)
      })
      var number = $scope.data.round - 1;
      $scope.query.title = questions[number].title;
      $scope.query.responses = questions[number].responses;
      $scope.data.guess = questions[number].title + " ";
      $scope.queryAnswer = {};
      timer();
      $scope.data.round++
      // console.log($scope.query.responses);
    // }).catch(function (error) {
    //   console.log("Error in retrieving query", error)
    // })
  });
  var scoreValues = {
    1: 500,
    2: 400,
    3: 300,
    4: 200,
    5: 100
  }

  $scope.makeGuess = function() {
    var index = $scope.query.responses.indexOf($scope.data.guess)
  
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
  // $scope.getCount();
})
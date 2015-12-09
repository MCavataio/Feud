angular.module('feud.game', [])

.controller('GameController', function($rootScope, $scope, $window, $location, Game, socket){
  $scope.data = {};
  $scope.query = {};
  var queries;
  var questions = {}
  $scope.queryAnswer = {};
  var room = 5;
  var dataSize;
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
  socket.on('startRound', function(response) {
    console.log(response)
  })
  
  socket.on('playRound', function(query) {
    // console.log(query, "query, room: ", room);
      query = parsedResponses(query, true)
      $scope.query.title = query.title;
      $scope.query.responses = query.responses;
      $scope.data.guess = query.title + " ";
      $scope.queryAnswer = {};
      // console.log(query.responses)
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

  var parsedResponses = function (response, count, query) {
    var data = response;
    
          if(!query) {
            var query = {
              title: data.title,
              responses: []
            }
          }
          count = count || 1
          if(count > 5) {
            console.log(query);
            return query;
          }
          var queryResponse = "response" + count;
          if (data[queryResponse]) {
            query.responses.push(data[queryResponse])
            return parsedResponses (response, count+1, query)
          } else {
            return query;
          }
        }

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
angular.module('feud.game', [])

.controller('GameController', function($scope, $window, $location, Game, socket){
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
  
  socket.on('playRound', function() {
    console.log('in socket')
    console.log(query);
      query = parsedResponses(query, true)
      $scope.query.title = query.title;
      $scope.query.responses = query.responses;
      $scope.data.guess = query.title + " ";
      $scope.queryAnswer = {};
      consol.log(query.responses)
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

  var parsedResponses = function (response, isSocket, count, query) {
    var data = response.data;
    if (isSocket) {
      data = response;
    } 
    console.log("parsedResponses", data);
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
            return parsedResponses (response, isSocket, count+1, query)
          } else {
            return query;
          }
        }

  $scope.startRound = function() {
    socket.emit('startRound');
    var queryId = Math.ceil(Math.random() * dataSize)
    Game.startRound(queryId).then(function (query) {
      query = parsedResponses(query, false)
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
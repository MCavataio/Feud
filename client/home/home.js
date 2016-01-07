angular.module("feud.home", [])

.controller("HomeController", function($rootScope, $scope, $location, Home, Socket) {
  $scope.query = {};
  $scope.data = {};
  $scope.socket = 0;
  $scope.status = true;
  $scope.turn = {};
  var room;

  ///////////////////////////////////////////
  /////// Login
  //////////////////////////////////////////

       var gameInfo = {
            user2: 'Sandro Anthony',
            user2ID: 5555555,
            user1: 'Michael Vincent',
            user1ID: 33333333
        }
  $scope.playFriends = function() {
    Socket.emit('playFriend', gameInfo)
  }
  Socket.on('playFriend', function(data) {
    console.log(data)
  })
  $scope.test = function() {
    Socket.emit('playRandom', {name: 'Max', id: 553})
  }
  var infoTest = {
    name: 'Mark'
  }
  $scope.userInfoTest = function() {
    Socket.emit('updateHome', infoTest)
  }
  $scope.getQueries = function(queries) {
    Socket.emit('getQueries', queries)
  }
  $scope.start = function(game) {
   var queries = [];
   var isUser1;
   var test;
   if (game.user1 === 'flito') {
      var userColu = 'user1'
      isUser1 = true;
   } else {
    var userColu = 'user2'
      isUser1 = false;
   }
   console.log(userColu)
   console.log(game.round)
    if (isUser1) {
      if (game.round == 2) {
      test = {
        round: 3,
        userCol: userColu,
        gameID: game.id,
        score: 300,
        opponent: game.opponentName
      }
    }
      if (game.round == 4) {
        test = { 
        round: 4,
        userCol: userColu,
        gameID: game.id,
        score: 3000,
        opponent: game.opponentName
        }
      }
    } else {
    if (game.round == 3) {
      console.log(' in here ')
      test = {
        round: 4,
        userCol: userColu,
        gameID: game.id,
        score: 300,
        opponent: game.opponentName
      }
    }
    if (game.round == 4) {
      test = {
        round: 5,
        userCol: userColu,
        gameID: game.id,
        score: 300,
        opponent: game.opponentName
      }
    }
  }
    console.log(test)
    Socket.emit('updateScore', test)
  
  }
  $scope.init = function() {
    console.log($rootScope.update)
    if (!$rootScope.update) {
      Socket.on('updateHome', function(data) {
        console.log(data)
        console.log(data.yourTurn)
        $scope.data.yourTurn = data.yourTurn

        $rootScope.update = true;
      })
    }

  }
  Socket.on('playRandom', function(data) {
    $rootScope.dbQuestion = data
    $location.path('/game');
  })
  $scope.login = function() {
    console.log('in login controlelr')
    var userInfo = {
      username: $scope.data.username,
      password: $scope.data.password
    }
    Home.login(userInfo)
  }

  ////////////////////////////////////////////
  ////// Socket
  ////////////////////////////////////////////

  $scope.createRoom = function() {
    $scope.status = false;
    Home.createRoom()
    .then(function(room) {
      console.log(room);
      // console.log('in create room', room)
      Socket.emit('changeRoom', {room: room})
    })
  }

  Socket.on('playRound', function(response) {
    $location.path('/game');
  }); 

  ////////////////////////////////////////////
  //// add search feature
  ////////////////////////////////////////////

  $scope.addQuery = function() {
    var query = {title: $scope.query.search};
    var suggestCallBack; // global var for autocomplete jsonp
    var request = {term: $scope.query.search};
    $scope.query.search = "";
    $.getJSON("https://suggestqueries.google.com/complete/search?callback=?",
      { 
        "hl":"en", // Language                  
        // "jsonp":"suggestCallBack", // jsonp callback function name
        "q":request.term, // query term
        "client":"youtube" // force youtube style response, i.e. jsonp
      })
      .then(function(data) {
        console.log(data)
        // create function for parsing
        for (var i = 0; i < data[1].length; i++ ){
          var split = data[1][i][0].split(query.title + " ")
          if (split.length > 1) {
            query["response" + (i + 1)] = split[1];
          } else {
            query['response' + (i + 1)] = split[0];
          }
        } 
      })
      .then(function() {
        Home.addQuery(query)
          .then(function(query) {
            $scope.query.search = "";
            console.log("success")
          }).catch(function (error) {
            console.log("Error in submitting Query", error);
            $scope.query.search = "";
        })
      })
    }
  });

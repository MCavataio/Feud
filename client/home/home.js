angular.module("feud.home", [])

.controller("HomeController", function($scope, $location, Home, Socket) {
  $scope.query = {};
  $scope.data = {};
  $scope.socket = 0;
  var room;

  ///////////////////////////////////////////
  /////// Login
  ///////////////////////////////////////////

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
    Home.createRoom()
    .then(function(room) {
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
  // $scope.addQuery = function() {
  //   Home.findQuery($scope.data.search)
  //   .then(function(response) {
  //     console.log('used http')
  //     console.log(response)
  //   })
  // }

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

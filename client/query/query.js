angular.module("feud.query", [])

.controller("QueryController", function($scope, $window, $location, Query, socket) {
  $scope.data = {};
  $scope.socket = 0;
  var room;
  socket.on('playRound', function(response) {
    
    $location.path('/game');
  })

  $scope.createRoom = function() {
    Query.createRoom()
    .then(function(room) {
      socket.emit('changeRoom', {room: room})
    })
  }

  // socket.on('init', function (data) {
  //   $scope.name = data.name;
  //   $scope.users = data.users;
  // });

  // socket.on('send:message', function (message) {
  //   $scope.messages.push(message);
  // });

  // socket.on('change:name', function (data) {
  //   changeName(data.oldName, data.newName);
  // });

  // socket.on('user:join', function (data) {
  //   $scope.messages.push({
  //     user: 'chatroom',
  //     text: 'User ' + data.name + ' has joined.'
  //   });
  //   $scope.users.push(data.name);
  // });
  
  // socketio.on('playRound', function(message) {
  //   $scope.socket = message;
  // })
  $scope.signIn = function() {
    Query.signIn($scope.userName)

  }

  $scope.addSearch = function() {
    var query = {title: $scope.data.search};
    console.log($scope.data.search)
    var suggestCallBack; // global var for autocomplete jsonp
    var request = {term: $scope.data.search};
    $.getJSON("http://suggestqueries.google.com/complete/search?callback=?",
      { 
        "hl":"en", // Language                  
        // "jsonp":"suggestCallBack", // jsonp callback function name
        "q":request.term, // query term
        "client":"youtube" // force youtube style response, i.e. jsonp
      })
    .then(function(data) {
      console.log(data[1])
      for (var i = 0; i < data[1].length; i++ ){
        query["response" + (i + 1)] = data[1][i][0];
      }
      console.log(query)
    Query.addSearch(query)
      .then(function() {
        $scope.data.query = "";
      }).catch(function (error) {
        console.log("Error in submitting Query", error);
        $scope.data.query = "";
      })
    })
  }
});

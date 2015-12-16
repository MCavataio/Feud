angular.module('feud.services', [])

.factory('Home', function ($http, $location, $window) {
  // adds google search to database
  // needs some sort of logic filtering eventually
  var findQuery = function(search) {
    var url = "http://suggestqueries.google.com/complete/search?callback=?" + search
    return $http({
      method: "GET",
      url: url,
    }). then(function(response) {
      return response;
    })
  }
  var addQuery = function(search) {
    console.log(search ,"++++++")
    return $http({
      method: 'POST',
      url: 'api/home/query',
      data: {
        query: search
      }
    })
  }
  var login = function(user) {
    console.log("in login")
    return $http({
      method: 'POST',
      url: 'api/home/login',
      data: user
    })
  }
  var createRoom = function() {
    return $http({
      method: 'GET',
      url: 'api/home/room',
    }).then(function(response) {
      return response;
    })
  }
  return {
    addQuery: addQuery,
    createRoom: createRoom,
    login: login
  }
 })
.factory('Game', function($http, $window, $location) {

  // var startRound = function(queryId) {
  //   console.log('in start round')
  //   var url = 'api/game/query/' + queryId
  //   return $http({
  //     method: "GET",
  //     url: url
  //   }).then(function (response) {
  //     return response;
  //   })
  // }
  var fuzzyCheck = function(guess) {
    var url = 'api/game/natural'
    return $http({
      method: "POST",
      url: url,
      data: guess
    }).then(function (result) {
      return result;
    })
  }
  return {
    // getCount: getCount,
    
    fuzzyCheck: fuzzyCheck
  }
})
  // brian ford socket wrapper implementation
.factory('Socket', function ($rootScope, $window) {
  var address = $window.location.origin
  var socket = io.connect(address, {
    'sync disconnect on unload': true });
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments; 
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
  };
  return {
    socket: socket
  }
})
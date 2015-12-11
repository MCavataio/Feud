angular.module('feud.services', [])

.factory('Home', function ($http, $location, $window) {
  // adds google search to database
  // needs some sort of logic filtering eventually
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
    return $http({
      method: 'POST',
      url: 'api/home/login'
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
    createRoom: createRoom
  }
 })
.factory('Game', function($http, $window, $location) {
  var getCount = function(room) {
    console.log('in get count')
    var url = 'api/game/queries/' + room;
    return $http({
      method: "GET",
      url: url
    }).then (function (response) {
      return response;
    });
  }
  var startRound = function(queryId) {
    console.log('in start round')
    var url = 'api/game/query/' + queryId
    return $http({
      method: "GET",
      url: url
    }).then(function (response) {
      return response;
    })
  }
  return {
    // getCount: getCount,
    startRound: startRound
  }
})
  // brian ford socket wrapper implementation
.factory('socket', function ($rootScope) {
  var socket = io.connect('http://localhost:3000/', {
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
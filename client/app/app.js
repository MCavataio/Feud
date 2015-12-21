angular.module('feud', [
  'feud.home',
  'feud.game',
  'feud.welcome',
  'feud.services',
  'ui.router'
])

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('/', {
      url: '/',
      templateUrl:'home/home.html',
      controller: 'HomeController'
    })
    .state('query', {
      url: '/query',
      templateUrl: 'query/query.html'
    })
    .state('game', {
      url: '/game',
      templateUrl: 'game/game.html'
    })
    // .state('friends', {
    //   url: '/friends',
    //   templateUrl: 'friends/friends.html'
    // })
});


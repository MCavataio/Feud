angular.module('feud', [
  'feud.query',
  'ui.router'
])

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('/', {
      url: '/',
      templateUrl:'query/query.html',
      controller: 'QueryController'
    })
    .state('query', {
      url: '/query',
      templateUrl: 'query/query.html'
    });
});


angular.module("feud.query", [])

.controller("QueryController", function($scope, $window, $location) {
  $scope.data = {};

  $scope.addSearch = function() {
    console.log('in addsearch');
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
      data[1].forEach(function(team) {
        console.log(team)
      })
    })
  }
});
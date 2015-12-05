angular.module("feud.query", [])

.controller("QueryController", function($scope, $window, $location, Query) {
  $scope.data = {};

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

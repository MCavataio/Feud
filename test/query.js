 // var query = "give me suggestions"
 //  var stringResponse = UrlFetchApp.fetch("http://suggestqueries.google.com/complete/search?client=firefox&q=" + encodeURIComponent(query)).getContentText();
 //  var parsedResponse = JSON.parse(stringResponse);
 //  var searchString = parsedResponse[0];
 //  Logger.log("search string: " + searchString);
 //  var suggestions = parsedResponse[1];
 //  for (var i=0; i<suggestions.length; i++) {
 //    console.log("Suggestion: " + suggestions[i]);
 //  }
var suggestCallBack; // global var for autocomplete jsonp
var request = {term: "michigan"};
$(document).ready(function () {

            $.getJSON("http://suggestqueries.google.com/complete/search?callback=?",
                { 
                  "hl":"en", // Language                  
                  // "jsonp":"suggestCallBack", // jsonp callback function name
                  "q":request.term, // query term
                  "client":"firefox" // force youtube style response, i.e. jsonp
                })
            .done(function(data) {
              data[1].forEach(function(team) {
                console.log(team)
              })
            })
            // suggestCallBack = function (data) {
            //     var suggestions = [];
            //     $.each(data[1], function(key, val) {
            //         suggestions.push({"value":val[0]});
            //     });
            //     suggestions.length = 5; // prune suggestions list to only 5 items
            //     response(suggestions);
            // };
});
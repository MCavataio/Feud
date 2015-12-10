var helpers = require(./config/helpers.js)
var storage = [];

for (var i = 0; i < 10; i++) {
  helpers.getGameQueries(function(err, response){
  if (response) {
    storage.push(queries)
  }
  }
}
console.log(storage, '+++++++++++++++++++++++++++++++++++')

module.exports = storage;
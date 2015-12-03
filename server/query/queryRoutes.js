var queryController = require('./queryController.js');

module.exports = function (app) {
  console.log(" in here");
  app.post('/', queryController.addQuery);
}
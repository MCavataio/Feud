var gameController = require('./gameController.js');

module.exports = function (app) {
  console.log(" in here");
  app.get('/count', gameController.getCount);
  app.get('/query/:id', gameController.startRound);
}
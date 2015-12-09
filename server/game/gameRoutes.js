var gameController = require('./gameController.js');

module.exports = function (app, io) {
  console.log(" in here");
  app.get('/queries/:id', gameController.getCount);
  app.get('/query/:id', gameController.startRound);
  app.get('/:id', gameController.startGame);
}
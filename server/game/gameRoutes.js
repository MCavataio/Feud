var gameController = require('./gameController.js');

module.exports = function (app, io) {
  console.log(" in here");
  app.get('/queries/:id', gameController.getCount);
  app.get('/query/:id', gameController.startRound);
  app.post('/natural', gameController.fuzzyCheck);
  // app.get('/:id', gameController.startGame);
}
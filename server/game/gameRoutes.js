var gameController = require('./gameController.js');

module.exports = function (app, io) {
  // app.get('/queries/:id', gameController.getCount);
  // app.get('/quqery/:id', gameController.startRound);
  app.post('/natural', gameController.fuzzyCheck);
  // app.get('/:id', gameController.startGame);
  app.get('/queries', gameController.getQueries)
}
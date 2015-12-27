var homeController = require('./homeController.js');

module.exports = function (app, io) {
  console.log(" in here");
  app.post('/query', homeController.addQuery);
  app.get('/room', homeController.createRoom);
  app.post('/login', homeController.login);
}
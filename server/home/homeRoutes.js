var homeController = require('./homeController.js');

module.exports = function (app) {
  console.log(" in here");
  app.post('/query', homeController.addQuery);
  app.get('/room', homeController.createRoom)
}
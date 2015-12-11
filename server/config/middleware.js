var bodyParser = require('body-parser');
var morgan = require('morgan');
var helpers = require('./helpers.js');


module.exports = function(app, express, io) {

  var homeRouter = express.Router();
  var gameRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.json());
  console.log(__dirname);
  app.use(express.static(__dirname + '/../../client'));
  app.use('/', function(req, res, next) {
    req.io = io;
    next();
  });


  app.use('/api/home', homeRouter);
  app.use('/api/game', gameRouter);

  require('../game/gameRoutes.js')(gameRouter, io);
  require('../home/homeRoutes.js')(homeRouter);
}
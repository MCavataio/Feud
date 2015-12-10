var bodyParser = require('body-parser');
var morgan = require('morgan');
var helpers = require('./helpers.js');


module.exports = function(app, express, io) {

  
  // var userRouter = express.Router();
  // var bracketRouter = express.Router();
  // var participantRouter = express.Router();


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


  // app.use('/api/users', userRouter);
  app.use('/api/home', homeRouter);
  app.use('/api/game', gameRouter);
  // app.use('/api/bracket', bracketRouter);

  // app.use('/api/participants' paricipantsRouter);
  require('../game/gameRoutes.js')(gameRouter, io);
  require('../home/homeRoutes.js')(homeRouter);
  // require('../brackets/bracketRoutes.js')(bracketRouter);
  // require('../users/userRoutes.js')(userRouter)
}
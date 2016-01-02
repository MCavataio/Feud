var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.Query;
var rooms = [];
var number = [];
var usersOnline = {};


// helpers.getCount()
// .then(function(response) {
//   count = response.count
//   count++
//   console.log(count, "++++++++++++++")
//   number.push(count);
// }).catch(function(err) {
//   console.log(err)
// })
module.exports = {
  logout: function(socket) {
    var username = usersOnline[socket.id];
    delete usersOnline[socket.id];
    delete usersOnline[username];
  },
  // updateUser: function(opponent) {
  //   if (usersOnline[opponent]) {
  //     var user = {
  //       name: opponent,
  //       id: usersOnline[opponent],
  //       io: opponent.io,
  //       game: opponent.game,
  //       fromUpdate: true
  //     }
  //   }
  //   updateHome(user)
  // },
  getQueries: function(data) {
    return helpers.getQueries(data.ids)
    .then(function(queries) {
      data.io.to(data.socket).emit('getQueries', queries)
    })
  },
  updateHome: function(user) {
    console.log('should be here nowwwwww')
    if (user.isOpponent) { 
      console.log(user, ' about to call this findOrCreate user for opponent')
        return helpers.findUser(user.name)
        .then(function(userInfo) {
          console.log(userInfo, "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
          if (userInfo[0].dataValues.online){
            user.socket = userInfo[0].dataValues.socket
            console.log(user)
          } else {
            return;
          }
        })
    }
    return helpers.retrieveGames(user.name)
    .then(function(games) {
      var openGames = {
        yourTurn: [],
        opponentTurn: [],
        finished: []
      }
      games.forEach(function(game) {
        if (game.dataValues.user1 === user.name ) {
            game.dataValues.opponentName = game.dataValues.user2;
            game.dataValues.opponentID = game.dataValues.user2ID;
          } else {
            game.dataValues.opponentName = game.dataValues.user1;
            game.dataValues.opponentID = game.dataValues.user1ID;
          }

        if (game.dataValues.turn === user.name) {
          openGames.yourTurn.push(game)
        } else if (game.dataValues.round == 8 && openGames.finished.length < 5) {
          openGames.finished.push(game);
        } 
        else {
          openGames.opponentTurn.push(game)
        }
      })
    
      user.io.to(user.socket).emit('updateHome', openGames)
    })
  },
  addQuery: function (req, res, next) {
    var query = req.body.query
    helpers.getQuery({title: query.title})
    .then(function(response) {
      if (response === null) {
        return helpers.getCount()
        .then(function(size) {
          size = size.count + 1;
          query.number = size;
          console.log(query.number, "hereeee weee g----------------------ogooo")
          return helpers.findOrCreateQuery(query, 'Query')
          .then(function(response) {
          console.log('successful')
          res.json(response);
        })
        });
      } else {
        res.json(response)
      }
    }).catch(function(err) {
      res.json(response);
    })
  },
  addPotential: function(data) {
    helpers.findOrCreateQuery(data, 'PotentialQuery')
  },

  user: function(userInfo) {
    helpers.findOrCreateUser(userInfo)
    .then(function(user) {
      // console.log(user, "before being send +++++++++++++++")
      // console.log(userInfo.socket);
      userInfo.io.to(userInfo.socket).emit('userInfo', user);
    }).catch(function(error) {
      console.log(error)
    })
  },

  createRoom: function(req, res, next) {
    if(rooms.length > 0) {
      var last = rooms.length - 1;
        if (rooms[last].full === false) {
          rooms[last].full = true;
        } else {
          var value = rooms[last].value
          value++
          rooms.push({value: value, full: false})
        }
    } else {
      rooms.push({value: 1, full: false});
    }
    res.json({room: rooms[rooms.length -1].value})
  },
  login: function(req, res, next) {
    helpers.findOrCreateUser(req.body)
  }
}
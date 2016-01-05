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
  updateOpponentHome: function(user) {
    console.log('updateOpponentHome ')
    var userInfo;
    console.log(user, '-------------------------------user before calling findUser')
    return helpers.findUser(user)
      .then(function(userInfo) {
        console.log('FindUser Begin ------------------------------')
        if (userInfo.dataValues.online){
          user.socket = userInfo.dataValues.socket
          return helpers.retrieveGames(user.name)
          .then(function(games) {
            console.log('retrieveGames Begin --------------------------')
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

              if (game.dataValues.turn === user.name && game.dataValues.round !== 8) {
                openGames.yourTurn.push(game)
              } else if (game.dataValues.round == 8 && openGames.finished.length < 5) {
                openGames.finished.push(game);
              } 
              else if (game.dataValues.round !== 8){
                openGames.opponentTurn.push(game)
              }
            })
            user.io.to(user.socket).emit('updateHome', openGames)
            console.log('retrieve games end----------------------')
          }).catch(function(err){
            console.log(err)
          })

      } 
      console.log('findUser endddd ================================')
    }).catch(function(err) {
        console.log(err)
      })

  },
  updateHome: function(user) {
    return helpers.retrieveGames(user.name)
    .then(function(games) {
      console.log('retrieveGames updateHome begin --------------')
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
          game.dataValues.round = 'Finished';
          openGames.finished.push(game);
        } 
        else {
          openGames.opponentTurn.push(game)
        }
      })

    
      user.io.to(user.socket).emit('updateHome', openGames)
      console.log('retrieveGames updateHome end -----------------------')
    }).catch(function(err) {
      console.log(err)
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
      console.log(err)
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
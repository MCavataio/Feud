var Sequelize = require('sequelize');
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');

if (process.env.NODE_ENV === 'production') {
  console.log('PRODUCTION MODE');
  var db = new Sequelize(process.env.CLEARDB_DATABASE_URL);
} else {
  // vadr secret = require('../lib/secrets').sql || "blue";
  var db = new Sequelize('feud', 'root', "null", {
    dialect: 'mysql',
    port: 3306
  });
}

db.authenticate()
  .then(function(err) {
    console.log('connected!');
  })
  .catch(function (err) {
    console.log('Not Connected!', err )
  })
  .done();

var PotentialQuery = db.define('potentialQuery', {
  number: Sequelize.INTEGER,
  title: Sequelize.STRING,
  response1: Sequelize.STRING, 
  response2: Sequelize.STRING,
  response3: Sequelize.STRING,
  response4: Sequelize.STRING,
  response5: Sequelize.STRING,
  response6: Sequelize.STRING,
  response7: Sequelize.STRING,
  response8: Sequelize.STRING,
  response9: Sequelize.STRING,
  response10: Sequelize.STRING,
})

var User = db.define('user', {
  name: Sequelize.STRING,
  wins: Sequelize.INTEGER,
  losses: Sequelize.INTEGER
})
var FriendGame = db.define('game', {
  user1: Sequelize.STRING,
  user2: Sequelize.STRING,
  user1score: Sequelize.INTEGER,
  user2score: Sequelize.INTEGER
})

var RandomGame = db.define('randomGame', {
  user1: Sequelize.STRING,
  user2: Sequelize.STRING,
  questionRD1: Sequelize.INTEGER,
  questionRD2: Sequelize.INTEGER,
  questionRD3: Sequelize.INTEGER,
  questionRD4: Sequelize.STRING,
  turn: Sequelize.STRING,
  user1RD1: Sequelize.INTEGER,
  user2RD1: Sequelize.INTEGER,
  user1RD2: Sequelize.INTEGER,
  user2RD2: Sequelize.INTEGER,
  user1RD3: Sequelize.INTEGER,
  user2RD3: Sequelize.INTEGER,
  user1RD4: Sequelize.INTEGER,
  user2RD4: Sequelize.INTEGER,
  user1Total: Sequelize.INTEGER,
  user2Total: Sequelize.INTEGER
})

var Query = db.define('query', {
  number: Sequelize.INTEGER,
  title: Sequelize.STRING,
  response1: Sequelize.STRING, 
  response2: Sequelize.STRING,
  response3: Sequelize.STRING,
  response4: Sequelize.STRING,
  response5: Sequelize.STRING,
  response6: Sequelize.STRING,
  response7: Sequelize.STRING,
  response8: Sequelize.STRING,
  response9: Sequelize.STRING,
  response10: Sequelize.STRING,
});

db.sync({force: true})
  .then(function(err) {
    console.log('created database')
  }, function (err) {
    console.log('An error occured while creating the table:', err)
  })

module.exports = {
  Query: Query,
  User: User,
  RandomGame: RandomGame
}
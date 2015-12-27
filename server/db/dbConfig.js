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

var PotentialQuery = db.define('potentialquery', {
  query: Sequelize.STRING
})

var User = db.define('user', {
  name: Sequelize.STRING,
  wins: Sequelize.INTEGER,
  losses: Sequelize.INTEGER
})
var Game = db.define('game', {
  user1: Sequelize.INTEGER,
  user2: Sequelize.INTEGER,
  user1score: Sequelize.INTEGER,
  user2score: Sequelize.INTEGER
})

var RandomGame = db.define('randomGame', {
  user1: Sequelize.INTEGER,
  user2: Sequelize.INTEGER,
  user1score: Sequelize.INTEGER,
  user2Score: Sequelize.INTEGER
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

db.sync({force:true})
  .then(function(err) {
    console.log('created database')
  }, function (err) {
    console.log('An error occured while creating the table:', err)
  })

module.exports = {
  Query: Query,
  User: User
}
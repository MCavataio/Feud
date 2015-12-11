var Sequelize = require('sequelize');
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');

if (process.env.NODE_ENV === 'production') {
  var sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);
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
    console.log('Not Connected!', err)
  })
  .done();

var QueryCount = db.define('querycount', {
  size: Sequelize.INTEGER
})

var User = db.define('user', {
  name: Sequelize.STRING,
  password: Sequelize.STRING
})

var Query = db.define('query', {
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
  response10: Sequelize.STRING
});

db.sync()
  .then(function(err) {
    console.log('created database')
  }, function (err) {
    console.log('An error occured while creating the table:', err)
  })

module.exports = {
  Query: Query,
  User: User
}
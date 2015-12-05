var express = require ('express');
var app = express();
// var io = require('socket.io')(http)
// var db = require("./db/dbconfig.js");
// io.on('connection', function(socket) {
//   console.log('a user connected');
// })

require('./config/middleware.js')(app, express);

app.listen(5555);
console.log("connected to port: 4000")

module.exports = app;
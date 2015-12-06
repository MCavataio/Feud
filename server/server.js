var express = require ('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)
// var db = require("./db/dbconfig.js");



require('./config/middleware.js')(app, express, io);

http.listen(3000)

console.log("connected to port: 3000")
app.io = io;
module.exports = app;

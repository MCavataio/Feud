var express = require ('express');
var app = express();
// var db = require("./db/dbconfig.js");


require('./config/middleware.js')(app, express);

app.listen(5555);
console.log("connected to port: 4000")

module.exports = app;
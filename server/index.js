var server = require('./app/server.js');
var mongoose = require('mongoose');
var dbConfig = require('./config/db_config');

console.log("Connecting to DB");
mongoose.connect(dbConfig.url, function(err){
    if(err){
        console.log("DB connection error");
    }
});
console.log("DB connection success. Starting server...");
server.start();
console.log("Server started. Waiting for connections...");
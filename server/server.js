var express  = require('express');
var app      = express(); 								
var mongoose = require('mongoose'); 	

var database = require('./config/db_config'); 
var server = require('./config/server_config');

var morgan = require('morgan'); 		
var bodyParser = require('body-parser'); 
var methodOverride = require('method-override');

var port  	 = server.port;
var restApiSpecFile = server.apiSpecFile;

mongoose.connect(database.url, function(err){
	if(err){
		console.log(err);
	}
}); 	

app.use(express.static(server.staticDirectory)); 	

app.use(morgan('dev')); 										
app.use(bodyParser.urlencoded({'extended':'true'})); 			
app.use(bodyParser.json()); 									
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

require(restApiSpecFile)(app);

app.listen(port);


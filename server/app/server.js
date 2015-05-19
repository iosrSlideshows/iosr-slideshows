var express  = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var session  = require('express-session');
var cookieParser = require('cookie-parser')

var serverConfig = require('./../config/server_config');
var authConfig = require('./../config/auth_config');
var routes = require('./routes.js');

var passport = require('./passport.js')(authConfig);
var driveClient = require('./driveClient.js')(authConfig);


//Konfiguracja
app.use(express.static(serverConfig.staticDirectory));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(session({ secret: 'iosrSlidesSessionSecret' }));

function start() {
    app.use(passport.initialize());
    app.use(passport.session());
    routes.setup(app, passport, driveClient);
    var port = serverConfig.port;
    app.listen(port);
}

function startMock(passportMock, userMock, driveMock) {
    app.use(passportMock.initialize(userMock));
    app.use(passport.session());
    routes.setup(app, passport, driveMock);
    var port = 5555;
    app.listen(port);
}

exports.start = start;
exports.startMock = startMock;

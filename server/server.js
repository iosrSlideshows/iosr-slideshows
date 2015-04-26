var express  = require('express');
var app      = express(); 								
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;
var session  = require('express-session');
var cookieParser = require('cookie-parser')

var authConfig = require('./config/auth_config');
var database = require('./config/db_config'); 
var server = require('./config/server_config');
var model = require('./app/models/models.js');

var port  	 = server.port;
var log = require(server.logger);

mongoose.connect(database.url, function(err){
	if(err){
		log.error(err);
	}
});


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    model.User.findOne({'id' : id}, function(err, user) {
        done(err, user);
    });
});

passport.use(new googleStrategy({
        clientID: authConfig.clientID,
        clientSecret: authConfig.clientSecret,
        callbackURL:  authConfig.callbackURL,
        passReqToCallback : true
    },
    function(req, accessToken, refreshToken, profile, done) {

        process.nextTick(function() {
            if (!req.user) {

                model.User.findOne({ 'id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        if (!user.token) {
                            user.token = accessToken;
                            user.name  = profile.displayName;
                            user.email = (profile.emails[0].value || '').toLowerCase();

                            user.save(function(err) {
                                if (err) {
                                    return done(err);
                                }
                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    } else {
                        var newUser          = new User();

                        newUser.id    = profile.id;
                        newUser.token = accessToken;
                        newUser.name  = profile.displayName;
                        newUser.email = (profile.emails[0].value || '').toLowerCase();

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }
                });

            } else {
                var user = req.user;

                user.id    = profile.id;
                user.token = accessToken;
                user.name  = profile.displayName;
                user.email = (profile.emails[0].value || '').toLowerCase();

                user.save(function(err) {
                    if (err)
                        return done(err);

                    return done(null, user);
                });

            }

        });
    }
));

app.use(express.static(server.staticDirectory)); 	

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({'extended':'true'})); 			
app.use(bodyParser.json());
app.use(methodOverride());

app.use(session({ secret: 'iosrSlidesSessionSecret' }));
app.use(passport.initialize());
app.use(passport.session());

require('./app/routes.js')(app, log, passport);

app.listen(port);


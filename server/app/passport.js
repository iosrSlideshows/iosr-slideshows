var passport = require('passport');
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;
var model = require('./models/models.js');

module.exports = function(authConfig){

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(_id, done) {
        model.User.findOne({'_id' : _id}, function(err, user) {
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

                    model.User.findOne({ 'profileId' : profile.id }, function(err, user) {
                        if (err)
                            return done(err);

                        if (user) {

                            user.refreshToken = refreshToken;
                            user.token = accessToken;

                            user.save(function(err) {
                                if (err) {
                                    return done(err);
                                }
                                return done(null, user);
                            });

                        } else {
                            var newUser = new model.User();

                            newUser.profileId = profile.id;
                            newUser.token = accessToken;
                            newUser.refreshToken = refreshToken;
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

                    user.profileId = profile.id;
                    user.token = accessToken;
                    user.refreshToken = refreshToken;
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

    return passport;
};